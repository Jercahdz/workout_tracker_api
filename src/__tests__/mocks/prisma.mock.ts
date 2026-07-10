import { vi } from "vitest";

export const prismaMock = {
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  profile: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  progress: {
    findMany: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  },
};

vi.mock("../../shared/utils/prisma", () => ({
  prisma: prismaMock,
}));