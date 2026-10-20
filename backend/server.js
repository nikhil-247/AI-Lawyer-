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
const { hashPassword, verifyPassword } = require('./lib/password');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Accept only known audio MIME types and use fixed extensions rather than user-supplied filenames.
const AUDIO_EXTENSIONS = {
  'audio/mpeg': '.mp3',
  'audio/mp3': '.mp3',
  'audio/wav': '.wav',
  'audio/x-wav': '.wav',
  'audio/webm': '.webm',
  'audio/ogg': '.ogg',
  'audio/mp4': '.m4a',
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const extension = AUDIO_EXTENSIONS[file.mimetype];
    if (!extension) {
      return cb(new Error('Unsupported audio type.'), '');
    }
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `audio-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!AUDIO_EXTENSIONS[file.mimetype]) {
      req.audioUploadError = true;
      return cb(null, false);
    }
    cb(null, true);
  },
});

// Multer memory storage for on-the-fly transcription (no files written to disk)
const memoryUpload = multer({ storage: multer.memoryStorage() });

// Log request metadata only. Never log request bodies because they may contain passwords or patient data.
app.use((req, _res, next) => {
  console.info(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Authentication primitives for the prototype. This validates passwords but does not yet issue a session/token.
app.post('/api/auth/signup', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return res.status(400).json({ message: 'A JSON object is required.' });
    }

    const name = typeof payload.name === 'string' ? payload.name.trim() : '';
    const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
    const password = typeof payload.password === 'string' ? payload.password : '';
    if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'A valid name and email are required.' });
    }
    if (password.length < 8 || password.length > 1024) {
      return res.status(400).json({ message: 'Password must be between 8 and 1024 characters.' });
    }

    const existing = await User.findOne({ email }).select('_id');
    if (existing) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const user = await User.create({ name, email, password: await hashPassword(password) });
    const userData = user.toObject();
    delete userData.password;
    res.status(201).json({ ...userData, id: user._id });
  } catch (err) {
    console.error('Error in /api/auth/signup:', err instanceof Error ? err.name : 'UnknownError');
    res.status(500).json({ message: 'Signup failed.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return res.status(400).json({ message: 'A JSON object is required.' });
    }
    const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
    const password = typeof payload.password === 'string' ? payload.password : '';
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const verification = await verifyPassword(password, user.password);
    if (!verification.valid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Upgrade old plain-text records on successful login; new accounts are always hashed.
    if (verification.needsRehash) {
      user.password = await hashPassword(password);
      await user.save();
    }

    const userData = user.toObject();
    delete userData.password;
    res.json({ ...userData, id: user._id });
  } catch (err) {
    console.error('Error in /api/auth/login:', err instanceof Error ? err.name : 'UnknownError');
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

// Audio upload with a size limit and MIME allowlist.
app.post('/api/upload/audio', (req, res, next) => {
  upload.single('audio')(req, res, (error) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'Audio file must be 10 MB or smaller.' });
    }
    if (error) {
      return res.status(400).json({ message: 'Invalid audio upload.' });
    }
    next();
  });
}, (req, res) => {
  if (req.audioUploadError) {
    return res.status(415).json({ message: 'Unsupported audio type. Use MP3, WAV, WEBM, OGG, or M4A.' });
  }
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file uploaded.' });
  }

  return res.status(201).json({ url: `/uploads/${req.file.filename}` });
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
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/memory-assist')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});