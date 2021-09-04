import { Redis } from "ioredis";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export type MyContext = {
  req: Request & {
    session: Session & Partial<SessionData>;
  };
  res: Response;
  redis: Redis;
};
