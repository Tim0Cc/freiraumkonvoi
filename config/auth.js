function ensureAuthenticated(req,res,next) {
      if(req.isAuthenticated()) {
          return next();
      }
      req.flash('error_msg' , 'Sie müssen eingeloggt sein, um auf diesen Inhalt zugreifen zu können!');
      res.redirect('/users/login');
  }

function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      req.flash('error_msg', 'Sie sind zu dieser Aktion nicht Autorisiert. Bitte wenden Sie sich an die Administration!')
      res.redirect('/dashboard')
    }
    next()
  }
}

  module.exports = { ensureAuthenticated, authRole }