import { repository } from "./src/integrations/PostgreSQLCommentsRepository.js";
import { commentsService } from "./src/service/CommentsService.js";
import dotenv from "dotenv";

dotenv.config();

const myCommentsRepository = repository({
    url: `postgres://${process.env.POSTGRESQL_USERNAME_PASSWORD}@localhost:5432/chateau-local-test`,
});

const myCommentsService = commentsService({
    repository: myCommentsRepository,
});

export default {
    repository: myCommentsRepository,
    commentsService: myCommentsService,
    context: process.env.CHATEAU_CONTEXT,
    api: {
        cors: ["https://boraini.com", "http://localhost:3000"],
    },
};

//repository().getAllComments("///");