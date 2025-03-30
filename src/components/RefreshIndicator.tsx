
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { RefreshCw, Linkedin, AlertCircle } from 'lucide-react';

interface RefreshIndicatorProps {
  lastUpdated: Date;
  loading: boolean;
  onRefresh: () => void;
  error?: string | null;
}

const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({
  lastUpdated,
  loading,
  onRefresh,
  error
}) => {
  const timeAgo = formatDistanceToNow(lastUpdated, { addSuffix: true });

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full py-2 px-4 bg-muted/50 rounded-md gap-2">
      <div className="flex items-center">
        <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
        <p className="text-sm text-muted-foreground">
          LinkedIn jobs updated: {timeAgo}
        </p>
        {error && (
          <div className="flex items-center ml-3 text-yellow-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">{error}</span>
          </div>
        )}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh} 
        disabled={loading}
        className="ml-2 flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">
          {loading ? 'Refreshing...' : 'Refresh now'}
        </span>
      </Button>
    </div>
  );
};

export default RefreshIndicator;
