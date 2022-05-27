import Movie from '../models/Movie.js';

export const addMovieView = (req, res) => {
	res.render('layout', { page: 'views/addMovie' });
};

export const editMovieView = (req, res) => {
	res.render('layout', {
		page: 'views/addMovie',
		movie: {
			title: 'Skazani na Shawshank',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam mattis nec eros a vehicula. Maecenas semper justo ac vehicula facilisis. Nullam vel hendrerit nisl. Sed sed tortor convallis, condimentum felis in, dapibus felis. Aliquam pulvinar non nunc at volutpat. ',
			genre: 'Dramat',
			productionCountry: 'USA',
			productionDate: '1994-01-06',
			director: 'Frank Darabont',
			actors: ['Actor 1', 'Actor 2', 'Actor 3', 'Actor 4'],
		},
	});
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
