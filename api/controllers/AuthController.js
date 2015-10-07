/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var passport = require('passport');
module.exports = {
  login: function (req, res) {
    (passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        return res.forbidden({
          message: 'login failed'
        });
      }
      req.logIn(user, function(err) {
        if (err) res.forbidden(err);
        else {
          return res.ok({
            message: 'login successful'
          });
        }
      });
    }))(req, res);
  },
  register : function (req, res) {
    var username = req.body.username;
    var password = req.body.password
    User.create({username : username, password : password}).exec(function (err, user) {
      res.json(user);
    });
  },
  listUser : function (req, res) {
    User.find({}).exec(function (err, users) {
      res.json(users);
    });
  },
  recovery_getcode : function (req, res) {
    var email = req.query.email;
    var validateEmail = (require("anchor")(email)).to({type:"email"});
    if(validateEmail){
      return res.badRequest(validateEmail);
    }
    User.find({username : email}).exec(function (err, users) {
      if(users.length > 0){
        User.sendVerifyCodeMail(email, function (err) {
          if(err){
            res.serverError(err);
          }else{
            res.ok();
          }
        });
      }else{
        return res.notFound();
      }
    });
  },
  changePassword : function (req, res) {
    var email = req.body.email;
    var verifyCode = req.body.verifycode;
    var newpassword = req.body.newpassword;
    var validateEmail = (require("anchor")(email)).to({type:"email"});
    if(validateEmail){
      return res.badRequest(validateEmail);
    }
    User.changePassword(email, newpassword, verifyCode, function (err) {
      if(err){
        res.serverError(err);
      }else{
        res.ok();
      }
    });
  },
  needauth : function (req, res) {
    res.ok();
  },
  noneedauth : function (req, res) {
    res.ok();
  },
  logout: function (req, res){
    req.
    req.logout();
    res.ok('logout successful');
  },
  myinfo: function (req, res){
    res.ok(req.user);
  },

  _config : {
    actions: false,
    rest : false
  }
};

