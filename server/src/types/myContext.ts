import { Redis } from "ioredis";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { createUserLoader } from "../utils/createUserLoader";
import { createUpdootLoader } from "../utils/createUpdootLoader";

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
  userLoader: ReturnType<typeof createUserLoader>;
  updootLoader: ReturnType<typeof createUpdootLoader>;
};
