import { ipcRenderer } from 'electron';
import type { FileItem } from '../types';

export function useFileSystem() {
  const readDirectory = async (dirPath: string): Promise<FileItem[]> => {
    return ipcRenderer.invoke('fs/readDirectory', dirPath);
  };

  const getRootDirectories = async (): Promise<FileItem[]> => {
    return ipcRenderer.invoke('fs/getRootDirectories');
  };

  const getDesktopPath = async (): Promise<string> => {
    return ipcRenderer.invoke('fs/getDesktopPath');
  };

  const getHomePath = async (): Promise<string> => {
    return ipcRenderer.invoke('fs/getHomePath');
  };

  const getPlatform = async (): Promise<string> => {
    return ipcRenderer.invoke('fs/getPlatform');
  };

  const openFile = async (filePath: string): Promise<string> => {
    return ipcRenderer.invoke('fs/openFile', filePath);
  };

  const formatFileSize = (size: number): string => {
    if (size === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + units[i];
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileExtension = (filename: string): string => {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex === -1 ? '' : filename.slice(lastDotIndex + 1).toLowerCase();
  };

  return {
    readDirectory,
    getRootDirectories,
    getDesktopPath,
    getHomePath,
    getPlatform,
    openFile,
    formatFileSize,
    formatDate,
    getFileExtension,
  };
}
