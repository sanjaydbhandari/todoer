#!/usr/bin/env node

import fs from "fs";
import { Command } from "commander";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import figlet from "figlet";

const program = new Command();
const TODOS_FILE = path.join(process.cwd(), "todos.json");

program
  .name("Todoer")
  .description(
    "The todoer CLI command project is user-friendly command-line interface tool designed to manage your todo tasks efficiently. With todoer, you can easily create, read, update, and delete tasks directly from your terminal, streamlining your productivity workflow.",
  )
  .version("0.1.0");

// ------------functions---------------------

function padString(str, targetLength) {
  return str.padEnd(targetLength, " ");
}

const readTodos = () => {
  if (!fs.existsSync(TODOS_FILE)) return [];

  const data = fs.readFileSync(TODOS_FILE, "utf8");
  return JSON.parse(data);
};

const removeChalkColor = (color) => {
  return color.replace(/\x1B\[\d+m/g, "");
};

const response = (todo) => {
  let priority =
    todo.priority == "High"
      ? chalk.red("*H*")
      : chalk.blue(todo.priority.substring(0,3));
  if (todo.status == "Completed")
    console.log(
      chalk.green(
        `[ ${priority} ] [${chalk.green("✔")} ] ${todo.id} : ${todo.task}`,
      ),
    );
  else if (todo.status == "InProgress")
    console.log(chalk.yellow(`[ ${priority} ] [--] ${todo.id} : ${todo.task}`));
  else console.log(`[ ${priority} ] [  ] ${todo.id} : ${todo.task}`);
};

const listTodos = () => {
  const todos = readTodos();
  let deleted = false;
  if (todos.length > 0) {
    todos.forEach((todo, i) => {
      if (!todo.deleted) {
        response(todo);
        deleted = true;
      }
    });
  }

  if (!deleted)
    console.log(
      chalk.italic.blueBright("Todo List is empty! Add some todos..."),
    );
};

const writeTodo = (todo) => {
  fs.writeFileSync(TODOS_FILE, JSON.stringify(todo));
  return true;
};

// add todo --------------------------------------------

program
  .command("add")
  .description("add todo")
  .action(() => {
    console.log(chalk.grey("Todo List :"));
    listTodos();
    inquirer
      .prompt([
        {
          type: "input",
          name: "task",
          message: chalk.bold.white("Enter a new Todo :"),
        },
        {
          type: "list",
          name: "priority",
          message: chalk.bold.white("select the task priority :"),
          choices: [
            chalk.red("High"),
            chalk.yellow("Medium"),
            chalk.cyan("low"),
          ],
        },
        {
          type: "list",
          name: "status",
          message: chalk.bold.white("select the task status :"),
          choices: [
            chalk.green("Completed"),
            chalk.blue("InProgress"),
            chalk.white.bold("OnHold"),
          ],
        },
        {
          type: "input",
          name: "deadline",
          message: chalk.bold.white("Enter a task's deadline :"),
        },
      ])
      .then((ans) => {
        const todos = readTodos();
        const todo = {
          id: todos.length + 1,
          task: removeChalkColor(ans.task),
          priority: removeChalkColor(ans.priority),
          status: removeChalkColor(ans.status),
          deadline: ans.deadline,
          created_at: Date.now(),
          updated_at: null,
          deleted: false,
        };

        todos.push(todo);
        if (writeTodo(todos))
          console.log(
            chalk.italic.green(`New Task Added Succussfully : ${todo.task}`),
          );
        else console.log(chalk.red(`Failed to add Task : ${todo.task}`));
        listTodos();
      });
  });

// edit todo ------------------------------------------

program
  .command("ch <id> <task>")
  .description("Shorthand Edit todo using ID")
  .action((id, task) => {
    const todos = readTodos();
    let edited = false;
    todos.map((todo) => {
      if (todo.id == id && todo.deleted == false) {
        (todo.task = task), (todo.updated_at = Date.now());
        edited = true;
      }
    });
    if (edited) {
      writeTodo(todos);
      console.log(chalk.italic.green(`Task Edited Succussfully`));
    } else console.log(chalk.red(`ID ${id} Not Found! Failed to Edit Task`));
    listTodos();
  });

program
  .command("edit")
  .description("edit todo")
  .action(() => {
    console.log(chalk.grey("Todo List :"));
    listTodos();
    inquirer
      .prompt([
        {
          type: "input",
          name: "id",
          message: chalk.bold.white("Enter a Todo ID :"),
        },
        {
          type: "input",
          name: "task",
          message: chalk.bold.white("Enter a new Todo :"),
        },
        {
          type: "list",
          name: "priority",
          message: chalk.bold.white("select the task priority :"),
          choices: [chalk.red("High"), chalk.blue("Medium"), chalk.cyan("low")],
        },
        {
          type: "list",
          name: "status",
          message: chalk.bold.white("select the task status :"),
          choices: [
            chalk.green("Completed"),
            chalk.yellow("InProgress"),
            chalk.white.bold("OnHold"),
          ],
        },
        {
          type: "input",
          name: "deadline",
          message: chalk.bold.white("Enter a task's deadline :"),
        },
      ])
      .then((ans) => {
        const todos = readTodos();
        let edited = false;
        todos.map((todo) => {
          if (todo.id == ans.id && todo.deleted == false) {
            todo.task = removeChalkColor(ans.task);
            todo.priority = removeChalkColor(ans.priority);
            todo.status = removeChalkColor(ans.status);
            todo.deadline = ans.deadline;
            todo.updated_at = Date.now();
            edited = true;
          }
        });
        if (edited) {
          writeTodo(todos);
          console.log(chalk.italic.green(`Task Edited Succussfully`));
        } else
          console.log(chalk.red(`ID ${ans.id} Not Found! Failed to Edit Task`));
        listTodos();
      });
  });

//  delete todo---------------------------------

program
  .command("rm <id>")
  .description("Delete todos by ID")
  .action((id) => {
    let todos = readTodos();
    let deleted = false;
    let deletedTodo;
    if (id > 0 && id <= todos.length) {
      todos.map((todo, todoId) => {
        if (todo.id === Number(id) && todo.deleted == false) {
          deletedTodo = todo;
          todo.deleted = true;
          deleted = true;
        }
      });
      writeTodo(todos);
    }
    if (deleted)
      console.log(
        chalk.italic.green(
          `Task [ ${deletedTodo.id} : ${deletedTodo.task} ] Deleted Succussfully`,
        ),
      );
    else console.log(chalk.italic.red(`invalid id! todo not found...`));
  });

program
  .command("del")
  .description("Delete all todos")
  .action(() => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "confirm",
          message: chalk.bold.white("Are you sure! Do you wnat to delete? :"),
          choices: [chalk.grey("No"), chalk.red("Yes")],
        },
      ])
      .then((ans) => {
        if (ans.confirm == removeChalkColor("Yes")) {
          let todos = readTodos();
          todos.map((todo) => {
            todo.deleted = true;
          });
          writeTodo(todos);
          console.log(chalk.italic.green(`All Task Deleted Succussfully!`));
        } else {
          console.log(chalk.italic.red(`Failed to Deleted All Task!`));
        }
      });
  });

