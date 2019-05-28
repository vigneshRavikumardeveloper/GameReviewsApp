const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true
    },
    ownerUserName: {
        type: String,
        require: true,
        trim: true
    },
    review: {
        type: String,
        require: true,
        trim: true,
        maxlength: 500
    },
    rating: {
        type: String,
        require: true,
        trim: true,
        min: 1,
        max: 10
    },
    ownerId: {
        type: String,
        require: true
    }
}, { timestamps: true });


const ArticleDetails = mongoose.model('Article', ArticleSchema);

module.exports = { ArticleDetails };