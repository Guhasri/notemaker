// routes/notes.js
const express = require('express');
const Note = require('../models/Note');
const router = express.Router();


router.get('/:username', async (req, res) => {
  console.log("here");
  const { username } = req.params;
  try {
    const notes = await Note.find({ username });
    console.log(notes);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Create a note
router.post('/', async (req, res) => {
  const { username, title, content } = req.body;
  try {
    const note = new Note({ username, title, content });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note' });
  }
});

// Update a note
router.put('/:title', async (req, res) => {
  const { title } = req.params;
  const { username, content } = req.body;
  try {
    const updatedNote = await Note.findOneAndUpdate(
      { title, username },
      { content },
      { new: true }
    );
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note' });
  }
});


router.delete('/:title', async (req, res) => {
  const { title } = req.params;
  const { username } = req.body;
  try {
    await Note.findOneAndDelete({ title, username });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note' });
  }
});

module.exports = router;
