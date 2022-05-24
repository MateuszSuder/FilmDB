import User from '../models/User.js'

export const dashboardView = async (req, res) => {
	if(req.session.user?.permission !== 'admin') {
		return res.redirect('/');
	}
	const users = await User.getAllUsers([req.session.user.id], ['user', 'admin']);
	res.render('layout', { page: 'views/dashboard', users });
}

export const modifyUserPermission = async (req, res) => {

}

export const deleteUser = async (req, res) => {

}

export const blockUser = async (req, res) => {

}