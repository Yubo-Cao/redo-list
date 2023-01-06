#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod todos;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            todos::get_todos,
            todos::add_todo,
            todos::delete_todo,
            todos::get_todo,
            todos::update_todo,
            todos::get_todos_by_parent_id,
            todos::get_root_todos
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
