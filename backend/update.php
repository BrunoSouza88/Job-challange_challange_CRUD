<?php
$servername = getenv('MYSQL_HOST') ?: 'db';
$username = getenv('MYSQL_USER') ?: 'root';
$password = getenv('MYSQL_PASSWORD') ?: 'password';
$dbname = getenv('MYSQL_DATABASE') ?: 'todolist';
$port = getenv('MYSQL_PORT') ?: 3306;

$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$taskId = mysqli_real_escape_string($conn, $_POST['id']);
$status = mysqli_real_escape_string($conn, $_POST['status']);


if (isset($_POST['title']) && isset($_POST['description'])) {
  $title = mysqli_real_escape_string($conn, $_POST['title']);
  $description = mysqli_real_escape_string($conn, $_POST['description']);
  $sql = "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("sssi", $title, $description, $status, $taskId);
} else {
  $sql = "UPDATE tasks SET status = ? WHERE id = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("si", $status, $taskId);
}

$stmt->execute();
$stmt->close();
$conn->close();
?>

