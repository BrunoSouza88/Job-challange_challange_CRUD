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

$sql = "DELETE FROM tasks WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $taskId);
$stmt->execute();

$stmt->close();
$conn->close();
?>
