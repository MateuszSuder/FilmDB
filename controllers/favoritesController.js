import Movie from '../models/Movie.js';

export const favoritesView = async (req, res) => {
	if (!req.session.user?.id) return res.redirect('/');

	const movies = await Movie.getUserFavorites(req.session.user.id);

	res.render('layout', {
		page: 'views/favorites',
		movies: movies.map((movie) => ({ ...movie, isFavorite: true })),
	});
};

export const toggleFavorite = async (req, res) => {
	try {
		const { movieId } = req.body;
		await Movie.toggleMovieFavorite(req.session.user.id, movieId);
		res.status(200).end();
	} catch (e) {
		console.error(e);
		res.status(400).end();
	}
};
