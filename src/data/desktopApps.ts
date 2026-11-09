export interface DesktopIconData {
  id: string;
  label: string;
  icon: string;
  alt: string;
  href?: string;
}

// Un arreglo anidado es una fila de iconos lado a lado; un objeto suelto va en su propia columna
export const desktopIcons: Array<DesktopIconData | DesktopIconData[]> = [
  [
    { id: 'portfolio-icon', label: 'My Portfolio', icon: '/images/brand/sanchodev_logo.png', alt: 'My Portfolio', href: '/portfolio' },
    { id: 'notepad-icon', label: 'About Me', icon: '/images/icons/notepad_icon.png', alt: 'Notepad' },
  ],
  [
    { id: 'pactasis-icon', label: 'P.A.C.T.A.S.I.S', icon: '/images/icons/pactasis_icon.png', alt: 'P.A.C.T.A.S.I.S' },
    { id: 'paint-icon', label: 'MS PAINT', icon: '/images/icons/paint_icon.png', alt: 'MS Paint' },
  ],
  [
    { id: 'cine-icon', label: 'Cinema', icon: '/images/icons/movies_icon.png', alt: 'Cinema' },
    { id: 'ascii-icon', label: 'ASCII', icon: '/images/icons/ascii_logo.png', alt: 'ASCII' },
  ],
  { id: 'games-icon', label: 'Videogames', icon: '/images/icons/videogame_icon.png', alt: 'Videogames' },
  { id: 'pinball-icon', label: '3D Pinball', icon: '/images/icons/pinball_icon.png', alt: '3D Pinball' },
  { id: 'doom-icon', label: 'DOOM', icon: '/images/icons/doom_icon.png', alt: 'DOOM' },
  { id: 'wolf-icon', label: 'Wolfenstein 3D', icon: '/images/icons/wolf_icon.png', alt: 'Wolfenstein 3D' },
  { id: 'chaos-icon', label: 'Chaos Faction 2', icon: '/images/icons/chaos_faction_icon.png', alt: 'Chaos Faction 2' },
];
