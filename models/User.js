import db from '../src/database/database.js'
import bcrypt from 'bcrypt'


export default class User {
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

	async saveUserToDatabase() {
		try {
			this.validator(this.login, this.password);
			// generate salt to hash password
			const salt = await bcrypt.genSalt(10);
			// now we set user password to hashed password
			const hashedPassword = await bcrypt.hash(this.password, salt);
			const result = db.exec(`INSERT INTO Users (username, password, permission) VALUES ("${this.login}", "${hashedPassword}", "user")`);
			return await result;
		} catch (e) {
			if(e.errno === 19) throw new Error(`Użytkownik z nazwą ${this.login} już istnieje`);
			throw e;
		}
	}

	async searchUserInDB() {
		try {
			this.validator(this.login, this.password);
			// language=SQL
			return await db.all(`SELECT * FROM Users where username='${this.login}'`);
		} catch (e) {
			throw e;
		}
	}

	validator(login, password) {
		if (!login) throw new Error('Login jest pusty');
		if (login.length <= 3) throw new Error('Login musi być dłuższy niż 3 znaki');
		if (login.length > 12) throw new Error('Login nie może być dłuższy niż 12 znaków');
		if (!password) throw new Error('Hasło jest puste');
		if (password.length < 5) throw new Error('Hasło musi być dłuższe lub równe 5 znaków');
		if (password.length > 18) throw new Error('Hasło nie może być dłuższe niż 18 znaków');
	}
}