export default function (req, res) {
	if (!req.session.user || req.session.user?.permission === 'user') {
		if (req.method === 'GET') {
			return res.redirect('/');
		} else {
			return res.status(401).json({ error: 'Unauthorized' });
		}
	}
}
