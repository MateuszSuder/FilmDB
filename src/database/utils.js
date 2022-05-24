/**
 * Transforms given array to sql list
 * @example ['user', 'admin'] => ('user', 'admin')
 * @param {Array.<number | string>} array
 */
export const arrayToSqlList = (array) => {
	return `(${array.map(el => typeof el === 'string' ? `'${el}'` : el)})`
}