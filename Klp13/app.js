const express = require("express");
const app = express();
const port = 3000;

// Middleware untuk parsing form data dan menyajikan file statis
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Kelas TaskManager untuk mengelola tugas (OOP)
class TaskManager {
  constructor() {
    this.tasks = [];
  }

  addTask(task) {
    if (task && typeof task === "string" && task.trim() !== "") {
      this.tasks.push(task.trim());
    }
  }

  deleteTask(index) {
    if (index >= 0 && index < this.tasks.length) {
      this.tasks.splice(index, 1);
    }
  }

  getTasks() {
    return this.tasks;
  }
}

// Inisialisasi TaskManager
const taskManager = new TaskManager();

// Route untuk homepage (tampilkan form dan daftar tugas)
app.get("/", (req, res) => {
  const taskList = taskManager
    .getTasks()
    .map(
      (task, index) => `
    <li>
      ${task}
      <a href="/delete/${index}" class="delete-btn">Hapus</a>
    </li>
  `
    )
    .join("");

  res.send(`
    <html>
      <head>
        <title>To-Do List</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f4f4f9;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
          }
          form {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
          }
          input[type="text"] {
            padding: 8px;
            flex: 1;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          button {
            padding: 8px 16px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background-color: #218838;
          }
          ul {
            list-style: none;
            padding: 0;
          }
          li {
            padding: 10px;
            background-color: white;
            margin-bottom: 8px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .delete-btn {
            color: #dc3545;
            text-decoration: none;
          }
          .delete-btn:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Manajemen Tugas</h1>
          <form action="/add" method="post">
            <input type="text" name="task" placeholder="Masukkan tugas baru" required>
            <button type="submit">Tambah Tugas</button>
          </form>
          <h3>Daftar Tugas:</h3>
          <ul>${taskList}</ul>
        </div>
      </body>
    </html>
  `);
});

// Route untuk menambah tugas
app.post("/add", (req, res) => {
  const newTask = req.body.task;
  taskManager.addTask(newTask);
  res.redirect("/");
});

// Route untuk menghapus tugas
app.get("/delete/:index", (req, res) => {
  const index = parseInt(req.params.index);
  taskManager.deleteTask(index);
  res.redirect("/");
});

// Jalankan server
app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}/`);
});