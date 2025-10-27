import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthRedirector from "./AuthRedirector"; 

// Mocks
let mockUser: { photoURL?: string | null } | null = null;
let mockLoading = true;
jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    loading: mockLoading,
  }),
}));

const mockRouterReplace = jest.fn();
let mockPathname = "/";
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    replace: mockRouterReplace,
    push: jest.fn(),
    back: jest.fn(),
  })),
  usePathname: jest.fn(() => mockPathname),
}));

const MockChildComponent = () => <div>Conteúdo Protegido</div>;

beforeEach(() => {
  mockRouterReplace.mockClear();
  mockUser = null;
  mockLoading = true;
  mockPathname = "/";
});

// Tests
describe("AuthRedirector Component", () => {
  it("should show loading indicator initially (on protected route)", () => {
    mockPathname = "/";
    mockLoading = true;
    render(
      <AuthRedirector>
        <MockChildComponent />
      </AuthRedirector>
    );
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
    expect(screen.queryByText("Conteúdo Protegido")).not.toBeInTheDocument();
  });

  it("should not show loading indicator initially on public route (/share)", () => {
    mockPathname = "/share/some-id";
    mockLoading = true;
    render(
      <AuthRedirector>
        <MockChildComponent />
      </AuthRedirector>
    );
    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
    expect(screen.getByText("Conteúdo Protegido")).toBeInTheDocument();
  });

  it("should render children if user is logged in and accessing a protected route", () => {
    mockPathname = "/";
    mockLoading = false;
    mockUser = { photoURL: "test" };
    render(
      <AuthRedirector>
        <MockChildComponent />
      </AuthRedirector>
    );

    expect(mockRouterReplace).not.toHaveBeenCalled();
    expect(screen.getByText("Conteúdo Protegido")).toBeInTheDocument();
  });

  it("should render children if user is null and accessing /login", () => {
    mockPathname = "/login";
    mockLoading = false;
    mockUser = null;
    render(
      <AuthRedirector>
        <MockChildComponent />
      </AuthRedirector>
    );

    expect(mockRouterReplace).not.toHaveBeenCalled();
    expect(screen.getByText("Conteúdo Protegido")).toBeInTheDocument();
  });

  it("should render children if accessing a public route (/share) regardless of auth state", () => {
    mockPathname = "/share/some-id";
    mockLoading = false;

    // Cenário 1: Deslogado
    mockUser = null;
    const { rerender } = render(
      <AuthRedirector>
        <MockChildComponent />
      </AuthRedirector>
    );
    expect(mockRouterReplace).not.toHaveBeenCalled();
    expect(screen.getByText("Conteúdo Protegido")).toBeInTheDocument();

    mockRouterReplace.mockClear();

    // Cenário 2: Logado
    mockUser = { photoURL: "test" };
    rerender(
      <AuthRedirector>
        <MockChildComponent />
      </AuthRedirector>
    );
    expect(mockRouterReplace).not.toHaveBeenCalled();
    expect(screen.getByText("Conteúdo Protegido")).toBeInTheDocument();
  });
});
