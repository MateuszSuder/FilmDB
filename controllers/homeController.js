import Movie from '../models/Movie.js';

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
	const movies = await Movie.getAllMovies(req.session.user?.id);

	res.render('layout', {
		page: 'views/home',
		movies,
	});
};
