const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

exports.getData = function() {
    return db
        .query(`SELECT url, title, id FROM images`)
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

exports.getImage = function(id) {
    console.log("Result from getImage: ", id);
    return db
        .query(
            `SELECT url, title, username, description FROM images WHERE id=${id}`
        )
        .then(({ rows }) => rows);
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
    console.log("Result from getComments: ", id);
    return db
        .query(`SELECT comment, username FROM comments WHERE image_id=${id}`)
        .then(({ rows }) => rows);
};
