const mongoose = require('mongoose');

// LibrarySet Schema
const librarySetSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true, index: true },
  data: {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    votes: { type: Number, default: 0 },
    copies: { type: Number, default: 0 },
  },
  timestamp: { type: Number, required: true, index: true },
}, { timestamps: true });

const LibrarySet = mongoose.model('librarySet', librarySetSchema, 'librarySet');

module.exports = {
  LibrarySet,
};