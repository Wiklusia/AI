<?php

/** @var \App\Model\User $user */
/** @var \App\Service\Router $router */

$title = 'Create User';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create User</h1>
    <form action="<?= $router->generatePath('user-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="user-create">
    </form>

    <a href="<?= $router->generatePath('user-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
