export const movieView = (req, res) => {
	console.log(req.params.id);
	res.render('layout', {
		page: 'views/movie',
		movie: {
			title: 'Skazani na Shawshank',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam mattis nec eros a vehicula. Maecenas semper justo ac vehicula facilisis. Nullam vel hendrerit nisl. Sed sed tortor convallis, condimentum felis in, dapibus felis. Aliquam pulvinar non nunc at volutpat. ',
			genre: 'Dramat',
			productionCountry: 'USA',
			productionDate: '1994-01-06',
			addDate: '2022-05-16',
			director: 'Frank Darabont',
			actors: ['Actor 1', 'Actor 2', 'Actor 3', 'Actor 4'],
		},
	});
};
