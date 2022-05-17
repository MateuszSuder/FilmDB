import db from "./database/jsondb.js";

const usersColumns = [
    {
        "required": true,
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

db.createTable('users', usersColumns).then(async table => {
    if(table) {
        try {
            await table.insert({
                username: 'test',
                permission: 'user'
            },{
                username: 'test2',
                permission: 'user'
            })
        } catch (e) {
            console.error(e.message);
        }

    }
})