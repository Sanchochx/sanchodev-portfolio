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
    title: 'GESTRACK ERP',
    description:
      'Full-stack web application designed to help businesses manage inventory, clients, and stock operations efficiently.',
    problem:
      'Small businesses lack centralized tools for managing inventory, invoicing, and clients in one place.',
    techDecision:
      'Chose React 19 + Flask as a decoupled API so each layer can scale and be tested independently.',
    tech: [
      'PYTHON',
      'FLASK',
      'REACT 19',
      'POSTGRESQL',
      'SQLALCHEMY',
      'REST APIS',
      'JWT',
      'VITE',
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
    title: 'SECURE VOTING PROJECT',
    description:
      'Full-stack web application focused on secure user and vote management.',
    problem:
      'Digital voting systems are vulnerable to vote manipulation and lack meaningful auditability.',
    techDecision:
      'Implemented vote hashing and unique per-voter tokens to guarantee integrity without exposing voter identity.',
    tech: ['PYTHON', 'FLASK', 'MYSQL', 'REST API', 'CSS', 'HTML'],
    image: '/images/projects/secure_voting.jpg',
    imageAlt:
      'Secure voting interface with hashed ballots and per-voter token validation.',
    href: 'https://github.com/Sanchochx/final_project_seguridad_dev',
  },
  {
    title: 'WORLD CUP 2026 AI SIMULATOR',
    description:
      'Interactive World Cup simulator with 48 teams, full knockout bracket, and real-time AI-generated tactical match analysis.',
    problem:
      'There was no interactive way to simulate the 2026 World Cup with all 48 teams, the actual bracket, and a tactical analysis with an AI model for each match.',
    techDecision:
      'Web app that simulates group stage, ranks teams using real FIFA rules, and generates AI-powered match analysis in real time via OpenAI API (GPT-4o mini).',
    tech: ['NEXT.JS', 'TYPESCRIPT', 'REACT', 'OPENAI API'],
    image: '/images/projects/wc_simulator.png',
    imageAlt:
      'World cup 2026 AI simulator interface showing team rankings and match analysis.',
    href: 'https://github.com/Sanchochx/world_cup_ai_simulator',
  },
  {
    title: 'LINPROG SOLVER',
    description:
      'For the final project of the Optimization course, I developed a calculator that provides an intuitive interface for defining and solving linear programming problems.',
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
  {
    title: '2D PLATFORMER AI-ASSISTED DEVELOPMENT',
    description:
      'A fully-featured 2D platformer game that demonstrates the power of human-AI collaboration through Claude Code and agile development methodologies.',
    problem:
      'Traditional 2D game development requires designing every asset and physics interaction manually, making iteration slow.',
    techDecision:
      'Used AI-assisted development via Claude Code for level design and user story mapping, cutting prototyping time significantly.',
    tech: [
      'PYTHON',
      'PYGAME',
      'AI-ASSISTED DEVELOPMENT',
      'AGILE METHODOLOGIES',
      'USER STORY MAPPING',
    ],
    image: '/images/projects/coffee_bros.jpg',
    imageAlt:
      'Coffee Bros 2D platformer gameplay scene with pixel-art characters.',
    href: 'https://github.com/Sanchochx/coffee_bros',
  },
] as const;
