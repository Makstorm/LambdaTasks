import * as path from "path";
import * as fs from "fs";

export const getFilePathArray = async (dirPath: string) => {
  const filePaths: string[] = [];
  const files = await fs.promises.readdir(dirPath, { encoding: "utf-8" });

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      filePaths.push(filePath);
    }
  });

  return filePaths;
};

export const readFileAsArray = async (filePath: string): Promise<string[]> => {
  return new Promise<string[]>((resolve, reject) => {
    const stream: fs.ReadStream = fs.createReadStream(filePath, {
      encoding: "utf8",
    });
    const lines: string[] = [];

    stream.on("data", (chunk: string) => {
      const chunkLines = chunk.split("\n");
      if (chunkLines[chunkLines.length - 1] === "") {
        chunkLines.pop();
      }
      lines.push(...chunkLines);
    });

    stream.on("error", (err) => {
      reject(err);
    });

    stream.on("end", () => {
      resolve(lines);
    });
  });
};
