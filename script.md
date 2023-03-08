Welcome to Redo-List project, a powerful todo list app built using Tauri and
Next.js.

Redo-List contains a variety of features that made it stands out.

- CRUD operations for todo list item.
- Extended markdown syntax support for description. You can save images, links,
  and more.
- Extended attributes to todo list item, such as duration, due date, tags, and
  subtasks.
- Kanban support, you can create an arbitrary number of boards and add todo
- Dark mode, responsive design, and material design.

The app is built using Tauri, a web app that uses the native WebView to enhance
performance and security, reducing file size. The state is managed using Redux
and written in TypeScript. The packaged .msi file is less than 10MB.

The app uses a high-performance KV database that called Sled, a fast embedded
database written in Rust. The database employs the B-tree algorithm to keep data
sorted, allowing for searches, sequential access, insertions, and deletions in
logarithmic time.
