const express = require("express");
const app = express();
const { getData, insertData } = require("./db");
const s3 = require("./s3");
const { s3Url } = require("./config");

app.use(express.static("./public"));

/////// DO NOT TOUCH

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

/////// DO NOT TOUCH

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.json());

app.get("/images", (req, res) => {
    getData().then(rows => {
        res.json(rows);
    });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("file: ", req.file);
    console.log("input: ", req.body);
    let title = req.body.title,
        description = req.body.description,
        username = req.body.username,
        url = s3Url + req.file.filename;

    ////// you'll eventually want to make a db insert here
    insertData(title, description, username, url)
        .then(response => {
            res.json(response.rows[0]);
        })
        .catch(err => {
            console.log("Error in insertData: ", err);
            res.sendStatus(500);
        });
});

app.listen(8080, () => console.log("I'm listening."));
