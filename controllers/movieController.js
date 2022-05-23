export const movieView = (req, res) => {
	console.log(req.params.id);
	res.render("layout", { page: "views/movie" });
};
