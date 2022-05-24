export const logoutController = (req, res) => {
	req.session.user = undefined;
	res.status(200).end();
}