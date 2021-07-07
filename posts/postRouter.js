const express = require('express');

const posts = require("./postDb.js")

const router = express.Router();

const users = require("./../users/userDb")

router.get('/', (req, res) => {
  posts.get(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'we f***** up' })
    });
});

router.get('/:id', validatePostId, (req, res) => {
  const post = req.post;
  if (post) { res.status(200).json(post) }
  else { res.status(400).json({ message: "couldnt find that post" }) }
});

router.delete('/:id', validatePostId, (req, res) => {
  posts.remove(req.params.id)
    .then(response => {
      res.status(200).json({ message: `nuked` });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "we f***** up" })
    });
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  const id = req.params.id;
  const post = req.body.text;
  posts.update(id, { text: post })
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "its set in stone, couldnt edit" })
    });
});

// custom middleware

function validatePostId(req, res, next) {
  const id = req.params.id;
  posts.getById(id)
    .then(post => {
      if (post) { req.post = post; next(); }
      else { res.status(400).json({ message: "got the wrong post id bro" }) }
    });
}

function validatePost(req, res, next) {
  const post = req.body;

  if (post) {
    if (post.text) { next(); }
    else { res.status(400).json({ message: "aint got no text!" }) }
  } else { res.status(400).json({ message: "aint got no date!" }) }
}

module.exports = router;
