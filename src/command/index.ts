import * as vscode from 'vscode';
import * as browserCommands from './browser';
import * as editorCommands from './editor';
import * as searchCommands from './search';

export function register(context: vscode.ExtensionContext) {
  browserCommands.register(context);
  editorCommands.register(context);
  searchCommands.register(context);
}
