const express = require('express');
const Note = require('../models/Note'); // Adjust the path according to your project structure
const router = express.Router();

router.post('/migrate', async (req, res) => {
  const { oldUsername, newUsername } = req.body;

  try {
    // Find notes for the old username
    const notesToMigrate = await Note.find({ username: oldUsername });

    // Create a copy of each note for the new username
    const migratedNotes = notesToMigrate.map(note => {
      return {
        username: newUsername,
        title: note.title,
        content: note.content,
        timestamp: note.timestamp,
        versions: note.versions,
      };
    });

    // Save all migrated notes
    await Note.insertMany(migratedNotes);

    res.status(200).json({ message: 'Notes migrated successfully.' });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ message: 'Error migrating notes.' });
  }
});

module.exports = router;
