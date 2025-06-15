import type { JobApplication } from '../../types';

interface AIScoreCircleProps {
  score: number;
  status: JobApplication['status'];
}

export default function AIScoreCircle({ score, status }: AIScoreCircleProps) {
  const getScoreColor = () => {
    if (status === 'pending') return 'text-green-600';
    if (status === 'rejected') return 'text-red-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="relative w-12 h-12">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="3"
        />
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={getScoreColor()}
          strokeWidth="3"
          strokeDasharray={`${score}, 100`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-medium ${getScoreColor()}`}>{score}</span>
      </div>
    </div>
  );
} 