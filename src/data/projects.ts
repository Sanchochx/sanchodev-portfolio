// Proyectos sincronizados desde demo_portfolio/app.py (PROJECTS array).
// Para añadir imágenes: colocar archivo en public/images/projects/{slug}.png
// y agregar `image: '/images/projects/{slug}.png'` a la entrada correspondiente.

export type Project = {
  title: string;
  description: string;
  problem: string;
  techDecision: string;
  tech: readonly string[];
  image?: string;
  imageAlt: string;
  href: string;
};

export const projects: readonly Project[] = [
  {
    title: 'GESTRACK_ERP',
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
    title: 'SECURE_VOTING',
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
    title: 'COFFEE_BROS',
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
  {
    title: 'LINPROG_SOLVER',
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
] as const;
