import React from 'react';
import { Card, Button } from '../ui';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface DashboardErrorStateProps {
  onRetry: () => void;
  message?: string;
}

export const DashboardErrorState: React.FC<DashboardErrorStateProps> = ({
  onRetry,
  message = 'Unable to load your career overview.'
}) => {
  return (
    <Card className="p-8 bg-[#1A1A1A] border-rose-800/40 text-center max-w-xl mx-auto my-12 space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-950/60 text-rose-400 flex items-center justify-center mx-auto border border-rose-800/50">
        <AlertCircle className="w-7 h-7" />
      </div>
      
      <div>
        <h3 className="text-lg font-bold text-white font-sans">{message}</h3>
        <p className="text-xs text-neutral-400 mt-1">
          We encountered an issue synchronizing your agent context. Please try again or refresh your workspace.
        </p>
      </div>

      <div className="pt-2 flex justify-center">
        <Button
          variant="primary"
          size="md"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Try Again
        </Button>
      </div>
    </Card>
  );
};
