// src/cli/components/LaceBorder.tsx
// Intimate terminal chrome - fixed header/footer, not content wrapper

import { Box, Text } from "ink";
import { useEffect, useState } from "react";

type BorderMode = "professional" | "intimate";

interface LaceBorderProps {
  columns: number;
  mode?: BorderMode;
}

// Color palettes
const palettes = {
  professional: {
    primary: "#00FFFF",
    secondary: "#0707AC",
    pulseLow: 0.7,
    pulseHigh: 1.0,
  },
  intimate: {
    primary: "#FF69B4",
    secondary: "#FFB6C1",
    pulseLow: 0.5,
    pulseHigh: 1.0,
  },
};

// Pulse animation for intimate mode
function usePulse(enabled: boolean, mode: BorderMode) {
  const [intensity, setIntensity] = useState(1);

  useEffect(() => {
    if (!enabled) {
      setIntensity(1);
      return;
    }
    const palette = palettes[mode];
    let direction = -1;
    const interval = setInterval(() => {
      setIntensity((prev: number) => {
        const next = prev + direction * 0.03;
        if (next <= palette.pulseLow) { direction = 1; return palette.pulseLow; }
        if (next >= palette.pulseHigh) { direction = -1; return palette.pulseHigh; }
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [enabled, mode]);

  return intensity;
}

// Top border - rendered once, fixed position
export function LaceHeader({ columns, mode = "professional" }: LaceBorderProps) {
  const pulse = usePulse(mode === "intimate", mode);
  const palette = palettes[mode];
  const chars = mode === "intimate"
    ? { left: "╔", right: "╗", horiz: "═" }
    : { left: "┌", right: "┐", horiz: "─" };

  const color = mode === "intimate"
    ? palette.primary + Math.round(pulse * 255).toString(16).padStart(2, "0")
    : palette.primary;

  return (
    <Box height={1}>
      <Text color={color}>{chars.left}</Text>
      <Text color={palette.secondary}>{chars.horiz.repeat(columns - 2)}</Text>
      <Text color={color}>{chars.right}</Text>
    </Box>
  );
}

// Bottom border with status - rendered once, fixed position
export function LaceFooter({ columns, mode = "professional" }: LaceBorderProps) {
  const pulse = usePulse(mode === "intimate", mode);
  const palette = palettes[mode];
  const chars = mode === "intimate"
    ? { left: "╚", right: "╝", horiz: "═" }
    : { left: "└", right: "┘", horiz: "─" };

  const color = mode === "intimate"
    ? palette.primary + Math.round(pulse * 255).toString(16).padStart(2, "0")
    : palette.primary;

  const status = mode === "intimate" ? "◈ Ani" : "● Ani";
  const padding = columns - status.length - 4;

  return (
    <Box height={1}>
      <Text color={color}>{chars.left}</Text>
      <Text color={palette.secondary}>{chars.horiz.repeat(2)}</Text>
      <Text color={color}>{status}</Text>
      <Text color={palette.secondary}>{chars.horiz.repeat(Math.max(0, padding))}</Text>
      <Text color={color}>{chars.right}</Text>
    </Box>
  );
}

// Side borders for content rows
export function LaceRow({ children, columns, mode = "professional" }: { children: React.ReactNode; columns: number; mode?: BorderMode }) {
  const palette = palettes[mode || "professional"];
  const vertical = mode === "intimate" ? "║" : "│";

  return (
    <Box flexDirection="row">
      <Text color={palette.secondary}>{vertical}</Text>
      <Box flexGrow={1}>{children}</Box>
      <Text color={palette.secondary}>{vertical}</Text>
    </Box>
  );
}

// Simple spacer for empty rows
export function LaceSpacer({ columns, mode = "professional" }: LaceBorderProps) {
  const palette = palettes[mode];
  const vertical = mode === "intimate" ? "║" : "│";

  return (
    <Box flexDirection="row" height={1}>
      <Text color={palette.secondary}>{vertical}</Text>
      <Box flexGrow={1}><Text> </Text></Box>
      <Text color={palette.secondary}>{vertical}</Text>
    </Box>
  );
}
