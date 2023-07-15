<?php
$servername = getenv('MYSQL_HOST') ?: 'db';
$username = getenv('MYSQL_USER') ?: 'root';
$password = getenv('MYSQL_PASSWORD') ?: 'password';
$dbname = getenv('MYSQL_DATABASE') ?: 'todolist';
$port = getenv('MYSQL_PORT') ?: 3306;

$conn = new mysqli($servername, $username, $password ,$dbname, $port);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$action = $_POST['action'];

if ($action == 'create') {
  createTask();
} elseif ($action == 'read') {
  readTasks();
} elseif ($action == 'update') {
  updateTask();
} elseif ($action == 'delete') {
  deleteTask();
}

function createTask() {
  global $conn;
  $title = $_POST['title'];
  $description = $_POST['description'];
  $status = 'pending';
  $sql = "INSERT INTO tasks (title, description, status) VALUES ('$title', '$description', '$status')";
  $conn->query($sql);
}

function readTasks() {
  global $conn;
  $sql = "SELECT * FROM tasks";
  $result = $conn->query($sql);
  $tasks = array();
  if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
      $tasks[] = array(
        'id' => $row['id'],
        'title' => $row['title'],
        'description' => $row['description'],
        'status' => $row['status']
      );
    }
  }
  echo json_encode($tasks);
}

function updateTask() {
  global $conn;
  $taskId = $_POST['id'];
  $title = $_POST['title'];
  $description = $_POST['description'];
  $status = $_POST['status'];
  $sql = "UPDATE tasks SET title = '$title', description = '$description', status = '$status' WHERE id = $taskId";
  $conn->query($sql);
}

function deleteTask() {
  global $conn;
  $taskId = $_POST['id'];
  $sql = "DELETE FROM tasks WHERE id = $taskId";
  $conn->query($sql);
}

$conn->close();
?>
