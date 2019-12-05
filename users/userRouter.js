const express = require('express');

const router = express.Router(); /// 

const users = require("./userDb.js")

router.post('/', (req, res) => {
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

router.post('/:id/posts', (req, res) => {
  // do your magic!
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

router.get('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

router.put('/:id', (req, res) => {
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

}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
