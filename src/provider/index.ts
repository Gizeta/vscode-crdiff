import * as vscode from 'vscode';
import { TextDocumentContentProvider } from './document';

export function register(context: vscode.ExtensionContext) {
  const provider = new TextDocumentContentProvider();
  const registration = vscode.workspace.registerTextDocumentContentProvider('crdiff-src', provider);
  context.subscriptions.push(registration);
}
