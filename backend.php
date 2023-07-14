<?php
$servername = "localhost";
$username = "root";
$password = "passowrd_test";
$dbname = "todolist";
$port = 3306;

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$action = $_POST['action'];

switch ($action) {
  case 'create':
    $title = $_POST['title'];
    $description = $_POST['description'];
    $sql = "INSERT INTO tasks (title, description, status) VALUES ('$title', '$description', 'pending')";
    $conn->query($sql);
    break;
  case 'read':
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
    break;
  case 'update':
    $taskId = $_POST['id'];
    $title = $_POST['title'];
    $description = $_POST['description'];
    $status = $_POST['status'];
    $sql = "UPDATE tasks SET title = '$title', description = '$description', status = '$status' WHERE id = $taskId";
    $conn->query($sql);
    break;
  case 'delete':
    $taskId = $_POST['id'];
    $sql = "DELETE FROM tasks WHERE id = $taskId";
    $conn->query($sql);
    break;
}

$conn->close();
?>
