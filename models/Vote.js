const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true
    },
    criteria: {
        type: String,
        required: true,
        trim: true
    },
    pandalName: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
