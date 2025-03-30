
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface JobSearchProps {
  onSearch: (search: string, location: string) => void;
}

const JobSearch: React.FC<JobSearchProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchText, location);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search job titles, companies..."
          className="pl-10"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Any Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Location</SelectItem>
            <SelectItem value="Hyderabad">Hyderabad</SelectItem>
            <SelectItem value="Bengaluru">Bengaluru</SelectItem>
            <SelectItem value="Chennai">Chennai</SelectItem>
            <SelectItem value="Mumbai">Mumbai</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
          </SelectContent>
        </Select>
        
        <Button type="submit" className="flex items-center gap-2" variant="default">
          <Filter className="h-4 w-4" />
          <span className="hidden md:inline">Filter</span>
        </Button>
      </div>
    </form>
  );
};

export default JobSearch;
