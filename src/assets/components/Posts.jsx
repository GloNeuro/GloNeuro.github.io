// src/components/Posts.js
import React, { useEffect, useState } from 'react';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('https://gloneuro.org/wp-json/wp/v2/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div>
      <h2>Blog Posts</h2>
      {posts.map(post => (
        <div key={post.id}>
          <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
        </div>
      ))}
    </div>
  );
};

export default Posts;
