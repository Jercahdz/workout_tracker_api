import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "./mocks/prisma.mock";
import * as progressService from "../modules/progress/progress.service";

describe("progress.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllProgress", () => {
    it("should return all progress logs for a user", async () => {
      const mockLogs = [
        { id: "log-1", userId: "user-id-1", weight: 75, date: new Date() },
        { id: "log-2", userId: "user-id-1", weight: 74.5, date: new Date() },
      ];
      prismaMock.progress.findMany.mockResolvedValue(mockLogs);

      const result = await progressService.getAllProgress("user-id-1");
      expect(result).toHaveLength(2);
      expect(result[0].weight).toBe(75);
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