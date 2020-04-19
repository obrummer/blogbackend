const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const title = process.argv[3];
const author = process.argv[4];
const urli = process.argv[5];
const likes = process.argv[6];

const url = `mongodb+srv://obrummer:${password}@cluster1-ayu9i.mongodb.net/blog?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const blogSchema = new mongoose.Schema({
  title: { type: String },
  author: { type: String },
  url: { type: String },
  likes: { type: Number }
});

const Blog = mongoose.model('Blog', blogSchema);

const blog = new Blog({
  title: title,
  author: author,
  url: urli,
  likes: likes
});

if (process.argv.length === 3) {
  Blog.find({}).then(result => {
    result.forEach(blog => {
      console.log(blog);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length > 3) {
  blog.save().then(() => {
    console.log(`added ${title} author ${author} to blog`);
    mongoose.connection.close();
  });
}
