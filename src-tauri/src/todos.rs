use crate::error::Error;
use crate::globals::PROJECT_DIRS;

use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use sled::{open, Db};
use tauri::command;

lazy_static! {
    pub static ref DB: Db = {
        let db_path = PROJECT_DIRS.data_dir().join("todos.db");
        open(db_path).unwrap()
    };
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Todo {
    pub id: u64,
    pub title: String,
    pub description: u64,
    pub completed: bool,
    pub create_date: String,
    pub due_date: Option<String>,
    pub importance: u64,
    pub important: bool,
    pub tags: Vec<String>,
    pub estimated_duration: Option<u64>,
    pub parent_task_id: Option<u64>,
    pub subtasks: Vec<u64>,
    pub dependencies: Vec<u64>,
}

#[command]
pub async fn add_todo(todo: Todo) -> Result<u64, Error> {
    let id = DB.generate_id()?;
    let todo = Todo { id, ..todo };
    DB.insert(id.to_be_bytes(), serde_json::to_vec(&todo)?)?;
    Ok(id)
}

#[command]
pub async fn get_todos() -> Result<Vec<Todo>, Error> {
    let todos = DB
        .iter()
        .filter_map(|item| item.ok())
        .map(|item| serde_json::from_slice::<Todo>(&item.1).ok())
        .filter_map(|item| item)
        .collect();
    Ok(todos)
}

#[command]
pub async fn get_root_todos() -> Result<Vec<Todo>, Error> {
    let todos = get_todos().await?;
    let root_todos = todos
        .into_iter()
        .filter(|todo| todo.parent_task_id.is_none())
        .collect();
    Ok(root_todos)
}

#[command]
pub async fn delete_todo(id: u64) -> Result<(), Error> {
    DB.remove(id.to_be_bytes())?;
    Ok(())
}

#[command]
pub async fn get_todo(id: u64) -> Result<Todo, Error> {
    let todo = DB.get(id.to_be_bytes())?;
    let todo = serde_json::from_slice::<Todo>(&todo.unwrap())?;
    Ok(todo)
}

#[command]
pub async fn update_todo(id: u64, todo: Todo) -> Result<(), Error> {
    DB.insert(id.to_be_bytes(), serde_json::to_vec(&todo)?)?;
    Ok(())
}

#[command]
pub async fn get_todos_by_parent_id(parent_id: u64) -> Result<Vec<Todo>, Error> {
    let todos = get_todos().await?;
    let todos = todos
        .into_iter()
        .filter(|todo| todo.parent_task_id == Some(parent_id))
        .collect();
    Ok(todos)
}
