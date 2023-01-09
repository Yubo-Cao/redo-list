use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;

use crate::error::Error;
use crate::globals::PROJECT_DIRS;

use chrono::Utc;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use tauri::command;

lazy_static! {
    pub static ref DB: Db = {
        let db_path = PROJECT_DIRS.data_dir().join("myday.json");
        let mut db = if Path::new(&db_path).exists() {
            read().unwrap_or_else(|_| Db {
                today: "".to_string(),
                ids: Vec::new(),
            })
        } else {
            Db {
                today: "".to_string(),
                ids: Vec::new(),
            }
        };
        let today = Utc::now().to_string();

        if db.today != today {
            db.ids = Vec::new();
        }

        db
    };
}

#[derive(Serialize, Deserialize)]
pub struct Db {
    today: String,
    ids: Vec<u64>,
}

fn read() -> Result<Db, Error> {
    let path = PROJECT_DIRS.data_dir().join("myday.json");
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    let db: Db = serde_json::from_str(&contents)?;
    Ok(db)
}

fn save(db: &Db) -> Result<(), Error> {
    let db_path = PROJECT_DIRS.data_dir().join("myday.json");
    let serialized = serde_json::to_string(db)?;
    let mut file = File::create(db_path)?;
    file.write_all(serialized.as_bytes())?;
    Ok(())
}

#[command]
pub fn get_my_day_todos() -> Result<Vec<u64>, Error> {
    let db = read()?;
    Ok(db.ids)
}

#[command]
pub fn clear_my_days() -> Result<(), Error> {
    let mut db = read()?;
    db.ids = Vec::new();
    save(&db)?;
    Ok(())
}

#[command]
pub fn add_todo_my_day(id: u64) -> Result<(), Error> {
    let mut db = read()?;
    if !db.ids.contains(&id) {
        db.ids.push(id);
        save(&db)?;
    }
    Ok(())
}

#[command]
pub fn remove_todo_my_day(id: u64) -> Result<(), Error> {
    let mut db = read()?;
    let index = db.ids.iter().position(|x| *x == id);
    if let Some(i) = index {
        db.ids.remove(i);
        save(&db)?;
    }
    Ok(())
}
