import React from 'react';
import { Button } from './Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = "We couldn't load appointment availability. Please try again.",
  onRetry,
}) => {
  return (
    <div className="rounded-2xl border border-rose-200/80 bg-rose-50/40 p-6 text-center max-w-md mx-auto my-6">
      <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center mx-auto mb-3 text-rose-600">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-rose-900 mb-1">{title}</h4>
      <p className="text-xs text-rose-700 mb-4">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};
