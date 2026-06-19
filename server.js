const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files directly

const dataPath = path.join(__dirname, 'data');
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
}

const appsFile = path.join(dataPath, 'applications.json');
const usersFile = path.join(dataPath, 'users.json');
const logsFile = path.join(dataPath, 'logs.json');

const defaultUsers = [
    { username: 'admin', password: 'S4ndw!4_SMP#ScuRe_2026!', role: 'Администратор' },
    { username: 'Banan4o', password: 'Banan4o123Sand@wi4', role: 'Администратор' },
    { username: 'Krasi', password: 'Krasicheto123Sandik@4', role: 'Администратор' }
];

function readJSON(file, defaultValue = []) {
    if (!fs.existsSync(file)) return defaultValue;
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8')) || defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 4), 'utf8');
}

// Applications API
app.get('/api/applications', (req, res) => {
    res.json(readJSON(appsFile));
});

app.post('/api/applications', (req, res) => {
    const apps = readJSON(appsFile);
    apps.push(req.body);
    writeJSON(appsFile, apps);
    res.json({ success: true });
});

app.put('/api/applications', (req, res) => {
    const apps = readJSON(appsFile);
    const { id, status } = req.body;
    apps.forEach(app => {
        if (app.id == id) {
            app.status = status;
        }
    });
    writeJSON(appsFile, apps);
    res.json({ success: true });
});

app.delete('/api/applications/:id', (req, res) => {
    let apps = readJSON(appsFile);
    apps = apps.filter(app => app.id != req.params.id);
    writeJSON(appsFile, apps);
    res.json({ success: true });
});

// Users API
app.get('/api/users', (req, res) => {
    let users = readJSON(usersFile);
    
    // Ensure default users are registered
    let updated = false;
    defaultUsers.forEach(defUser => {
        const found = users.some(u => u.username.toLowerCase() === defUser.username.toLowerCase());
        if (!found) {
            users.push(defUser);
            updated = true;
        }
    });
    if (updated || users.length === 0) {
        writeJSON(usersFile, users);
    }
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const users = readJSON(usersFile);
    users.push(req.body);
    writeJSON(usersFile, users);
    res.json({ success: true });
});

app.delete('/api/users/:username', (req, res) => {
    let users = readJSON(usersFile);
    users = users.filter(u => u.username.toLowerCase() !== req.params.username.toLowerCase());
    writeJSON(usersFile, users);
    res.json({ success: true });
});

// Logs API
app.get('/api/logs', (req, res) => {
    res.json(readJSON(logsFile));
});

app.post('/api/logs', (req, res) => {
    const logs = readJSON(logsFile);
    logs.unshift(req.body);
    writeJSON(logsFile, logs);
    res.json({ success: true });
});

app.delete('/api/logs', (req, res) => {
    writeJSON(logsFile, []);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Sandwi4 SMP server running at http://localhost:${PORT}`);
});
