-- Запрос списка всех категорий.
SELECT * FROM categories;
-- Запрос списка категорий для которых создана минимум одна публикация.
SELECT
categories.id,
categories.name
FROM categories
JOIN article_categories
ON categories.id = article_categories.category_id
GROUP BY categories.id
ORDER BY categories.id;
-- Запрос списка категорий с количеством публикаций.
SELECT
categories.id,
categories.name,
count(article_categories.article_id) as articles_count
FROM categories
LEFT JOIN article_categories
ON categories.id = article_categories.category_id
GROUP BY categories.id
ORDER BY categories.id;
-- Запрос списка публикаций. Сначала свежие публикации.
SELECT
articles.id,
articles.title,
articles.announce,
to_char(articles.created_at, 'DD.MM.YYYY') as created_at,
concat(users.first_name, ' ', users.last_name) as user,
users.email,
count(comments.article_id) as comments,
string_agg(DISTINCT categories.name, ' ') as categories
FROM articles
JOIN users ON articles.user_id = users.id
JOIN comments ON articles.id = comments.article_id
JOIN article_categories ON articles.id = article_categories.article_id
JOIN categories ON article_categories.category_id = categories.id
GROUP BY articles.id, users.id
ORDER BY articles.created_at DESC;
-- Запрос полной информацию определённой публикации.
SELECT
articles.id,
articles.title,
articles.announce,
articles.full_text,
to_char(articles.created_at, 'DD.MM.YYYY') as created_at,
articles.picture,
concat(users.first_name, ' ', users.last_name) as user,
users.email,
count(comments.article_id) as comments,
string_agg(DISTINCT categories.name, ' ') as categories
FROM articles
JOIN users ON articles.user_id = users.id
JOIN comments ON articles.id = comments.article_id
JOIN article_categories ON articles.id = article_categories.article_id
JOIN categories ON article_categories.category_id = categories.id
WHERE articles.id = 1
GROUP BY articles.id, users.id;
-- Запрос списка из 5 свежих комментариев.
SELECT
comments.id,
comments.article_id,
concat(users.first_name, ' ', users.last_name) as user,
comments.text
FROM comments
JOIN users ON comments.user_id = users.id
ORDER BY comments.created_at DESC LIMIT 5;
-- Запрос списка комментариев для определённой публикации. Сначала новые комментарии.
SELECT
comments.id,
comments.article_id,
concat(users.first_name, ' ', users.last_name) as user,
comments.text
FROM comments
JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 1
ORDER BY comments.created_at DESC;
-- Обновить заголовок определённой публикации на «Как я встретил Новый год».
UPDATE articles
set title = 'Как я встретил Новый год'
WHERE articles.id = 1;
