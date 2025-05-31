const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: {
        type: Date,
        default: function() {
            const malaysiaTime = new Date();
            malaysiaTime.setHours(malaysiaTime.getHours() + 8);
            return malaysiaTime;
        }
    }
}, { timestamps: false });

module.exports = mongoose.model('Waitlist', waitlistSchema); 