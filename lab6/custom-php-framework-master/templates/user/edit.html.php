<?php

/** @var \App\Model\User $user */
/** @var \App\Service\Router $router */

$title = "Edit User {$user->getName()} ({$user->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('user-edit', ['id' => $user->getId()]) ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="user-edit">
        <input type="hidden" name="id" value="<?= $user->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('user-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('user-delete', ['id' => $user->getId()]) ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="user-delete">
                <input type="hidden" name="id" value="<?= $user->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
