const express = require('express');

const router = express.Router(); /// 

const users = require("./userDb.js")
const posts = require("./../posts/postDb.js")

router.post('/', validateUser, (req, res) => {
  users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'We f***** up',
      });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const id = req.params.id;
  const text = req.body.text;
  posts.insert({ user_id: id, text: text })
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "We f***** up" })
    });
});

router.get('/', (req, res) => {
  users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'We f***** up',
      });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  users.getById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "Couldnt find that dude" })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "We f***** up",
      });
    });
});

router.get('/:id/posts', (req, res) => {
  users.getUserPosts(req.params.id)
    .then(posts => {
      if (posts.length > 0) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: "That guy didnt write any posts" })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "We f***** up"
      });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  users.remove(id)
    .then(user => {
      if (user) {
        res.status(200).json({ message: 'Theyre swimming with the fishes' });
      } else {
        res.status(404).json({ message: 'Couldnt find that dude' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'We f***** up',
      });
    });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  users.update(id, changes)
    .then(user => {
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({
          message: "That dude doesnt exist"
        })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "We f***** up"
      })
    })
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  users.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({
          message: "Couldnt find the dude with that Id"
        })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "We f***** up"
      })
    })
}

function validateUser(req, res, next) {
  const userData = req.body;

  if (userData) {
    if (userData.name) { next(); }
    else { res.status(400).json({ message: "missing required name field" }) }
  } else { res.status(400).json({ message: "missing user data" }) }
}

function validatePost(req, res, next) {
  const post = req.body;

  if (post) {
    if (post.text) { next(); }
    else { res.status(400).json({ message: "aint got no text!" }) }
  } else { res.status(400).json({ message: "aint got no data!" }) }
}

module.exports = router;
