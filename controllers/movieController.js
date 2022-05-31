import Movie from '../models/Movie.js';

export const movieView = async (req, res) => {
	try {
		let userId = req.session.user?.id;
		const movie = await Movie.getMovie(req.params.id, userId);

		if (movie) {
			res.render('layout', {
				page: 'views/movie',
				movie,
			});
		} else {
			res.redirect('/');
		}
	} catch (e) {
		res.render('layout', {
			page: 'views/home',
		});
	}
};

export const deleteMovie = async (req, res) => {
	if (req.params.id) {
		await Movie.deleteMovie(req.params.id);
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
};
