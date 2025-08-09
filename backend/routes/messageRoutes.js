const express = require('express');
const router = express.Router();
const Message = require('../models/ProcessedMessage');
const messageController = require('../controllers/messageController');

module.exports = (io) => {
  // Socket listener for status updates
  Message.watch([], { fullDocument: 'updateLookup' }).on('change', (change) => {
    if (change.operationType === 'update') {
      const updatedMessage = change.fullDocument;
      io.emit('statusUpdated', updatedMessage);
      console.log('📡 Emitted statusUpdated:', updatedMessage);
    }
  });

  // Pass io to controller via middleware
  router.use((req, res, next) => {
    req.io = io;
    next();
  });

  router.get('/', messageController.getAllMessages);
  router.post('/', messageController.createMessage);

  return router;
};
