use crate::error::Error;
use crate::globals::PROJECT_DIRS;

use async_std::{
    fs::{create_dir_all, remove_file},
    path::Path,
    stream::StreamExt,
    task::spawn,
    task::JoinHandle,
};
use crypto::{digest::Digest, sha2::Sha256};
use image::{io::Reader as ImageReader, ImageFormat};
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use sled::{open, Db};
use std::{collections::HashSet, io::Cursor, path::PathBuf};
use tauri::command;

lazy_static! {
    pub static ref DB: Db = {
        let db_path = PROJECT_DIRS.data_dir().join("documents.db");
        open(db_path).unwrap()
    };
    pub static ref IMAGES_DIR: PathBuf = PROJECT_DIRS.data_dir().join("images");
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Document {
    pub id: u64,
    pub resources: Vec<String>,
    pub content: String,
}

#[command]
pub async fn add_document(document: Document) -> Result<u64, Error> {
    let id = DB.generate_id()?;
    println!("ID: {}", id);
    let document = Document { id, ..document };
    DB.insert(id.to_be_bytes(), serde_json::to_vec(&document)?)?;
    Ok(id)
}

#[command]
pub async fn get_document(id: u64) -> Result<Document, Error> {
    let document = DB.get(id.to_be_bytes())?;
    let document =
        serde_json::from_slice::<Document>(&document.expect("Document doesn't exists!"))?;
    Ok(document)
}

#[command]
pub async fn get_documents() -> Result<Vec<Document>, Error> {
    let documents = DB
        .iter()
        .filter_map(|item| item.ok())
        .map(|item| serde_json::from_slice::<Document>(&item.1).ok())
        .filter_map(|item| item)
        .collect();
    Ok(documents)
}

#[command]
pub async fn update_document(id: u64, document: Document) -> Result<(), Error> {
    DB.insert(id.to_be_bytes(), serde_json::to_vec(&document)?)?;
    Ok(())
}

#[command]
pub fn get_document_ids() -> Result<Vec<u64>, Error>
where
    Error: Into<tauri::InvokeError>,
{
    let mut keys = Vec::new();
    for key in DB.iter() {
        let key = key?.0;
        let key = u64::from_be_bytes(key.as_ref().try_into().unwrap());
        keys.push(key);
    }
    Ok(keys)
}

#[command]
pub async fn delete_document(id: u64) -> Result<(), Error> {
    DB.remove(id.to_be_bytes())?;
    Ok(())
}

#[command]
pub async fn document_exists(id: u64) -> Result<bool, Error> {
    let document = DB.get(id.to_be_bytes())?;
    Ok(document.is_some())
}

#[command]
pub async fn get_document_resources(id: u64) -> Result<Vec<String>, Error> {
    let document = get_document(id).await?;
    Ok(document.resources)
}

fn get_image_dir(id: u64) -> async_std::path::PathBuf {
    Path::new(&*IMAGES_DIR).join(id.to_string())
}

#[command]
pub async fn clean_document_resources(id: u64) -> Result<(), Error> {
    let doc = get_document(id).await?;
    let dir = get_image_dir(id);
    let mut handles = Vec::new();
    dir.read_dir()
        .await?
        .map(|item| {
            let doc = doc.clone();
            spawn(async move {
                let item = item.ok().unwrap();
                let path = item.path();
                if path.exists().await
                    && !&doc.resources.contains(&path.to_str().unwrap().to_string())
                {
                    remove_file(path).await
                } else {
                    Ok(())
                }
            })
        })
        .for_each(|v| {
            handles.push(v);
        });
    for handle in handles {
        handle.await?;
    }
    Ok(())
}

#[command]
pub async fn add_images_to_document(
    id: u64,
    images_data: Vec<Vec<u8>>,
) -> Result<Vec<String>, Error> {
    let mut dst_paths = Vec::new();

    let dir = get_image_dir(id);
    let _ = create_dir_all(&dir).await?;

    let mut handles = Vec::new();

    for data in images_data {
        let data = data.clone();
        let cloned_dir = dir.clone();
        let handle: JoinHandle<Result<String, Error>> = spawn(async move {
            let mut hasher = Sha256::new();
            hasher.input(&data);
            let hash = hasher.result_str();
            let dst_path = cloned_dir.join(hash + ".png");
            if !dst_path.exists().await {
                let img = ImageReader::new(Cursor::new(data))
                    .with_guessed_format()
                    .unwrap()
                    .decode()
                    .unwrap();
                img.save_with_format(&dst_path, ImageFormat::Png).unwrap();
            }
            let str_path = dst_path.to_str().unwrap().to_string();
            Ok(str_path)
        });
        handles.push(handle);
    }

    for handle in handles {
        let dst_path = handle.await?;
        dst_paths.push(dst_path);
    }

    let mut doc = get_document(id).await?;

    let merged_paths: Vec<String> = dst_paths.clone()
        .into_iter()
        .chain(doc.resources.into_iter())
        .collect::<HashSet<_>>()
        .into_iter()
        .collect();

    doc.resources = merged_paths.clone();
    update_document(id, doc).await?;

    Ok(dst_paths)
}
