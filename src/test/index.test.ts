import request from "supertest";
import index from "../index";
import http from "http";

describe("Health Check Endpoint", () => {
    let serverInstance: http.Server;

    beforeAll(async() => {
        serverInstance = (await index).server;
    });

    afterAll(async () => {
        await serverInstance.close();
    });

    it("should return status OK", async () => {
        const response = await request(serverInstance).get("/health");
        expect(response.status).toBe(200);
        expect(response.body.health).toBe("OK");
    });
});
