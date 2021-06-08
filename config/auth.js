// Authorisation by Authentications

module.exports = {
  ensureAuthenticated : function(req,res,next) {
      if(req.isAuthenticated()) {
          return next();
      }
      req.flash('error_msg' , 'Sie müssen eingeloggt sein, um auf diesen Inhalt zugreifen zu können!');
      res.redirect('/users/login');
  }
}