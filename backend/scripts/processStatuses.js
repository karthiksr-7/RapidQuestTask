const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Message = require('../models/ProcessedMessage');

dotenv.config();

const folderPath = path.join(__dirname, '../whatsapp sample payloads');

async function processAllStatuses() {
  await connectDB();

  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    if (file.includes('status')) {
      const filePath = path.join(folderPath, file);
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      const statusUpdates = payload.metaData?.entry?.[0]?.changes?.[0]?.value?.statuses;

      if (Array.isArray(statusUpdates)) {
        for (const status of statusUpdates) {
          const { id, status: newStatus } = status;

          if (id && newStatus) {
            const result = await Message.findOneAndUpdate(
              { message_id: id },
              { status: newStatus },
              { new: true }
            );

            if (result) {
              console.log(`✅ Updated status to "${newStatus}" for message ID: ${id}`);
            } else {
              console.warn(`⚠️ No message found for ID: ${id}`);
            }
          }
        }
      } else {
        console.warn(`⚠️ No statuses in file: ${file}`);
      }
    }
  }

  mongoose.disconnect();
}

processAllStatuses();
