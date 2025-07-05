const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite Database (creates it if it doesn't exist)
const db = new sqlite3.Database('./clinic.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the clinic database.');
});

// Create Tables (if they don't exist)
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS Clients (id TEXT PRIMARY KEY, name TEXT, phone TEXT, email TEXT)',
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Clients table created or already exists.');
      }
    }
  );

  db.run(
    'CREATE TABLE IF NOT EXISTS Animals (id TEXT PRIMARY KEY, clientId TEXT, name TEXT, type TEXT, age TEXT, race TEXT, sexe TEXT, FOREIGN KEY(clientId) REFERENCES Clients(id))',
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Animals table created or already exists.');
      }
    }
  );

  db.run(
    'CREATE TABLE IF NOT EXISTS Consultations (id TEXT PRIMARY KEY, doctor TEXT, clientId TEXT, animalId TEXT, consultation TEXT, symptoms TEXT, vaccins TEXT, examen TEXT, FOREIGN KEY(clientId) REFERENCES Clients(id), FOREIGN KEY(animalId) REFERENCES Animals(id))',
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Consultations table created or already exists.');
      }
    }
  );
});

// API Endpoint to Handle Clinical Data
app.post('/api/consultations', (req, res) => {
  const data = req.body;
  const consultationId = uuidv4();
  const clientId = uuidv4();
  const animalId = uuidv4();

  db.serialize(() => {
    // Insert Client
    db.run(
      'INSERT INTO Clients (id, name, phone, email) VALUES (?, ?, ?, ?)',
      [clientId, data.client.name, data.client.phone, data.client.email],
      (err) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: 'Failed to save client.' });
        }

        // Insert Animal
        db.run(
          'INSERT INTO Animals (id, clientId, name, type, age, race, sexe) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [animalId, clientId, data.animal.name, data.animal.type, data.animal.age, data.animal.race, data.animal.sexe],
          (err) => {
            if (err) {
              console.error(err.message);
              return res.status(500).json({ error: 'Failed to save animal.' });
            }

            // Insert Consultation
            db.run(
              'INSERT INTO Consultations (id, doctor, clientId, animalId, consultation, symptoms, vaccins, examen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [
                consultationId,
                data.doctor,
                clientId,
                animalId,
                JSON.stringify(data.consultation),
                JSON.stringify(data.symptoms),
                JSON.stringify(data.vaccins),
                JSON.stringify(data.examen),
              ],
              (err) => {
                if (err) {
                  console.error(err.message);
                  return res.status(500).json({ error: 'Failed to save consultation.' });
                }
                res.json({ id: consultationId, ...data });
              }
            );
          }
        );
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});