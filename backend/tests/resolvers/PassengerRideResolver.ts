import { assert, TestArgsType } from "../index.spec";
import { mutationCreatePassengerRide } from "../api/createPassengerRide";
import { queryWhoami } from "../api/whoami";
import { datasource } from "../../src/datasource";
import { User } from "../../src/entities/User";
import { Ride } from "../../src/entities/Ride";
import { sign } from "jsonwebtoken";

export function PassengerRidesResolverTest(testArgs: TestArgsType) {
  describe("creating a passenger_ride", () => {
    let driver: User;
    let ride: Ride;
    let passenger: User;

    beforeAll(async () => {
      driver = await User.save({
        email: "a@b.com",
        firstName: "Jean",
        lastName: "TEST",
        hashedPassword: "",
      });

      ride = await Ride.save({
        departure_city: "CityA",
        arrival_city: "CityB",
        departure_address: "AddressA",
        arrival_address: "AddressB",
        departure_location: { type: "Point", coordinates: [2.3522, 48.8566] },
        arrival_location: { type: "Point", coordinates: [4.8357, 45.764] },
        departure_at: new Date(),
        arrival_at: new Date(),
        max_passenger: 3,
        driver,
      });

      passenger = await User.save({
        email: "passenger@test.fr",
        firstName: "John",
        lastName: "Doe",
        hashedPassword: "hashedpassword",
      });
    });

    it("fails if user is not logged in", async () => {
      const noAuth = {
        contextValue: {
          req: { headers: {} }, // pas de cookie
          res: {}, // mock suffisant pour cookies
          user: null, // champ présent dans ContextType, même si non utilisé
        },
      };

      const createResponse = await testArgs.server.executeOperation(
        {
          query: mutationCreatePassengerRide,
          variables: {
            data: {
              user_id: driver.id,
              ride_id: ride.id,
            },
          },
        },
        noAuth
      );

      assert(createResponse.body.kind === "single", "Expected single-result response");
      const { errors, data } = createResponse.body.singleResult;

      // Non authentifié => la mutation échoue
      expect(data).toBeNull();
      expect(errors?.[0].extensions?.code).toBe("UNAUTHORIZED"); // erreur type-GraphQL pour @Authorized
    });
    it("succeeds if user is logged in", async () => {
      const token = sign({ id: passenger.id }, process.env.JWT_SECRET_KEY!);
      const createResponse = await testArgs.server.executeOperation(
        {
          query: mutationCreatePassengerRide,
          variables: {
            data: {
              user_id: passenger.id,
              ride_id: ride.id,
            },
          },
        },
        {
          contextValue: {
            req: { headers: { cookie: `token=${token};` } },
            res: {},
            user: { id: passenger.id, email: passenger.email, role: "user" },
          },
        }
      );

      assert(createResponse.body.kind === "single", "Expected single-result response");
      const { errors, data } = createResponse.body.singleResult;

      // Authentifié => la mutation réussit
      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
    });
    it("fails if user tries to book his own ride", async () => {
      const token = sign({ id: passenger.id }, process.env.JWT_SECRET_KEY!);
      const createResponse = await testArgs.server.executeOperation(
        {
          query: mutationCreatePassengerRide,
          variables: {
            data: {
              user_id: driver.id,
              ride_id: ride.id,
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

      assert(createResponse.body.kind === "single", "Expected single-result response");
      const { errors, data } = createResponse.body.singleResult;

      // Authentifié => la mutation réussit
      expect(data).toBeDefined();
      expect(errors?.[0].message).toBe("Vous ne pouvez pas réserver votre propre trajet");
    });
  });
}
