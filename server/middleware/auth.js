const { UserDetails } = require('./../models/user');

let auth = (req, res, next) => {

    const token = req.cookies.Auth;
    //  || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1Y2VhZmFlODE0MTk4ZjA1ODgyNjIzZDYiLCJpYXQiOjE1NTg5NzA2NjN9.LtXTC3GfxLCY6ole3igwxB5DLgeu4EYrqDG14IrM0vU";
    console.log(req.url);
    console.log('token from cookie:' + token);

    UserDetails.findByToken(token, (err, user) => {
        if (err) {
            console.log("Token is not available in cookie");
            req.error = err;
        }
        req.user = user;
        next();
    });
};

module.exports = { auth };
