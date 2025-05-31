const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    zonePrices: [{
        zoneName: String,
        price: Number,
        color: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ticket', ticketSchema); 