
import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedAt: Date;
  logoUrl: string;
  applyUrl: string;
  sourceUrl?: string;
}

const SAMPLE_JOBS: Job[] = [
  {
    id: "1",
    title: "Associate Software Engineer",
    company: "Techno Solutions",
    location: "Hyderabad, Telangana",
    description: "Looking for an Associate Software Engineer proficient in React.js and TypeScript. Great opportunity for freshers with strong fundamentals.",
    postedAt: new Date(Date.now() - 1000 * 60 * 30),
    logoUrl: "https://ui-avatars.com/api/?name=Techno+Solutions&background=0D8ABC&color=fff",
    applyUrl: "https://example.com/apply/1",
    sourceUrl: "https://www.linkedin.com/jobs/view/4161413548"
  },
  {
    id: "2",
    title: "Junior Frontend Developer",
    company: "Global Systems",
    location: "Bengaluru, Karnataka",
    description: "Exciting opportunity for a Junior Frontend Developer with 0-2 years of experience. Knowledge of React.js and CSS frameworks required.",
    postedAt: new Date(Date.now() - 1000 * 60 * 60),
    logoUrl: "https://ui-avatars.com/api/?name=Global+Systems&background=2563EB&color=fff",
    applyUrl: "https://example.com/apply/2",
    sourceUrl: "https://www.linkedin.com/jobs/view/3578941267"
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company: "Innovative Tech",
    location: "Chennai, Tamil Nadu",
    description: "We need a full stack developer who can work with React, Node.js, and MongoDB. Must be able to handle both frontend and backend tasks.",
    postedAt: new Date(Date.now() - 1000 * 60 * 90),
    logoUrl: "https://ui-avatars.com/api/?name=Innovative+Tech&background=DC2626&color=fff",
    applyUrl: "https://example.com/apply/3"
  },
  {
    id: "4",
    title: "React Native Developer",
    company: "Mobile Apps Inc",
    location: "Remote",
    description: "Seeking a React Native developer to build cross-platform mobile applications. Experience with iOS and Android development is a plus.",
    postedAt: new Date(Date.now() - 1000 * 60 * 120),
    logoUrl: "https://ui-avatars.com/api/?name=Mobile+Apps+Inc&background=10B981&color=fff",
    applyUrl: "https://example.com/apply/4"
  },
  {
    id: "5",
    title: "UI/UX Designer",
    company: "Creative Studios",
    location: "Hyderabad, Telangana",
    description: "Looking for a UI/UX designer with experience in creating user interfaces for web and mobile applications. Figma proficiency required.",
    postedAt: new Date(Date.now() - 1000 * 60 * 150),
    logoUrl: "https://ui-avatars.com/api/?name=Creative+Studios&background=8B5CF6&color=fff",
    applyUrl: "https://example.com/apply/5"
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "Cloud Systems",
    location: "Mumbai, Maharashtra",
    description: "Join our team to manage cloud infrastructure and CI/CD pipelines. Experience with AWS, Docker, and Kubernetes is required.",
    postedAt: new Date(Date.now() - 1000 * 60 * 180),
    logoUrl: "https://ui-avatars.com/api/?name=Cloud+Systems&background=EC4899&color=fff",
    applyUrl: "https://example.com/apply/6"
  }
];

// New function to build LinkedIn job search URL with parameters
const buildLinkedInJobSearchUrl = (keywords: string, timeFilter: string = 'r86400') => {
  const encodedKeywords = encodeURIComponent(keywords);
  return `https://www.linkedin.com/jobs/search/?f_TPR=${timeFilter}&keywords=${encodedKeywords}&origin=JOB_SEARCH_PAGE_JOB_FILTER`;
};

