<?php

/** @var \App\Model\User $user */
/** @var \App\Service\Router $router */

$title = "{$user->getName()} ({$user->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= htmlspecialchars($user->getName()) ?></h1>
    <article>
        <p>Email: <?= htmlspecialchars($user->getEmail()) ?></p>
        <p>Password: <?= htmlspecialchars($user->getPassword()) ?></p> <!-- Or hide it based on your security policy -->
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('user-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('user-edit', ['id' => $user->getId()]) ?>">Edit</a></li>
        <li><a href="<?= $router->generatePath('user-delete', ['id' => $user->getId()]) ?>">Delete</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
