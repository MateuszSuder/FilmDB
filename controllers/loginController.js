import User from '../models/User.js'
import bcrypt from 'bcrypt'

export const loginView = (req, res) => {
  res.render("layout", {
    page: "views/login",
    translations: {
      title: "Zaloguj się",
      href: "/register",
      hrefText: "Nie masz konta? Zarejestruj się.",
      buttonText: "Zaloguj się",
      action: "/login",
    },
  });
};

export const loginUser = async (req, res) => {
  const { login, password } = req.body;

  try {
    const u = new User(login, password);
    const result = await u.searchUserInDB();

    if(result.length === 0) throw new Error(`Niepoprawny login`);

    const validation = await bcrypt.compare(password, result[0].password);

    if(!validation) throw new Error(`Niepoprawne hasło`);

    res.redirect('/');
  } catch (e) {
    res.render('layout', {
      page: 'views/login',
      translations: {
        title: "Zaloguj się",
        href: "/register",
        hrefText: "Nie masz konta? Zarejestruj się.",
        buttonText: "Zaloguj się",
        action: "/login",
      },
      errors: [e.message]
    })
  }
}
