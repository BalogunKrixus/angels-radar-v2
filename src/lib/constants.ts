// Vocab shared by forms, filters and validation across the app.
// Kept as plain arrays (not DB enums) because SQLite has no native enum type
// and this keeps the same code path working after a Postgres migration.

export const ROLES = ["founder", "investor", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const USER_STATUSES = ["active", "suspended"] as const;

export const STARTUP_STATUSES = [
  "draft",
  "pending",
  "approved",
  "changes_requested",
  "rejected",
] as const;
export type StartupStatus = (typeof STARTUP_STATUSES)[number];

export const INVESTOR_STATUSES = [
  "draft",
  "pending",
  "approved",
  "changes_requested",
  "rejected",
  "suspended",
] as const;
export type InvestorStatus = (typeof INVESTOR_STATUSES)[number];

export const INTRO_STATUSES = ["new", "contacted", "completed"] as const;
export type IntroStatus = (typeof INTRO_STATUSES)[number];

export const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending: "Pending verification",
  approved: "Approved",
  changes_requested: "Changes requested",
  rejected: "Rejected",
  suspended: "Suspended",
  new: "New",
  contacted: "Contacted",
  completed: "Completed",
  active: "Active",
};

export const INDUSTRIES = [
  "Fintech",
  "Agritech",
  "Healthtech",
  "Edtech",
  "SaaS",
  "E-commerce",
  "Climate",
  "Mobility",
  "AI",
  "Consumer",
  "Other",
] as const;

export const STAGES = [
  { value: "pre_seed", label: "Pre-seed" },
  { value: "seed", label: "Seed" },
  { value: "series_a", label: "Series A" },
  { value: "series_b_plus", label: "Series B+" },
  { value: "other", label: "Other" },
] as const;

export const TICKET_RANGES = [
  { value: "under_50k", label: "Under $50k" },
  { value: "50k_250k", label: "$50k–$250k" },
  { value: "250k_500k", label: "$250k–$500k" },
  { value: "500k_1m", label: "$500k–$1m" },
  { value: "over_1m", label: "$1m+" },
] as const;

export const INVESTOR_TYPES = [
  { value: "angel", label: "Angel Investor" },
  { value: "vc", label: "Venture Capital" },
  { value: "fund", label: "Fund" },
  { value: "syndicate", label: "Syndicate" },
  { value: "other", label: "Other" },
] as const;

export const CURRENCIES = ["USD", "NGN", "KES", "ZAR", "GHS", "EGP", "Other"] as const;

export const AFRICAN_COUNTRIES = [
  "Algeria",
  "Angola",
  "Benin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cameroon",
  "Central African Republic",
  "Chad",
  "Comoros",
  "Congo (DRC)",
  "Congo (Republic)",
  "Djibouti",
  "Egypt",
  "Equatorial Guinea",
  "Eritrea",
  "Eswatini",
  "Ethiopia",
  "Gabon",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Ivory Coast",
  "Kenya",
  "Lesotho",
  "Liberia",
  "Libya",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritania",
  "Mauritius",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Niger",
  "Nigeria",
  "Rwanda",
  "Sao Tome and Principe",
  "Senegal",
  "Seychelles",
  "Sierra Leone",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Sudan",
  "Tanzania",
  "Togo",
  "Tunisia",
  "Uganda",
  "Zambia",
  "Zimbabwe",
] as const;

export const TICKET_RANGE_BOUNDS: Record<string, { min: number; max?: number }> = {
  under_50k: { min: 0, max: 50_000 },
  "50k_250k": { min: 50_000, max: 250_000 },
  "250k_500k": { min: 250_000, max: 500_000 },
  "500k_1m": { min: 500_000, max: 1_000_000 },
  over_1m: { min: 1_000_000 },
};

export function labelFor(value: string, options: readonly { value: string; label: string }[]): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}
