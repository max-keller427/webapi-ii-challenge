const express = require("express");

const router = express.Router();

const db = require("../data/db.js");

router.post("/", (req, res) => {
  const newPost = req.body;
  if (newPost.title && newPost.contents) {
    res.status(201).json(newPost);
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
  db.insert(newPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    });
});

router.get("/", (req, res) => {
  db.find(req.body)
    .then(body => {
      res.json(body);
    })
    .catch(err => {
      res
        .json(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(post => {
      if (post.length) {
        res.json(post);
      } else {
        res
          .status(500)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(error =>
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." })
    );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then(post => {
      if (post) {
        res.json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  if (changes.title && changes.contents) {
    db.update(id, changes)
      .then(change => {
        //   console.log(id);
        if (change) {
          db.findById(id).then(updatedPost => {
            res.json(updatedPost);
          });
        } else {
          res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: "The user information could not be modified." });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the user."
    });
  }
});

module.exports = router;
