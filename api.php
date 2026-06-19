<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Handle CORS Pre-flight options request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$action = $_GET['action'] ?? '';
$dataPath = __DIR__ . '/data';

if (!file_exists($dataPath)) {
    mkdir($dataPath, 0777, true);
}

$appsFile = $dataPath . '/applications.json';
$usersFile = $dataPath . '/users.json';
$logsFile = $dataPath . '/logs.json';

// Helper to read JSON
function readJSON($file, $default = []) {
    if (!file_exists($file)) return $default;
    $content = file_get_contents($file);
    return json_decode($content, true) ?: $default;
}

// Helper to write JSON
function writeJSON($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

switch ($action) {
    case 'get_applications':
        echo json_encode(readJSON($appsFile));
        break;
        
    case 'add_application':
        $data = json_decode(file_get_contents('php://input'), true);
        if ($data) {
            $apps = readJSON($appsFile);
            $apps[] = $data;
            writeJSON($appsFile, $apps);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'No data']);
        }
        break;
        
    case 'update_application':
        $data = json_decode(file_get_contents('php://input'), true);
        if ($data && isset($data['id']) && isset($data['status'])) {
            $apps = readJSON($appsFile);
            foreach ($apps as &$app) {
                if ($app['id'] == $data['id']) {
                    $app['status'] = $data['status'];
                }
            }
            writeJSON($appsFile, $apps);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }
        break;
        
    case 'delete_application':
        $id = $_GET['id'] ?? '';
        if ($id) {
            $apps = readJSON($appsFile);
            $apps = array_filter($apps, function($app) use ($id) {
                return $app['id'] != $id;
            });
            writeJSON($appsFile, array_values($apps));
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }
        break;
        
    case 'get_users':
        $defaultUsers = [
            ['username' => 'admin', 'password' => 'S4ndw!4_SMP#ScuRe_2026!', 'role' => 'Администратор'],
            ['username' => 'Banan4o', 'password' => 'Banan4o123Sand@wi4', 'role' => 'Администратор'],
            ['username' => 'Krasi', 'password' => 'Krasicheto123Sandik@4', 'role' => 'Администратор']
        ];
        $users = readJSON($usersFile);
        
        // Ensure default users are registered
        $updated = false;
        foreach ($defaultUsers as $defUser) {
            $found = false;
            foreach ($users as $user) {
                if (strtolower($user['username']) === strtolower($defUser['username'])) {
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $users[] = $defUser;
                $updated = true;
            }
        }
        if ($updated || empty($users)) {
            writeJSON($usersFile, $users);
        }
        echo json_encode($users);
        break;
        
    case 'add_user':
        $data = json_decode(file_get_contents('php://input'), true);
        if ($data) {
            $users = readJSON($usersFile);
            $users[] = $data;
            writeJSON($usersFile, $users);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }
        break;
        
    case 'delete_user':
        $username = $_GET['username'] ?? '';
        if ($username) {
            $users = readJSON($usersFile);
            $users = array_filter($users, function($u) use ($username) {
                return strtolower($u['username']) !== strtolower($username);
            });
            writeJSON($usersFile, array_values($users));
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }
        break;
        
    case 'get_logs':
        echo json_encode(readJSON($logsFile));
        break;
        
    case 'add_log':
        $data = json_decode(file_get_contents('php://input'), true);
        if ($data) {
            $logs = readJSON($logsFile);
            array_unshift($logs, $data);
            writeJSON($logsFile, $logs);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }
        break;
        
    case 'clear_logs':
        writeJSON($logsFile, []);
        echo json_encode(['success' => true]);
        break;
        
    default:
        echo json_encode(['error' => 'Unknown action']);
}
