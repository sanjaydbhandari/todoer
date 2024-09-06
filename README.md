# Todoer
The todoer CLI command project is user-friendly command-line interface tool designed to manage your todo tasks efficiently. With todoer, you can easily create, read, update, and delete tasks directly from your terminal, streamlining your productivity workflow.

## Installation
To install Todoer, run the following command:

```bash
npm install -g todoer
```
 
### License

This project is licensed under the MIT License.

<br>


### **Usage: todoer [options] [command]**
* * * * *
-   **Usage** defines how the user should run the CLI tool.
    -   `Todoer`: This is the name of the CLI tool.
    -   `[options]`: These are optional flags or options the user can provide (like `--version`, `--help`, etc.).
    -   `[command]`: These are the commands that perform specific actions (like `add`, `edit`, `rm` ,`del`,`list`).

### 2\. **Description of the Tool**

-   This section gives an overview of the tool's purpose. In this case:

    > The todoer CLI command project is a user-friendly command-line interface tool designed to manage your todo tasks efficiently. With todoer, you can easily create, read, update, and delete tasks directly from your terminal, streamlining your productivity workflow.

    The description summarizes the functionality and objective of the CLI tool (i.e., managing tasks efficiently).

### 3\. **Options**

-   **Options** are flags that modify the behavior of the command or provide additional information. These are generally preceded by `-` or `--`.

    -   `-V, --version`: This is an option that, when used, outputs the version number of the CLI tool. Both `-V` and `--version` are aliases for this option, so the user can type either one to get the same result.

    Example:

    ```bash
     todoer --version
    ```

### 4\. **Commands**

-   **Commands** are specific actions that the user can perform with the CLI tool. Commands often take arguments or options to modify the action.

    Here are the commands listed for the **Todoer** CLI tool:

    -   **`add`**: Adds a new todo task.

        Example:

        ```bash
        todoer add
        ```
        <br>
        

    -   **`ch <id> <task>`**: This is a shorthand way to edit a todo using the ID of the task and the new task description.

        Example:

        ```bash
        todoer ch 1 "Complete assignment"
        ```
        <br>

    -   **`edit`**: Edits an existing todo. This may take further arguments like ID and new task description, task priority, tast status, task deadline.

        Example:

        ```bash
        todoer edit
        ```
        <br>

    -   **`rm <id>`**: Removes (deletes) a todo by its ID.

        Example:

        ```bash
        todoer rm 1
        ```
        <br>

    -   **`del`**: Deletes **all** todos. This is a bulk delete command.

        Example:

        ```bash
        todoer del
        ```
        <br>

    -   **`ls`**: Lists all todos.

        Example:

        ```bash
        todoer ls
        ```
        <br>

    -   **`list`**: Lists todos using some sort of filter. This command might support various filtering options like Completed | InProgress | onHold 

        Example:

        ```bash
        todoer list
        ```
        <br>

    -   **`h`**: This likely shows the available commands. It's a shorthand for help.

        Example:

        ```bash
        todoer h
        ```
        <br>

* * * * *

### Explanation of How to Use the Tool

1.  **Add a task**:

    ```bash
    todoer add
    ```
    <br>


2.  **Edit a task**:
    ```bash
    todoer ch 1 "Go to the gym"
    ```
    <br>

3.  **Shorthand way to Edit a task by ID**:

    ```bash
    todoer ch 1 "Go to the gym"
    ```
    <br>

4.  **Remove a task by ID**:

    ```bash
    todoer rm 1
    ```
    <br>

5.  **Delete all tasks**:

    ```bash
    todoer del
    ```
    <br>

6.  **List all tasks**:

    ```bash
    todoer ls
    ```
    <br>

7.  **List tasks with Filter (Completed/Inprogress/onHold)**:

    ```bash
     todoer list
    ```
     <br>
     
8.  **Display help**:

    ```bash
    todoer --help
    ```
    <br>

### Summary

-   The `Usage` section provides the syntax for running the CLI tool.
-   The **Options** are flags like `--version` that give you extra information or modify the behavior.
-   **Commands** are the actual actions you perform with the tool, like `add`, `edit`, `rm` for adding, editing, and removing todos, respectively.
-   **`help`** and `h` commands display detailed usage instructions for specific commands.
