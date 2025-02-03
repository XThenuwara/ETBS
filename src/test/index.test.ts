import request from "supertest";
import index from "../index";
import http from "http";
import Redis from "ioredis";
import { closeRedis } from "@/config/redis.config";

jest.mock("ioredis", () => {
  const MockRedis = jest.fn(() => {
    return {
      ping: jest.fn(() => Promise.resolve("PONG")),
      set: jest.fn(() => Promise.resolve("OK")),
      get: jest.fn(() => Promise.resolve("someValue")),
      quit: jest.fn(() => Promise.resolve()),
      on: jest.fn(),
      connect: jest.fn(() => Promise.resolve()),
      disconnect: jest.fn(() => Promise.resolve()),
    };
  });
  return MockRedis;
});


describe("Health Check Endpoint", () => {
    let serverInstance: http.Server;
    let mockRedisClient: jest.Mocked<Redis>

    beforeAll(async () => {
        serverInstance = (await index).server;
        mockRedisClient = new Redis() as jest.Mocked<Redis>;
    });

    afterAll(async () => {
        await closeRedis();
        await serverInstance.close();
        await mockRedisClient.quit();
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    it("should return status OK", async () => {
        const response = await request(serverInstance).get("/health");
        expect(response.status).toBe(200);
        expect(response.body.health).toBe("OK");
    });
});
