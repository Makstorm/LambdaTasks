import * as path from "path";
import {
  existInAllFiles,
  existInAtLeastTen,
  getFilePathArray,
  getNicknamesOccurrences,
  uniqueValues,
} from "./utils";

const app = async () => {
  const dirPath = path.join(__dirname, "data", "2kk_words_400x400"); // Для тустування на повному наборі даних необхідно замінити на 2kk_words_400x400
  const pathsArray = await getFilePathArray(dirPath);

  console.time("startMeasureAll");
  const records = await getNicknamesOccurrences(pathsArray);

  console.log("Number of unique names:", await uniqueValues(records));
  console.log(
    "Number of names that exists in all files",
    await existInAllFiles(records)
  );
  console.log(
    "Number of names that exists in 10 files",
    await existInAtLeastTen(records)
  );

  console.timeEnd("startMeasureAll");
};

app();
