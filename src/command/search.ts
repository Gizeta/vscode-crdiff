import * as vscode from 'vscode';
import { search } from '../service/codesearch';
import { SearchResult, SearchResultProvider } from '../provider/searchResult';

export function register(context: vscode.ExtensionContext) {
  const searchResultProvider = new SearchResultProvider();
  const disposableCommands = [
    vscode.commands.registerCommand('crdiff.search', async () => {
      try {
        vscode.window.createTreeView('crdiff-search-result', {
          treeDataProvider: searchResultProvider,
        });
        const keyword = await vscode.window.showInputBox({
          placeHolder: 'search keyword',
          value: vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection),
        });
        if (!keyword) {
          throw new Error('empty keyword');
        }
        const results = await search(keyword);
        const items = results.data.filter(x => !!x).map(x => new SearchResult(
          x.path.split('/').reverse()[0],
          x.path,
          'FILE',
          x.lines.map(y => new SearchResult(
            {
              label: y.text,
              highlights: y.highlights
            },
            '',
          )),
        ));
        searchResultProvider.setItems(items);
        vscode.commands.executeCommand('crdiff-search-result.focus');
      } catch (e) {
        vscode.window.showErrorMessage((e as Error).message);
      }
    }),
  ];

  disposableCommands.forEach(cmd => context.subscriptions.push(cmd));
}
