import * as vscode from 'vscode';

export function getConfig(key: string) {
  const configuration = vscode.workspace.getConfiguration('crdiff');
  return configuration[key];
}
