export async function download(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file. Status: ${response.status}`);
  }
  const text = await response.text();
  return atob(text);
}
