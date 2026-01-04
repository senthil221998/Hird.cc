import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  linkedin_url?: string;
  website_url?: string;
  profile_picture?: string;
  professional_summary: string;
  experience: Array<{
    company_name: string;
    role_title: string;
    start_date: string;
    end_date: string;
    location?: string;
    responsibilities: string[];
  }>;
  education: Array<{
    school_name: string;
    degree: string;
    start_date: string;
    end_date: string;
    field_of_study?: string;
  }>;
  skills: string[];
  certifications?: Array<{
    name: string;
    organization: string;
    year: string;
  }>;
}

interface AnalyzeRequest {
  jobDescription: string;
  resume_source: 'upload' | 'profile';
  resumeText?: string;
  profile_data?: ProfileData;
}

interface AIResponse {
  match_score: {
    percentage: number;
    summary: string;
  };
  tailored_resume: {
    header: {
      name: string;
      email: string;
      phone: string;
      location: string;
      linkedin?: string;
    };
    summary: string;
    experience: Array<{
      company: string;
      position: string;
      duration: string;
      bullets: string[];
    }>;
    skills: {
      technical: string[];
      soft: string[];
    };
    education?: Array<{
      degree: string;
      institution: string;
      location: string;
      dates: string;
    }>;
    projects?: Array<{
      title: string;
      description: string;
    }>;
    certifications?: Array<{
      title: string;
      issuer: string;
      dates: string;
    }>;
  };
  explanation: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const { jobDescription, resume_source, resumeText, profile_data }: AnalyzeRequest = await req.json();

    if (!jobDescription) {
      return new Response(
        JSON.stringify({ error: "Missing jobDescription" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (resume_source === 'upload' && !resumeText) {
      return new Response(
        JSON.stringify({ error: "Missing resumeText for upload source" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (resume_source === 'profile' && !profile_data) {
      return new Response(
        JSON.stringify({ error: "Missing profile_data for profile source" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let candidateInfo = '';

    if (resume_source === 'upload' && resumeText) {
      candidateInfo = `Candidate Resume:
${resumeText}`;
    } else if (resume_source === 'profile' && profile_data) {
      const expText = profile_data.experience.map(exp =>
        `${exp.role_title} at ${exp.company_name}
${exp.start_date} - ${exp.end_date}${exp.location ? ` | ${exp.location}` : ''}
${exp.responsibilities.map(r => `• ${r}`).join('\n')}`
      ).join('\n\n');

      const eduText = profile_data.education.map(edu =>
        `${edu.degree} - ${edu.school_name}
${edu.start_date} - ${edu.end_date}${edu.field_of_study ? ` | ${edu.field_of_study}` : ''}`
      ).join('\n\n');

      const certText = profile_data.certifications && profile_data.certifications.length > 0
        ? profile_data.certifications.map(cert =>
            `${cert.name} - ${cert.organization} (${cert.year})`
          ).join('\n')
        : '';

      candidateInfo = `Candidate Profile:

Contact Information:
Name: ${profile_data.first_name} ${profile_data.last_name}
Email: ${profile_data.email}
Phone: ${profile_data.phone_number}${profile_data.linkedin_url ? `\nLinkedIn: ${profile_data.linkedin_url}` : ''}${profile_data.website_url ? `\nWebsite: ${profile_data.website_url}` : ''}

Professional Summary:
${profile_data.professional_summary}

Experience:
${expText}

Education:
${eduText}

Skills:
${profile_data.skills.join(', ')}${certText ? `\n\nCertifications:\n${certText}` : ''}`;
    }

    const systemPrompt = `You are an expert career assistant and resume writer.
Your task is to analyze a job description and a candidate's information, then produce a tailored, professional resume optimized specifically for that job.
Be realistic and conservative. Do not exaggerate skills or invent experience. Reframe or emphasize what can be reasonably inferred from the candidate's information.
Output must be structured as JSON following the schema provided. No extra commentary or fields.`;

    const userPrompt = `Job Description:
${jobDescription}

${candidateInfo}

Instructions:
1. Evaluate how well the candidate's background matches the job description.
2. Produce a tailored version of the resume emphasizing the most relevant experience and skills.
3. Include Education, Projects, and Certifications if present in candidate information or relevant to the job description.
4. Keep the resume professional, ATS-friendly, and truthful. Do not exaggerate or invent information.
5. Maintain concise formatting; avoid fluff.
6. Use concise bullet points for experience.
7. Assume the candidate will manually edit the resume later.

Output Rules:
- Return ONLY valid JSON matching this schema:
{
  "match_score": { "percentage": 0, "summary": "" },
  "tailored_resume": {
    "header": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "" },
    "summary": "",
    "experience": [{"company": "", "position": "", "duration": "", "bullets": [""]}],
    "skills": { "technical": [""], "soft": [""] },
    "education": [{"degree": "", "institution": "", "location": "", "dates": ""}],
    "projects": [{"title": "", "description": ""}],
    "certifications": [{"title": "", "issuer": "", "dates": ""}]
  },
  "explanation": [""]
}
- Education, projects, and certifications are optional. Only include them if relevant or present in the candidate information.
- Do not add extra fields or explanations outside JSON.`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const aiResponseText = openaiData.choices[0].message.content;
    const parsedResponse: AIResponse = JSON.parse(aiResponseText);

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-resume function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});