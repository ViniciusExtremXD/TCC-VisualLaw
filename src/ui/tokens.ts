export const uiTokens = {
  radii: {
    sm: 14,
    md: 18,
    lg: 22,
    xl: 28,
  },
  shadows: {
    sm: "0 1px 1px rgba(0, 0, 0, 0.05), 0 4px 10px rgba(15, 23, 42, 0.05)",
    md: "0 1px 1px rgba(0, 0, 0, 0.05), 0 8px 22px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.05)",
    lg: "0 1px 1px rgba(0, 0, 0, 0.05), 0 12px 30px rgba(15, 23, 42, 0.1), 0 4px 12px rgba(15, 23, 42, 0.06)",
    xl: "0 1px 1px rgba(0, 0, 0, 0.05), 0 18px 45px rgba(15, 23, 42, 0.14), 0 8px 24px rgba(15, 23, 42, 0.08)",
  },
  blur: {
    glass: 16,
  },
  borders: {
    hairline: "1px solid rgba(60, 60, 67, 0.22)",
  },
  gradients: {
    specular:
      "radial-gradient(circle at 20% 0%, rgba(255,255,255,0.9), rgba(255,255,255,0) 60%)",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    "2xl": 24,
    "3xl": 32,
  },
  motion: {
    duration: {
      fast: 0.12,
      normal: 0.18,
      medium: 0.24,
      slow: 0.32,
    },
    easing: {
      ios: [0.22, 1, 0.36, 1],
      swift: [0.2, 0.8, 0.2, 1],
      soft: [0.28, 0.84, 0.42, 1],
    },
  },
  typography: {
    largeTitle: {
      fontSize: 32,
      lineHeight: 38,
      fontWeight: 700,
    },
    title2: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: 700,
    },
    body: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: 500,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: 500,
    },
  },
  colors: {
    systemGroupedBackground: "#f2f2f7",
    card: "rgba(255, 255, 255, 0.74)",
    cardSolid: "#ffffff",
    separator: "rgba(60, 60, 67, 0.22)",
    label: "#1c1c1e",
    secondaryLabel: "#6b7280",
    accent: "#0a84ff",
    accentStrong: "#0066d6",
  },
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Arial, sans-serif',
} as const;

export type UiTokens = typeof uiTokens;
