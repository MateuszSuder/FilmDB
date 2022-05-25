import User from '../models/User.js';

export const dashboardView = async (req, res) => {
	if (req.session.user?.permission !== 'admin') {
		// return res.redirect('/');
		const users = await User.getAllUsers([], ['user', 'admin']);
		return res.render('layout', { page: 'views/dashboard', users });
	}
	const users = await User.getAllUsers(
		[req.session.user.id],
		['user', 'admin'],
	);
	res.render('layout', { page: 'views/dashboard', users });
};

export const modifyUserPermission = async (req, res) => {
	const { id, permission } = req.body;

	await User.modifyUserPermission(id, permission);
	res.status(200).end();
};

export const deleteUser = async (req, res) => {
	const { id } = req.body;

	await User.deleteUser(id);
	res.status(200).end();
};

export const blockUser = async (req, res) => {
	const { id, blocked } = req.body;

	await User.blockUser(id, blocked);
	res.status(200).end();
};
