import {JsonDB, DBSchema} from "./database/jsondb.js";

const usersColumns = [
    {
        "required": true,
        "minLength": 3,
        "maxLength": 12,
        "type": "string",
        "unique": true,
        columnName: "username"
    },
    {
        "required": true,
        "type": ["user", "admin"],
        columnName: "permission"
    }
]

JsonDB.createDatabase('users', new DBSchema(usersColumns))