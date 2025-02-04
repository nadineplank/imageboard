const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

exports.getImages = function() {
    return db
        .query(
            `SELECT url, title, id
            FROM images
            ORDER BY id DESC
            LIMIT 9;`
        )
        .then(({ rows }) => rows);
};

exports.getMoreImages = function(lastId) {
    return db
        .query(
            `SELECT id, url, title, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 9`,
            [lastId]
        )
        .then(({ rows }) => rows);
};

exports.getData = function(id) {
    return db
        .query(
            `SELECT url, title, username, description, id,
        (SELECT id from images WHERE id > ${id} LIMIT 1)
        AS left_id,
        (SELECT id FROM images WHERE id < ${id} ORDER BY id DESC LIMIT 1) AS right_id
        FROM images WHERE id=${id}`
        )
        .then(({ rows }) => rows);
};

exports.insertData = function(title, description, username, url) {
    return db.query(
        `INSERT INTO images (title, description, username, url)
        VALUES ($1, $2, $3, $4)
        RETURNING title, description, username, url, id`,
        [title, description, username, url]
    );
};

exports.insertComment = function(username, comment, image_id) {
    return db.query(
        `INSERT INTO comments (username, comment, image_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [username, comment, image_id]
    );
};

exports.getComments = function(id) {
    return db
        .query(`SELECT comment, username FROM comments WHERE image_id=${id}`)
        .then(({ rows }) => rows);
};
