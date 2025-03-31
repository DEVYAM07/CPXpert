import { pgTable, text, serial, integer, timestamp, json, uniqueIndex, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  displayName: text("display_name"),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

// Codeforces profile integration
export const codeforcesProfiles = pgTable("codeforces_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  handle: text("handle").notNull(),
  rating: integer("rating"),
  maxRating: integer("max_rating"),
  rank: text("rank"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  problemsSolved: integer("problems_solved"),
  contestsParticipated: integer("contests_participated"),
  profileData: json("profile_data").default({}),
}, (table) => {
  return {
    userIdIdx: uniqueIndex("codeforces_user_id_idx").on(table.userId),
    handleIdx: uniqueIndex("codeforces_handle_idx").on(table.handle),
  }
});

// Study routines
export const studyRoutines = pgTable("study_routines", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  topics: json("topics").default([]),
  schedule: json("schedule").default({}),
  currentRating: integer("current_rating"),
  targetRating: integer("target_rating"),
  studyHoursPerWeek: integer("study_hours_per_week"),
  contestParticipation: text("contest_participation"),
  answers: json("answers").default({}),
  routine: json("routine").default({}),
});

// Problem recommendations
export const problemRecommendations = pgTable("problem_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  problemId: text("problem_id").notNull(),
  problemTitle: text("problem_title").notNull(),
  problemUrl: text("problem_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  difficulty: integer("difficulty"),
  tags: json("tags").default([]),
  source: text("source"),
  status: text("status").default("recommended"),
  solvedOn: timestamp("solved_on"),
});

// Learning resources
export const learningResources = pgTable("learning_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resourceType: text("resource_type").notNull(),
  tags: json("tags").default([]),
  difficulty: text("difficulty"),
  source: text("source"),
});

// Debug sessions
export const debugSessions = pgTable("debug_sessions", {
  id: serial("id").primaryKey(),
  problemStatement: text("problem_statement").notNull(),
  code: text("code").notNull(),
  language: text("language").notNull(),
  aiResponse: text("ai_response").notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  problemId: text("problem_id"),
  tags: json("tags").default([]),
});

// Explain sessions
export const explainSessions = pgTable("explain_sessions", {
  id: serial("id").primaryKey(),
  problemStatement: text("problem_statement").notNull(),
  solutionCode: text("solution_code").notNull(),
  language: text("language").notNull(),
  aiResponse: text("ai_response").notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  problemId: text("problem_id"),
  tags: json("tags").default([]),
});

// CP Problems Database
export const cpProblems = pgTable("cp_problems", {
  id: serial("id").primaryKey(),
  problemId: text("problem_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  inputFormat: text("input_format"),
  outputFormat: text("output_format"),
  constraints: text("constraints"),
  sampleInput: text("sample_input"),
  sampleOutput: text("sample_output"),
  difficulty: integer("difficulty"),
  tags: json("tags").default([]),
  source: text("source"),
  url: text("url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User solutions
export const userSolutions = pgTable("user_solutions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  problemId: text("problem_id").notNull(),
  code: text("code").notNull(),
  language: text("language").notNull(),
  verdict: text("verdict"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  executionTime: integer("execution_time"),
  memoryUsage: integer("memory_usage"),
  notes: text("notes"),
});

// Problem lists (e.g. collections, contests, practice lists)
export const problemLists = pgTable("problem_lists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  tags: json("tags").default([]),
});

// Problem list items (problems in a list)
export const problemListItems = pgTable("problem_list_items", {
  id: serial("id").primaryKey(),
  listId: integer("list_id").references(() => problemLists.id).notNull(),
  problemId: text("problem_id").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
  orderIndex: integer("order_index").default(0),
  notes: text("notes"),
});

// Zod schemas for form validation and type safety
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  profilePicture: true,
});

export const insertCodeforcesProfileSchema = createInsertSchema(codeforcesProfiles).omit({
  id: true,
  lastUpdated: true,
  profileData: true,
});

// ... other insert schemas

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCodeforcesProfile = z.infer<typeof insertCodeforcesProfileSchema>;
export type CodeforcesProfile = typeof codeforcesProfiles.$inferSelect;

// ... other types