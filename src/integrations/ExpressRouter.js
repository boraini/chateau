import express from "express";
import bodyParser from "body-parser";
import multer from "multer";

const multerUpload = multer();

function getComments(Chateau) {
    return function(req, res) {
        const queryObj = req.query;

        if (!("postid" in queryObj)) {
            res.status(400).send("Chateau doesn't know what to get comments for.");
            return;
        }

        Chateau.getComments({
            postid: queryObj.postid
        }).then(obj => res.json(obj), err => res.status(502).send(err));
    }
}

function postComment(Chateau) {
    return function(req, res) {
        const queryObj = req.body;

        if (!("postid" in queryObj)) {
            res.status(400).send("Chateau doesn't know what to post comment on.");
            return;
        }

        Chateau.postComment({
            postid: queryObj.postid,
            parentid: queryObj.parentid,
            displayname: queryObj.displayname,
            email: queryObj.email,
            content: queryObj.content
        }).then(obj => res.json(obj), err => res.status(502).send(err));
    }
}

function checkContext(Chateau) {
    return function(req, res, next) {
        next();
    }
}

function setCommonHeaders(Chateau) {
    return function(req, res, next) {
        const fullhostname = req.get("Origin");
        if (Chateau.apiConfig.cors.indexOf(fullhostname) != -1) {
            res.set({
                "Access-Control-Allow-Origin": fullhostname,
                "Vary": "Origin",
            });
        }
        next();
    }
}

export function expressRouter(Chateau) {
    const router = new express.Router();

    router.use(bodyParser.urlencoded());
    router.use("/", checkContext(Chateau));
    router.use("/", setCommonHeaders(Chateau));
    router.get("/comments", getComments(Chateau));
    router.post("/comments", multerUpload.none(), postComment(Chateau));
    return router;
}