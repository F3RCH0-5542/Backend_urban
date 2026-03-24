<?php
// Configuración desde variables de entorno
$servername = getenv('DB_HOST') ?: 'localhost';
$username   = getenv('DB_USER') ?: 'root';
$password   = getenv('DB_PASS'); // YA NO va vacía en el código
$dbname     = getenv('DB_NAME') ?: 'urban1';

// Validar que exista contraseña
if ($password === false || $password === "") {
    http_response_code(500);
    echo json_encode([
        "error" => "La contraseña de la base de datos no está configurada correctamente"
    ]);
    exit;
}

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Manejo de errores
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "error" => "Error en la conexión a la base de datos",
        "details" => $conn->connect_error
    ]);
    exit;
}

// Siempre JSON
header("Content-Type: application/json; charset=UTF-8");
?>