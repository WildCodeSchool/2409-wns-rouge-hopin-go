import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Signup from "../components/Signup";
import { MockedProvider } from "@apollo/client/testing";
import { mutationCreateUser } from "../api/CreateUser";

describe("Signup", () => {
  it("should render the Signup component", async () => {
    const mocks: any[] = [];
    render(
      <MockedProvider mocks={mocks}>
        <Signup />
      </MockedProvider>
    );
    expect(await screen.findByText("S'inscrire")).toBeInTheDocument();

    screen.debug(); // prints out the jsx in the App component unto the command line
  });
  it("should validate credentials and display a success toast", async () => {
    const mocks = [
      {
        request: {
          query: mutationCreateUser,
          variables: {
            data: {
              firstName: "François-Xavier",
              lastName: "Dupont",
              email: "test@gmail.com",
              password: "Password123!",
            },
          },
        },
        result: {
          data: {
            createUser: {
              id: "1",
              firstName: "François-Xavier",
              lastName: "Dupont",
              email: "test@gmail.com",
              __typename: "User",
            },
          },
        },
      },
      {
        request: {
          query: mutationCreateUser,
          variables: {
            data: {
              firstName: "John",
              lastName: "Doe",
              email: "test@gmail.com",
              password: "Password123!",
            },
          },
        },
        result: {
          data: null,
          errors: [],
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <Signup />
      </MockedProvider>
    );

    //ICI
    // Get input fields and button
    const emailInput = screen.getByLabelText("Email");

    const passwordInput = screen.getByLabelText("Mot de passe");
    const lastnameInput = screen.getByLabelText("Nom");
    const firstnameInput = screen.getByLabelText("Prénom");
    const confirmPasswordInput = screen.getByLabelText("Confirmer mot de passe");

    // Simulate user typing in inputs
    fireEvent.change(firstnameInput, { target: { value: "François-Xavier" } });
    fireEvent.change(lastnameInput, { target: { value: "Dupont" } });
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password123!" },
    });

    // Expect inputs to have the typed values
    expect(emailInput).toHaveValue("test@gmail.com");
    expect(passwordInput).toHaveValue("Password123!");

    const button = await screen.findByText("S'inscrire");

    fireEvent.click(button);
    waitFor(() => expect(screen.getByText("Inscription réussie !")).toBeInTheDocument());
  });
});
