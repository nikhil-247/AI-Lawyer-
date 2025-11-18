const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const User = require('./models/user');
const Patient = require('./models/patient');
const Memory = require('./models/memory');
const Session = require('./models/session');
const Schedule = require('./models/schedule');
const Feedback = require('./models/feedback');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Multer storage for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, `audio-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// Multer memory storage for on-the-fly transcription (no files written to disk)
const memoryUpload = multer({ storage: multer.memoryStorage() });

// Simple request logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log('Body:', req.body);
  }
  next();
});

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    console.log('Signup attempt for email:', email);

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Signup failed: email already in use');
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const user = await User.create({ name, email, password });
    console.log('User created with id:', user._id);

    const { password: _pw, ...userData } = user.toObject();
    const responseUser = { ...userData, id: user._id };
    res.status(201).json(responseUser);
  } catch (err) {
    console.error('Error in /api/auth/signup:', err);

    res.status(500).json({ message: 'Signup failed.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    console.log('Login attempt for email:', email);

    const user = await User.findOne({ email, password });
    if (!user) {
      console.log('Login failed: invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const { password: _pw, ...userData } = user.toObject();
    const responseUser = { ...userData, id: user._id };
    res.json(responseUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed.' });
  }
});

// Patients
app.post('/api/patients', async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    const patientObj = patient.toObject();
    const responsePatient = { ...patientObj, id: patient._id };
    res.status(201).json(responsePatient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create patient.' });
  }
});

// Memories
app.get('/api/memories/:patientId', async (req, res) => {
  try {
    const memories = await Memory.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    res.json(memories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch memories.' });
  }
});

app.post('/api/memories', async (req, res) => {
  try {
    const memory = await Memory.create(req.body);
    res.status(201).json(memory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create memory.' });
  }
});

// Sessions
app.get('/api/sessions/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
      return res.json([]);
    }

    const sessions = await Session.find({ patientId }).sort({ createdAt: -1 });
    const responseSessions = sessions.map((session) => {
      const obj = session.toObject();
      return { ...obj, id: session._id };
    });
    res.json(responseSessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch sessions.' });
  }
});

app.post('/api/sessions', async (req, res) => {
  try {
    const session = await Session.create(req.body);
    const obj = session.toObject();
    const responseSession = { ...obj, id: session._id };
    res.status(201).json(responseSession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create session.' });
  }
});

app.delete('/api/sessions/:id', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete session.' });
  }
});

// Schedules
app.get('/api/schedules/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
      return res.json([]);
    }

    const schedules = await Schedule.find({ patientId }).sort({ createdAt: -1 });
    const responseSchedules = schedules.map((schedule) => {
      const obj = schedule.toObject();
      return { ...obj, id: schedule._id };
    });
    res.json(responseSchedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch schedules.' });
  }
});

app.get('/api/schedules/:patientId/upcoming', async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
      return res.json([]);
    }

    const schedules = await Schedule.find({ patientId, isActive: true }).sort({ createdAt: -1 });
    const responseSchedules = schedules.map((schedule) => {
      const obj = schedule.toObject();
      return { ...obj, id: schedule._id };
    });
    res.json(responseSchedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch upcoming schedules.' });
  }
});

app.post('/api/schedules', async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    const obj = schedule.toObject();
    const responseSchedule = { ...obj, id: schedule._id };
    res.status(201).json(responseSchedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create schedule.' });
  }
});

app.delete('/api/schedules/:id', async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Schedule deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete schedule.' });
  }
});

// Feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save feedback.' });
  }
});

// Audio upload
app.post('/api/upload/audio', upload.single('audio'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ url: fileUrl });
  } catch (err) {
    console.error('Error in /api/upload/audio:', err);
    res.status(500).json({ message: 'Failed to upload audio.' });
  }
});

// Audio transcription (placeholder – integrate real STT later)
app.post('/api/transcribe', memoryUpload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file provided.' });
    }

    // Here you would call an external Speech-to-Text API with req.file.buffer.
    // For now we return a placeholder transcript.
    const transcript = 'Transcription pending (Speech-to-Text not yet integrated)';

    res.json({ transcript });
  } catch (err) {
    console.error('Error in /api/transcribe:', err);
    res.status(500).json({ message: 'Failed to transcribe audio.' });
  }
});

mongoose
  .connect('mongodb://127.0.0.1:27017/memory-assist', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});