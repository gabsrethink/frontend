import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Navbar } from "./Navbar";

const mockLogOut = jest.fn();
let mockUser: { photoURL?: string | null } | null = {
  photoURL: "https://example.com/avatar.jpg",
};
jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    logOut: mockLogOut,
  }),
}));

const mockRouterPush = jest.fn();
let mockPathname = "/";
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: mockRouterPush,
    back: jest.fn(),
  })),
  usePathname: jest.fn(() => mockPathname),
}));

// Mock
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    const { layout, objectFit, ...rest } = props;
    delete rest.layout;
    delete rest.objectFit;
    return <img {...rest} />;
  },
}));

beforeEach(() => {
  mockLogOut.mockClear();
  mockRouterPush.mockClear();
  mockUser = { photoURL: "https://example.com/avatar.jpg" };
  mockPathname = "/";
});

// Tests
describe("Navbar Component (User Updated)", () => {
  it("should render fallback avatar if user has no photoURL", () => {
    mockUser = { photoURL: null };
    render(<Navbar />);
    const avatarImages = screen.getAllByAltText(
      "Avatar do usuário"
    ) as HTMLImageElement[];
    expect(avatarImages.some((img) => img.src.includes("/avatar.svg"))).toBe(
      true
    );
  });

  it('should apply active styles to the Home link when on "/"', () => {
    mockPathname = "/";
    render(<Navbar />);
    const homeLinkWrappers = screen
      .getAllByTitle("Início / Tendências")
      .map((link) => link.querySelector("div"));

    expect(
      homeLinkWrappers.some((wrapper) =>
        wrapper?.classList.contains("opacity-100")
      )
    ).toBe(true);

    const favoritesLinkWrappers = screen
      .getAllByTitle("Favoritos")
      .map((link) => link.querySelector("div"));
    favoritesLinkWrappers.forEach((wrapper) => {
      expect(wrapper).not.toHaveClass("opacity-100");
      expect(wrapper).toHaveClass("opacity-30"); // Classe inativa do seu código
    });
  });

  it('should apply active styles to the Favorites link when on "/favorites"', () => {
    mockPathname = "/favorites";
    render(<Navbar />);
    const favoritesLinkWrappers = screen
      .getAllByTitle("Favoritos")
      .map((link) => link.querySelector("div"));
    expect(
      favoritesLinkWrappers.some((wrapper) =>
        wrapper?.classList.contains("opacity-100")
      )
    ).toBe(true);

    const homeLinkWrappers = screen
      .getAllByTitle("Início / Tendências")
      .map((link) => link.querySelector("div"));
    homeLinkWrappers.forEach((wrapper) => {
      expect(wrapper).not.toHaveClass("opacity-100");
      expect(wrapper).toHaveClass("opacity-30");
    });
  });

  it("should call logOut and redirect to /login when logout button is clicked", async () => {
    render(<Navbar />);
    const logoutButtons = screen.getAllByTitle("Sair da conta");
    fireEvent.click(logoutButtons[0]);

    await waitFor(() => {
      expect(mockLogOut).toHaveBeenCalledTimes(1);
    });
    expect(mockRouterPush).toHaveBeenCalledTimes(1);
    expect(mockRouterPush).toHaveBeenCalledWith("/login");
  });
});
