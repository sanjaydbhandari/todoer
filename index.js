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

  // ------------functions---------------------

const readTodos = () => {
  if (!fs.existsSync(TODOS_FILE)) return [];

  const data = fs.readFileSync(TODOS_FILE, "utf8");
  return JSON.parse(data);
};

const removeChalkColor=(color)=>{
  return color.replace(/\x1B\[\d+m/g,"")
}

const response = (todo) =>{
    let priority = todo.priority=="High"?chalk.red(todo.priority):chalk.blue(todo.priority);
    if (todo.status == "Completed")
      console.log(chalk.green(`[ ${priority} ] [${chalk.green("✔")} ] ${todo.id} : ${todo.task}`));
    else if(todo.status == "InProgress")
        console.log(chalk.yellow(`[ ${priority} ] [--] ${todo.id} : ${todo.task}`));
    else console.log(`[ ${priority} ] [  ] ${todo.id} : ${todo.task}\n`);
}

const listTodos = () =>{
    const todos = readTodos();
    let deleted = false;
    if(todos.length>0){
      todos.forEach((todo, i) => {
        if(!todo.deleted){
            response(todo);
            deleted=true;
        }        
      });
    }
    
    if(!deleted) console.log(chalk.italic.blueBright("Todo List is empty! Add some todos...")); 
}

const writeTodo = (todo) => {
  fs.writeFileSync(TODOS_FILE, JSON.stringify(todo));
  return true;
};

// add todo --------------------------------------------
program
  .command("add")
  .description("add todos")
  .action(() => {
    console.log(chalk.grey('Todo List :'))
    listTodos();
    inquirer.prompt([
      {        
        type: "input",
        name : "task",
        message : chalk.bold.white("Enter a new Todo :")
      },
      {
        type: "list",
        name: "priority",
        message: chalk.bold.white("select the task priority :"),
        choices:[
          chalk.red("High"),
          chalk.yellow("Medium"),
          chalk.cyan("low"),
        ]
      },
      {
        type: "list",
        name: "status",
        message: chalk.bold.white("select the task status :"),
        choices:[
          chalk.green("Completed"),
          chalk.blue("InProgress"),
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
        status: removeChalkColor(ans.status),
        deadline: ans.deadline,
        created_at: Date.now(),
        updated_at: null,
        deleted: false
      };

      todos.push(todo);
      if (writeTodo(todos)) console.log(chalk.italic.green(`New Task Added Succussfully : ${todo.task}`));
      else console.log(chalk.red(`Failed to add Task : ${todo.task}`));      
      listTodos();
    })                        
  });

  // edit todo ------------------------------------------

  program
.command("edit <id> <task>")
  .description("list all todos")
  .action((id,task ) => {
    const todos = readTodos();
    let edited = false;
    todos.map((todo)=>{
      if(todo.id==id && todo.deleted == false){
        todo.task= task,
        todo.updated_at= Date.now()
        edited=true;
      }
    });
    if (edited) {writeTodo(todos);console.log(chalk.italic.green(`Task Edited Succussfully`));}
    else console.log(chalk.red(`ID ${id} Not Found! Failed to Edit Task` ));      
    listTodos();
  });

  program
  .command("ch")
  .description("edit todo")
  .action(() => {
    console.log(chalk.grey('Todo List :'))
    listTodos();
    inquirer.prompt([
      {        
        type: "input",
        name : "id",
        message : chalk.bold.white("Enter a Todo ID :")
      },
      {        
        type: "input",
        name : "task",
        message : chalk.bold.white("Enter a new Todo :")
      },
      {
        type: "list",
        name: "priority",
        message: chalk.bold.white("select the task priority :"),
        choices:[
          chalk.red("High"),
          chalk.blue("Medium"),
          chalk.cyan("low"),
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
      let edited = false;
      todos.map((todo)=>{
        if(todo.id==ans.id && todo.deleted == false){
          todo.task= removeChalkColor(ans.task)
          todo.priority= removeChalkColor(ans.priority)
          todo.status= removeChalkColor(ans.status)
          todo.deadline= ans.deadline
          todo.updated_at= Date.now()
          edited=true;
        }
      });
      if (edited) {writeTodo(todos);console.log(chalk.italic.green(`Task Edited Succussfully`));}
      else console.log(chalk.red(`ID ${ans.id} Not Found! Failed to Edit Task` ));      
      listTodos();
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

//  delete todo---------------------------------
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
    if(deleted)console.log(chalk.italic.green(`Task [ ${deletedTodo.id} : ${deletedTodo.task} ] Deleted Succussfully`));
    else console.log(chalk.italic.red(`invalid id! todo not found...`));
  });

  program
  .command("DEL")
  .description("Delete all todos")
  .action(() => {
    inquirer.prompt([
      {
        type: "list",
        name: "confirm",
        message: chalk.bold.white("Are you sure! Do you wnat to delete? :"),
        choices:[
          chalk.grey("No"),
          chalk.red("Yes"),
        ]
      }
    ])
    .then((ans)=>{
      if(ans.confirm == removeChalkColor("Yes")){
        let todos = readTodos();
        todos.map((todo) => {
          todo.deleted = true;
        })
        writeTodo(todos);
        console.log(chalk.italic.green(`All Task Deleted Succussfully!`));
      }else{
        console.log(chalk.italic.red(`Failed to Deleted All Task!`));
      }
    })

});

// list todo----------------------------------

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
        message: chalk.bold("Which task want to list?"),
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

program.parse(process.argv);
