export interface MatchScore {
  percentage: number;
  summary: string;
}

export interface ResumeHeader {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  bullets: string[];
}

export interface Skills {
  technical: string[];
  soft: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  dates: string;
}

export interface Project {
  title: string;
  description: string;
}

export interface Certification {
  title: string;
  issuer: string;
  dates: string;
}

export interface TailoredResume {
  header: ResumeHeader;
  summary: string;
  experience: Experience[];
  skills: Skills;
  education?: Education[];
  projects?: Project[];
  certifications?: Certification[];
}

export interface AnalysisResult {
  match_score: MatchScore;
  tailored_resume: TailoredResume;
  explanation: string[];
}

export interface UserExperience {
  company_name: string;
  role_title: string;
  start_date: string;
  end_date: string;
  location: string;
  responsibilities: string[];
}

export interface UserEducation {
  school_name: string;
  degree: string;
  start_date: string;
  end_date: string;
  field_of_study?: string;
}

export interface UserCertification {
  certificate_name: string;
  issuing_organization: string;
  year_of_completion: number;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  linkedin_url?: string;
  website_url?: string;
  profile_picture?: string;
  professional_summary: string;
  experiences: UserExperience[];
  education: UserEducation[];
  skills: string[];
  certifications?: UserCertification[];
  last_login_at: string;
  number_of_resumes_generated: number;
  created_at: string;
  updated_at: string;
}
