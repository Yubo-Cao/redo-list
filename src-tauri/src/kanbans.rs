use crate::error::Error;
use crate::globals::PROJECT_DIRS;

use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use sled::{open, Db};
use tauri::command;

lazy_static! {
    pub static ref DB: Db = {
        let db_path = PROJECT_DIRS.data_dir().join("kanbans.db");
        open(db_path).unwrap()
    };
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Kanban {
    pub id: u64,
    pub title: String,
    pub description: u64,
    pub tasks: Vec<u64>,
}

#[command]
pub async fn add_kanban(kanban: Kanban) -> Result<u64, Error> {
    let id = DB.generate_id()?;
    let kanban = Kanban { id, ..kanban };
    DB.insert(id.to_be_bytes(), serde_json::to_vec(&kanban)?)?;
    Ok(id)
}

#[command]
pub async fn delete_kanban(id: u64) -> Result<(), Error> {
    DB.remove(id.to_be_bytes())?;
    Ok(())
}

#[command]
pub async fn update_kanban(kanban: Kanban) -> Result<(), Error> {
    DB.insert(kanban.id.to_be_bytes(), serde_json::to_vec(&kanban)?)?;
    Ok(())
}

#[command]
pub async fn add_todo_to_kanban(kanban_id: u64, todo_id: u64) -> Result<(), Error> {
    if let Some(kanban_bytes) = DB.get(kanban_id.to_be_bytes())? {
        let mut kanban: Kanban = serde_json::from_slice(&kanban_bytes)?;
        kanban.tasks.push(todo_id);
        DB.insert(kanban_id.to_be_bytes(), serde_json::to_vec(&kanban)?)?;
    }
    Ok(())
}

#[command]
pub async fn remove_todo_from_kanban(kanban_id: u64, todo_id: u64) -> Result<(), Error> {
    if let Some(kanban_bytes) = DB.get(kanban_id.to_be_bytes())? {
        let mut kanban: Kanban = serde_json::from_slice(&kanban_bytes)?;
        kanban.tasks.retain(|&x| x != todo_id);
        DB.insert(kanban_id.to_be_bytes(), serde_json::to_vec(&kanban)?)?;
    }
    Ok(())
}

#[command]
pub async fn move_todo_in_kanban(kanban_id: u64, todo_id: u64, index: usize) -> Result<(), Error> {
    if let Some(kanban_bytes) = DB.get(kanban_id.to_be_bytes())? {
        let mut kanban: Kanban = serde_json::from_slice(&kanban_bytes)?;
        let index_of_todo = kanban.tasks.iter().position(|&x| x == todo_id);
        if let Some(i) = index_of_todo {
            kanban.tasks.remove(i);
            kanban.tasks.insert(index, todo_id);
            DB.insert(kanban_id.to_be_bytes(), serde_json::to_vec(&kanban)?)?;
        }
    }
    Ok(())
}

#[command]
pub async fn get_all_kanbans() -> Result<Vec<Kanban>, Error> {
    let kanbans = DB
        .iter()
        .filter_map(|item| item.ok())
        .map(|item| serde_json::from_slice::<Kanban>(&item.1).ok())
        .filter_map(|item| item)
        .collect();
    Ok(kanbans)
}

#[command]
pub async fn get_kanban(id: u64) -> Result<Kanban, Error> {
    let kanban = DB.get(id.to_be_bytes())?.expect("Kanban not found");
    let kanban = serde_json::from_slice::<Kanban>(&kanban)?;
    Ok(kanban)
}
