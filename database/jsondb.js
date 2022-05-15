import { writeFile } from 'node:fs/promises';

/**
 * @typedef ColumnSchema
 * @type {object}
 * @property required: boolean|undefined
 * @property minLength: number|undefined
 * @property maxLength: number|undefined
 * @property type: 'boolean'|'string'|'number'
 * @property columnName: string
 */

export class JsonDB {
    /**
     * Create new database if not exists
     * @param {string} databaseName name of database
     * @param {Object.<DBSchema>} schema
     */
    static async createDatabase(databaseName, schema) {
        let db = JsonDB.databaseExists();
        console.log(db);
        if(!db) {
            try {
                await writeFile('./database/' + databaseName + '.json', JSON.stringify(schema.parse()), { encoding: 'utf8' });
            } catch (e) {
                console.error(e);
            }
        }
        return db;
    }

    /**
     * Check if database exists
     * @param databaseName name of database
     */
    static databaseExists(databaseName) {
        return false;
    }
}

export class Database {

}


export class DBSchema {
    /**
     * @type {array.<ColumnSchema>}
     */
    columns = [];

    /**
     * @param {array.<ColumnSchema>} schemaInput
     */
    constructor(schemaInput) {
        for(const column of schemaInput) {
            this.columns.push(
                new DBColumn(
                    {...column}
                )
            );
        }
    }

    parse() {
        let result = {};
        for(const column of this.columns) {
            result[column.columnName] = column;
        }
        return {
            "columns": result
        }
    }
}

export class DBColumn {
    /**
     * @type {string};
     * @const
     */
    columnName;

    /**
     * @type {'boolean'|'string'|'number'};
     * @const
     */
    type;

    /**
     * @type {boolean|undefined};
     * @const
     */
    required;

    /**
     * @type {number|undefined};
     * @const
     */
    minLength;

    /**
     * @type {number|undefined};
     * @const
     */
    maxLength;

    /**
     * @param {ColumnSchema} columnInput
     */
    constructor(columnInput) {
        const {columnName, type, minLength, maxLength, required} = columnInput;
        if(!columnName) throw new Error('Column name is required');
        if(!type) throw new Error('Type is required');
        this.columnName = columnName;
        this.type = type;
        this.required = required;
        this.minLength = minLength;
        this.maxLength = maxLength;
    }
}