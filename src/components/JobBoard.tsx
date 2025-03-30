
import React, { useState, useEffect } from 'react';
import { useJobs, Job } from '@/services/jobService';
import JobCard from './JobCard';
import JobSearch from './JobSearch';
import RefreshIndicator from './RefreshIndicator';
import { useToast } from '@/components/ui/use-toast';

const JobBoard: React.FC = () => {
  const { jobs, loading, lastUpdated, refreshJobs, error } = useJobs();
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const { toast } = useToast();
  
  // Update filtered jobs whenever the main jobs list changes
  useEffect(() => {
    setFilteredJobs(jobs);
  }, [jobs]);
  
  const handleSearch = (search: string, location: string) => {
    const filtered = jobs.filter(job => {
      const matchesSearch = search === '' || 
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase());
        
      const matchesLocation = location === '' || 
        job.location.toLowerCase().includes(location.toLowerCase());
        
      return matchesSearch && matchesLocation;
    });
    
    setFilteredJobs(filtered);
    
    toast({
      title: `${filtered.length} jobs found`,
      description: filtered.length > 0 
        ? "Displaying matching job results" 
        : "Try adjusting your search criteria",
      duration: 3000,
    });
  };
  
  const handleRefresh = () => {
    refreshJobs();
    toast({
      title: "Refreshing job listings",
      description: "Getting the latest opportunities for you",
      duration: 3000,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Latest Job Opportunities</h2>
        <p className="text-muted-foreground">
          Discover fresh opportunities updated every 5 minutes
        </p>
      </div>
      
      <JobSearch onSearch={handleSearch} />
      
      <RefreshIndicator 
        lastUpdated={lastUpdated} 
        loading={loading} 
        onRefresh={handleRefresh}
        error={error}
      />
      
      {loading && filteredJobs.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-md bg-muted animate-pulse"></div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No jobs found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobBoard;
