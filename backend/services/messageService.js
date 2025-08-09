const Message = require('../models/ProcessedMessage');

exports.fetchMessages = async () => {
  return await Message.find().sort({ timestamp: 1 });
};

exports.saveMessage = async (data, io) => {
  const { message_id, wa_id, name, from, message, timestamp, status } = data;

  if (!wa_id || !message) {
    throw new Error('wa_id and message are required');
  }

  if (message_id) {
    const exists = await Message.findOne({ message_id });
    if (exists) {
      throw new Error('Message already exists with this ID');
    }
  }

  const newMsg = new Message({
    message_id: message_id || null,
    wa_id,
    name: name || 'Unknown',
    from: from || 'me',
    message,
    timestamp: timestamp ? new Date(timestamp) : new Date(),
    status: status || 'sent',
  });

  const saved = await newMsg.save();

  // Emit to all connected clients
  io.emit('newMessage', saved);
  console.log('📨 Emitted newMessage:', saved);

  return saved;
};
