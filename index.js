import fs, { stat } from "fs";
import { Command } from "commander";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer"
import { type } from "os";

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

const removeChalkColor=(color)=>{
  return color.replace(/\x1B\[\d+m/g,"")
}

const response = (todo) =>{
    if (todo.status == "Completed")
      console.log(chalk.green(`[${chalk.green("✔")} ] ${todo.id} : ${todo.task}`));
    else if(todo.status == "InProgress")
        console.log(chalk.yellow(`[--] ${todo.id} : ${todo.task}`));
    else console.log(`[  ] ${todo.id} : ${todo.task}`);
}

const listTodos = () =>{
    const todos = readTodos();
    let deleted = false;
    todos.forEach((todo, i) => {
      if(!todo.deleted){
          response(todo);
          deleted=true;
      }        
    });
    if(!deleted) console.log(chalk.yellow("Todo List is empty! Add some todos..."));    
}

const editTodos = (id, task) => {
  const todos = readTodos();
  let editTodo = todos.find((todo)=> todos.id = id);
  if(editTodo){
    editTodo.task = task;
    console.log(`Todo [ ${id} : ${task} ] edited succussfully`)
  }
  else console.log(`Failed to edit Task! id ${id} not found`)
}

const writeTodo = (todo) => {
  fs.writeFileSync(TODOS_FILE, JSON.stringify(todo));
  return true;
};

program
  .command("add")
  .description("add todos")
  .action(() => {
    console.log(chalk.grey('Todo List :'))
    listTodos();
    inquirer.prompt([
      {        
        type: "input",
        name : "todo",
        message : chalk.bold.white("Enter a new Todo :")
      },
      {
        type: "list",
        name: "priority",
        message: chalk.bold.white("select the task priority :"),
        choices:[
          chalk.red("High"),
          chalk.hex('#b100cd')("Medium"),
          chalk.hex('#4c00b0')("low"),
        ]
      },
      {
        type: "list",
        name: "status",
        message: chalk.bold.white("select the task status :"),
        choices:[
          chalk.green("Completed"),
          chalk.yellow("InProgress"),
          chalk.bold("OnHold"),
        ]
      },
      {        
        type: "input",
        name : "deadline",
        message : chalk.bold.white("Enter a task's deadline :")
      }
    ]) 
    .then((ans)=>{
      const todos = readTodos();
      const todo = {
        id: todos.length + 1,
        task: removeChalkColor(ans.task),
        priority: removeChalkColor(ans.priority),
        status: ans.status,
        deadline: ans.deadline,
        created_at: Date.now(),
        updated_at: null,
      };

      console.log(todo);
    // todos.push(todo);
    // if (writeTodo(todos)) console.log(chalk.green(`Added new Task : ${task}`));
    // else console.log(chalk.red(`Failed to add Task : ${task}`));      
    // listTodos();
    })                        
  });


// program
//   .command("add <task>")
//   .description("add todos")
//   .action((task) => {
//     const todos = readTodos();
//     const todo = {
//       id: todos.length + 1,
//       task: task,
//       status: "",
//       deleted_at: 0
//     };
//     todos.push(todo);
//     if (writeTodo(todos)) console.log(chalk.green(`Added new Task : ${task}`));
//     else console.log(chalk.red(`Failed to add Task : ${task}`));      
//     listTodos();                          
//   });

program
  .command("del <id>")
  .description("Delete todos")
  .action((id) => {
    let todos = readTodos();
    let deleted = false;
    let deletedTodo ;
    if (id > 0 && id <= todos.length) {
      console.log(todos)
      todos.map((todo, todoId) => {
        if (todo.id === Number(id)) {
            deletedTodo=todo;
            todo.deleted = true;
            deleted=true;
          }
        });
        writeTodo(todos);
    } 
    if(deleted)console.log(chalk.green(`Task [ ${deletedTodo.id} : ${deletedTodo.task} ] Deleted Succussfully`));
    else console.log(chalk.red(`invalid id! todo not found...`));
  });

  program
  .command("DEL")
  .description("Delete all todos")
  .action(() => {
    let todos = readTodos();
    todos.map((todo) => {
      todo.deleted = true;
    }
  );
  writeTodo(todos);
  console.log(chalk.green(`All Task Deleted Succussfully!`));
});

program
  .command("ls")
  .description("list all todos")
  .action(() => {
      listTodos()
  });

program
  .command("list")
  .description("list all todos")
  .action(() => {
      inquirer.prompt([{
        type: "list",
        name: "filter",
        message: chalk.yellow("Which task want to list?"),
        choices:[
          chalk.green("Completed"),
          chalk.yellow("InProgress"),
          chalk.bold("OnHold"),
        ]
      }])
      .then((ans)=>{
        let todos = readTodos();
        let deleted = false;
        let status = ans.filter.replace(/\x1B\[\d+m/g,"")
        todos.forEach((todo) => {
          if(!todo.deleted && todo.status == status){
              response(todo);
              deleted=true;
          }        
        });
        if(!deleted) console.log(chalk.red("Todo List is empty! Add some todos..."));    
      })

  });

program
.command("edit <id> <task>")
  .description("list all todos")
  .action((id,task ) => {
    editTodos(id,task)
  });
  

program.parse(process.argv);
