"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="text-ios-secondary" style={{ fontSize: "0.875rem" }}>
          Cláusula {current} de {total}
        </span>
        <span className="fw-semibold text-ios-accent" style={{ fontSize: "0.875rem" }}>
          {progress}%
        </span>
      </div>
      <div className="progress-ios">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
