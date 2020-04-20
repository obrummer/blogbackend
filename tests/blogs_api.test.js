const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

const api = supertest(app);

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('id is defined', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body[0].id).toBeDefined();
});

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'How not to use Express',
    author: 'Olli B',
    url: 'https://uri.js',
    likes: 7,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const title = blogsAtEnd.map(n => n.title);
  expect(title).toContain(
    'How not to use Express'
  );
});

test('if likes is undefined, value is null', async () => {
  const newBlog = {
    title: 'Ei nollaa',
    author: 'joo',
    url: 'https:',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();

  const like = (blogsAtEnd.map(n => n.likes)).slice(-1)[0];
  expect(like).toBe(
    0
  );
});

test('blog without title or url receive 400', async () => {
  const newBlog = {
    author: 'jyri',
    likes: 7,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
});


afterAll(() => {
  mongoose.connection.close();
});
