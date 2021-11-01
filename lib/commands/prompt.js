import inquirer from "inquirer";
import { merge } from "./merge.js";
import { questions } from "./Questions.js";

export function prompt() {
  inquirer.prompt(questions).then((answers) => {
    const options = {
      sequence: answers.sequence ? "-s" : "",
      filename: answers.filename,
      conversion: answers.delGLTFConversion ? "-dc" : "",
    };
    console.log(options);
    merge(answers.fileType, answers.useCWDIn, answers.useCWDOut, options).then(
      (r) => console.log("Complete.")
    );
  });
}
