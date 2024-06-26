// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod command;
pub mod error;
pub mod types;
pub mod impls;

#[tokio::main]
async fn main() {
  tauri::Builder::default()
    .invoke_handler(
      tauri::generate_handler![
        command::download::download,
        command::search::search,
      ],
    )
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
