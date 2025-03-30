
// Simulated job data service (since direct LinkedIn scraping requires authorization)
import { useState, useEffect } from 'react';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedAt: Date;
  logoUrl: string;
  applyUrl: string;
}

// Sample job data (in a real app, this would come from an API)
const SAMPLE_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "Techno Solutions",
    location: "Hyderabad, Telangana",
    description: "Looking for an experienced React developer to join our growing team. Must have 3+ years of experience with React and TypeScript.",
    postedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    logoUrl: "https://ui-avatars.com/api/?name=Techno+Solutions&background=0D8ABC&color=fff",
    applyUrl: "https://example.com/apply/1"
  },
  {
    id: "2",
    title: "Frontend Engineer",
    company: "Global Systems",
    location: "Bengaluru, Karnataka",
    description: "Join our team to build beautiful and responsive web interfaces. Experience with React, Redux, and CSS-in-JS is required.",
    postedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    logoUrl: "https://ui-avatars.com/api/?name=Global+Systems&background=2563EB&color=fff",
    applyUrl: "https://example.com/apply/2"
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company: "Innovative Tech",
    location: "Chennai, Tamil Nadu",
    description: "We need a full stack developer who can work with React, Node.js, and MongoDB. Must be able to handle both frontend and backend tasks.",
    postedAt: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    logoUrl: "https://ui-avatars.com/api/?name=Innovative+Tech&background=DC2626&color=fff",
    applyUrl: "https://example.com/apply/3"
  },
  {
    id: "4",
    title: "React Native Developer",
    company: "Mobile Apps Inc",
    location: "Remote",
    description: "Seeking a React Native developer to build cross-platform mobile applications. Experience with iOS and Android development is a plus.",
    postedAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    logoUrl: "https://ui-avatars.com/api/?name=Mobile+Apps+Inc&background=10B981&color=fff",
    applyUrl: "https://example.com/apply/4"
  },
  {
    id: "5",
    title: "UI/UX Designer",
    company: "Creative Studios",
    location: "Hyderabad, Telangana",
    description: "Looking for a UI/UX designer with experience in creating user interfaces for web and mobile applications. Figma proficiency required.",
    postedAt: new Date(Date.now() - 1000 * 60 * 150), // 2.5 hours ago
    logoUrl: "https://ui-avatars.com/api/?name=Creative+Studios&background=8B5CF6&color=fff",
    applyUrl: "https://example.com/apply/5"
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "Cloud Systems",
    location: "Mumbai, Maharashtra",
    description: "Join our team to manage cloud infrastructure and CI/CD pipelines. Experience with AWS, Docker, and Kubernetes is required.",
    postedAt: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    logoUrl: "https://ui-avatars.com/api/?name=Cloud+Systems&background=EC4899&color=fff",
    applyUrl: "https://example.com/apply/6"
  }
];

// This function simulates fetching new jobs
const fetchNewJobs = (): Promise<Job[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create 1-3 new jobs with current timestamp
      const numberOfNewJobs = Math.floor(Math.random() * 3) + 1;
      const companyNames = ["TechGrow", "Skynet Solutions", "Digital Wizards", "Code Masters", "Web Experts"];
      const locations = ["Hyderabad", "Bengaluru", "Chennai", "Delhi", "Mumbai", "Remote"];
      const jobTitles = ["React Developer", "Frontend Engineer", "Full Stack Developer", "UI/UX Designer", "JavaScript Engineer"];
      
      const newJobs: Job[] = [];
      
      for (let i = 0; i < numberOfNewJobs; i++) {
        const randomCompany = companyNames[Math.floor(Math.random() * companyNames.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const randomTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
        
        newJobs.push({
          id: Date.now() + "-" + i,
          title: randomTitle,
          company: randomCompany,
          location: `${randomLocation}, India`,
          description: `We're looking for a talented ${randomTitle} to join our team. Great opportunity to grow and learn!`,
          postedAt: new Date(),
          logoUrl: `https://ui-avatars.com/api/?name=${randomCompany.replace(/ /g, "+")}&background=${Math.floor(Math.random()*16777215).toString(16)}&color=fff`,
          applyUrl: `https://example.com/apply/${Date.now()}-${i}`
        });
      }
      
      resolve(newJobs);
    }, 1000); // Simulate network delay
  });
};

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>(SAMPLE_JOBS);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refreshJobs = async () => {
    setLoading(true);
    try {
      console.log("Fetching new jobs...");
      const newJobs = await fetchNewJobs();
      setJobs(prevJobs => [...newJobs, ...prevJobs].slice(0, 20)); // Keep latest 20 jobs
      setLastUpdated(new Date());
      console.log(`Added ${newJobs.length} new jobs`);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initially load jobs
  useEffect(() => {
    // Set up the 5-minute interval for refreshing jobs
    const intervalId = setInterval(() => {
      refreshJobs();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
    
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return { jobs, loading, lastUpdated, refreshJobs };
}
