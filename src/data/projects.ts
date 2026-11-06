export type Project = {
  title: string;
  description: string;
  tech: readonly string[];
  image?: string;
  imageAlt: string;
  href: string;
  websiteHref?: string;
};

export const projects: readonly Project[] = [
  {
    title: 'AutoOps: Automated Technical Support Platform with AI Agents',
    description:
      'Incident management platform where LangGraph AI agents triage ticket severity and generate root-cause analyses, streamed in real time. Deployed with hardened Docker containers behind Traefik (HTTPS and HSTS), idempotent Bash server provisioning, and a GitHub Actions CI/CD pipeline with rollback and smoke testing.',
    tech: [
      'LANGGRAPH',
      'TRAEFIK',
      'DOCKER COMPOSE',
      'GITHUB ACTIONS',
      'BASH',
      'LINUX'
    ],
    image: '/images/projects/autoops.png',
    imageAlt: 'AutoOps dashboard showing incident tickets with AI agent triage and real-time reasoning.',
    href: 'https://github.com/Sanchochx/autoOps',
  },
  {
    title: 'GesTrack ERP',
    description:
      'Full-Stack application designed to efficiently manage inventory and clients, featuring a containerized architecture for standardized deployment and secure role-based access.',
    tech: [
      'DOCKER',
      'DOCKER COMPOSE',
      'PYTHON',
      'FLASK',
      'REACT 19',
      'VITE',
      'POSTGRESQL',
      'JWT'
    ],
    image: '/images/projects/gestrack.jpg',
    imageAlt: 'GesTrack ERP dashboard showing inventory and client management.',
    href: 'https://github.com/Sanchochx/GesTrack',
  },
  {
    title: 'HIDROSOLDADURAS ACH SAS - WEBSITE',
    description:
      'Professional industrial landing page for a hydraulic solutions company with a dynamic product catalog, 17 individual technical detail pages generated from a unified JSON data model, and route-based navigation.',
    tech: ['ANGULAR 17+', 'TYPESCRIPT', 'SCSS', 'AOS', 'ANGULAR ANIMATIONS', 'GIT'],
    image: '/images/projects/hidrosoldaduras.png',
    imageAlt:
      'Hidrosoldaduras index page.',
    href: 'https://github.com/Sanchochx/hidrosoldaduras_web',
    websiteHref: 'https://hidrosoldaduras.com',
  },
  {
    title: 'MULTI-MODEL DEBATE ARENA',
    description:
      'Full-stack application with 4 AI models (GPT-4o-mini, DeepSeek-chat, Llama 3.1, Gemini 2.0) that debate in real time on any topic. It allows you to choose models and rounds, receives a verdict from the AI judge, supports Spanish/English.',
    tech: ['NEXT.JS', 'TYPESCRIPT', 'OPENAI API', 'DEEPSEEK API', 'GROQ API', 'OPENROUTER API', 'TAILWIND CSS', 'FRAMER MOTION'],
    image: '/images/projects/debate_arena.png',
    imageAlt:
      'Multimodel arena debate interface showing AI models competing in real-time.',
    href: 'https://github.com/Sanchochx/ai-debate-arena',
  },
  {
    title: 'LINPROG SOLVER',
    description:
      'I developed a calculator that provides an intuitive interface for defining and solving linear programming problems.',
    tech: ['PYTHON', 'FLASK', 'PULP', 'LINEAR PROGRAMMING', 'OPTIMIZATION'],
    image: '/images/projects/linear_programming.jpg',
    imageAlt:
      'Linear programming calculator showing constraints and an optimal solution plot.',
    href: 'https://github.com/Sanchochx/linear-programming-project',
  },
] as const;
