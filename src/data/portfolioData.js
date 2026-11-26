export const defaultPortfolioData = {
  personal: {
    brandMain: "Karthikeya",
    brandAccent: "Portfolio",
    name: "V.S.G. Karthikeya",
    role: "B.Sc. Computer Science Student & Frontend UI Designer",
    tagline: "Designing responsive, user-centric web interfaces, interactive portals, and modern frontend experiences with React and Tailwind CSS.",
    location: "Rajahmundry, Andhra Pradesh, India",
    email: "contact@example.com",
    defaultResumeUrl: "https://drive.google.com/",
    socials: {
      github: "https://github.com/",
      linkedin: "https://www.linkedin.com/",
    },
  },

  projects: [
    {
      id: 1,
      title: "ADCRJY-365 Institutional Web Portal",
      category: "Full-Stack",
      featured: true,
      description:
        "Collaborated on the official institutional web portal for Aditya Degree College, Rajahmundry, featuring role-based controls, dynamic content sections, and cloud storage integration.",
      tech: ["React", "Vite", "Tailwind CSS", "Supabase", "Vercel"],
      liveUrl: "https://adcrjy-365.vercel.app/",
      githubUrl: "https://github.com/",
    },
  ],

  skills: [
    {
      id: 1,
      category: "Programming Languages",
      items: ["Python", "C", "Java"],
    },
    {
      id: 2,
      category: "Web & Frontend",
      items: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"],
    },
    {
      id: 3,
      category: "Database & Tools",
      items: ["Supabase", "Git", "GitHub", "Vercel"],
    },
  ],

  credentialsOrder: ["education", "internships", "certifications"],

  education: [
    {
      id: 1,
      degree: "Bachelor of Science (B.Sc.)",
      institution: "Aditya Degree College (Autonomous)",
      location: "Rajahmundry, Andhra Pradesh",
      period: "2025 – Present",
      highlights: "Undergraduate coursework in Computer Science, Programming, and Software Development.",
    },
  ],

  internships: [],

  certifications: [],

  contact: {
    eyebrow: "Get In Touch",
    heading: "Let's build something together.",
    subtext:
      "Whether you have an internship opportunity, project collaboration, or just want to connect, my inbox is always open.",
    ctaLabel: "Say Hello",
  },
};

export function getDirectDriveDownloadUrl(url) {
  if (!url) return "#";
  const trimmed = url.trim();
  const fileIdMatch =
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
  }
  return trimmed;
}

export function mergeWithDefaults(raw) {
  const defaultOrder = ["education", "internships", "certifications"];
  const rawOrder = Array.isArray(raw?.credentialsOrder)
    ? raw.credentialsOrder.filter((k) => defaultOrder.includes(k))
    : [];
  const mergedOrder = [
    ...rawOrder,
    ...defaultOrder.filter((k) => !rawOrder.includes(k)),
  ];

  return {
    ...defaultPortfolioData,
    ...raw,
    personal: { ...defaultPortfolioData.personal, ...(raw?.personal || {}) },
    contact: { ...defaultPortfolioData.contact, ...(raw?.contact || {}) },
    credentialsOrder: mergedOrder,
    education: Array.isArray(raw?.education)
      ? raw.education
      : defaultPortfolioData.education,
    internships: Array.isArray(raw?.internships)
      ? raw.internships
      : defaultPortfolioData.internships,
    certifications: Array.isArray(raw?.certifications)
      ? raw.certifications
      : defaultPortfolioData.certifications,
  };
}

export async function fetchLivePortfolioData() {
  try {
    const res = await fetch("/api/portfolio");
    if (res.ok) {
      const json = await res.json();
      if (json?.data) {
        localStorage.setItem("portfolio_cms_data_karthikeya_v1", JSON.stringify(json.data));
        return mergeWithDefaults(json.data);
      }
    }
  } catch (e) {
    console.error("Live fetch error:", e);
  }

  try {
    const cached = localStorage.getItem("portfolio_cms_data_karthikeya_v1");
    if (cached) return mergeWithDefaults(JSON.parse(cached));
  } catch (e) {
    console.error(e);
  }
  return defaultPortfolioData;
}

export async function saveLivePortfolioData(updatedData) {
  localStorage.setItem("portfolio_cms_data_karthikeya_v1", JSON.stringify(updatedData));

  try {
    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: updatedData }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { ok: false, reason: json?.error || "Server sync failed" };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err.message || "Network error" };
  }
}