// Function to fetch job count using the API endpoint
const fetchJobCount = async () => {
  try {
    const apiKey = "YOUR_API_KEY";
    const baseUrl = "https://api.example.com"; // Replace with actual base URL
    const url = `${baseUrl}/api/v2/linkedin/company/job/count`;
    
    const response = await axios.get(url, {
      params: {
        job_type: "entry_level",
        experience_level: "entry_level",
        when: "past-month",
        flexibility: "remote",
        geo_id: "92000000",
        keyword: "software engineer",
        search_id: "1035"
      },
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching job count:", error);
    return { count: 0 };
  }
};

// Updated function to use the Scrapingdog API for LinkedIn jobs
const fetchJobsFromApi = async (): Promise<Job[]> => {
  try {
    const apiKey = "67e995644cb9f6e2991b9919"; // Scrapingdog API key
    const url = "https://api.scrapingdog.com/linkedinjobs/";
    
    const response = await axios.get(url, {
      params: {
        api_key: apiKey,
        field: "associate software engineer",
        geoid: "102713980", // India
        page: 1,
        sortBy: "day",
        jobType: "full_time",
        expLevel: "entry_level"
      }
    });

    if (response.status === 200 && Array.isArray(response.data)) {
      console.log("ScrapingDog API Response:", response.data);
      return response.data.map((job: any) => ({
        id: job.jobId || String(Math.random()),
        title: job.jobTitle || "Unknown Position",
        company: job.companyName || "Unknown Company",
        location: job.location || "Location not specified",
        description: job.description || "No description available",
        postedAt: new Date(job.postedDate || Date.now()),
        logoUrl: job.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName || 'Company')}&background=${Math.floor(Math.random()*16777215).toString(16)}&color=fff`,
        applyUrl: job.jobUrl || "#",
        sourceUrl: job.jobUrl || buildLinkedInJobSearchUrl("associate software engineer")
      }));
    }
    
    console.error("Invalid response format from Scrapingdog API");
    return [];
  } catch (error) {
    console.error("Error fetching jobs from Scrapingdog API:", error);
    return [];
  }
};

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>(SAMPLE_JOBS);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [jobCount, setJobCount] = useState<number>(0);

  const refreshJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching jobs from Scrapingdog API...");
      const apiJobs = await fetchJobsFromApi();
      
      // Try to fetch job count
      try {
        const countData = await fetchJobCount();
        if (countData && typeof countData.count === 'number') {
          setJobCount(countData.count);
        } else {
          // If job count API fails, set the count to the number of jobs retrieved
          setJobCount(apiJobs.length);
        }
      } catch (countError) {
        console.error("Error fetching job count:", countError);
        setJobCount(apiJobs.length);
      }
      
      if (apiJobs.length > 0) {
        setJobs(apiJobs);
        console.log(`Added ${apiJobs.length} new jobs from Scrapingdog API`);
      } else {
        const simulatedJobs = await fetchNewJobs();
        setJobs(prevJobs => [...simulatedJobs, ...prevJobs].slice(0, 20));
        console.log(`API returned no jobs. Added ${simulatedJobs.length} simulated jobs instead`);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error refreshing jobs:", error);
      setError("Failed to fetch jobs. Using sample data instead.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNewJobs = (): Promise<Job[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const numberOfNewJobs = Math.floor(Math.random() * 3) + 1;
        const companyNames = ["TechGrow", "Skynet Solutions", "Digital Wizards", "Code Masters", "Web Experts"];
        const locations = ["Hyderabad", "Bengaluru", "Chennai", "Delhi", "Mumbai", "Remote"];
        const jobTitles = ["Associate Software Engineer", "React Developer", "Frontend Engineer", "Junior Developer", "Software Engineer Trainee"];
        
        const newJobs: Job[] = [];
        
        for (let i = 0; i < numberOfNewJobs; i++) {
          const randomCompany = companyNames[Math.floor(Math.random() * companyNames.length)];
          const randomLocation = locations[Math.floor(Math.random() * locations.length)];
          const randomTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
          const jobId = Date.now() + "-" + i;
          
          newJobs.push({
            id: jobId,
            title: randomTitle,
            company: randomCompany,
            location: `${randomLocation}, India`,
            description: `We're looking for a talented ${randomTitle} to join our team. Great opportunity to grow and learn!`,
            postedAt: new Date(),
            logoUrl: `https://ui-avatars.com/api/?name=${randomCompany.replace(/ /g, "+")}&background=${Math.floor(Math.random()*16777215).toString(16)}&color=fff`,
            applyUrl: `https://example.com/apply/${jobId}`,
            sourceUrl: buildLinkedInJobSearchUrl(randomTitle) // Use the LinkedIn search URL
          });
        }
        
        resolve(newJobs);
      }, 1000);
    });
  };

  useEffect(() => {
    refreshJobs();
    
    const intervalId = setInterval(() => {
      refreshJobs();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return { jobs, loading, lastUpdated, refreshJobs, error, jobCount };
}
