import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

describe("cn utility function", () => {
  it("should merge basic class names", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const isDisabled = false;
    expect(
      cn(
        "base-class",
        isActive && "active-class",
        isDisabled && "disabled-class"
      )
    ).toBe("base-class active-class");
  });

  it("should filter out falsy values", () => {
    expect(cn("class-a", null, undefined, false, "class-b")).toBe(
      "class-a class-b"
    );
  });

  it("should merge conflicting tailwind classes correctly", () => {
    expect(cn("p-4", "p-6")).toBe("p-6");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("should handle arrays of class names", () => {
    expect(cn(["p-4", "m-2"], "bg-green-100")).toBe("p-4 m-2 bg-green-100");
  });
});
