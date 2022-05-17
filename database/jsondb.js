import {writeFile, readFile} from 'node:fs/promises';

const PathLocationPrefix = './database/';

/**
 * @typedef ColumnSchema
 * @type {object}
 * @property { boolean | undefined} required if this column/property is required
 * @property { boolean | undefined } unique if unique
 * @property { 'boolean' | 'string'|' number' } type type of data that can be inserted
 * @property { string } columnName name of column/property
 */

/**
 * @typedef TableUpdateEntry
 * @type {object}
 * @property { string } id id of object to update
 * @property { Object.<string, any> } update key-value array where key: property to change, value: value to change to
 */

class JsonDB {
    /**
     * List of available tables
     * @type {Array.<Table>}
     */
    tablesList = [];

    /**
     * Create new table if not exists
     * @param {string} tableName name of table
     * @param {Array.<ColumnSchema>} schema
     * @return
     */
    async createTable(tableName, schema) {
        let table = await this.getTable(tableName);
        if (!table) {
            try {
                table = new Table(tableName, schema);
                await writeFile(PathLocationPrefix + tableName + '.json', JSON.stringify({columns: schema}), {encoding: 'utf8'});
            } catch (e) {
                console.error(e);
            }
        }
        return table;
    }

    /**
     * Check if table exists
     * @param tableName name of table
     * @return { Promise<Table> } table or null if not exists
     */
    async getTable(tableName) {
        return this.#getCachedTable(tableName) || (await this.#getNotCachedTable(tableName)) || null;
    }

    /**
     * Check and return if exists table from cached array
     * @param tableName name of table to search
     * @return {null|Table}
     */
    #getCachedTable(tableName) {
        for (let i = 0; i < this.tablesList.length; i++) {
            if (this.tablesList[i].name === tableName) return this.tablesList[i];
        }
        return null;
    }

    /**
     * Search for table in files, if not found, return null
     * @param tableName name of table to search
     * @return {Promise<Table|null>}
     */
    async #getNotCachedTable(tableName) {
        try {
            const file = await readFile(PathLocationPrefix + tableName + '.json', {encoding: 'utf8'});
            /**
             * @type {Table}
             */
            const parse = JSON.parse(file);
            const table = new Table(tableName, parse.columns);
            await table.insert(...parse.values);
            this.tablesList.push(table);
            return table;
        } catch (e) {
            console.error(e);
            return null
        }
    }
}

export class Table {
    /**
     * Table name
     * @type string
     */
    name;

    /**
     * Schema for columns
     * @type {Object.<string, ColumnSchema>}
     */
    columns = {};

    /**
     * Values in table
     * @type {Array.<object>}
     */
    values = [];

    constructor(name, schemaInput) {
        this.name = name;
        for (const column of Object.values(schemaInput)) {
            this.columns[column.columnName] = new TableColumn({...column});
        }
    }

    /**
     * Insert x values to table
     * @param toInsert values to insert
     * @return {Promise<void>}
     */
    async insert(...toInsert) {
        const copy = JSON.parse(JSON.stringify(this.values));
        try {
            for (const entry of toInsert) {
                if (this.#validateEntry(entry)) {
                    this.values.push({
                        id: this.#idGen(), ...entry
                    });
                }
            }
            await this.#saveToFile();
        } catch (e) {
            this.values = copy;
            throw e;
        }

    }

    static #rollbackUpdate(obj, copy, updateEntries) {
        for(const update of updateEntries) {
            obj[update[0]] = copy[update[0]];
        }
    }

    /**
     * Updates entry
     * @param { TableUpdateEntry } toUpdate array of record
     */
    async update(toUpdate) {
        let obj = this.find({ id: toUpdate.id });
        if(!obj.length) {
            throw new Error(`Id: ${toUpdate.id} not found in ${this.name}`);
        } else {
            obj = obj[0];
        }
        const copy = JSON.parse(JSON.stringify(obj));
        for(const update of Object.entries(toUpdate.update)) {
            obj[update[0]] = update[1];
        }
        try {
            this.#validateEntry(obj);
            await this.#saveToFile();
        } catch(e) {
            Table.#rollbackUpdate(obj, copy, Object.entries(toUpdate.update));
            console.error(e);
        }
    }

    /**
     * Delete object with given id
     * @param id of object to delete
     * @return {Promise<boolean>} true if deleted, false if not
     */
    async delete(id) {
        let lengthBefore = this.values.length;
        this.values = this.values.filter(element => element.id !== id);
        if(lengthBefore === this.values.length) {
            return false;
        } else {
            await this.#saveToFile();
            return true;
        }
    }

    /**
     * Finds entry in table
     * @property { Object.<string, any> } toFind key-value object, where key: property, value: value which property has to have
     */
    find(toFind) {
        let res = [];
        for(const entry of Object.entries(toFind)) {
            if(res.length) {
                res = res.filter(element => element[entry[0]] === entry[1]);
            } else {
                res = this.values.filter(element => element[entry[0]] === entry[1]);
            }
        }
        return res;
    }

    /**
     * Saves table content to file
     * @return {Promise<void>}
     */
    async #saveToFile() {
        await writeFile(PathLocationPrefix + this.name + '.json', JSON.stringify({
            columns: this.columns, values: this.values
        }))
    }

    /**
     * Validate entry
     * @param entry
     * @return {boolean} true if valid
     * @throws error when column is invalid
     */
    #validateEntry(entry) {
        for (const columnName of Object.keys(this.columns)) {
            const column = this.columns[columnName];
            const columnValue = entry[column.columnName];
            if (!columnValue) {
                if (column.required) {
                    throw new Error(`Column ${columnName} (${columnValue}) is missing in ${JSON.stringify(entry)}`);
                }
                continue;
            }
            if (!this.#validateEntryType(column.type, columnValue)) {
                throw new Error(`Column ${columnName} (${columnValue}) has invalid type in ${JSON.stringify(entry)}`);
            }
            if (column.unique) {
                for (let i = 0; i < this.values.length; i++) {
                    if ((this.values[i][columnName] === columnValue)
                        && (entry.id && entry.id !== this.values[i].id))
                        throw new Error(`Column ${columnName} (${columnValue}) is not unique ${JSON.stringify(entry)}`);
                }
            }
        }
        return true;
    }

    /**
     * Check if
     * @param columnType required type of column
     * @param entryValue type of entry given
     * @return {boolean} true if valid else false
     */
    #validateEntryType(columnType, entryValue) {
        if (Array.isArray(columnType)) {
            return !!columnType.some(allowedValue => allowedValue === entryValue);
        }
        return columnType === typeof entryValue;
    }

    /**
     * Method generating uuid
     * @return {string} uuid
     */
    #idGen() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

export class TableColumn {
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
     * @type {boolean|undefined};
     * @const
     */
    unique;

    /**
     * @param {ColumnSchema} columnInput
     */
    constructor(columnInput) {
        const {columnName, unique, type, minLength, maxLength, required} = columnInput;
        if (!columnName) throw new Error('Column name is required');
        if (!type) throw new Error('Type is required');
        this.columnName = columnName;
        this.type = type;
        this.required = required;
        this.unique = unique;
    }
}

export default new JsonDB();