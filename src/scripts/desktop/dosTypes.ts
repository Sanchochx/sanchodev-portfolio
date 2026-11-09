export interface DosCommandInterface { exit(): Promise<void>; }
export interface DosFs { extract(url: string): Promise<void>; }
export type DosMain = (args: string[]) => Promise<DosCommandInterface>;
export interface DosBoot { ready(cb: (fs: DosFs, main: DosMain) => void): void; }
export type DosFactory = (canvas: HTMLCanvasElement, opts: { wdosboxUrl: string }) => DosBoot;
