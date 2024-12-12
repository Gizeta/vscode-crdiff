import * as vscode from 'vscode';

export class SearchResult extends vscode.TreeItem {
  constructor(
    public readonly label: string | vscode.TreeItemLabel,
    public readonly filename: string,
    public readonly type: 'FILE' | 'LINE' = 'LINE',
    public readonly children: SearchResult[] = []
  ) {
    super(label);
    this.description = `${this.filename}`;
    this.collapsibleState = type === 'FILE'
      ? vscode.TreeItemCollapsibleState.Collapsed
      : vscode.TreeItemCollapsibleState.None;
  }
}

export class SearchResultProvider implements vscode.TreeDataProvider<SearchResult> {
  private _onDidChangeTreeData: vscode.EventEmitter<SearchResult | undefined | null | void> = new vscode.EventEmitter<SearchResult | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<SearchResult | undefined | null | void> = this._onDidChangeTreeData.event;

  private items: SearchResult[] = [];

  public getChildren(element?: SearchResult | undefined): vscode.ProviderResult<SearchResult[]> {
    if (element) {
      return element.children;
    }
    return this.items;
  }

  public getTreeItem(element: SearchResult): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  public async setItems(items: SearchResult[]) {
    this.items = items;
    this._onDidChangeTreeData.fire();
  }
}
