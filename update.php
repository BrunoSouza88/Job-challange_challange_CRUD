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

$taskId = $_POST['id'];
$title = $_POST['title'];
$description = $_POST['description'];
$status = $_POST['status'];
$sql = "UPDATE tasks SET title = '$title', description = '$description', status = '$status' WHERE id = $taskId";
$conn->query($sql);

$conn->close();
?>
