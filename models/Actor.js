import db from '../src/database/database.js';

export default class Actor {
	/**
	 * @type { string }
	 */
	name;

	static async getActorsFromMovie(movieId) {
		return await db.all(
			`
            SELECT a.id, a.name FROM Actors a 
            LEFT JOIN MoviesActors m ON a.id=m.actorId
            WHERE m.movieId=?
            `,
			[movieId],
		);
	}
}
