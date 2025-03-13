import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Button from "../components/Button";

describe("Signup", () => {
  it("should trigger the click when cliked", async () => {
    const modify = () => {
      // Recuperer le H1
      // Modifier le H1 avec "true"
    };

    render(
      <>
        <h1>false</h1>
        <Button
          onClick={() => (this.valu = "true")}
          variant="validation"
          type="button"
          label="S'inscrire"
        />
      </>
    );
    const button = await screen.findByText("S'inscrire");
    fireEvent.click(button);
    expect(await screen.findByText("true")).toBeInTheDocument();

    screen.debug(); // prints out the jsx in the App component unto the command line
  });
});
