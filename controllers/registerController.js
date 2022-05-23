export const registerView = (req, res) => {
	res.render("layout", {
		page: "views/login",
		translations: {
			title: "Zarejestruj się",
			href: "/login",
			hrefText: "Masz już konto? Zaloguj się.",
			buttonText: "Zarejestruj się",
		},
	});
};
