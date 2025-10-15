// tests/resolvers/RidesResolver.ts
import { assert, TestArgsType } from "../index.spec";
import { mutationCreateRide } from "../api/createRide";
import { queryWhoami } from "../api/whoami";
import { sign } from "jsonwebtoken";
import { User } from "../../src/entities/User";
import { Ride } from "../../src/entities/Ride";

export function RidesResolverTest(testArgs: TestArgsType) {
  describe("RidesResolver", () => {
    // Contexte "non authentifié" : pas de cookie
    const noAuth = {
      contextValue: {
        req: { headers: {} }, // pas de cookie
        res: {}, // mock suffisant pour cookies
        user: null, // champ présent dans ContextType, même si non utilisé
      },
    };

    it("returns null on whoami when not authenticated", async () => {
      const whoamiResponse = await testArgs.server.executeOperation({ query: queryWhoami }, noAuth);

      assert(whoamiResponse.body.kind === "single", "Expected single-result response");
      const res = whoamiResponse.body.singleResult;

      // whoami ne doit pas créer d'erreur GraphQL
      expect(res.errors).toBeUndefined();
      expect(res.data).toBeDefined();
      expect(res.data!.whoami).toBeNull();
    });

    it("fails to create a ride when user is not authenticated", async () => {
      const createResponse = await testArgs.server.executeOperation(
        {
          query: mutationCreateRide,
          variables: {
            data: {
              departure_city: "Paris",
              arrival_city: "Lyon",
              departure_address: "10 rue de Paris",
              arrival_address: "20 avenue de Lyon",
              driver: { id: 1 }, // ignoré côté auth, on attend un refus avant
              departure_at: new Date("2024-07-01T10:00:00Z"),
              departure_lng: 2.3522,
              departure_lat: 48.8566,
              arrival_lng: 4.8357,
              arrival_lat: 45.764,
              max_passenger: 3,
            },
          },
        },
        noAuth
      );

      assert(createResponse.body.kind === "single", "Expected single-result response");
      const { errors, data } = createResponse.body.singleResult;

      // Non authentifié => la mutation échoue
      expect(data).toBeNull();
      expect(errors).toBeDefined();
    });

    it("rejects obviously invalid payload (validation/DB checks), still unauthenticated", async () => {
      const invalidResponse = await testArgs.server.executeOperation(
        {
          query: mutationCreateRide,
          variables: {
            data: {
              departure_city: "P",
              arrival_city: "L",
              departure_address: "",
              arrival_address: "",
              driver: { id: 999 },
              departure_at: new Date("2024-07-01T10:00:00Z"),
              departure_lng: 2.3522,
              departure_lat: 48.8566,
              arrival_lng: 4.8357,
              arrival_lat: 45.764,
              max_passenger: 0, // invalide (Min(1) côté input)
            },
          },
        },
        noAuth
      );

      assert(invalidResponse.body.kind === "single", "Expected single-result response");
      const { errors, data } = invalidResponse.body.singleResult;

      // Selon l’ordre (auth d’abord ou validation d’abord), on aura de toute façon un échec
      expect(data).toBeNull();
      expect(errors).toBeDefined();
    });
    it("succeed to create a ride when user is authenticated", async () => {
      const driver = await User.save({
        email: "driver@example.com",
        firstName: "Jean",
        lastName: "TEST",
        hashedPassword: "dummy",
      });
      const token = sign({ id: driver.id }, process.env.JWT_SECRET_KEY!);
      const createResponse = await testArgs.server.executeOperation<{
        createRide: Ride;
      }>(
        {
          query: mutationCreateRide,
          variables: {
            data: {
              departure_city: "Paris",
              arrival_city: "Lyon",
              departure_address: "10 rue de Paris",
              arrival_address: "20 avenue de Lyon",
              driver: { id: driver.id },
              departure_at: new Date("2024-07-01T10:00:00Z"),
              departure_lng: 2.3522,
              departure_lat: 48.8566,
              arrival_lng: 4.8357,
              arrival_lat: 45.764,
              max_passenger: 3,
            },
          },
        },
        {
          contextValue: {
            req: { headers: { cookie: `token=${token};` } },
            res: {},
            user: { id: driver.id, email: driver.email, role: "user" },
          },
        }
      );
      // check API response
      assert(createResponse.body.kind === "single", "Expected single-result response");
      const { errors, data } = createResponse.body.singleResult;
      expect(data).not.toBeNull();
      expect(errors).toBeUndefined();
      expect(data?.createRide).toBeDefined();
      expect(data?.createRide.id).toBeDefined();
      expect(data?.createRide.id).toBe("1");

      // check ride in database
      const ride = await Ride.findOne({
        where: { id: Number(data?.createRide.id) },
        relations: ["driver"],
      });
      expect(ride!.driver.id).toBe(driver.id);
      expect(ride!.max_passenger).toBe(3);
    });
  });
}
