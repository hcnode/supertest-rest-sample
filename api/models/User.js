/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
function sendMail(to, code, call) {
  var transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "", // Modify here to set mail sender account
      pass: password // set the pasword
    }
  });
  transport.sendMail({
    from: "", // sender address
    to: to, // list of receivers
    subject: "Sails-with-passport Account Recovery", // Subject line
    html: "verify code : " + code // html body
  }, function(err, response) {
    call(err, response);
  });
}
function encodePassword(user, cb) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        console.log(err);
        cb(err);
      }else{
        user.password = hash;
        cb(null, user);
      }
    });
  });
}
module.exports = {

  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true,
      email : true
    },
    password: {
      type: 'string',
      required: true
    },
    verifycode: {
      type: 'string'
    },
    pets : {
      collection : "pets"
    },
    toJSON: function() {
      var obj = this;
      delete obj.password;
      delete obj.verifycode;
      return obj;
    }
  },
  sendVerifyCodeMail : function (email, call) {
    var verifyCode = new Date().valueOf() + "";
    sendMail(email, verifyCode, function (err, response) {
      if(!err){
        User.find({username:email}).exec(function (err, users) {
          if(users.length > 0){
            users[0].verifycode = verifyCode;
            users[0].save(function (err) {
              call(err)
            });
          }
        })
      }else {
        call(err);
      }
    });
  },
  changePassword : function (email, newPassord, verifyCode, cb) {
    User.findOne({username:email}).exec(function (err, user) {
      if(user){
        if(!user.verifycode){
          return cb("change password is fobidden");
        }
        if(user.verifycode == verifyCode){
          user.password = newPassord;
          user.verifycode = "";
          encodePassword(user, function (err, user) {
            if(err){
              cb(err);
            }else {
              user.save(function (err) {
                cb(err);
              });
            }
          });
        }else{
          cb("verify code is err");
          //cb(user.verifycode +":"+ verifyCode);
        }
      }else{
        cb("email not found");
      }
    })
  },
  beforeCreate: function(user, cb) {
    encodePassword(user, cb);
  }

};
