# Redo-List

Redo-List is a powerful todo list app with various features, including:
- CRUD of the to-do list items
- Organizing tasks for future days
- Rich text editing of to-do list items supporting markdown syntax, images, and more
- Specifying duration, and due date, adding tags and subtasks, and tracking progress
- Kanban support with the ability to create an arbitrary number of boards and
  add to-do list items to them.

## Tech Stack

The Redo-List app is built using Tauri, a web app that utilizes the native
WebView to enhance performance and security, and reduces file size. The app uses
Redux to manage its state and is written in TypeScript. The packaged `.msi` file
is less than 10MB.

The app uses a high-performance KV database that utilizes Sled, a fast embedded
database written in Rust. The database employs the B-tree algorithm to keep data
sorted, allowing for searches, sequential access, insertions, and deletions in
logarithmic time.
