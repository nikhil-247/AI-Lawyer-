import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  dementiaStage: text("dementia_stage").notNull(),
  relationship: text("relationship").notNull(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const memories = pgTable("memories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  mediaUrls: text("media_urls").array(),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const people = pgTable("people", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  name: text("name").notNull(),
  relationship: text("relationship").notNull(),
  photoUrl: text("photo_url"),
  significance: text("significance"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const places = pgTable("places", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  name: text("name").notNull(),
  address: text("address"),
  photoUrl: text("photo_url"),
  significance: text("significance"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  audioUrl: text("audio_url"),
  duration: integer("duration"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const schedules = pgTable("schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => sessions.id),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  time: text("time").notNull(),
  days: text("days").array().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  outputDevice: text("output_device"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => sessions.id),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  emoji: text("emoji").notNull(),
  notes: text("notes"),
  anxietyLevel: integer("anxiety_level"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

export const insertMemorySchema = createInsertSchema(memories).omit({
  id: true,
  createdAt: true,
});

export const insertPersonSchema = createInsertSchema(people).omit({
  id: true,
  createdAt: true,
});

export const insertPlaceSchema = createInsertSchema(places).omit({
  id: true,
  createdAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  createdAt: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  timestamp: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Memory = typeof memories.$inferSelect;
export type InsertMemory = z.infer<typeof insertMemorySchema>;

export type Person = typeof people.$inferSelect;
export type InsertPerson = z.infer<typeof insertPersonSchema>;

export type Place = typeof places.$inferSelect;
export type InsertPlace = z.infer<typeof insertPlaceSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
