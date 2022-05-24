import User from '../models/User.js'

const registerTranslation = {
	title: 'Zarejestruj się',
	href: '/login',
	hrefText: 'Masz już konto? Zaloguj się.',
	buttonText: 'Zarejestruj się',
	action: '/register',
}

export const registerView = (req, res) => {
	if(req.session.user) {
		res.redirect('/');
	} else {
		res.render('layout', {
			page: 'views/login',
			translations: registerTranslation,
		})
	}
}

export const registerUser = async (req, res) => {
    const { login, password } = req.body;

    try {
        const u = new User(login, password);
		await u.saveUserToDatabase();

		res.redirect('/login');
    } catch (e) {
        res.render('layout', {
            page: 'views/login',
            translations: registerTranslation,
            errors: [e.message]
        })
    }
}
