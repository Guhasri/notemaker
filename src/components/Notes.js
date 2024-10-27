import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Notes.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [localNotes, setLocalNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNoteTitle, setEditingNoteTitle] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.user) {
      setUsername(user.user.username);
      fetchNotes(user.user.username);
    }
  }, []);

  // Fetch notes from the server
  const fetchNotes = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/notes/${username}`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Handle adding a note locally
  const handleAddNote = () => {
    const newNote = {
      username,
      title,
      content,
      timestamp: new Date().toISOString(), // Add timestamp when note is created
    };

    setLocalNotes((prev) => [...prev, newNote]);
    setTitle('');
    setContent('');
  };

  // Sync local notes to the server
  const syncNotes = async () => {
    if (localNotes.length === 0) return;

    for (const localNote of localNotes) {
      const serverNote = notes.find((note) => note.title === localNote.title);

      if (serverNote) {
        // Compare timestamps if the same title exists on the server
        const localTimestamp = new Date(localNote.timestamp);
        const serverTimestamp = new Date(serverNote.timestamp);

        if (localTimestamp > serverTimestamp) {
          // Update the server with the local note if it has a newer timestamp
          try {
            const response = await axios.put(`http://localhost:5000/api/notes/${localNote.title}`, localNote);
            setNotes((prevNotes) =>
              prevNotes.map((note) =>
                note.title === localNote.title ? response.data : note
              )
            );
          } catch (error) {
            console.error('Error updating note during sync:', error);
          }
        }
      } else {
        // If note doesn't exist on the server, add it
        try {
          const response = await axios.post('http://localhost:5000/api/notes', localNote);
          setNotes((prevNotes) => [...prevNotes, response.data]);
        } catch (error) {
          console.error('Error syncing note:', error);
        }
      }
    }

    // Clear local notes after sync
    setLocalNotes([]);
  };

  // Handle editing a note
  const handleEditNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingNoteTitle(note.title);
  };

  // Handle updating a note
  const handleUpdateNote = async () => {
    const updatedNote = {
      username,
      title,
      content,
      timestamp: new Date().toISOString(), 
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/notes/${editingNoteTitle}`, updatedNote);
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.title === editingNoteTitle ? response.data : note))
      );
      setTitle('');
      setContent('');
      setEditingNoteTitle('');
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  // Handle deleting a note
  const handleDeleteNote = async (noteTitle) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${noteTitle}`, {
        data: { username },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note.title !== noteTitle));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Handle logging out the user
  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user info from localStorage
    navigate('/login'); // Redirect to login page
  };

  // Download notes as text file
  const downloadNotes = (format) => {
    let dataStr = notes.map(note => `Title: ${note.title}\nContent: ${note.content}\n`).join('\n');
    const blob = new Blob([dataStr], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="notes-container">
      <h2 className="notes-header">Notes for {username}</h2>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <div className="input-container">
        <input
          className="note-title-input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="note-content-input"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {editingNoteTitle ? (
          <button className="note-button update-button" onClick={handleUpdateNote}>Update Note</button>
        ) : (
          <button className="note-button add-button" onClick={handleAddNote}>Add Note</button>
        )}
      </div>

      <div className="notes-list">
        {localNotes.map((note, index) => (
          <div className="note-item offline-note" key={index}>
            <h3 className="note-title">{note.title} (Offline)</h3>
            <p className="note-content">{note.content}</p>
          </div>
        ))}
        {notes.map((note) => (
          <div className="note-item" key={note.title}>
            <h3 className="note-title">{note.title}</h3>
            <p className="note-content">{note.content}</p>
            <div className="button-group">
              <button className="note-button edit-button" onClick={() => handleEditNote(note)}>Edit</button>
              <button className="note-button delete-button" onClick={() => handleDeleteNote(note.title)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={syncNotes} className="sync-button">Sync Offline Notes</button>
      <button onClick={() => downloadNotes('txt')} className="download-button">Download All Notes (TXT)</button>
    </div>
  );
};

export default Notes;
