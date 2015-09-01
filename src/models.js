'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* Claim Schema */

var claimSchema = new Schema({
  slug: String,
  doi: String,
  status: String
});

mongoose.model('Claim', claimSchema);


/* User Schema */

var userSchema = new Schema({
  name: String,
  orcid: String,
  role: String
})

userSchema.pre('save', function(next, done){
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  this.updatedAt = Date.now();
  next();
});

mongoose.model('User', userSchema);
