const dummy = blogs => {
  return blogs.length;
};

const totalLikes = blogs => {
  const result = blogs.reduce(function(prev, cur) {
    return prev + cur.likes;
  }, 0);
  return blogs.length === 0 ? 0 : result;
};

const favoriteBlog = blogs => {
  const maxValueOfLikes = Math.max(...blogs.map(o => o.likes), 0);
  const bestBlogObject = blogs.find(item => item.likes === maxValueOfLikes);
  return bestBlogObject;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
