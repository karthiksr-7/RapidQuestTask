const mongoose = require('mongoose');

const processedMessageSchema = new mongoose.Schema({
  message_id: String,
  wa_id: String,
  name: String,
  from: String,
  message: String,
  timestamp: Date,
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  }
});

module.exports = mongoose.model('ProcessedMessage', processedMessageSchema);
