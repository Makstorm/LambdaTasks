export const uniqueValues = async (records: Map<string, Set<string>>) => {
  const uniqueNicknames = new Set<string>();

  records.forEach((files, nickname) => {
    if (files.size === 1) uniqueNicknames.add(nickname);
  });

  return uniqueNicknames.size;
};

export const existInAllFiles = async (records: Map<string, Set<string>>) => {
  const allFilesNicknames = new Set<string>();

  records.forEach((files, nickname) => {
    if (files.size === 20) allFilesNicknames.add(nickname);
  });

  return allFilesNicknames.size;
};

export const existInAtLeastTen = async (records: Map<string, Set<string>>) => {
  const tenFilesNicknames = new Set<string>();

  records.forEach((files, nickname) => {
    if (files.size === 10) tenFilesNicknames.add(nickname);
  });

  return tenFilesNicknames.size;
};
