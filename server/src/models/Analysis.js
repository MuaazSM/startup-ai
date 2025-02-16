// server/src/models/Analysis.js
const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  context_used: [{
    source: String,
    relevance: Number
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analysis', analysisSchema);