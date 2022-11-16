import e from "express";
import pgpLib from "pg-promise";
import crypto from "crypto";
import { isBlank } from "../common/utils.js";

const pgp = pgpLib(/* options */);
const hasher = crypto.createHash("sha256");

class PostgreSQLCommentsRepository {
    applyConfig(config) {
        if (!config) return this;

        if (this.connection) {
            console.warn("Repository config applied multiple times!");
            return this;
        }

        this.url = config.url;

        this.connection = pgp(this.url);

        return this;
    }

    async checkMissingData(query) {
        const result = {
            authorMissing: false,
            postMissing: false,
        };

        let postID = await this.connection.oneOrNone(`select id from post where postid = $1;`, query.postid, r => r.id);
        result.postMissing = postID == null;

        let authorID = await this.connection.oneOrNone(`select id from commentauthor where email = $1;`, query.hashedEmail, r => r.id);
        result.authorMissing = authorID == null;

        return [result, {postID, authorID}];
    }

    buildCommentHierarchy(table) {
        const commentMap = {};
        const roots = [];

        table.forEach(row => {
            const comment = {
                id: row.id,
                parentid: row.parentid,
                postid: row.postid,
                author: row.displayname,
                date: row.Date,
                content: row.content,
                children: [],
            };

            commentMap[comment.id] = comment;
            if (row.parentid == null) {
                roots.push(comment);
            }
        });

        table.forEach(row => {
            if (row.parentid != null) {
                commentMap[row.parentid].children.push(commentMap[row.id]);
            }
        });

        return roots;
    }

    getAllComments(postID) {
        const preparedQuery = `
        select comment.id id, parentid, postid, displayname, "Date", content
        from commentparent
        join comment on commentparent.id = comment.id
        left join commentauthor on commentauthor.id = comment.author
        where comment.postid in (select id from post where postid = '///')
        order by "Date" desc;
        `;

        return this.connection.manyOrNone(preparedQuery, postID).then(table => this.buildCommentHierarchy(table));
        //.then(roots => console.dir(roots, {depth: 5}));
    }

    putAuthor(comment) {
        return this.connection.one(`insert into commentauthor(email, displayname) values ($1, $2) returning id;`, [comment.hashedEmail, comment.displayname], r => r.id);
    }

    putPost(comment) {
        return this.connection.one(`insert into post(postid) values ($1) returning id;`, comment.postid, r => r.id);
    }

    async putComment(comment, foundData) {
        console.log(comment.Date);
        if (typeof comment.parentid == "string") {
            if (isBlank(comment.parentid)) {
                comment.parentid = null;
            } else {
                comment.parentid = parseInt(comment.parentid);
            }
        }

        const commentID = await this.connection.one('insert into comment(postid, author, "Date", content) values (${postid}, ${author}, ${date}, ${content}) returning id;', {
            postid: foundData.postID,
            author: foundData.authorID,
            date: comment.Date,
            content: comment.content
        }, r => r.id);

        this.connection.none(`insert into commentparent(id, parentid) values ($1, $2);`, [commentID, comment.parentid]);

        return commentID;
    }

    async postComment(comment) {
        comment.hashedEmail = hasher.copy().update(comment.email).digest("hex");

        console.dir(comment);

        const [missingData, foundData] = await this.checkMissingData(comment);

        if (missingData.authorMissing) {
            if (!isBlank(comment.displayname)) {
                foundData.authorID = this.putAuthor(comment);
            } else return missingData;
        }

        if (missingData.postMissing) {
            foundData.postID = this.putPost(comment);
        }

        this.putComment(comment, foundData);

        return missingData;
    }
}

// No Beans???
const instance = new PostgreSQLCommentsRepository();

export const repository = (config) => instance.applyConfig(config);