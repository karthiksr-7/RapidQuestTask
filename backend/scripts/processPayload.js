// backend/scripts/processPayload.js

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Message = require('../models/ProcessedMessage');

dotenv.config();

const folderPath = path.join(__dirname, '../whatsapp sample payloads');

async function processAllMessages() {
  await connectDB();

  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    if (file.includes('message')) {
      const filePath = path.join(folderPath, file);
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      const data = payload.metaData?.entry?.[0]?.changes?.[0]?.value;
      const contact = data?.contacts?.[0];
      const message = data?.messages?.[0];

      if (message && contact) {
        const entry = new Message({
          message_id: message.id,
          wa_id: contact.wa_id,
          name: contact.profile?.name || '',
          from: message.from,
          message: message.text?.body || '',
          timestamp: new Date(Number(message.timestamp) * 1000),
          status: 'sent',
        });

        try {
          await entry.save();
          console.log(`✅ Saved from file: ${file}`);
        } catch (err) {
          console.error(`❌ Error saving file: ${file}`, err);
        }
      } else {
        console.warn(`⚠️ Skipped file (no message/contact): ${file}`);
      }
    }
  }

  mongoose.disconnect();
}

processAllMessages();
