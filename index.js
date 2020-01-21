const express = require("express");
const app = express();
const { getData } = require("./db");

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

app.post("/upload", uploader.single("file"), (req, res) => {
    console.log("file: ", req.file);
    console.log("input: ", req.body);

    if (req.file) {
        ////// you'll eventually want to make a db insert here
        res.json({
            success: true
        });
    } else {
        res.json({
            success: true
        });
    }
});

app.listen(8080, () => console.log("I'm listening."));
