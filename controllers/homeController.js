export const homeView = (req, res) => {
    req.session
    res.render('layout', { page: 'home' });
}