const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const noteSchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, required: true, unique: true },
  content: String,
  timestamp: { type: Date, default: Date.now },
  versions: { type: [versionSchema], default: [] },
});

module.exports = mongoose.model('Note', noteSchema);
