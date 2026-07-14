use std::fs;
use std::path::PathBuf;

// Command to read a file's contents from a path provided by the frontend
#[tauri::command]
fn open_file(path: String) -> Result<String, String> {
    fs::read_to_string(PathBuf::from(path))
        .map_err(|err| err.to_string())
}

// Command to write content to a path provided by the frontend
#[tauri::command]
fn save_file(path: String, content: String) -> Result<(), String> {
    fs::write(PathBuf::from(path), content)
        .map_err(|err| err.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init()) // Initialize the dialog plugin
        .invoke_handler(tauri::generate_handler![open_file, save_file]) // Register our commands
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
