import {open} from "sqlite";
import sqlite3 from "sqlite3";

export default await (async () => {
    // open the database
    const db = await open({
        filename: './filmdb.sqlite',
        driver: sqlite3.Database
    })

    await db.exec(
        `CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            username VARCHAR(12) UNIQUE NOT NULL,
            password VARCHAR(18) NOT NULL, 
            permission TEXT NOT NULL CHECK(permission in ('user', 'admin')), 
            isBlocked INTEGER DEFAULT 0 CHECK(isBlocked in (0, 1)),
            dateJoined DATE DEFAULT CURRENT_DATE
        )`
    );

    await db.exec(
        `CREATE TABLE IF NOT EXISTS Movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            director TEXT NOT NULL,
            productionDate DATE NOT NULL,
            dateAdded DATE DEFAULT CURRENT_DATE
        )`
    );

    await db.exec(
        `CREATE TABLE IF NOT EXISTS Actors (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            'name' TEXT NOT NULL,
            lastName TEXT NOT NULL
         )`
    );

    await db.exec(
        `CREATE TABLE IF NOT EXISTS MoviesActors (
            movieId INTEGER NOT NULL,
            actorId INTEGER NOT NULL,
            FOREIGN KEY (movieId) REFERENCES Movies(id),
            FOREIGN KEY (actorId) REFERENCES Actors(id),
            UNIQUE(movieId, actorID)
        )`
    );
    return db;
})()