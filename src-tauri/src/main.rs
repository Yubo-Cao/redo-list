#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

mod documents;
mod error;
mod globals;
mod todos;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            todos::get_todos,
            todos::add_todo,
            todos::delete_todo,
            todos::get_todo,
            todos::update_todo,
            todos::get_todos_by_parent_id,
            todos::get_root_todos,
            // documents::get_documents,
            documents::add_document,
            documents::delete_document,
            documents::get_document,
            documents::update_document,
            documents::add_images_to_document,
            documents::document_exists,
            documents::get_document_resources,
            documents::clean_document_resources,
            documents::get_document_resources,
            documents::get_document_ids,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
