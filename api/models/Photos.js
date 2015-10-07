/**
* Photos.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    url : {
      type : "string",
      required: true
    },
    title : "string",
    description : "string",
    star : {
      collection : "user"
    },
    comments : {
      collection : "comments"
    }
  }
};

