import db from '../src/database/database.js';
import bcrypt from 'bcrypt';
import { arrayToSqlList } from '../src/database/utils.js';

/**
 * Model containing user data
 */
export default class User {
	/**
	 * @type number
	 */
	id;
	/**
	 * @type string
	 */
	login;
	/**
	 * @type string
	 */
	password;
	/**
	 * @type { 0 | 1 }
	 */
	isBlocked;
	/**
	 * @type { 'user' | 'admin' }
	 */
	permission;

	constructor(login, password) {
		this.validator(login, password);
		this.login = login;
		this.password = password;
	}

	/**
	 * Gets all users from database
	 * @param {Array<string>} omit id of users to omit
	 * @param {Array<'user' | 'admin'>} permissions permissions to get
	 * @return {Promise<User[]>}
	 */
	static async getAllUsers(omit, permissions) {
		try {
			// language=SQL
			return await db.all(
				`SELECT id, username, permission, isBlocked FROM Users WHERE id NOT IN ${arrayToSqlList(
					omit,
				)} AND permission IN ${arrayToSqlList(permissions)}`,
			);
		} catch (e) {
			console.log(e);
		}
	}

	static async modifyUserPermission(id, permission) {
		try {
			// language=SQL
			return await db.run(
				`UPDATE Users SET permission='${permission}' WHERE id='${id}'`,
			);
		} catch (e) {
			console.log(e);
		}
	}

	static async deleteUser(id) {
		try {
			// language=SQL
			return await db.run(`DELETE FROM Users WHERE id='${id}'`);
		} catch (e) {
			console.log(e);
		}
	}

	static async blockUser(id, blocked) {
		try {
			// language=SQL
			return await db.run(
				`UPDATE Users SET isBlocked='${blocked}' WHERE id='${id}'`,
			);
		} catch (e) {
			console.log(e);
		}
	}

	/**
	 * Saves user contained in object to database
	 * @return {Promise<*>} Result of query
	 * @throws when invalid username/password or duplicate username
	 */
	async saveUserToDatabase() {
		try {
			this.validator(this.login, this.password);
			// generate salt to hash password
			const salt = await bcrypt.genSalt(10);
			// now we set user password to hashed password
			const hashedPassword = await bcrypt.hash(this.password, salt);
			const result = db.exec(
				`INSERT INTO Users (username, password, permission) VALUES ("${this.login}", "${hashedPassword}", "user")`,
			);
			return await result;
		} catch (e) {
			if (e.errno === 19)
				throw new Error(
					`U??ytkownik z nazw?? ${this.login} ju?? istnieje`,
				);
			throw e;
		}
	}

	/**
	 * Checks for user in db
	 * @return {Array.<User> | undefined}
	 */
	async searchUserInDB() {
		try {
			this.validator(this.login, this.password);
			// language=SQL
			return await db.all(
				`SELECT * FROM Users where username='${this.login}'`,
			);
		} catch (e) {
			throw e;
		}
	}

	/**
	 * Validates user input
	 * @param login username of user
	 * @param password password of user
	 */
	validator(login, password) {
		if (!login) throw new Error('Login jest pusty');
		if (login.length <= 3)
			throw new Error('Login musi by?? d??u??szy ni?? 3 znaki');
		if (login.length > 12)
			throw new Error('Login nie mo??e by?? d??u??szy ni?? 12 znak??w');
		if (!password) throw new Error('Has??o jest puste');
		if (password.length < 5)
			throw new Error('Has??o musi by?? d??u??sze lub r??wne 5 znak??w');
		if (password.length > 18)
			throw new Error('Has??o nie mo??e by?? d??u??sze ni?? 18 znak??w');
	}
}
