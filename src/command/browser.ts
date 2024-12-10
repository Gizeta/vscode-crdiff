import * as vscode from 'vscode';
import { getCurrentOpenFile, getSourcePageURL, open } from '../utils';

export function register(context: vscode.ExtensionContext) {
  const disposableCommands = [
    vscode.commands.registerCommand('crdiff.openInSystemBrowser', () => {
      try {
        const file = getCurrentOpenFile();
        if (!file) {
          vscode.window.showErrorMessage('no open file');
          return;
        }
        open(getSourcePageURL(file));
      } catch (e) {
        vscode.window.showErrorMessage((e as Error).message);
      }
    }),
  ];

  disposableCommands.forEach(cmd => context.subscriptions.push(cmd));
}
