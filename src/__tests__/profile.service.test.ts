import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "./mocks/prisma.mock";
import * as profileService from "../modules/profile/profile.service";

describe("profile.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should return profile if it exists", async () => {
      const mockProfile = {
        id: "profile-id-1",
        userId: "user-id-1",
        age: 25,
        weight: 75,
        height: 175,
        goal: "GAIN_MUSCLE",
        level: "BEGINNER",
        unitSystem: "METRIC",
      };
      prismaMock.profile.findUnique.mockResolvedValue(mockProfile);

      const result = await profileService.getProfile("user-id-1");
      expect(result).toEqual(mockProfile);
    });

    it("should throw PROFILE_NOT_FOUND if profile does not exist", async () => {
      prismaMock.profile.findUnique.mockResolvedValue(null);

      await expect(
        profileService.getProfile("user-id-1")
      ).rejects.toThrow("PROFILE_NOT_FOUND");
    });
  });

  describe("createProfile", () => {
    it("should create a profile successfully", async () => {
      prismaMock.profile.findUnique.mockResolvedValue(null);
      prismaMock.profile.create.mockResolvedValue({
        id: "profile-id-1",
        userId: "user-id-1",
        age: 25,
        weight: 75,
        height: 175,
        goal: "GAIN_MUSCLE",
        level: "BEGINNER",
        unitSystem: "METRIC",
      });

      const result = await profileService.createProfile("user-id-1", {
        age: 25,
        weight: 75,
        height: 175,
        goal: "GAIN_MUSCLE" as any,
        level: "BEGINNER" as any,
      });

      expect(result).toHaveProperty("id");
      expect(result.userId).toBe("user-id-1");
    });

    it("should throw PROFILE_ALREADY_EXISTS if profile exists", async () => {
      prismaMock.profile.findUnique.mockResolvedValue({
        id: "profile-id-1",
        userId: "user-id-1",
      });

      await expect(
        profileService.createProfile("user-id-1", {
          age: 25,
          weight: 75,
          height: 175,
          goal: "GAIN_MUSCLE" as any,
          level: "BEGINNER" as any,
        })
      ).rejects.toThrow("PROFILE_ALREADY_EXISTS");
    });
  });
});