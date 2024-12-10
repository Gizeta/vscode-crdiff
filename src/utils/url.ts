import { getConfig } from './config';

export function getSrcSchemaURL(file: string, branch?: string) {
  return `crdiff-src://${branch || getConfig('branch')}/${file}`;
}

export function getDownloadURL(file: string, branch?: string) {
  return `http://chromium.googlesource.com/chromium/src/+/${branch || getConfig('branch')}/${file}?format=TEXT`;
}

export function getSourcePageURL(file: string, branch?: string) {
  return `https://source.chromium.org/chromium/chromium/src/+/${branch || getConfig('branch')}:${file}`;
}
