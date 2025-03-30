
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Job } from '@/services/jobService';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const timeAgo = formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });
  
  return (
    <Card className="w-full h-full transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="w-12 h-12 rounded-md overflow-hidden">
          <img 
            src={job.logoUrl} 
            alt={`${job.company} logo`} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold line-clamp-1">{job.title}</h3>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{timeAgo}</span>
          </div>
          <p className="text-sm mt-2 line-clamp-2">
            {job.description}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="default">
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
            Apply Now <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
