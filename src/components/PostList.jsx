// components/PostList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data.posts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
      {posts.map(post => (
        <div key={post.id} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 8 }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              style={{ width: "100%", height: "auto", borderRadius: 4 }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PostList;