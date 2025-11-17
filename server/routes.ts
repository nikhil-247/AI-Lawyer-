import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertPatientSchema,
  insertMemorySchema,
  insertPersonSchema,
  insertPlaceSchema,
  insertSessionSchema,
  insertScheduleSchema,
  insertFeedbackSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      const user = await storage.createUser(validatedData);
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.get("/api/patients", async (req, res) => {
    try {
      const { userId } = req.query;
      
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: "User ID required" });
      }

      const patients = await storage.getPatientsByUserId(userId);
      res.json(patients);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(validatedData);
      res.json(patient);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.patch("/api/patients/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const patient = await storage.updatePatient(id, req.body);
      
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      res.json(patient);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.get("/api/memories/:patientId", async (req, res) => {
    try {
      const { patientId } = req.params;
      const memories = await storage.getMemoriesByPatientId(patientId);
      res.json(memories);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  app.post("/api/memories", async (req, res) => {
    try {
      const validatedData = insertMemorySchema.parse(req.body);
      const memory = await storage.createMemory(validatedData);
      res.json(memory);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.patch("/api/memories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const memory = await storage.updateMemory(id, req.body);
      
      if (!memory) {
        return res.status(404).json({ error: "Memory not found" });
      }

      res.json(memory);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.delete("/api/memories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMemory(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Memory not found" });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  app.get("/api/people/:patientId", async (req, res) => {
    try {
      const { patientId } = req.params;
      const people = await storage.getPeopleByPatientId(patientId);
      res.json(people);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  app.post("/api/people", async (req, res) => {
    try {
      const validatedData = insertPersonSchema.parse(req.body);
      const person = await storage.createPerson(validatedData);
      res.json(person);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.patch("/api/people/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const person = await storage.updatePerson(id, req.body);
      
      if (!person) {
        return res.status(404).json({ error: "Person not found" });
      }

      res.json(person);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.delete("/api/people/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePerson(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Person not found" });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  app.get("/api/places/:patientId", async (req, res) => {
    try {
      const { patientId } = req.params;
      const places = await storage.getPlacesByPatientId(patientId);
      res.json(places);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  app.post("/api/places", async (req, res) => {
    try {
      const validatedData = insertPlaceSchema.parse(req.body);
      const place = await storage.createPlace(validatedData);
      res.json(place);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.patch("/api/places/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const place = await storage.updatePlace(id, req.body);
      
      if (!place) {
        return res.status(404).json({ error: "Place not found" });
      }

      res.json(place);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.delete("/api/places/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePlace(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Place not found" });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  app.get("/api/sessions/:patientId", async (req, res) => {
    try {
      const { patientId } = req.params;
      const sessions = await storage.getSessionsByPatientId(patientId);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const validatedData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(validatedData);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.updateSession(id, req.body);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.delete("/api/sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSession(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  app.get("/api/schedules/:patientId", async (req, res) => {
    try {
      const { patientId } = req.params;
      const schedules = await storage.getSchedulesByPatientId(patientId);
      res.json(schedules);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  app.get("/api/schedules/:patientId/upcoming", async (req, res) => {
    try {
      const { patientId } = req.params;
      const schedules = await storage.getSchedulesByPatientId(patientId);
      const activeSchedules = schedules.filter(s => s.isActive);
      res.json(activeSchedules);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  app.post("/api/schedules", async (req, res) => {
    try {
      const validatedData = insertScheduleSchema.parse(req.body);
      const schedule = await storage.createSchedule(validatedData);
      res.json(schedule);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.patch("/api/schedules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const schedule = await storage.updateSchedule(id, req.body);
      
      if (!schedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }

      res.json(schedule);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.delete("/api/schedules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSchedule(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Schedule not found" });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(validatedData);
      res.json(feedback);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  app.get("/api/feedback/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const feedback = await storage.getFeedbackBySessionId(sessionId);
      res.json(feedback);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  app.get("/api/feedback/patient/:patientId", async (req, res) => {
    try {
      const { patientId } = req.params;
      const feedback = await storage.getFeedbackByPatientId(patientId);
      res.json(feedback);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
