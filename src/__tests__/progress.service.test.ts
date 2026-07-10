import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "./mocks/prisma.mock";
import * as progressService from "../modules/progress/progress.service";

describe("progress.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllProgress", () => {
    it("should return paginated progress logs for a user", async () => {
      const mockLogs = [
        { id: "log-1", userId: "user-id-1", weight: 75, notes: null, date: new Date() },
        { id: "log-2", userId: "user-id-1", weight: 74.5, notes: null, date: new Date() },
      ];
      prismaMock.progress.findMany.mockResolvedValue(mockLogs);
      prismaMock.progress.count.mockResolvedValue(2);

      const result = await progressService.getAllProgress("user-id-1", { page: 1, limit: 20 });
      expect(result.data).toHaveLength(2);
      expect(result.data[0].weight).toBe(75);
      expect(result.meta.total).toBe(2);
    });
  });

  describe("logProgress", () => {
    it("should create a progress log", async () => {
      const mockLog = {
        id: "log-1",
        userId: "user-id-1",
        weight: 75,
        notes: "Feeling good",
        date: new Date(),
      };
      prismaMock.progress.create.mockResolvedValue(mockLog);

      const result = await progressService.logProgress("user-id-1", {
        weight: 75,
        notes: "Feeling good",
      });

      expect(result).toHaveProperty("id");
      expect(result.weight).toBe(75);
    });
  });
});