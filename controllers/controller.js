const feedModel = require('../models/feedModel');

const renderHomePage = (req, res) => {
  const date = new Date();
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  const formattedDate = `${month}/${day}/${year}`;
  console.log(formattedDate);

  return feedModel
    .find()
    .sort({ date: -1 })
    .then((feeds) => {
      // display the delete and success messages on the homepage
      const messageDelete = req.query.messageDelete || '';
      const messageSuccess = req.query.messageSuccess || '';

      res.render('homepage', {
        title: 'Home Page',
        feeds: feeds,
        message: '',
        messageDelete: messageDelete,
        messageSuccess: messageSuccess,
        formattedDate: formattedDate,
        messageErr: '',
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(404)
        .render('404', { messageError: 'No posts founded', title: '' });
    });
};

const addPost = (req, res) => {
  const { name, message } = req.body;
  console.log(req.body);

  if (!name || !message) {
    return feedModel
      .find()
      .sort({ date: -1 })
      .then((feeds) => {
        return res.render('homepage', {
          message: '',
          messageError: 'All fields are required!Please fill in!',
        });
      })
      .catch((err) => {
        console.log(err);
        res
          .status(404)
          .render('404', { messageError: 'Unable to fetch posts', title: '' });
      });
  }

  if (name.length > 15 || message.length > 40) {
    return feedModel
      .find()
      .sort({ date: -1 })
      .then((feeds) => {
        return res.render('homepage', {
          messageErr:
            'The name field have to be no longer then 15 characters and the message field no longer then 40 characters!',
        });
      })
      .catch((err) => {
        console.log(err);
        res
          .status(404)
          .render('404', { messageError: 'Unable to fetch posts', title: '' });
      });
  } else {
    // Formatting the date
    const formattedDate = new Date().toLocaleDateString('en-GB');

    let newFeed = new feedModel({
      name: name,
      message: message,
      date: new Date(),
      formattedDate: formattedDate,
    });

    newFeed
      .save()
      .then(() => res.redirect(`/feed?messageSuccess=Post successfully added`))
      .catch((err) => {
        console.log(err);

        // Handle errors during save
        return feedModel
          .find()
          .sort({ date: -1 })
          .then((feeds) => {
            res.render('homepage', {
              msgError: 'An error occurred, please try again.',
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(403).render('404', {
              messageError: 'Unable to fetch posts',
              title: '',
            });
          });
      });
  }
};

const renderDetailsPost = (req, res) => {
  const messageSuccess = req.query.messageSuccess || '';
  const feedId = req.params.feedId;
  feedModel
    .findById(feedId)
    .then((feed) => {
      if (!feed) {
        return res.render('404', { messageError: 'Post not found', title: '' });
      }

      res.render('detailsPost', {
        title: 'details Post',
        feed: feed,
        messageError: '',
        messageSuccess: messageSuccess,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).render('404', {
      messageError: 'Error retrieving Post Details',

      });
    });
};

const editPostPage = (req, res) => {
  const feedId = req.params.feedId;
  console.log(feedId);

  feedModel
    .findById(feedId)
    .then((feedInfo) => {
      if (!feedInfo) {
        return res.render('404', {
          messageError: 'Posts not found',
         
        });
      }
      return res.render('editPost', {
       feed: feedInfo,
        title: '',
        messageError: '',
      });
    })
    .catch((err) => {
      console.log(err);
      return res.render('404', { messageError: 'Error retrieving posts' });
    });
};

const editPostForm = (req, res) => {
  const feedId = req.params.feedId;
  console.log(feedId);

  // Find the post by ID
  feedModel
    .findById(feedId)
    .then((post) => {
      if (!post) {
        return res.render('404', { messageError: 'Post not found', title: '' });
      }

      let { name, message } = req.body;
      name = name.trim();
      message = message.replace(/^"|"$/g, '').trim();

      // Validate name and message fields length
      if (name.length > 15 || message.length > 40) {
        return res.render('editPost', {
          messageError:
            'The name field must be no longer than 15 characters and the message field must to be no longer than 40  characters',
          feedId: feedId,
          name: name,
          message: message,
          title: 'Edit Post Form',
          feed: post,
        });
      }

      // Check if the user didn't make any changes to the inputs
      if (name === post.name && message === post.message) {
        return res.render('editPost', {
          messageError: 'No changes made to the post!',
          feedId: feedId,
          name: name,
          message: message,
          title: 'Edit Post Form',
          feed: post,
        });
      }

      // Check if fields are empty
      if (!name || !message) {
        return res.render('editPost', {
          messageError: 'All fields are required! Please fill them in!',
          feedId: feedId,
          name: name,
          message: message,
          title: 'Edit Post Form',
          feed: post,
        });
      }

      // Update the post in the database
      feedModel
        .findByIdAndUpdate(
          feedId,
          { name: name, message: message },
          { new: true }
        )
        .then((updatedPost) => {
          if (!updatedPost) {
            return res.render('404', {
              messageError: 'Post not found',
              title: '',
            });
          }
          return res.redirect(`/feed/${updatedPost._id}`);
        })
        .catch((err) => {
          console.log(err);
          return res.render('editPost', {
            messageError: 'Error updating post. Please try again!',
            feedId: feedId,
            name: name,
            message: message,
            title: 'Edit Post Form',
          });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.render('404', { messageError: 'Post not found', title: '' });
    });
};

const deletePost = (req, res) => {
  const feedId = req.params.feedId;

  console.log('Deleting post:', feedId);

  // Find the post and delete it
  feedModel
    .findByIdAndDelete(feedId)
    .then((deletedFeed) => {
      if (!deletedFeed) {
        return res
          .status(404)
          .render('404', { messageError: 'Post not found', messageErr: '' });
      }
      res.redirect(`/feed?messageDelete=Post successfully deleted`);
    })
    .catch((err) => {
      console.error('Error deleting post:', err);
      res.status(401).render('404', {
        messageError: 'Server error while deleting post',
        title: '404',
      });
    });
};

const notFoundPage = (req, res) => {
  res.status(404).render('404', { title: '404' });
};

module.exports = {
  renderHomePage,
  addPost,
  renderDetailsPost,
  editPostPage,
  editPostForm,
  deletePost,
  notFoundPage,
};
