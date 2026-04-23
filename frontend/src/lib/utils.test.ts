import { describe, expect, it } from "vitest";
import { cn, formatDate } from "./utils";

describe("utils", () => {
  it("merges tailwind classes and keeps the latest conflict", () => {
    const result = cn("px-2", "text-sm", "px-4");
    expect(result).toContain("px-4");
    expect(result).not.toContain("px-2");
    expect(result).toContain("text-sm");
  });

  it("formats ISO date to readable string", () => {
    const result = formatDate("2026-04-23T10:00:00.000Z");
    expect(result).toContain("2026");
    expect(result.length).toBeGreaterThan(4);
  });
});
