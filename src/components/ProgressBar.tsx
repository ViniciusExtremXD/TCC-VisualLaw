"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="cupertino-card-inset p-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="text-ios-secondary" style={{ fontSize: "0.8rem" }}>
          {current} de {total}
        </span>
        <span className="text-ios-secondary" style={{ fontSize: "0.8rem" }}>
          {progress}%
        </span>
      </div>
      <div className="progress-ios">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
