"use client";

import PremiumProgress from "@/ui/components/PremiumProgress";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return <PremiumProgress current={current} total={total} />;
}
