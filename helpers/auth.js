module.exports = {
  enureAuthenticated: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error_msg', 'Not Authorised');
    res.redirect('/users/login');
  }
}