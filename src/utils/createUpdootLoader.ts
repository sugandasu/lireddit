import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";

export const createUpdootLoader = () => {
  return new DataLoader<{ postId: number; userId: number }, Updoot | null>(
    async (keys) => {
      const updoots = await Updoot.findByIds(keys as any);
      const updootIdToUpdoot: Record<string, Updoot> = {};
      updoots.forEach((updoot) => {
        updootIdToUpdoot[`${updoot.postId}|${updoot.userId}`] = updoot;
      });
      return keys.map((key) => updootIdToUpdoot[`${key.postId}|${key.userId}`]);
    }
  );
};
