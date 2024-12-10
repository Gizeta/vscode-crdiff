import * as vscode from 'vscode';
import * as command from './command';
import * as provider from './provider';

export function activate(context: vscode.ExtensionContext) {
	command.register(context);
	provider.register(context);
}

export function deactivate() {}
