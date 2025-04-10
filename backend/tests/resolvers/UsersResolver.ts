import { User } from "../../src/entities/User";
import { mutationCreateUser } from "../api/createUser";
import { mutationSignin } from "../api/signin";
import { queryWhoami } from "../api/whoami";
import { assert, TestArgsType } from "../index.spec";

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
      console.log(response);
      assert(response.body.kind === "single");
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data).toBeDefined();
    });
  });
}
