import * as vscode from 'vscode';
import { getDownloadURL, download } from '../utils';

export class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
  public async provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Promise<string> {
    return await download(getDownloadURL(uri.path.slice(1), uri.authority));
  }
}
