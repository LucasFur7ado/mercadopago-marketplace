insert into
  users(email, password, is_verified)
values
  (
    'test1@gmail.com',
    '$2a$10$VGroMebkHN9qSD0PvgtWTuIx65F9VcF7NJpICumj195wu302/X3jm',
    true
  ),
  (
    'test2@gmail.com',
    '$2a$10$VGroMebkHN9qSD0PvgtWTuIx65F9VcF7NJpICumj195wu302/X3jm',
    true
  ),
  (
    'test3@gmail.com',
    '$2a$10$VGroMebkHN9qSD0PvgtWTuIx65F9VcF7NJpICumj195wu302/X3jm',
    true
  ),
  (
    'test4@gmail.com',
    '$2a$10$VGroMebkHN9qSD0PvgtWTuIx65F9VcF7NJpICumj195wu302/X3jm',
    true
  );

insert into
  products(name, description, price, seller_id)
values
  ('Product1', 'Lorem description', 1300, 1),
  ('Product2', 'Lorem description', 2300, 1),
  ('Product3', 'Lorem description', 1100, 1),
  ('Product4', 'Lorem description', 1200, 1),
  ('Product5', 'Lorem description', 1900, 2),
  ('Product6', 'Lorem description', 1440, 2),
  ('Product7', 'Lorem description', 1230, 2),
  ('Product8', 'Lorem description', 900, 2),
  ('Product9', 'Lorem description', 100, 3),
  ('Product10', 'Lorem description', 300, 3),
  ('Product11', 'Lorem description', 3500, 3),
  ('Product12', 'Lorem description', 1350, 3),
  ('Product13', 'Lorem description', 1370, 3),
  ('Product14', 'Lorem description', 1309, 3),
  ('Product15', 'Lorem description', 1399, 3),
  ('Product16', 'Lorem description', 1220, 3),
  ('Product17', 'Lorem description', 1270, 4),
  ('Product18', 'Lorem description', 330, 4),
  ('Product19', 'Lorem description', 1300, 4),
  ('Product20', 'Lorem description', 1650, 4),
  ('Product21', 'Lorem description', 5300, 4),
  ('Product22', 'Lorem description', 5100, 4),
  ('Product23', 'Lorem description', 1420, 4),
  ('Product24', 'Lorem description', 3100, 4),
  ('Product25', 'Lorem description', 1840, 4);