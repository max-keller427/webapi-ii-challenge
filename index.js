const express = require("express");

const server = express();

const postsRoutes = require("./postsRoutes/postsRoutes.js");

server.use(express.json());
server.use("/api/posts", postsRoutes);

server.listen(4000, () => {
  console.log("running");
});
