import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "./Button";

describe("Button Component", () => {
  it("should render correctly with children text", () => {
    const buttonText = "Clique Aqui";
    render(<Button>{buttonText}</Button>);

    const buttonElement = screen.getByRole("button", { name: buttonText });
    expect(buttonElement).toBeInTheDocument();
  });

  it("should apply primary variant styles by default", () => {
    render(<Button>Primário</Button>);
    const buttonElement = screen.getByRole("button", { name: "Primário" });

    expect(buttonElement.className).toContain("bg-[var(--color-red-500)]");
    expect(buttonElement.className).toContain("text-[var(--color-white)]");
  });

  it("should apply white variant styles when specified", () => {
    render(<Button variant="white">Branco</Button>);
    const buttonElement = screen.getByRole("button", { name: "Branco" });

    expect(buttonElement.className).toContain("bg-[var(--color-white)]");
    expect(buttonElement.className).toContain("text-[var(--color-black)]");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Desabilitado</Button>);
    const buttonElement = screen.getByRole("button", { name: "Desabilitado" });

    expect(buttonElement).toBeDisabled();
    expect(buttonElement.className).toContain("disabled:opacity-50");
    expect(buttonElement.className).toContain("disabled:pointer-events-none");
  });

  it("should render an icon when iconSrc prop is provided", () => {
    const iconPath = "/google-icon.svg";
    const buttonText = "Com Ícone";
    const expectedAccessibleName = `Ícone do botão ${buttonText}`;

    render(<Button iconSrc={iconPath}>{buttonText}</Button>);

    const buttonElement = screen.getByRole("button", {
      name: expectedAccessibleName,
    });
    const imgElement = screen.getByAltText("Ícone do botão");

    expect(buttonElement).toBeInTheDocument();
    expect(imgElement).toBeInTheDocument();
    expect((imgElement as HTMLImageElement).src).toContain(iconPath);
  });

  it("should call onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clicável</Button>);
    const buttonElement = screen.getByRole("button", { name: "Clicável" });

    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick handler when clicked if disabled", () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Não Clicável
      </Button>
    );
    const buttonElement = screen.getByRole("button", { name: "Não Clicável" });

    fireEvent.click(buttonElement);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
