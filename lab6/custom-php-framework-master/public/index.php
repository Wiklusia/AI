<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

$config = new \App\Service\Config();

$templating = new \App\Service\Templating();
$router = new \App\Service\Router();

$action = $_REQUEST['action'] ?? null;
switch ($action) {
    case 'user-index':
    case null:
        $controller = new \App\Controller\UserController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'user-create':
        $controller = new \App\Controller\UserController();
        $view = $controller->createAction($_REQUEST['user'] ?? null, $templating, $router);
        break;
    case 'user-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\UserController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['user'] ?? null, $templating, $router);
        break;
    case 'user-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\UserController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'user-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\UserController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;
    case 'info':
        $controller = new \App\Controller\InfoController();
        $view = $controller->infoAction();
        break;
    default:
        $view = 'Not found';
        break;
}

if ($view) {
    echo $view;
}
