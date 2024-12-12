import { request } from './gapi';

interface CodeSearchResult {
  data: Array<{
    repo: string;
    ref: string;
    path: string;
    lines: {
      text: string;
      highlights: [number, number][];
    }[];
  } | null>;
}

const MAX_RESULT_COUNT = 500;

export async function search(keyword: string): Promise<CodeSearchResult> {
  const result: CodeSearchResult = {
    data: [],
  };
  let pageToken = '';
  do {
    const searchData = {
      queryString: keyword,
      searchOptions: {
        enableDiagnostics: false,
        exhaustive: false,
        numberOfContextLines: 1,
        pageSize: 100,
        pageToken,
        pathPrefix: '',
        repositoryScope: {
          root: {
            ossProject: 'chromium',
          },
        },
        retrieveMultibranchResults: true,
        savedQuery: '',
        scoringModel: '',
        showPersonalizedResults: false,
        suppressGitLegacyResults: false,
      },
      snippetOptions: {
        minSnippetLinesPerFile: 10,
        minSnippetLinesPerPage: 60,
        numberOfContextLines: 1,
      },
    };
    const resp = await request({
      host: 'https://source.chromium.org/',
      path: '/v1/contents/search?alt=json&key=AIzaSyCqPSptx9mClE5NU4cpfzr6cgdO_phV1lM',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchData),
    });
    const data = JSON.parse(resp);
    pageToken = data.nextPageToken;
    for (const item of data.searchResults) {
      if (item.fileSearchResult) {
        result.data.push({
          repo: item.fileSearchResult.fileSpec.sourceRoot.repositoryKey.repositoryName,
          ref: item.fileSearchResult.fileSpec.sourceRoot.refSpec,
          path: item.fileSearchResult.fileSpec.path,
          lines: item.fileSearchResult.snippets ? item.fileSearchResult.snippets.map((x: any) => {
            return x.snippetLines.map((y: any) => {
              if (y.lineText) {
                const i = y.lineText.toUpperCase().indexOf(keyword.toUpperCase());
                if (i <= 0) {
                  return undefined;
                }
                return {
                  text: y.lineText,
                  highlights: [[i, i + keyword.length]],
                };
              }
              return undefined;
            }).filter((y: string | undefined) => !!y);
          }).flat(Infinity) : [],
        });
      } else {
        result.data.push(null);
      }
    }
    if (result.data.length >= MAX_RESULT_COUNT) {
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  while (pageToken);
  return result;
}