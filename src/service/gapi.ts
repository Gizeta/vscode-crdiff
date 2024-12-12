interface GAPIPostParams {
  host: string;
  path: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: string;
}

export async function request(params: GAPIPostParams): Promise<string> {
  const batchId = `batch${Math.random() * 1e18}`;
  const response = await fetch(`https://grimoireoss-pa.clients6.google.com/batch?$ct=multipart/mixed; boundary=${batchId}`, {
    method: 'POST',
    body: [
      `--${batchId}`,
      'Content-Type: application/http',
      `Content-ID: <${batchId}+gapiRequest@googleapis.com>`,
      '',
      `${params.method} ${params.path}`,
      ...Object.entries(params.headers || {}).map(([k, v]) =>`${k}: ${v}`),
      params.body ? `\r\n${params.body}` : '',
      `--${batchId}--`
    ].join('\r\n'),
    headers: {
      Referer: params.host,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to send google api. Status: ${response.status}`);
  }
  const text = await response.text();
  const result: string[] = [];
  let boundaryFlag = '';
  let headerSectionFlag = false;
  let contentSectionFlag = false;
  for (const line of text.split(/\r\n/)) {
    if (!boundaryFlag) {
      if (line.match(/^--batch_/)) {
        boundaryFlag = line;
      }
      continue;
    }
    if (line === `${boundaryFlag}--`) {
      if (contentSectionFlag) {
        return result.join('\n');
      }
      throw new Error('Unknown response format.');
    }
    if (line.match(/^HTTP\/1\.1 \d+ /)) {
      const code = line.match(/^HTTP\/1\.1 (\d+) /)?.[1];
      if (code !== '200') {
        throw new Error(`Failed to request google api. Status: ${code}`);
      }
      headerSectionFlag = true;
      continue;
    }
    if (headerSectionFlag) {
      if (line.length === 0) {
        headerSectionFlag = false;
        contentSectionFlag = true;
      }
    } else if (contentSectionFlag) {
      result.push(line);
    }
  }
  throw new Error('Unknown error.');
}
