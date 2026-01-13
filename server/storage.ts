import { db } from "./db";
import { subscribers, type Subscriber, type InsertSubscriber } from "@shared/schema";

export interface IStorage {
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
}


export class DatabaseStorage implements IStorage {
  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    if (!db) throw new Error("Database not initialized");
    const [subscriber] = await db
      .insert(subscribers)
      .values({ ...insertSubscriber, createdAt: new Date().toISOString() })
      .returning();
    return subscriber;
  }
}

export class MemStorage implements IStorage {
  private subscribers: Map<number, Subscriber> = new Map();
  private currentId = 1;

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.currentId++;
    const subscriber: Subscriber = {
      ...insertSubscriber,
      id,
      createdAt: new Date().toISOString()
    };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
