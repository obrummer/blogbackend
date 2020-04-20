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

const mostFrequent = (array) => {
  let map = array.map((a) => array.filter((b) => a === b).length);

  return array[map.indexOf(Math.max.apply(null, map))];
};

const mostBlogs = blogs => {
  let result = {};
  const authorList = blogs.map(blog => blog.author);
  const commonAuthor = mostFrequent(authorList);
  const aCount = new Map([...new Set(authorList)].map(
    x => [x, authorList.filter(y => y === x).length]
  ));
  result.author = commonAuthor;
  result.blogs = aCount.get(commonAuthor);
  return result;
};

const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const mostLikes = blogs => {
  const authorArray = blogs.reduce(function(acc, val){
    const o = acc.filter(function(obj){
      return obj.author === val.author;
    }).pop() || { author:val.author, likes:0 };

    o.likes += val.likes;
    acc.push(o);
    return acc;
  },[]);

  const uniqueAuthorArray = authorArray.filter(unique);

  const maxValueOfLikes = Math.max(...uniqueAuthorArray.map(o => o.likes), 0);
  const result = uniqueAuthorArray.find(item => item.likes === maxValueOfLikes);

  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
