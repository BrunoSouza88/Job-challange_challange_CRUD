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

$conn->close();
?>
