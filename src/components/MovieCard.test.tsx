import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MovieCard } from "./MovieCard"; // Ajuste o nome se necessário
import { Movie } from "@/src/types/tmdb"; // Ajuste o caminho/nome se necessário

// Mocks
const mockToggleFavorite = jest.fn();
let mockIsFavoriteReturnValue = false;
jest.mock("../hooks/useFavorites", () => ({
  useFavorites: () => ({
    isFavorite: jest.fn().mockImplementation(() => mockIsFavoriteReturnValue),
    toggleFavorite: mockToggleFavorite,
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
  })),
  usePathname: jest.fn(() => "/"),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    const { layout, objectFit, ...rest } = props;
    return <img {...rest} style={{ objectFit }} />;
  },
}));

// Mock de Dados
const mockMovieData: Movie = {
  id: 123,
  title: "Filme de Teste",
  release_date: "2025-10-27",
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  overview: "Uma sinopse de teste.",
  vote_average: 7.5,
};

const mockMovieDataNoImage: Movie = {
  ...mockMovieData,
  id: 456,
  title: "Filme Sem Imagem",
  poster_path: null,
  backdrop_path: null,
};

beforeEach(() => {
  mockToggleFavorite.mockClear();
  mockIsFavoriteReturnValue = false;
});

// Testes
describe("MovieCard Component", () => {
  it("should render movie title and year", () => {
    render(<MovieCard movie={mockMovieData} />);
    expect(screen.getByText(mockMovieData.title)).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
  });

  it("should render the backdrop image by default", () => {
    render(<MovieCard movie={mockMovieData} />);
    const imgElement = screen.getByAltText(
      mockMovieData.title
    ) as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.src).toContain(mockMovieData.backdrop_path);
    expect(imgElement.src).not.toContain(mockMovieData.poster_path);
  });

  it("should render the poster image if backdrop_path is null", () => {
    const movieWithoutBackdrop = { ...mockMovieData, backdrop_path: null };
    render(<MovieCard movie={movieWithoutBackdrop} />);
    const imgElement = screen.getByAltText(
      movieWithoutBackdrop.title
    ) as HTMLImageElement;
    expect(imgElement.src).toContain(movieWithoutBackdrop.poster_path);
  });

  it("should render the not-found image if image fails to load", async () => {
    render(<MovieCard movie={mockMovieData} />);
    const imgElement = screen.getByAltText(
      mockMovieData.title
    ) as HTMLImageElement;
    fireEvent.error(imgElement);
    await waitFor(() => {
      expect(imgElement.src).toContain("/not-found.svg");
    });
  });

  it("should render the not-found image if no image path exists initially", () => {
    render(<MovieCard movie={mockMovieDataNoImage} />);
    const imgElement = screen.getByAltText(
      mockMovieDataNoImage.title
    ) as HTMLImageElement;
    expect(imgElement.src).toContain("/not-found.svg");
  });

  it("should show the bookmark button by default", () => {
    render(<MovieCard movie={mockMovieData} />);
    const bookmarkButton = screen.getByTitle("Adicionar aos favoritos");
    expect(bookmarkButton).toBeInTheDocument();
  });

  it("should hide the bookmark button when showBookmark is false", () => {
    render(<MovieCard movie={mockMovieData} showBookmark={false} />);
    const bookmarkButton = screen.queryByTitle(/favoritos/i);
    expect(bookmarkButton).not.toBeInTheDocument();
  });

  it("should link to the correct movie detail page", () => {
    render(<MovieCard movie={mockMovieData} />);
    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", `/movie/${mockMovieData.id}`);
  });
});
