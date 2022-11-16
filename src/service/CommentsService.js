import { CommentErrorType } from "../common/enum.js";
import { isBlank } from "../common/utils.js";

class CommentsService {
    applyConfig(config) {
        if (!config) return this;

        if (config && this.repository) {
            console.warn("CommentsService config applied multiple times!");
            return this;
        }

        this.repository = config.repository;

        return this;
    }

    getAllComments(id) {
        return this.repository.getAllComments(id);
    }

    async postComment(comment) {
        if (isBlank(comment.content)) return { status: CommentErrorType.ContentMissing };
        const result = await this.repository.postComment(comment);
        if (result.authorMissing) return { status: CommentErrorType.MissingAuthor };
        else return { status: CommentErrorType.OK };
    }
}

const instance = new CommentsService();

export const commentsService = config => instance.applyConfig(config);