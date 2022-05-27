import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import home from './routes/home.js';
import login from './routes/login.js';
import register from './routes/register.js';
import movie from './routes/movie.js';
import logout from './routes/logout.js';
import dashboard from './routes/dashboard.js';
import addMovie from './routes/addMovie.js';

const app = express();

app.set('view engine', 'ejs');

// Middlewares
app.use(express.json()); // Used to parse JSON bodies
app.use(cookieParser());
app.use(
	session({
		secret: process.env.SECRET_SESSION_KEY,
		resave: false,
		saveUninitialized: true,
	}),
);
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies using qs library

app.use(function (req, res, next) {
	res.locals.user = req.session.user;
	next();
});

// Static content
app.use('/public', express.static('public'));
app.use('/src/js', express.static('src/js'));

// Routes
app.use('/', home);
app.use('/login', login);
app.use('/register', register);
app.use('/logout', logout);
app.use('/movie', movie);
app.use('/dashboard', dashboard);
app.use('/add-movie', addMovie);
app.use('/*', home);

// Run server
app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
