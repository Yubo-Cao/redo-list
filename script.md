Welcome to Redo-List project, a powerful todo list app built using Tauri, Redux, TypeScript, and a high-performance KV database utilizing Sled.

Redo-List boasts various features, including CRUD operations for to-do list items, the ability to organize tasks for future days, and rich text editing of to-do list items supporting markdown syntax, images, and more. Additionally, you can specify duration, due date, add tags and subtasks, and track progress, and it even supports Kanban with the ability to create an arbitrary number of boards and add to-do list items to them.

The app is built using Tauri, a web app that uses the native WebView to enhance performance and security, reducing file size. The state is managed using Redux and written in TypeScript. The packaged .msi file is less than 10MB.

Redo-List's high-performance KV database employs Sled, a fast embedded database written in Rust, utilizing the B-tree algorithm to keep data sorted, allowing for searches, sequential access, insertions, and deletions in logarithmic time.