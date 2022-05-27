export const homeView = (req, res) => {
	res.render('layout', {
		page: 'views/home',
		movies: [
			{
				title: 'Zielona mila',
				genre: 'Dramat',
				productionCountry: 'USA',
				productionYear: '1999',
				addDate: '30-04-2022',
				director: 'Frank Darabont',
			},
			{
				title: 'Skazani na Shawshank',
				genre: 'Dramat',
				productionCountry: 'USA',
				productionYear: '1994',
				addDate: '01-05-2022',
				director: 'Frank Darabont',
			},
			{
				title: 'Forrest Gump',
				genre: 'Dramat',
				productionCountry: 'USA',
				productionYear: '1994',
				addDate: '28-04-2022',
				director: 'Robert Zemeckis',
			},
		],
	});
};
