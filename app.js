const express = require("express");
const app = express();
const port = 4000;
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route");
const postsRouter = require("./routes/posts.route");
const commentsRouter = require("./routes/comments.route");
const likesRouter = require("./routes/likes.route");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");


app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(express.json());
app.use(cookieParser());
app.use("/", [authRouter]);
app.use("/posts", [likesRouter, postsRouter, commentsRouter]);


app.listen(port, () => {
  console.log(port, "Port Has Opened!!!");
});
