export interface Api2Interafce {
  status: string;
  data: {
    jobsList: Record<string, Api2JobDetail>;
  };
}

export interface Api2JobDetail {
  position: string;
  location: {
    city: string;
    state: string;
    remote: boolean;
  };
  compensation: {
    min: number;
    max: number;
    currency: string;
  };
  employer: {
    companyName: string;
    website: string;
  };
  requirements: {
    experience: number;
    technologies: string[];
  };
  datePosted: string;
}

export interface Api1Interafce {
  metadata: {
    requestId: string;
    timestamp: string;
  };
  jobs: Api1JobDetail[];
}

export interface Api1JobDetail {
  jobId: string;
  title: string;
  details: {
    location: string;
    type: string;
    salaryRange: string;
  };
  company: {
    name: string;
    industry: string;
  };
  skills: string[];
  postedDate: string;
}
