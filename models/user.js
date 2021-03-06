var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var findOrCreate = require('mongoose-findorcreate')
var Course = require('./course')

var userSchema = Schema({
    email:{type:String},
    password:{type:String},
    courseOffered:[{type:Schema.Types.ObjectId,ref:'Course'}],
    courseRegistered: [{type:String}]
});

userSchema.plugin(findOrCreate);
userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User',userSchema);
