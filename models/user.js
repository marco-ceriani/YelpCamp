var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, default: 'USER' }
})
UserSchema.plugin(passportLocalMongoose)
User = mongoose.model('User', UserSchema)

User.register({username: 'admin', role: 'ADMIN'}, 'istrator', function(err, user) {
})

module.exports = User
