const messageService = require('../services/messageService');

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await messageService.fetchMessages();
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const newMsg = await messageService.saveMessage(req.body, req.io);
    res.status(201).json(newMsg);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: err.message || 'Failed to save message' });
  }
};
