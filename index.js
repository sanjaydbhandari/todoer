import fs from "fs";
import { Command } from "commander";
import path from "path";
import chalk from "chalk";

const program = new Command();
const TODOS_FILE = path.join(process.cwd(), "todos.json");

program
  .name("Todoer")
  .description(
    "The todoer CLI command project is user-friendly command-line interface tool designed to manage your todo tasks efficiently. With todoer, you can easily create, read, update, and delete tasks directly from your terminal, streamlining your productivity workflow.",
  )
  .version("0.1.0");

const readTodos = () => {
  if (!fs.existsSync(TODOS_FILE)) return [];

  const data = fs.readFileSync(TODOS_FILE, "utf8");
  return JSON.parse(data);
};

const listTodos = () =>{
    const todos = readTodos();
    if (todos.length === 0) {
      console.log(chalk.yellow("Todo List is empty! Add some todos..."));
    } else {
      todos.forEach((todo, i) => {
        if(!todo.deleted){
            if (todo.status == "Done")
                console.log(chalk.green(`[${chalk.green("✔")} ] ${todo.id} : ${todo.task}`));
            else if(todo.status == "Inprogress")
                console.log(chalk.yellow(`[- ] ${todo.id} : ${todo.task}`));
            else console.log(`[  ] ${todo.id} : ${todo.task}`);
        }        
    });
    }
}

const writeTodo = (todo) => {
  fs.writeFileSync(TODOS_FILE, JSON.stringify(todo));
  return true;
};

program
  .command("add <task>")
  .description("add todos")
  .action((task) => {
    const todos = readTodos();
    const todo = {
      id: todos.length + 1,
      task: task,
      status: "",
      deleted_at: 0
    };
    todos.push(todo);
    if (writeTodo(todos)) console.log(chalk.green(`Added new Task : ${task}`));
    else console.log(chalk.red(`Failed to add Task : ${task}`));      
    listTodos();                          
  });

program
  .command("del <task>")
  .description("Delete todos")
  .action((id) => {
    let todos = readTodos();
    let deleted = false;
    if (id > 0 && id < todos.length) {
      todos.map((todo, todoId) => {
        if (todo.id === Number(id)) {
        //   todos.splice(todoId, 1);
            todo.deleted = true;
            writeTodo(todos);
            deleted=true;
        }
      });
    } 
    if(deleted)console.log(chalk.yellow(`Task Deleted Succussfully`));
    else console.log(chalk.red(`invalid id! todo not found...`));
  });

program
  .option("-l, --list", "list all the todos")
  .description("list all todos")
  .action(() => {
    listTodos()
  });

program.parse(process.argv);
