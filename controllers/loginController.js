export const loginView = (req, res) => {
	res.render("layout", {
		page: "views/login",
		translations: {
			title: "Zaloguj się",
			href: "/register",
			hrefText: "Nie masz konta? Zarejestruj się.",
			buttonText: "Zaloguj się",
		},
	});
};
