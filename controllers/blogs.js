const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user');

  res.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.post('/', async (req, res) => {
  const body = req.body;
  const token = getTokenFrom(req);

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: !body.title ? undefined : body.title,
    author: body.author,
    url: !body.url ? undefined : body.url,
    likes: !body.likes ? 0 : body.likes,
    user: user._id
  });

  if (body.title === undefined || body.url === undefined) {
    res.status(400).end();
  } else {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.json(savedBlog.toJSON());
  }

});

blogsRouter.delete('/:id', async (req, res) => {
  const token = getTokenFrom(req);

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);
  const blog = await Blog.findById(req.params.id);

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } else {
    return res.status(401).json({ error: 'error' });
  }
});

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body;

  const blog = {
    user: body.user,
    title: !body.title ? undefined : body.title,
    author: body.author,
    url: !body.url ? undefined : body.url,
    likes: !body.likes ? 0 : body.likes
  };

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id, blog, { new: true }
  );
  res.json(updatedBlog.toJSON);

});

module.exports = blogsRouter;
