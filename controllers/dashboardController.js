import User from '../models/User.js'

export const dashboardView = async (req, res) => {
	// if(req.session.user?.permission !== 'admin') {
	// 	return res.redirect('/');
	// }
	const users = await User.getAllUsers([], ['user', 'admin']);
	res.render('layout', { page: 'views/dashboard', users });
}