// src/components/Posts.js
import React, { useEffect, useState } from 'react';
import Card from './Card';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  const username = import.meta.env.VITE_API_USERNAME;
  const password = import.meta.env.VITE_API_PASSWORD;
  const apiRoot = import.meta.env.VITE_API_ROOT;

  useEffect(() => {
    const base64Credentials = btoa(`${username}:${password}`);

    fetch(`${apiRoot}/pages`, {
      headers: {
        'Authorization': `Basic ${base64Credentials}`
      }
    })
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Error fetching posts:', err));
  }, []);

  return (
    <>
      <h2>Blog Posts</h2>
      <div className='flex'>
        {posts.map(post => (
          <div key={post.id}>
            <Card
              title={post.title.rendered}

            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Posts;
