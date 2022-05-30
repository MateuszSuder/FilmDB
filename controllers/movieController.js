import Movie from '../models/Movie.js';

export const movieView = async (req, res) => {
	try {
		const movie = await Movie.getMovie(req.params.id);
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
