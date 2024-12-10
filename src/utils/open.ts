import { exec, ExecException } from 'node:child_process';
import os from 'node:os';

export async function open(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const execCallback = (e: ExecException | null, _stdout: string, _stderr: string) => {
      if (e) {
        reject(e);
        return;
      }
      resolve();
    };
    switch (os.platform()) {
      case 'win32':
        exec(`start "${url}"`, execCallback);
        break;
      case 'linux':
        exec(`xdg-open "${url}"`, execCallback);
        break;
      case 'darwin':
        exec(`open ${url}`, execCallback);
        break;
      default:
        console.error('unsupported platform');
    }
  });
}
