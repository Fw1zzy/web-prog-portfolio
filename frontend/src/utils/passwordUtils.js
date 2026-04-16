export function getPasswordStrength(password) {
  if (!password) {
    return { score: 0, label: "", className: "" };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return { score, label: "Weak", className: "weak" };
  }
  if (score <= 3) {
    return { score, label: "Medium", className: "medium" };
  }
  return { score, label: "Strong", className: "strong" };
}
