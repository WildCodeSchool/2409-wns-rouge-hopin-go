import { validate } from "class-validator";
import { User, UserCreateInput } from "../../src/entities/User";
import { mutationCreateUser } from "../api/createUser";
import { assert, TestArgsType } from "../index.spec";
import { mutationSignin } from "../api/signin";
import { queryWhoami } from "../api/whoami";

export function UsersResolverTest(testArgs: TestArgsType) {
  const cases = [
    ["less than 8 char", "Ab1!", "Password must be at least 8 characters long"],
    ["no uper case", "abcd1234!", "Password must contain at least one uppercase letter"],
    ["no lower case", "ABCD1234!", "Password must contain at least one lowercase letter"],
    ["no digit", "Abcdefgh!", "Password must contain at least one number"],
    [
      "no special char",
      "Abcd12345",
      "Password must contain at least one special character (@$!%*?&)",
    ],
  ];

  describe("UserResolver sign up", () => {
    it("fails to create a user if email is invalid", async () => {
      const response = await testArgs.server.executeOperation<{
        createUser: User;
      }>({
        query: mutationCreateUser,
        variables: {
          data: {
            email: "test@testfr",
            firstName: "Jean",
            lastName: "Test",
            password: "Test1234!",
          },
        },
      });
      assert(response.body.kind === "single");
      const { errors } = response.body.singleResult;

      assert(errors !== undefined);
      const validationErrors: Array<unknown> = errors[0].extensions
        ?.validationErrors as unknown as unknown[];
      expect(response.body.singleResult.data).toBeNull();
      expect(validationErrors[0]).toMatchObject({ property: "email" });
    });
    it("fails to create a user if password is less than 8 characters", async () => {
      const response = await testArgs.server.executeOperation<{
        createUser: User;
      }>({
        query: mutationCreateUser,
        variables: {
          data: {
            email: "test@test.fr",
            firstName: "Jean",
            lastName: "Test",
            password: "Tes34!",
          },
        },
      });
      assert(response.body.kind === "single");
      const { errors } = response.body.singleResult;

      assert(errors !== undefined);
      const validationErrors: Array<unknown> = errors[0].extensions
        ?.validationErrors as unknown as unknown[];
      expect(validationErrors[0]).toMatchObject({ property: "password" });
      expect(response.body.singleResult.data).toBeNull();
    });
    it("should creates a user and stores it in the DB", async () => {
      const response = await testArgs.server.executeOperation<{
        createUser: User;
      }>({
        query: mutationCreateUser,
        variables: {
          data: {
            email: "test@test.fr",
            firstName: "Jean",
            lastName: "Test",
            password: "Test1234!",
          },
        },
      });
      // check API response
      assert(response.body.kind === "single");
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data).toBeDefined();

      // check user in database
      const userFromDb = await User.findOneBy({
        id: response.body.singleResult.data?.createUser?.id,
      });
      expect(userFromDb).toBeDefined();
      expect(userFromDb?.email).toBe("test@test.fr");
      expect(userFromDb?.hashedPassword).not.toBe("Test1234!");
      testArgs.data.userId = response.body.singleResult.data?.createUser?.id;
      testArgs.data.userEmail = userFromDb?.email;
      testArgs.data.user = userFromDb;
    });

    it.each(cases)(
      "fails to create a user if password has %s",
      async (_, password, expectedMessage) => {
        const input = new UserCreateInput();
        input.email = "test@example.com"; // remplir les autres champs obligatoires
        input.firstName = "John";
        input.lastName = "Doe";
        input.password = password;

        const errors = await validate(input);

        // Trouver l'erreur sur le champ password
        const pwdError = errors.find((e) => e.property === "password");
        expect(pwdError).toBeDefined();

        // Vérifier que le message attendu est présent
        const messages = Object.values(pwdError!.constraints || {});
        expect(messages.join(" ")).toContain(expectedMessage);
      }
    );
  });

  describe("UserResolver sign in", () => {
    it("fails to sign in if email does not exist", async () => {
      const response = await testArgs.server.executeOperation<{
        signin: User;
      }>({
        query: mutationSignin,
        variables: {
          email: "nonexist@user.fr",
          password: "Test1234!",
        },
      });
      assert(response.body.kind === "single");
      const { errors, data } = response.body.singleResult;
      expect(errors).toBeUndefined();
      expect(data?.signin).toBeNull();
    });
    it("should sign in a user with valid credentials", async () => {
      const response = await testArgs.server.executeOperation<{
        signin: User;
      }>(
        {
          query: mutationSignin,
          variables: {
            email: "test@test.fr",
            password: "Test1234!",
          },
        },
        // Contexte simulant une requête HTTP avec des en-têtes de réponse
        {
          contextValue: {
            req: {},
            res: {
              // Simule les méthodes getHeader et setHeader utilisées pour gérer les cookies
              getHeader: () => "",
              setHeader: () => {},
            },
            user: null,
          },
        }
      );
      assert(response.body.kind === "single");
      const { errors, data } = response.body.singleResult;
      expect(errors).toBeUndefined();
      expect(data?.signin).not.toBeNull();
      expect(data?.signin.id).toBeDefined();
    });
    it("fails to find a user if email is invalid", async () => {
      const response = await testArgs.server.executeOperation<{
        signin: User;
      }>({
        query: mutationSignin,
        variables: {
          email: "nonexist@user.fr",
          password: "Test1234!",
        },
      });
      assert(response.body.kind === "single");
      const { errors, data } = response.body.singleResult;
      expect(errors).toBeUndefined();
      expect(data?.signin).toBeNull();
    });
    it("fails to signin if passord is invalid", async () => {
      const response = await testArgs.server.executeOperation<{
        signin: User;
      }>({
        query: mutationSignin,
        variables: {
          email: "nonexist@user.fr",
          password: "examplePassword78!",
        },
      });
      assert(response.body.kind === "single");
      const { errors, data } = response.body.singleResult;
      expect(errors).toBeUndefined();
      expect(data?.signin).toBeNull();
    });
    it("should sign in a user with valid credentials", async () => {
      const response = await testArgs.server.executeOperation<{
        signin: User;
      }>(
        {
          query: mutationSignin,
          variables: {
            email: "test@test.fr",
            password: "Test1234!",
          },
        },
        // Contexte simulant une requête HTTP avec des en-têtes de réponse
        {
          contextValue: {
            req: {},
            res: {
              // Simule les méthodes getHeader et setHeader utilisées pour gérer les cookies
              getHeader: () => "",
              setHeader: () => {},
            },
          },
        }
      );
      assert(response.body.kind === "single");
      const { errors, data } = response.body.singleResult;
      expect(errors).toBeUndefined();
      expect(data?.signin).not.toBeNull();
      expect(data?.signin.id).toBeDefined();
    });
  });

  describe("UserResolver whoamI", () => {
    it("should return a user if user connected", async () => {
      const response = await testArgs.server.executeOperation<{
        whoami: User;
      }>(
        {
          query: queryWhoami,
        },
        // Contexte simulant une requête HTTP avec des en-têtes de réponse
        {
          contextValue: {
            user: { id: "1", email: "test@test.fr", role: "user" },
            req: { headers: { cookie: "token=fake.jwt.token" } },
            res: {},
          },
        }
      );
      assert(response.body.kind === "single");
      const { errors, data } = response.body.singleResult;
      expect(errors).toBeUndefined();
      expect(data?.whoami).not.toBeNull();
      expect(data?.whoami.id).toBe(testArgs.data.userId);
      expect(data?.whoami.email).toBe(testArgs.data.userEmail);
      expect(data?.whoami.role).toBeDefined();
    });
    it("should returns null on whoami when not authenticated", async () => {
      const whoamiResponse = await testArgs.server.executeOperation(
        { query: queryWhoami },
        {
          contextValue: {
            user: null, // champ présent dans ContextType, même si non utilisé
            req: { headers: { cookie: "" } },
            res: {},
          },
        }
      );

      assert(whoamiResponse.body.kind === "single", "Expected single-result response");
      const res = whoamiResponse.body.singleResult;

      // whoami ne doit pas créer d'erreur GraphQL
      expect(res.errors).toBeUndefined();
      expect(res.data).toBeDefined();
      expect(res.data!.whoami).toBeNull();
    });
  });
}
