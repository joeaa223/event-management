const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  number: { type: String, required: true },
  status: { type: String, enum: ['available', 'occupied'], default: 'available' },
  price: { type: Number, required: true }
});

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organizer', required: true },
  isPublished: { type: Boolean, default: false },
  entryRules: { type: String },
  createdAt: { type: Date, default: Date.now },
  eventVenue: { type: String },
  eventCategory: { type: String },
  seats: [seatSchema]
});

module.exports = mongoose.model('Event', eventSchema); 