const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('post');
const requireLogin = require('../middleware/requireLogin');

router.get('/allpost', requireLogin, (req, res) => {
  Post.find()
    .populate('postedBy', '_id name')
    .populate('comments.postedBy', '_id name')
    .sort('-createdAt')
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/getpost', requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate('postedBy', '_id name')
    .populate('comments.postedBy', '_id name')
    .sort('-createdAt')
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/createpost', requireLogin, (req, res) => {
  const { title, body, img } = req.body;
  if (!title || !body || !img) return res.status(422).json({ error: 'Please fill in all details' });

  req.user.password = undefined;

  const post = new Post({
    title,
    body,
    photo: img,
    postedBy: req.user
  });

  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/myposts', requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate('postedBy', '_id name')
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put('/like', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likedBy: req.user._id }
    },
    {
      new: true
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: error });
    } else {
      res.json(result);
    }
  });
});

router.put('/unlike', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likedBy: req.user._id }
    },
    {
      new: true
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: error });
    } else {
      res.json(result);
    }
  });
});

router.put('/comment', requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment }
    },
    {
      new: true
    }
  )
    .populate('comments.postedBy', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: error });
      } else {
        res.json(result);
      }
    });
});

router.delete('/delete/:postId', requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate('postedBy', '_id')
    .exec((err, post) => {
      if (err || !post) {
        res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});
module.exports = router;
