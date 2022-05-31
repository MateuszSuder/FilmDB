import Movie from '../models/Movie.js';

/**
 * @typedef SearchInput
 * @type {object}
 * @property {string | undefined} title - title of movie
 * @property {string | undefined} director - director of movie
 * @property {string | undefined} actor - actor of movie
 * @property {string | undefined} productionYearStart - minimum production year
 * @property {string | undefined} productionYearEnd - maximum production year
 */

/**
 * @typedef FilterInput
 * @type {object}
 * @property {string | undefined} genre - genre of movie
 * @property {string | undefined} productionCountry - production country of movie
 * @property {string | undefined} dateAddedStart - minimum date of adding to db
 * @property {string | undefined} dateAddedEnd - maximum date of adding to db
 */

const mockMovies = [
	{
		title: 'Zielona mila',
		genre: 'Dramat',
		productionCountry: 'USA',
		productionYear: '1999',
		addDate: '30-04-2022',
		director: 'Frank Darabont',
		isFavorite: false,
	},
	{
		title: 'Skazani na Shawshank',
		genre: 'Dramat',
		productionCountry: 'USA',
		productionYear: '1994',
		addDate: '01-05-2022',
		director: 'Frank Darabont',
		isFavorite: true,
	},
	{
		title: 'Forrest Gump',
		genre: 'Dramat',
		productionCountry: 'USA',
		productionYear: '1994',
		addDate: '28-04-2022',
		director: 'Robert Zemeckis',
		isFavorite: false,
	},
];

export const homeView = async (req, res) => {
	let movies = await Movie.getMovies({
		userId: req.session.user?.id,
		actors: true,
	});

	movies = searchMovies(movies, { ...req.query });

	res.render('layout', {
		page: 'views/home',
		movies,
	});
};

const caseInsensitivePartialComparision = (stringA, stringB) => {
	return stringA.toLocaleLowerCase().includes(stringB.toLocaleLowerCase());
};

/**
 *
 * @param {SearchInput} searchInput searchInput object
 * @param {string} key key of searchInput to value to compare
 * @param {string} stringB
 */
const searchSingleValueWithComparision = (searchInput, key, stringA) => {
	if (!searchInput[key]) return true;
	return caseInsensitivePartialComparision(stringA, searchInput[key]);
};

/**
 *
 * @param {Date} date date to compare to
 * @param {SearchInput} searchInput
 */
const dateComparision = (date, searchInput) => {
	let result = true;
	const dateProducted = new Date(date);

	if (searchInput.productionYearStart)
		result =
			dateProducted.getFullYear() >=
			parseInt(searchInput.productionYearStart);
	if (searchInput.productionYearEnd)
		result =
			dateProducted.getFullYear() <=
			parseInt(searchInput.productionYearEnd);

	return result;
};

/**
 *
 * @param {Array.<Movie>} movies
 * @param {SearchInput} searchInput
 */
const searchMovies = (movies, searchInput) => {
	return movies.filter(
		(movie) =>
			searchSingleValueWithComparision(
				searchInput,
				'title',
				movie.title,
			) &&
			searchSingleValueWithComparision(
				searchInput,
				'director',
				movie.director,
			) &&
			movie.actors.some((actor) =>
				searchSingleValueWithComparision(
					searchInput,
					'actor',
					actor.name,
				),
			) &&
			dateComparision(movie.productionDate, searchInput),
	);
};
