module.exports = function(req, res, next) {
  if (!req.session.isAuthenticated || !(req.session.user && req.session.user.login)) {
    return res.status(404).render('404', {
      title: 'Страница не найдена'
    });
  }

  next();
}