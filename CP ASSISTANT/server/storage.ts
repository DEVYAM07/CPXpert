import { eq, and, inArray, between, gte, lte, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import {
  users, codeforcesProfiles, studyRoutines, problemRecommendations, learningResources,
  debugSessions, explainSessions, cpProblems, userSolutions, problemLists, problemListItems,
  InsertUser, User, InsertCodeforcesProfile, CodeforcesProfile, InsertStudyRoutine, StudyRoutine,
  InsertProblemRecommendation, ProblemRecommendation, InsertLearningResource, LearningResource,
  InsertDebugSession, DebugSession, InsertExplainSession, ExplainSession, InsertCpProblem, CpProblem,
  InsertUserSolution, UserSolution, InsertProblemList, ProblemList, InsertProblemListItem, ProblemListItem
} from "@shared/schema";

// Storage interface that defines all the data operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Codeforces profile methods
  getCodeforcesProfile(id: number): Promise<CodeforcesProfile | undefined>;
  getCodeforcesProfileByUserId(userId: number): Promise<CodeforcesProfile | undefined>;
  getCodeforcesProfileByHandle(handle: string): Promise<CodeforcesProfile | undefined>;
  createCodeforcesProfile(profile: InsertCodeforcesProfile): Promise<CodeforcesProfile>;
  updateCodeforcesProfile(id: number, profileData: Partial<InsertCodeforcesProfile>): Promise<CodeforcesProfile | undefined>;
  
  // ... other methods for study routines, problem recommendations, etc.
}

// In-memory storage implementation for development/testing
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private codeforcesProfiles: Map<number, CodeforcesProfile>;
  // ... other maps for different entities
  
  private currentUserId: number;
  // ... other ID counters
  
  constructor() {
    this.users = new Map();
    this.codeforcesProfiles = new Map();
    // ... initialize other maps
    
    this.currentUserId = 1;
    // ... initialize other ID counters
    
    // Initialize sample data
    this.initializeSampleLearningResources();
  }
  
  // Initialize sample learning resources
  private initializeSampleLearningResources() {
    const resources: InsertLearningResource[] = [
      {
        title: "Competitive Programming Algorithms",
        description: "A comprehensive course covering advanced algorithms for competitive programming",
        url: "https://example.com/cp-algorithms",
        resourceType: "course",
        tags: ["algorithms", "data structures", "competitive programming"],
        difficulty: "intermediate",
        source: "CP Academy"
      },
      // ... more resources
    ];
    
    resources.forEach(resource => {
      this.createLearningResource(resource).catch(console.error);
    });
  }
  
  // User methods implementation
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    
    const user: User = { 
      id, 
      ...insertUser,
      createdAt: new Date().toISOString()
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, ...userData };
    this.users.set(id, updatedUser);
    
    return updatedUser;
  }
  
  // ... implementations for other methods
}

// Database storage implementation for production
export class DbStorage implements IStorage {
  private db: any;
  
  constructor() {
    // Initialize Neon database connection
    const sql = neon(process.env.DATABASE_URL || '');
    this.db = drizzle(sql);
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const result = await this.db.update(users).set(userData).where(eq(users.id, id)).returning();
    return result[0];
  }
  
  // ... implementations for other methods
}

// Create and export storage instance based on environment
export const storage = process.env.NODE_ENV === 'production' && process.env.DATABASE_URL
  ? new DbStorage()
  : new MemStorage();