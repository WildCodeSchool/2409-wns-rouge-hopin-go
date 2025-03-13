import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import Button from "../components/Button";

describe("App", () => {
  it("renders the App component", () => {
    render(<Button />);

    screen.debug(); // prints out the jsx in the App component unto the command line
  });
});
