export const uiTokens = {
  radii: {
    sm: 12,
    md: 16,
    lg: 20,
  },
  shadows: {
    subtle: "0 1px 2px rgba(15, 23, 42, 0.08), 0 8px 18px rgba(15, 23, 42, 0.06)",
    elevated: "0 2px 4px rgba(15, 23, 42, 0.12), 0 20px 40px rgba(15, 23, 42, 0.14)",
  },
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 32,
  },
  typography: {
    largeTitle: {
      fontSize: 34,
      lineHeight: 40,
      fontWeight: 700,
    },
    title: {
      fontSize: 24,
      lineHeight: 30,
      fontWeight: 700,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: 400,
    },
    caption: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: 500,
    },
  },
  colors: {
    groupedBackground: "#F2F2F7",
    cardBackground: "#FFFFFF",
    separator: "rgba(60, 60, 67, 0.18)",
    label: "#1C1C1E",
    secondaryLabel: "#6B7280",
    tint: "#0A84FF",
  },
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Arial, sans-serif',
} as const;

export type UiTokens = typeof uiTokens;
