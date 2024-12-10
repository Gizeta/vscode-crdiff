import * as vscode from 'vscode';
import { relative } from 'node:path';

export function getCurrentOpenFile(): string | null {
  const currentFilePath = vscode.window.activeTextEditor?.document.uri.fsPath;
  const projectPath = vscode.workspace.workspaceFolders?.at(0)?.uri.fsPath;
  let relativePath = null;
  if (currentFilePath && projectPath) {
    relativePath = relative(projectPath, currentFilePath);
  }
  return relativePath;
}
