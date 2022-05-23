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
    /**
     * @type {Array<Object.<User>> | undefined}
     */
    const result = await u.searchUserInDB();

    await checkData(result, u.password);

    req.session.user = result[0];

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

/**
 * @param {Array<Object.<User>> | undefined} result user get from db
 * @param { string } password password from body
 * @throws error if invalid input
 * @return void
 */
const checkData = async (result, password) => {
  if(!result) throw new Error(`Nieznany błąd`);
  if(result.length === 0) throw new Error(`Niepoprawny login`);

  const validation = await bcrypt.compare(password, result[0].password);

  if(!validation) throw new Error(`Niepoprawne hasło`);
  if(result[0].isBlocked) throw new Error(`Niepoprawne hasło`);
}
