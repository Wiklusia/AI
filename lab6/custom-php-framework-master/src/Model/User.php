<?php
namespace App\Model;

use App\Service\Config;

class User
{
private ?int $id = null;
private ?string $name = null;
private ?string $email = null;
private ?string $password = null;

// Getters and Setters
public function getId(): ?int
{
return $this->id;
}

public function setId(?int $id): User
{
$this->id = $id;
return $this;
}

public function getName(): ?string
{
return $this->name;
}

public function setName(?string $name): User
{
$this->name = $name;
return $this;
}

public function getEmail(): ?string
{
return $this->email;
}

public function setEmail(?string $email): User
{
$this->email = $email;
return $this;
}

public function getPassword(): ?string
{
return $this->password;
}

public function setPassword(?string $password): User
{
$this->password = $password;
return $this;
}

// Populate object from array
public static function fromArray($array): User
{
$user = new self();
$user->fill($array);
return $user;
}

// Fill object with data from array
public function fill($array): User
{
if (isset($array['id']) && !$this->getId()) {
$this->setId($array['id']);
}
if (isset($array['name'])) {
$this->setName($array['name']);
}
if (isset($array['email'])) {
$this->setEmail($array['email']);
}
if (isset($array['password'])) {
$this->setPassword($array['password']);
}
return $this;
}

// Get all users
public static function findAll(): array
{
$pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
$sql = 'SELECT * FROM users';
$statement = $pdo->prepare($sql);
$statement->execute();

$users = [];
$usersArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
foreach ($usersArray as $userArray) {
$users[] = self::fromArray($userArray);
}

return $users;
}

// Get a single user by ID
public static function find($id): ?User
{
$pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
$sql = 'SELECT * FROM users WHERE id = :id';
$statement = $pdo->prepare($sql);
$statement->execute(['id' => $id]);

$userArray = $statement->fetch(\PDO::FETCH_ASSOC);
if (!$userArray) {
return null;
}
return self::fromArray($userArray);
}

// Save or update a user
public function save(): void
{
$pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));

if (!$this->getId()) {
// Insert a new user
$sql = "INSERT INTO users (name, email, password) VALUES (:name, :email, :password)";
$statement = $pdo->prepare($sql);
$statement->execute([
'name' => $this->getName(),
'email' => $this->getEmail(),
'password' => password_hash($this->getPassword(), PASSWORD_DEFAULT),
]);
$this->setId($pdo->lastInsertId());
} else {
// Update an existing user
$sql = "UPDATE users SET name = :name, email = :email, password = :password WHERE id = :id";
$statement = $pdo->prepare($sql);
$statement->execute([
':name' => $this->getName(),
':email' => $this->getEmail(),
':password' => password_hash($this->getPassword(), PASSWORD_DEFAULT),
':id' => $this->getId(),
]);
}
}

// Delete a user
public function delete(): void
{
$pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
$sql = "DELETE FROM users WHERE id = :id";
$statement = $pdo->prepare($sql);
$statement->execute([ ':id' => $this->getId() ]);
$this->setId(null);
$this->setName(null);
$this->setEmail(null);
$this->setPassword(null);
}
}
