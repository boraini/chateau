import { expressRouter } from "./integrations/ExpressRouter.js"

export class Chateau {
    constructor(config) {
        this.context = config.context;
        this.commentsService = config.commentsService;
    }

    getComments(query) {
        return this.commentsService.getAllComments(query.postid);
    }

    postComment(query) {
        return this.commentsService.postComment({...query, Date: new Date()});
    }

    expressRouter() {
        return expressRouter(this);
    }
}