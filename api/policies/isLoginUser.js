/**
 * Created by harry on 15/5/11.
 */

module.exports = function(req, res, next) {
  var is_auth = req.isAuthenticated();
  if (is_auth) return next();
  // User is not allowed
  return res.forbidden('You are not permitted to perform this action.');
}
