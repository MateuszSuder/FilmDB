import db from '../src/database/database.js';
import { arrayToSqlList } from '../src/database/utils.js';

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
	 * Adds movie to database
	 * @param {MovieInput} movieInput
	 */
	static async addMovie(movieInput) {
		const {
			title,
			description,
			director,
			productionDate,
			productionCountry,
		} = movieInput;

		let { actorsList } = movieInput;

		actorsList = actorsList || [];

		// language=SQL
		const movie = await db.all(
			`INSERT INTO Movies(title, description, director, productionDate, productionCountry) 
				VALUES (?, ?, ?, ?, ?) 
				RETURNING id`,
			[title, description, director, productionDate, productionCountry],
		);

		const movieId = movie[0].id;

		const actorsId = [];

		const actorQuery = `INSERT INTO Actors (name) VALUES (?) RETURNING id`;
		const actorStatement = await db.prepare(actorQuery);

		for (const actor of actorsList) {
			actorsId.push((await actorStatement.run(actor)).lastID);
		}

		await (await actorStatement).finalize();

		const movieActorQuery = `INSERT INTO MoviesActors (movieId, actorId) VALUES (?, ?)`;
		const movieActorStatement = await db.prepare(movieActorQuery);

		for (const actorId of actorsId) {
			await movieActorStatement.run([movieId, actorId]);
		}

		await (await movieActorStatement).finalize();
	}

	// /**
	//  * @param {Array<string>} actors
	//  */
	// static parseActors(actors) {
	// 	// language=SQL
	// 	return actors.map((actor) =>
	// 		db.prepare(`INSERT INTO Actors(name) VALUES (?) RETURNING id`, [
	// 			actor,
	// 		]),
	// 	);
	// }

	static async linkActorsToMovies() {}
}