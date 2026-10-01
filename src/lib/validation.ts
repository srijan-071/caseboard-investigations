export function validateCaseTitle(title: string): string | null {
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return "Case title is required";
  }

  if (trimmedTitle.length < 3) {
    return "Case title must be at least 3 characters";
  }

  if (trimmedTitle.length > 120) {
    return "Case title must be 120 characters or fewer";
  }

  return null;
}
