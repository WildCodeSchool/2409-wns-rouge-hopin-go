import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Button from "../components/Button";

describe("Button component", () => {
  it("should switch h1 from false to true when button is clicked", async () => {
    const modify = () => {
      const title = screen.getByTestId("title");
      title.textContent = "true";
    };
    render(
      <>
        <h1 data-testid="title">false</h1>
        <Button onClick={() => modify()} variant="validation" type="button" label="S'inscrire" />
      </>
    );
    const button = await screen.findByText("S'inscrire");
    fireEvent.click(button);
    expect(await screen.findByText("true")).toBeInTheDocument();

    screen.debug(); // prints out the jsx in the App component unto the command line
  });

  it("should be disabled if isDisabled is true", async () => {
    render(
      <Button
        data-testid="button"
        variant="validation"
        type="button"
        label="S'inscrire"
        isDisabled
      />
    );
    const button = await screen.findByText("S'inscrire");
    const element = screen.getByRole("button");
    fireEvent.click(button);
    expect(element).toBeDisabled();
  });
});
