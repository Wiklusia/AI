<?php
/** @var \App\Model\User $user */
?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="user[name]" value="<?= $user ? $user->getName() : '' ?>" required>
</div>

<div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="user[email]" value="<?= $user ? $user->getEmail() : '' ?>" required>
</div>

<div class="form-group">
    <label for="password">Password</label>
    <input type="password" id="password" name="user[password]" value="" <?= !$user ? 'required' : '' ?>>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
