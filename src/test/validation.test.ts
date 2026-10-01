import { describe, expect, it } from "vitest";
import { validateCaseTitle } from "@/lib/validation";

describe("validateCaseTitle", () => {
  it("rejects blank titles", () => {
    expect(validateCaseTitle("   ")).toBe("Case title is required");
  });

  it("rejects titles shorter than three characters", () => {
    expect(validateCaseTitle("ab")).toBe("Case title must be at least 3 characters");
  });

  it("rejects titles longer than 120 characters", () => {
    expect(validateCaseTitle("a".repeat(121))).toBe(
      "Case title must be 120 characters or fewer",
    );
  });

  it("accepts and normalizes a valid title", () => {
    expect(validateCaseTitle("  Missing Evidence  ")).toBeNull();
  });
});
