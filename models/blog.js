const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const blogSchema = new mongoose.Schema({
  title: { type: String },
  author: { type: String },
  url: { type: String },
  likes: { type: Number }
});

blogSchema.plugin(uniqueValidator);

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Blog', blogSchema);
