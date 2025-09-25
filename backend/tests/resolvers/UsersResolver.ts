import { User } from "../../src/entities/User";
import { mutationCreateUser } from "../api/createUser";
import { mutationSignin } from "../api/signin";
import { queryWhoami } from "../api/whoami";
import { assert, TestArgsType } from "../index.spec";
import * as jwt from "jsonwebtoken";

export function UsersResolverTest(testArgs: TestArgsType) {
  describe("UserResolver", () => {
    it("creates a user and stores it in the DB", async () => {
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
      assert(response.body.kind === "single");
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data).toBeDefined();
    });
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
    console.log(errors, data);
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
    console.log(errors, data);
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
            user: { id: "1", email: "test@test.fr", role: "USER" },
            req: { headers: { cookie: "token=fake.jwt.token" } },
            res: {},
          },
        }
      );
      assert(response.body.kind === "single");
      const { errors, data } = response.body.singleResult;
      console.log(errors, data);
      expect(errors).toBeUndefined();
      expect(data?.whoami).not.toBeNull();
      expect(data?.whoami.id).toBeDefined();
      expect(data?.whoami.email).toBeDefined();
      expect(data?.whoami.role).toBeDefined();
    });
  });
}
