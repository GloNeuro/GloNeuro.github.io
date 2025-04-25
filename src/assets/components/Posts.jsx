// src/components/Posts.js
import React, { useEffect, useState } from 'react';
import BlogCard from './BlogCard';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loadingDots, setLoadingDots] = useState('');
  const apiRoot = import.meta.env.VITE_API_ROOT;

  useEffect(() => {
    // Dot animation
    const dotInterval = setInterval(() => {
      setLoadingDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    // Fetch posts
    fetch(`${apiRoot}/pages`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => setPosts(data))
      .catch(err => console.error('Failed to fetch posts:', err))
      .finally(() => clearInterval(dotInterval)); // Stop animation when done

    return () => clearInterval(dotInterval); // Clean up interval on unmount
  }, [apiRoot]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Blog Posts</h2>
      <div className="flex flex-wrap gap-4 justify-center items-center">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="w-full sm:w-1/2 md:w-1/3">
              <BlogCard
                title={post?.title?.rendered || 'Untitled'}
                content={post?.content?.rendered || ''}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 font-medium">Loading{loadingDots}</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
