'use strict';
const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB'];

export const formatFileSize = (fileSize: any) => {
  if (typeof(fileSize) === 'string' && (fileSize.indexOf('K') > -1 || fileSize.indexOf('M') > -1)) {
    return fileSize;
  }
  let i = 0;
  while (fileSize > 99) {
    fileSize = fileSize / 1024;
    i++;
  }
  return Math.max(fileSize, 0.1).toFixed(1) + units[i];
};
