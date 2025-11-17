import {
  type User,
  type InsertUser,
  type Patient,
  type InsertPatient,
  type Memory,
  type InsertMemory,
  type Person,
  type InsertPerson,
  type Place,
  type InsertPlace,
  type Session,
  type InsertSession,
  type Schedule,
  type InsertSchedule,
  type Feedback,
  type InsertFeedback,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientsByUserId(userId: string): Promise<Patient[]>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, patient: Partial<Patient>): Promise<Patient | undefined>;
  
  getMemory(id: string): Promise<Memory | undefined>;
  getMemoriesByPatientId(patientId: string): Promise<Memory[]>;
  createMemory(memory: InsertMemory): Promise<Memory>;
  updateMemory(id: string, memory: Partial<Memory>): Promise<Memory | undefined>;
  deleteMemory(id: string): Promise<boolean>;
  
  getPerson(id: string): Promise<Person | undefined>;
  getPeopleByPatientId(patientId: string): Promise<Person[]>;
  createPerson(person: InsertPerson): Promise<Person>;
  updatePerson(id: string, person: Partial<Person>): Promise<Person | undefined>;
  deletePerson(id: string): Promise<boolean>;
  
  getPlace(id: string): Promise<Place | undefined>;
  getPlacesByPatientId(patientId: string): Promise<Place[]>;
  createPlace(place: InsertPlace): Promise<Place>;
  updatePlace(id: string, place: Partial<Place>): Promise<Place | undefined>;
  deletePlace(id: string): Promise<boolean>;
  
  getSession(id: string): Promise<Session | undefined>;
  getSessionsByPatientId(patientId: string): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, session: Partial<Session>): Promise<Session | undefined>;
  deleteSession(id: string): Promise<boolean>;
  
  getSchedule(id: string): Promise<Schedule | undefined>;
  getSchedulesByPatientId(patientId: string): Promise<Schedule[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: string, schedule: Partial<Schedule>): Promise<Schedule | undefined>;
  deleteSchedule(id: string): Promise<boolean>;
  
  getFeedbackBySessionId(sessionId: string): Promise<Feedback[]>;
  getFeedbackByPatientId(patientId: string): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private patients: Map<string, Patient>;
  private memories: Map<string, Memory>;
  private people: Map<string, Person>;
  private places: Map<string, Place>;
  private sessions: Map<string, Session>;
  private schedules: Map<string, Schedule>;
  private feedbacks: Map<string, Feedback>;

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.memories = new Map();
    this.people = new Map();
    this.places = new Map();
    this.sessions = new Map();
    this.schedules = new Map();
    this.feedbacks = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientsByUserId(userId: string): Promise<Patient[]> {
    return Array.from(this.patients.values()).filter((p) => p.userId === userId);
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = randomUUID();
    const patient: Patient = {
      ...insertPatient,
      id,
      createdAt: new Date(),
    };
    this.patients.set(id, patient);
    return patient;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | undefined> {
    const patient = this.patients.get(id);
    if (!patient) return undefined;
    
    const updated = { ...patient, ...updates };
    this.patients.set(id, updated);
    return updated;
  }

  async getMemory(id: string): Promise<Memory | undefined> {
    return this.memories.get(id);
  }

  async getMemoriesByPatientId(patientId: string): Promise<Memory[]> {
    return Array.from(this.memories.values()).filter((m) => m.patientId === patientId);
  }

  async createMemory(insertMemory: InsertMemory): Promise<Memory> {
    const id = randomUUID();
    const memory: Memory = {
      ...insertMemory,
      id,
      createdAt: new Date(),
    };
    this.memories.set(id, memory);
    return memory;
  }

  async updateMemory(id: string, updates: Partial<Memory>): Promise<Memory | undefined> {
    const memory = this.memories.get(id);
    if (!memory) return undefined;
    
    const updated = { ...memory, ...updates };
    this.memories.set(id, updated);
    return updated;
  }

  async deleteMemory(id: string): Promise<boolean> {
    return this.memories.delete(id);
  }

  async getPerson(id: string): Promise<Person | undefined> {
    return this.people.get(id);
  }

  async getPeopleByPatientId(patientId: string): Promise<Person[]> {
    return Array.from(this.people.values()).filter((p) => p.patientId === patientId);
  }

  async createPerson(insertPerson: InsertPerson): Promise<Person> {
    const id = randomUUID();
    const person: Person = {
      ...insertPerson,
      id,
      createdAt: new Date(),
    };
    this.people.set(id, person);
    return person;
  }

  async updatePerson(id: string, updates: Partial<Person>): Promise<Person | undefined> {
    const person = this.people.get(id);
    if (!person) return undefined;
    
    const updated = { ...person, ...updates };
    this.people.set(id, updated);
    return updated;
  }

  async deletePerson(id: string): Promise<boolean> {
    return this.people.delete(id);
  }

  async getPlace(id: string): Promise<Place | undefined> {
    return this.places.get(id);
  }

  async getPlacesByPatientId(patientId: string): Promise<Place[]> {
    return Array.from(this.places.values()).filter((p) => p.patientId === patientId);
  }

  async createPlace(insertPlace: InsertPlace): Promise<Place> {
    const id = randomUUID();
    const place: Place = {
      ...insertPlace,
      id,
      createdAt: new Date(),
    };
    this.places.set(id, place);
    return place;
  }

  async updatePlace(id: string, updates: Partial<Place>): Promise<Place | undefined> {
    const place = this.places.get(id);
    if (!place) return undefined;
    
    const updated = { ...place, ...updates };
    this.places.set(id, updated);
    return updated;
  }

  async deletePlace(id: string): Promise<boolean> {
    return this.places.delete(id);
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getSessionsByPatientId(patientId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter((s) => s.patientId === patientId);
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const session: Session = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    const updated = { ...session, ...updates };
    this.sessions.set(id, updated);
    return updated;
  }

  async deleteSession(id: string): Promise<boolean> {
    return this.sessions.delete(id);
  }

  async getSchedule(id: string): Promise<Schedule | undefined> {
    return this.schedules.get(id);
  }

  async getSchedulesByPatientId(patientId: string): Promise<Schedule[]> {
    return Array.from(this.schedules.values()).filter((s) => s.patientId === patientId);
  }

  async createSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    const id = randomUUID();
    const schedule: Schedule = {
      ...insertSchedule,
      id,
      createdAt: new Date(),
    };
    this.schedules.set(id, schedule);
    return schedule;
  }

  async updateSchedule(id: string, updates: Partial<Schedule>): Promise<Schedule | undefined> {
    const schedule = this.schedules.get(id);
    if (!schedule) return undefined;
    
    const updated = { ...schedule, ...updates };
    this.schedules.set(id, updated);
    return updated;
  }

  async deleteSchedule(id: string): Promise<boolean> {
    return this.schedules.delete(id);
  }

  async getFeedbackBySessionId(sessionId: string): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values()).filter((f) => f.sessionId === sessionId);
  }

  async getFeedbackByPatientId(patientId: string): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values()).filter((f) => f.patientId === patientId);
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = randomUUID();
    const feedback: Feedback = {
      ...insertFeedback,
      id,
      timestamp: new Date(),
    };
    this.feedbacks.set(id, feedback);
    return feedback;
  }
}

export const storage = new MemStorage();
