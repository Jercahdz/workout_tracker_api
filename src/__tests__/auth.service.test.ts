import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "./mocks/prisma.mock";

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
    compare: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn().mockReturnValue("mocked_token"),
    verify: vi.fn(),
  },
}));

import * as authService from "../modules/auth/auth.service";

describe("auth.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user and return tokens", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: "user-id-1",
        email: "test@example.com",
        role: "USER",
      });

      const result = await authService.register({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });

    it("should throw EMAIL_TAKEN if email already exists", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: "user-id-1",
        email: "test@example.com",
      });

      await expect(
        authService.register({
          email: "test@example.com",
          password: "password123",
        })
      ).rejects.toThrow("EMAIL_TAKEN");
    });
  });

  describe("login", () => {
    it("should throw INVALID_CREDENTIALS if user does not exist", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({
          email: "noexiste@example.com",
          password: "password123",
        })
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });

    it("should throw INVALID_CREDENTIALS if password does not match", async () => {
      const bcrypt = await import("bcrypt");
      prismaMock.user.findUnique.mockResolvedValue({
        id: "user-id-1",
        email: "test@example.com",
        password: "hashed_password",
        role: "USER",
      });
      vi.mocked(bcrypt.default.compare).mockResolvedValue(false as never);

      await expect(
        authService.login({
          email: "test@example.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });

    it("should return tokens on successful login", async () => {
      const bcrypt = await import("bcrypt");
      prismaMock.user.findUnique.mockResolvedValue({
        id: "user-id-1",
        email: "test@example.com",
        password: "hashed_password",
        role: "USER",
      });
      vi.mocked(bcrypt.default.compare).mockResolvedValue(true as never);

      const result = await authService.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });
  });
});