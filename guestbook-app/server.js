const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'guestbook.json');

app.use(express.json());
app.use(express.static('public'));

// Load existing entries
app.get('/api/entries', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    res.json(JSON.parse(data || '[]'));
  });
});

// Add a new entry
app.post('/api/entries', (req, res) => {
  const newEntry = req.body;
  
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    
    const entries = JSON.parse(data || '[]');
    entries.push(newEntry);
    
    fs.writeFile(DATA_FILE, JSON.stringify(entries), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save data' });
      }
      res.status(201).json(newEntry);
    });
  });
});

// Delete an entry
app.delete('/api/entries/:id', (req, res) => {
    const { id } = req.params;
  
    fs.readFile(DATA_FILE, (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to read data' });
      }
  
      const entries = JSON.parse(data || '[]').filter(entry => entry.id !== id);
      
      fs.writeFile(DATA_FILE, JSON.stringify(entries), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to save data' });
        }
        res.status(204).send();
      });
    });
  });
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });