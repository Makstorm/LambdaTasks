import { readFileAsArray } from "./get-files";

export const getNicknamesOccurrences = async (filePaths: string[]) => {
  const nicknameOccurrences = new Map<string, Set<string>>();

  for (const filePath of filePaths) {
    const nicknames = await readFileAsArray(filePath);
    for (const nickname of nicknames) {
      if (!nicknameOccurrences.has(nickname)) {
        nicknameOccurrences.set(nickname, new Set());
      }
      nicknameOccurrences.get(nickname)!.add(filePath);
    }
  }

  return nicknameOccurrences;
};
