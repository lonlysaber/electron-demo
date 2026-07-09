export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  mtime: number;
}

export interface WindowState {
  id: number;
  title: string;
  initialPath?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}
