'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/* Claim Schema  -- stores the unique claim codes for each email / doi combo to claim their badges*/

var claimSchema = new Schema({
  slug: String,
  doi: String,
  status: String
});

mongoose.model('Claim', claimSchema);

/* User Schema  -- to store Publisher ORCIDS. */
/* Only publishers can create papers that will issue claim codes. */

var userSchema = new Schema({
  name: String,
  orcid: String,
  role: String
});

userSchema.pre('save', function (next, done) {
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  this.updatedAt = Date.now();
  next();
});

mongoose.model('User', userSchema);
