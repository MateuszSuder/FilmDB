import User from '../models/User.js'

export const registerView = (req, res) => {
	res.render('layout', {
		page: 'views/login',
		translations: {
			title: 'Zarejestruj się',
			href: '/login',
			hrefText: 'Masz już konto? Zaloguj się.',
			buttonText: 'Zarejestruj się',
			action: '/register',
		},
	})
}

export const registerUser = async (req, res) => {
    const { login, password } = req.body;

    try {
        const u = new User(login, password);
		await u.saveUserToDatabase();

		res.render('layout', {
            page: 'views/home',
        })
    } catch (e) {
        res.render('layout', {
            page: 'views/login',
            translations: {
                title: 'Zarejestruj się',
                href: '/login',
                hrefText: 'Masz już konto? Zaloguj się.',
                buttonText: 'Zarejestruj się',
                action: '/register',
            },
            errors: [e.message]
        })
    }
}
