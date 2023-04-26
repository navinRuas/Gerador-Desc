<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);
/* Execute the Python script and store the output in a variable
$output = shell_exec('python get_data.py');

// Return the output to the client
echo $output;
*/
// Get the path to the config.json file
$config_file = __DIR__ . '/config.json';

// Read the contents of the config.json file
$config = json_decode(file_get_contents($config_file), true);

// Get database credentials from the config array
$db_host = $config['dbHost'];
$db_port = $config['dbPort'];
$db_username = $config['dbUsername'];
$db_password = $config['dbPassword'];
$db_name = $config['dbName'];

try {
    // Create connection
    $conn = new PDO("mysql:host=$db_host;port=$db_port;dbname=$db_name", $db_username, $db_password);

    // Set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query data from the De-Para table
    $stmt = $conn->prepare('SELECT * FROM eAud.`De-Para`');
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check if rows is empty
    if (empty($rows)) {
        echo 'Error: No rows returned';
    } else {
        // Encode the rows as a JSON object and print it
        echo json_encode($rows);
    }
} catch (PDOException $e) {
    // Print any exceptions that occur
    echo 'Connection failed: ' . $e->getMessage();
} finally {
    // Close the connection if it was opened
    if (isset($conn)) {
        $conn = null;
    }
}
?>