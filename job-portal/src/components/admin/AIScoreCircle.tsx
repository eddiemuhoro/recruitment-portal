import type { JobApplication } from '../../types';

interface AIScoreCircleProps {
  score: number;
  status: JobApplication['status'];
}

export const AIScoreCircle = ({ score, status }: AIScoreCircleProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="relative w-16 h-16">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        {/* Background circle */}
        <circle
          cx="18"
          cy="18"
          r="15.91549430918954"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="3"
        />
        {/* Score circle */}
        <circle
          cx="18"
          cy="18"
          r="15.91549430918954"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${score} 100`}
          strokeLinecap="round"
          className={getScoreColor(score)}
          transform="rotate(-90 18 18)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
    </div>
  );
}; 