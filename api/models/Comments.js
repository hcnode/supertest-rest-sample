/**
* Comments.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    content : {
      type : "string",
      required: true
    },
    replyTo : {
      model : "comments"
    },
    photos : {
      model : "photos",
      required: true
    }
  }
};

