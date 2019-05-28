const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const config = require('./../config/config')(process.env.NODE_ENV);

const saltRound = 12;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: 1,
        maxlength: 100
    },
    firstname: {
        type: String,
        require: true,
        trim: true
    },
    lastname: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: 1,
        trim: true
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    role: {
        type: Number,
        default: 2
    },
    token: {
        type: String,
        require: true
    }
});

userSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.hash(user.password, saltRound, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    }
    else {
        next();
    }

});


userSchema.methods.generateToken = function (cb) {
    const user = this;
    console.log('Inside Generate Token Method:');

    const token = jwt.sign({ sub: user._id }, config.SECRET);

    user.token = token;

    user.save((err, doc) => {
        if (err) return cb(err);
        return cb(null, doc);
    });
};


userSchema.methods.comparePassword = function (logpassword, cb) {
    const user = this;
    console.log('Inside compare password....');
    console.log(user);
    bcrypt.compare(logpassword, user.password, function (err, isMatch) {
        if (err) return cb(err);
        return cb(null, isMatch);
    });
}


userSchema.statics.findByToken = function (token, cb) {

    const user = this;
    console.log('Inside findByToken Method.....');
    console.log(user);
    jwt.verify(token, config.SECRET, (err, decode) => {
        if (err) return cb(err);

        console.log(decode);
        user.findOne({ _id: decode.sub, token: token }, (err, doc) => {
            if (err) return cb(err);
            console.log("id :" + doc);
            return cb(null, doc);
        });
    });
};


userSchema.methods.deleteToken = function (token, cb) {

    var user = this;

    console.log('Before Deleting Token.....');
    console.log(user);

    user.update({ $unset: { token: 1 } }, (err, user) => {
        if (err) return cb(err);
        return cb(null, user);
    });

};

const UserDetails = mongoose.model('User', userSchema);

module.exports = { UserDetails };


