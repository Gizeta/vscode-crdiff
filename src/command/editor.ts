import * as vscode from 'vscode';
import { getCurrentOpenFile, getSrcSchemaURL } from '../utils';

export function register(context: vscode.ExtensionContext) {
  const disposableCommands = [
    vscode.commands.registerCommand('crdiff.showInSidePanel', async () => {
      try {
        const file = getCurrentOpenFile();
        if (!file) {
          throw new Error('no open file');
        }
        const document = await vscode.workspace.openTextDocument(
          vscode.Uri.parse(getSrcSchemaURL(file))
        );
        vscode.window.showTextDocument(document, {
          viewColumn: vscode.ViewColumn.Beside,
        });
      } catch (e) {
        vscode.window.showErrorMessage((e as Error).message);
      }
    }),
    vscode.commands.registerCommand('crdiff.compareCurrentFile', () => {
      try {
        const file = getCurrentOpenFile();
        if (!file) {
          throw new Error('no open file');
        }
        vscode.commands.executeCommand(
          'vscode.diff',
          vscode.window.activeTextEditor?.document.uri,
          vscode.Uri.parse(getSrcSchemaURL(file))
        );
      } catch (e) {
        vscode.window.showErrorMessage((e as Error).message);
      }
    }),
  ];

  disposableCommands.forEach(cmd => context.subscriptions.push(cmd));
}
