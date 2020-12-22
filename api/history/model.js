/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Please login first'],
    },
    imageLink: {
        type: String,
        required: [true,'please upload an image first']
    },
    plasticType: {
        type: String,
        required: [true, 'Type of plastic not specified']
    },
    ytVideos: {
        type: [String]
    },
    articlesLink: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('History', historySchema);
