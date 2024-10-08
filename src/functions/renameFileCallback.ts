import path from 'path';
import fs from 'fs';

export function renameFile(
    oldFilePath: string,
    newFileName: string,
    extension: string,
    callback: (error: Error | null, newFileName?: string) => void
  ) {
    const oldFileName = path.basename(oldFilePath);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const randomPrefix = Math.random().toString(36).substring(2, 8); // Genera un prefijo aleatorio de 6 caracteres
    const finalFileName = randomPrefix + '-' + newFileName + '-' + uniqueSuffix + "." + extension;
    const newFilePath = path.join(path.dirname(oldFilePath), finalFileName);
  
    fs.rename(oldFilePath, newFilePath, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, finalFileName);
      }
    });
  }