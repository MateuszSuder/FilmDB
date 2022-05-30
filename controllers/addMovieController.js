import Movie from '../models/Movie.js';

export const addMovieView = (req, res) => {
	res.render('layout', { page: 'views/addMovie' });
};

export const editMovieView = async (req, res) => {
	if (!req.params.id) return res.redirect('/');

	const movie = await Movie.getMovie(req.params.id);

	res.render('layout', {
		page: 'views/addMovie',
		movie,
	});
};

export const editMovieFormHandler = async (req, res) => {
	try {
		await Movie.editMovie(req.body);

		res.redirect('/add-movie');
	} catch (e) {
		console.error(e);
		res.redirect('/');
	}
};

export const movieFormHandler = async (req, res) => {
	try {
		await Movie.addMovie(req.body);

		res.redirect('/add-movie');
	} catch (e) {
		console.error(e);
		res.redirect('/');
	}
};
