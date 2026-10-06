export type Project = {
  title: string;
  description: string;
  problem: string;
  techDecision: string;
  tech: readonly string[];
  image?: string;
  imageAlt: string;
  href: string;
  websiteHref?: string;
};

export const projects: readonly Project[] = [
  {
    title: 'GesTrack ERP',
    description:
      'Cloud-Native Full-Stack application designed to efficiently manage inventory and clients, featuring a containerized architecture for standardized deployment and secure role-based access.',
    problem:
      'Businesses need centralized management tools, while traditional setups create deployment bottlenecks and local environment inconsistencies ("it works on my machine" problem).',
    techDecision:
      'Built a decoupled architecture (Vite/React + Flask) and containerized all microservices using Docker Compose, establishing isolated internal networks and Linux volume mapping for hot-reloading.',
    tech: [
      'DOCKER',
      'DOCKER COMPOSE',
      'LINUX',
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
    problem:
      'The company lacked a digital presence to showcase their product catalog and technical specifications to potential clients, relying solely on physical brochures and WhatsApp for commercial outreach.',
    techDecision:
      'Built with Angular 17+ standalone components and SCSS to ensure a maintainable, modular codebase. Product data was extracted from 17 PDF technical sheets into a unified productos.json, enabling a single reusable detail component to serve all catalog entries dynamically.',
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
    problem:
      'Evaluating multiple AI models in real-time conversational tasks is complex; existing chatbots only use one model, limiting comparison of reasoning styles and performance.',
    techDecision:
      'Built a Next.js orchestration layer that unifies OpenAI, DeepSeek, Groq, and OpenRouter (Gemini) APIs, with turn-based debate flow, language detection, and AI judge for automated scoring.',
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
    problem:
      'Solving linear programming problems manually is error-prone and time-consuming in academic and engineering contexts.',
    techDecision:
      'Integrated PuLP as the open-source solver with a Flask interface that accepts constraints dynamically from the user.',
    tech: ['PYTHON', 'FLASK', 'PULP', 'LINEAR PROGRAMMING', 'OPTIMIZATION'],
    image: '/images/projects/linear_programming.jpg',
    imageAlt:
      'Linear programming calculator showing constraints and an optimal solution plot.',
    href: 'https://github.com/Sanchochx/linear-programming-project',
  },
] as const;
