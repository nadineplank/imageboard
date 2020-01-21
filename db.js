const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

exports.getData = function() {
    return db.query(`SELECT url, title FROM images`).then(({ rows }) => rows);
};

exports.insertData = function(title, description, username, url) {
    return db.query(
        `INSERT INTO images (title, description, username, url)
        VALUES ($1, $2, $3, $4)
        RETURNING id`,
        [title, description, username, url]
    );
};
