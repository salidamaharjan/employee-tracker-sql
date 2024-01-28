// importing inquirer
const inquirer = require("inquirer");

/**
 * function created to display question and get the user choice
 */
async function displayQuestion() {
// using object destructuring to extract user choice
 const { choices } = await inquirer.prompt([
    {
      name: "choices",
      type: "list",
      message: "What do you want to do?",
      choices: ["Add a Department", "View all department"],
    }
  ]);
}

displayQuestion();
