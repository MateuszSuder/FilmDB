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

export const homeView = async (req, res) => {
	let movies = await Movie.getMovies({
		userId: req.session.user?.id,
		actors: true,
	});

	let genres = await Movie.getAllGenres();
	genres = genres.reduce((prev, curr, i) => {
		prev.push(curr.genre);
		return prev;
	}, []);

	let productionCountries = await Movie.getAllProductionCountries();
	productionCountries = productionCountries.reduce((prev, curr, i) => {
		prev.push(curr.productionCountry);
		return prev;
	}, []);

	movies = searchMovies(movies, { ...req.query });

	res.render('layout', {
		page: 'views/home',
		movies,
		genres,
		productionCountries,
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
	const dateProducted = new Date(date);

	if (searchInput.productionYearStart) {
		if (
			dateProducted.getFullYear() <
			parseInt(searchInput.productionYearStart)
		)
			return false;
	}

	if (searchInput.productionYearStart) {
		if (
			dateProducted.getFullYear() >
			parseInt(searchInput.productionYearEnd)
		)
			return false;
	}

	return true;
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
			dateComparision(movie.productionDate, searchInput) &&
			(searchInput.genre ? movie.genre === searchInput.genre : true) &&
			(searchInput.productionCountry
				? movie.productionCountry === searchInput.productionCountry
				: true),
	);
};
