import { takeSurvey } from "../utils/take-survey.js";
import * as path from "path";
import * as fs from "fs";
import { uploadFile } from "../utils/drive-api.js";
import { makeShortenLink } from "../utils/shorten-link.js";

export const entryCall = async () => {
  const { filePath } = await takeSurvey<{ filePath: string }>([
    {
      type: "input",
      name: "filePath",
      message:
        "Drag and drop your image file to terminal and press Enter to upload:",
      filter: (input) => input.trim().replace(/^['"]+|['"]+$/g, ""),
      validate: (input) => {
        const filePath = input.trim().replace(/^['"]+|['"]+$/g, "");
        return (
          fs.existsSync(filePath) ||
          "File does not exist. Please enter a valid file path."
        );
      },
    },
  ]);

  console.log(`Path to file: ${filePath}`);
  console.log(`Filename: ${path.basename(filePath)}`);
  console.log(`File extention ${path.extname(filePath).slice(1)}`);

  const newBasename = await changeName(path.basename(filePath));

  let fileLink: string;

  if (!newBasename) {
    console.log("Name keeps same");
    fileLink = await uploadFile(filePath);
  } else {
    console.log({ newFileName: newBasename }, "\n");
    fileLink = await uploadFile(filePath, newBasename);
  }

  console.log("Successfully deployed!!!");

  const shortenLink = await shoterLink(fileLink);

  if (!shortenLink) {
    console.log(`Your base link: ${fileLink}`);
    return;
  } else {
    console.log(`Your short link is: ${shortenLink}`);
  }
};

const changeName = async (basename: string) => {
  const { changeoption } = await takeSurvey<{ changeoption: boolean }>([
    {
      type: "expand",
      message: `You uploading the file with name: ${basename} \nWould you like to change it?`,
      name: "changeoption",
      choices: [
        {
          key: "Y",
          name: "Yes",
          value: true,
        },
        {
          key: "N",
          name: "No",
          value: false,
        },
      ],
    },
  ]);

  if (!changeoption) {
    return undefined;
  }

  const { newBasename } = await takeSurvey<{ newBasename: string }>([
    {
      type: "input",
      name: "newBasename",
      message: "Enter new filename (WITHOUT extentions aka .jpg, .png, etc.):",
      filter: (input) => input.trim(),
    },
  ]);

  return newBasename;
};

const shoterLink = async (link: string) => {
  const { changeoption } = await takeSurvey<{ changeoption: boolean }>([
    {
      type: "expand",
      message: `Woud you like to shorten your link?`,
      name: "changeoption",
      choices: [
        {
          key: "Y",
          name: "Yes",
          value: true,
        },
        {
          key: "N",
          name: "No",
          value: false,
        },
      ],
    },
  ]);

  if (!changeoption) {
    return undefined;
  }

  const newSortenLink = await makeShortenLink(link);

  return newSortenLink;
};
