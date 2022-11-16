import express from "express";
import config from "./config.js";
import path from "node:path/posix";

import { Chateau } from "./index.js";

console.dir(config);

const app = express();

const chateauApp = new Chateau(config).expressRouter();

app.use("/", chateauApp);
app.use("/", (req, res) => res.sendFile(path.resolve("./prototype.html")));

app.listen(5173);