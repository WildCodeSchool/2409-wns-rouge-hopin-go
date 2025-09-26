// tests/resolvers/RidesResolver.ts
import { assert, TestArgsType } from "../index.spec";
import { mutationCreateRide } from "../api/createRide";
import { queryWhoami } from "../api/whoami";

export function RidesResolverTest(testArgs: TestArgsType) {
  describe("RidesResolver", () => {
    // Contexte "non authentifié" : pas de cookie
    const noAuth = {
      contextValue: {
        req: { headers: {} }, // pas de cookie
        res: {},              // mock suffisant pour cookies
        user: null,           // champ présent dans ContextType, même si non utilisé
      },
    };

    it("returns null on whoami when not authenticated", async () => {
      const whoamiResponse = await testArgs.server.executeOperation(
        { query: queryWhoami },
        noAuth
      );

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
              arrival_lat: 45.7640,
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
              max_passenger: 0,            // invalide (Min(1) côté input)
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
  });
}
