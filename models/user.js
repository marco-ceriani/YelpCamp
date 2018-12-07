var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')

var UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        index: true,
        unique: true
    },
    password: String,
    avatar: String,
    fullName: String,
    email: String,
    role: { type: String, default: 'USER' },
    disabled: Boolean
})
UserSchema.methods.isAdmin = function() {
    return this.role === 'ADMIN'
}

UserSchema.plugin(passportLocalMongoose)
User = mongoose.model('User', UserSchema)

module.exports = User