// list todo----------------------------------

program
  .command("ls")
  .description("list all todos")
  .action(() => {
    listTodos();
  });

program
  .command("list")
  .description("list todos using filter")
  .action(() => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "filter",
          message: chalk.bold("Which task want to list?"),
          choices: [
            chalk.green("Completed"),
            chalk.yellow("InProgress"),
            chalk.white.bold("OnHold"),
          ],
        },
      ])
      .then((ans) => {
        let todos = readTodos();
        let deleted = false;
        let status = ans.filter.replace(/\x1B\[\d+m/g, "");
        todos.forEach((todo) => {
          if (!todo.deleted && todo.status == status) {
            response(todo);
            deleted = true;
          }
        });
        if (!deleted)
          console.log(chalk.red("Todo List is empty! Add some todos..."));
      });
  });

program.on("command:*", () => {
  displayHelp();
  console.error(chalk.red("Invalid Command!"));
  process.exit(1);
});

function displayHelp() {
  console.log("\n");
  console.log(chalk.green(figlet.textSync("Todoer")));
  console.log(chalk.grey("Description:"));
  console.log(chalk.white("The todoer CLI command project is user-friendly command-line interface tool designed to manage your todo tasks efficiently. With todoer, you can easily create, read, update, and delete tasks directly from your terminal, streamlining your productivity workflow.\n"));
  console.log(chalk.grey("Options:"));
  console.log(chalk.yellow(padString("-V, --version", 23)) + " Display the version number\n");
  console.log(chalk.grey("Commands:"));
  console.log(chalk.yellow(padString("todoer ls", 23)) + " List all todos");
  console.log(
    chalk.yellow(padString("todoer list", 23)) + " List todo using filter",
  );
  console.log(chalk.yellow(padString("todoer add", 23)) + " Add a new todo");
  console.log(chalk.yellow(padString("todoer edit", 23)) + " Edit todo by ID");
  console.log(
    chalk.yellow(padString("todoer ch <id> <task>", 23)) +
    " ShortHand way to edit todo",
  );
  console.log(
    chalk.yellow(padString("todoer rm <id>", 23)) + " Delete/Remove todo by ID",
  );
  console.log(chalk.yellow(padString("todoer del", 23)) + " Delete all todos");
  
  console.log(chalk.yellow(padString("todoer h", 23)) + " Display the commands");
  console.log(chalk.yellow(padString("todoer help", 23)) + " Display help for command");
}

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('help') || args.includes('h') || args.includes('-h')  || args.length === 0) {
    displayHelp(); // Display the custom help message
    process.exit(0); // Exit after showing the help message
}
program.helpOption(false);
program.parse(process.argv);
