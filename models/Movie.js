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

	static async getAllMovies(userId = undefined) {
		/**
		 * @type { Array.<Movie> }
		 */
		const movies = await db.all(`SELECT * FROM Movies`);
		if (userId) {
			const favorites = await Movie.getUserFavorites(userId);
			movies.forEach(
				(movie) =>
					(movie.isFavorite = favorites.some(
						(favorite) => favorite.movieId === movie.id,
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
				description,
				genre,
				director,
				productionDate,
				productionCountry,
			],
		);

		const movieId = movie[0].id;

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

	static async toggleMovieFavorite(userId, movieId) {
		const isFavorite = await db.get(
			`SELECT movieId from UsersFavoriteMovies where userId=? AND movieId=?`,
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
			`SELECT movieId from UsersFavoriteMovies WHERE userId=?`,
			[userId],
		);
	}
}
