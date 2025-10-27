import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SearchBar } from "./SearchBar"; // Importa o componente

describe("SearchBar Component", () => {
  const placeholderText = "Buscar por filmes";

  it("should render the input field with the correct placeholder", () => {
    render(
      <SearchBar placeholder={placeholderText} value="" onChange={() => {}} />
    );
    const inputElement = screen.getByPlaceholderText(placeholderText);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue("");
  });

  it("should call onChange prop with the typed value", () => {
    const handleChange = jest.fn();
    render(
      <SearchBar
        placeholder={placeholderText}
        value=""
        onChange={handleChange}
      />
    );
    const inputElement = screen.getByPlaceholderText(placeholderText);
    const typedValue = "Matrix";

    fireEvent.change(inputElement, { target: { value: typedValue } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(typedValue);
  });

  it("should render the search icon", () => {
    render(
      <SearchBar placeholder={placeholderText} value="" onChange={() => {}} />
    );

    try {
      const svgElement = screen.getByRole("img", { hidden: true });
      expect(svgElement).toBeInTheDocument();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      const genericSvg = document.querySelector("svg");
      if (!genericSvg) {
        console.warn(
          "Não foi possível encontrar o SVG do ícone de busca. Considere adicionar um 'data-testid'."
        );
      }
      expect(genericSvg).toBeInTheDocument();
    }
  });
});
