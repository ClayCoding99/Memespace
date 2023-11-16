import React, { useContext, useEffect, useState } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useLocation } from 'react-router-dom';
import { getPosts } from '../util/clientHTTPFunctions';
import { Post } from '../components/post/post';
import ProfileListItem from '../components/profile-list-item/profileListItem';
import PostModal from '../components/modals/PostModal';
import './PageTemplate.scss';

export default function PageTemplate() {
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const { user } = useUser();

  const [posts, setPosts] = useState(null);
  const [contentType, setContentType] = useState("Images");

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  
  useEffect(() => {
    
      // lazy load posts
      if (contentType === "Images" && !posts) {
        async function fetchPosts() {
          const route = location.pathname.replace('/', '');
          console.log(route);
    
          const postResponse = await getPosts('createdAt', false, 0, 0);
          if (!postResponse.error) {
            setPosts(postResponse.posts);
          }
        }
        fetchPosts();
      }
    
  }, [contentType]);


  return (
    <>
      <PostModal isEditing={false} user={user} show={show} handleShow={handleShow} handleClose={handleClose} />

      <div className="home-container">
        <ul className="profile-types">
          <li onClick={() => setContentType("Images")}
            className={contentType === "Images" ? "profile-type active" : "profile-type"}>Images</li>
          <li onClick={() => setContentType("Videos")}
            className={contentType === "Videos" ? "profile-type active" : "profile-type"}>Videos</li>
        </ul>

        {auth && (
          <ListGroup horizontal className="w-100 text-center">
            <ListGroup.Item>
              <ProfileListItem />
            </ListGroup.Item>
            <ListGroup.Item className="w-100">
              <Button className="w-100" onClick={handleShow}>Create Post</Button>
            </ListGroup.Item>
          </ListGroup>
        )}

        <div className="posts-container">
          {!posts && <div>Loading posts...</div>}
          {posts && 
            posts.map((post, index) => {
              if (contentType === "Images") {
                return post.fileType !== "video/mp4" && <Post post={post} key={index} />
              }
              if (contentType === "Videos") {
                return post.fileType === "video/mp4" && <Post post={post} key={index} />
              }
            })
          }
        </div>
        
      </div>
    </>
  );
}