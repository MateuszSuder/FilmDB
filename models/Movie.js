import db from '../src/database/database.js';
import { arrayToSqlList } from '../src/database/utils.js';
import Actor from './Actor.js';

/**
 * @typedef MovieInput
 * @type {object}
 * @property {string} title - title of movie.
 * @property {string} description - description of movie.
 * @property {string} director - director of movie.
 * @property {date} productionDate - production date of movie in format YYYY-MM-DD.
 * @property {string} productionCountry - production country of movie.
 * @property {Array.<string>} actors - list of actors in movie.
 */

export default class Movie {
	/**
	 * @type { string }
	 */
	id;
	/**
	 * @type { string }
	 */
	title;
	/**
	 * @type { string }
	 */
	description;
	/**
	 * @type { string }
	 */
	director;
	/**
	 * @type { date }
	 */
	productionDate;
	/**
	 * @type { string }
	 */
	productionCountry;
	/**
	 * @type { date }
	 */
	dateAdded;
	/**
	 * @type { Array }
	 */
	actors;

	static async getMovies({ userId, actors }) {
		/**
		 * @type { Array.<Movie> }
		 */
		const movies = await db.all(`SELECT * FROM Movies`);

		if (actors) {
			for (const movie of movies) {
				movie.actors = await Actor.getActorsFromMovie(movie.id);
			}
		}

		if (userId) {
			const favorites = await Movie.getUserFavorites(userId);
			movies.forEach(
				(movie) =>
					(movie.isFavorite = favorites.some(
						(favorite) => favorite.id === movie.id,
					)),
			);
		}

		return movies;
	}

	static async getMovie(movieId, userId = undefined) {
		/**
		 * @type { Movie }
		 */
		const movie = await db.get(`SELECT * FROM Movies where id=?`, [
			movieId,
		]);

		if (!movie) return null;

		const actors = await Actor.getActorsFromMovie(movieId);

		let isFavorite = false;

		if (userId) {
			isFavorite = Boolean(
				await Movie.isUsersFavorite(userId, parseInt(movieId)),
			);
		}

		return {
			...movie,
			actors,
			isFavorite,
		};
	}

	/**
	 * Adds movie to database
	 * @param {MovieInput} movieInput
	 */
	static async addMovie(movieInput) {
		const {
			title,
			description,
			director,
			genre,
			productionDate,
			productionCountry,
		} = movieInput;

		let { actorsList } = movieInput;

		actorsList = actorsList || [];

		// language=SQL
		const movie = await db.all(
			`INSERT INTO Movies(title, genre, description, director, productionDate, productionCountry) 
				VALUES (?, ?, ?, ?, ?, ?) 
				RETURNING id`,
			[
				title,
				genre,
				description,
				director,
				productionDate,
				productionCountry,
			],
		);

		const movieId = movie[0].id;

		await Movie.linkActorsToMovies(movieId, actorsList);
	}

	static async linkActorsToMovies(movieId, actorsList) {
		const actorsId = [];

		const actorQuery = `INSERT INTO Actors (name) VALUES (?) RETURNING id`;
		const actorStatement = await db.prepare(actorQuery);

		for (const actor of actorsList) {
			actorsId.push((await actorStatement.run(actor)).lastID);
		}

		await actorStatement.finalize();

		const movieActorQuery = `INSERT INTO MoviesActors (movieId, actorId) VALUES (?, ?)`;
		const movieActorStatement = await db.prepare(movieActorQuery);

		for (const actorId of actorsId) {
			await movieActorStatement.run([movieId, actorId]);
		}

		await movieActorStatement.finalize();
	}

	/**
	 * @typedef { object } idInput;
	 * @property { string } id
	 * Edits movie in DB
	 * @param {idInput & MovieInput} movieInput
	 */
	static async editMovie(movieInput) {
		const {
			title,
			genre,
			description,
			director,
			productionDate,
			productionCountry,
			id,
		} = movieInput;

		let { actorsList } = movieInput;

		actorsList = actorsList || [];

		await db.run(
			`UPDATE Movies SET 
			title=?, genre=?, description=?, 
			director=?, productionDate=?, productionCountry=? 
			WHERE id=?`,
			[
				title,
				genre,
				description,
				director,
				productionDate,
				productionCountry,
				id,
			],
		);

		await db.run(
			`DELETE FROM Actors WHERE id in (SELECT actorId FROM MoviesActors where movieId=?)`,
			[id],
		);

		await db.run(`DELETE FROM MoviesActors WHERE movieId=?`, [id]);

		await Movie.linkActorsToMovies(id, actorsList);
	}

	static async deleteMovie(movieId) {
		await db.run(`DELETE FROM Movies WHERE id=?`, [movieId]);
		await db.run(`DELETE FROM UsersFavoriteMovies WHERE movieId=?`, [
			movieId,
		]);
		await db.run(`DELETE FROM MoviesActors WHERE movieId=?`, [movieId]);
	}

	static async toggleMovieFavorite(userId, movieId) {
		const isFavorite = await db.get(
			`SELECT movieId from UsersFavoriteMovies WHERE userId=? AND movieId=?`,
			[userId, movieId],
		);
		if (isFavorite) {
			return await db.run(
				`DELETE FROM UsersFavoriteMovies WHERE userId=? AND movieId=?`,
				[userId, movieId],
			);
		} else {
			return await db.run(
				`INSERT INTO UsersFavoriteMovies (userId, movieId) VALUES (?, ?)`,
				[userId, movieId],
			);
		}
	}

	static async isUsersFavorite(userId, movieId) {
		return await db.get(
			`SELECT movieId from UsersFavoriteMovies WHERE userId=? AND movieId=?`,
			[userId, movieId],
		);
	}

	static async getUserFavorites(userId) {
		return await db.all(
			`SELECT m.* from Movies m left join UsersFavoriteMovies u ON m.id=u.movieId WHERE u.userId=?`,
			[userId],
		);
	}

	static async getAllGenres() {
		return await db.all(`SELECT DISTINCT genre from Movies`);
	}

	static async getAllProductionCountries() {
		return await db.all(`SELECT DISTINCT productionCountry from Movies`);
	}
}
