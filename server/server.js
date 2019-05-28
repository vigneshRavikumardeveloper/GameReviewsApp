const express = require('express');

const hbs = require('express-handlebars');

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');

const moment = require('moment');

const config = require('./config/config')(process.env.NODE_ENV);

const app = express();

app.use(bodyParser.json());

app.use(cookieParser());

app.use('/abc', express.static(__dirname + './../public/css'));

app.use('/cde', express.static(__dirname + './../public/js'));

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: __dirname + './../views/layouts',
    partialsDir: __dirname + './../views/partials'
}));

// ADMIN ROLE:1 They can write article and reviews for all the games.
// USER ROLE:2  They can't write article only they can write reviews.
// By default Role => USER ROLE will be generated at the time of signup.

app.set('view engine', 'hbs');

mongoose.Promise = global.Promise;

mongoose.connect(config.DATABASE);

const { UserDetails } = require('./models/user');

const { ArticleDetails } = require('./models/article');

const { UserReviewDetails } = require('./models/user_reviews');

const { auth } = require('./middleware/auth');

app.get('/', (req, res) => {

    ArticleDetails.find().sort({ _id: 'asc' }).limit(10).exec((err, doc) => {
        if (err) return res.status(400).send(err);
        console.log('Articles Documents....');
        console.log(doc);
        res.render('home', {
            articles: doc
        });
    });
});


app.get('/games/:id', auth, (req, res) => {

    let addReview = req.user ? true : false;

    ArticleDetails.findById(req.params.id, (err, Articledoc) => {

        if (err) return res.status(400).send(err);

        UserReviewDetails.find({ 'postId': req.params.id }, (err, UserReview) => {
            if (err) return res.status(400).send(err);

            console.log(UserReview);
            res.render('article', {
                date: moment(Articledoc.createdAt).format('MM/DD/YY'),
                Articledoc,
                review: addReview,
                UserReview
            });
        });
    });
});


app.get('/register', auth, (req, res) => {

    if (req.user) return res.redirect('/dashboard');
    res.render('register');
});

app.get('/login', auth, (req, res) => {

    if (req.user) return res.redirect('/dashboard');
    res.render('login');

});


app.get('/dashboard', auth, (req, res) => {
    if (!req.user) return res.redirect('/login');
    res.render('dashboard', {
        dashboard: true,
        isAdmin: req.user.role === 1 ? true : false
    });
});


app.get('/dashboard/articles', auth, (req, res) => {
    if (!req.user) return res.redirect('/login');
    res.render('admin_articles', {
        dashboard: true,
        isAdmin: req.user.role === 1 ? true : false
    });
});


app.get('/dashboard/reviews', auth, (req, res) => {

    if (!req.user) return res.redirect('/login');

    UserReviewDetails.find({ 'ownerId': req.user._id }, (err, userReview) => {

        if (err) return res.status(400).send(err);

        res.render('admin_reviews', {
            dashboard: true,
            isAdmin: req.user.role === 1 ? true : false,
            userReview
        });

    });
});

app.get('/dashboard/logout', auth, (req, res) => {

    req.user.deleteToken(req.token, (err, user) => {
        if (err) return res.status(400).send(err);
        res.redirect('/');
    });

});

app.post('/api/register', (req, res) => {

    UserDetails.create(req.body, (err, doc) => {
        if (err) {
            return res.status(400).send(err);
        }
        console.log('Before generate Token:');
        doc.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            res.cookie('Auth', user.token).send('OK');
        });
    });

});

app.post('/api/login', (req, res) => {

    UserDetails.findOne({ email: req.body.email }, (err, doc) => {
        if (err) return res.status(400).send(err);

        if (!doc) return res.status(400).send('You are not valid user');

        doc.comparePassword(req.body.password, (err, ismatch) => {
            if (err) throw err;

            if (!ismatch) return res.status(400).json({
                message: 'Wrong Password'
            });

            doc.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie('Auth', user.token).send('OK');
            });
        });
    });

});

app.post('/api/add_article', auth, (req, res, next) => {

    const article = new ArticleDetails({
        ownerUserName: req.user.username,
        ownerId: req.user._id,
        title: req.body.title,
        review: req.body.review,
        rating: req.body.rating
    });

    article.save((err, doc) => {

        if (err) return res.status(400).send(err);

        return res.status(200).send();
    });

});


app.post('/api/user_review', auth, (req, res) => {

    const userReview = new UserReviewDetails({
        postId: req.body.id,
        ownerUserName: req.user.username,
        ownerId: req.user._id,
        titlePost: req.body.titlePost,
        review: req.body.review,
        rating: req.body.rating
    });


    userReview.save((err, doc) => {
        if (err) return res.status(400).send(err);
        console.log(doc);
        return res.status(200).send(doc);
    });

});


app.listen(config.PORT, () => {
    console.log(`Server is listening on port:${config.PORT}`);
});
