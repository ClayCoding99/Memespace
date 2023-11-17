import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import "./Profile.scss";
import { Post } from '../components/post/post.jsx';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import EditProfileModal from '../components/modals/editProfileModal';
import { Spinner } from 'react-bootstrap';

import { useUser } from '../context/UserContext';
import { getUserPosts, getUsers } from "../util/clientHTTPFunctions";

export default function Profile() {

  // for edit profile modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {auth, authLoading, logout} = useContext(AuthContext);
  const {user, setUser, userLoading} = useUser();
  
  const [posts, setPosts] = useState(null);
  const [contentType, setContentType] = useState('posts');

  useEffect(() => {
    async function get() {
      let response = await getUserPosts();
      if (response.userPosts !== null) {
        setPosts(response.userPosts);
      }
    }
    if (!userLoading) {
      get();
    }
  }, [userLoading]);

  // redirect player back to home page if they are not authenticated
  if (!auth && !authLoading) {
    window.location.href = "/home";
  }

  function handleLogout() { 
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
      }
    });
  }
  
  function removePost(postToRemove) {
    console.log(console.log(postToRemove));
    // Create a new array that excludes the post to be removed
    const updatedPosts = posts.filter((post) => post["_id"] !== postToRemove["_id"]);

    // Update the state with the new array
    setPosts(updatedPosts);
  }

  return (
    <>
    {userLoading && <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>}
    {user && 
      <div className="profile-container">
      <EditProfileModal setUser={setUser} user={user} handleShow={handleShow} handleClose={handleClose} show={show} />

      <header style={user.bannerColor && {"background-color": user.bannerColor}}>
        <img src={"http://localhost:8000/uploads/profile/" + user.profilePictureURL} alt="Roblox Logo" />
        <section className="profile-info">
          <div className="profile-info-top">
            <div className="profile-displayname">{user.displayname}</div>
            <Button onClick={handleShow}>Edit Profile</Button>
            <Button onClick={handleLogout}>Log out</Button>
          </div>
          <div className="profile-info-bottom">
            {user.gender && user.gender !== '' && <div>{user.gender}</div>}
            <div className="bio">
              <p>{user.bio}</p>
            </div>
          </div>
        </section>
      </header>

      <ul className="profile-types">
        <li onClick={() => setContentType("posts")}
          className={contentType === "posts" ? "profile-type active" : "profile-type"}>Posts</li>
        <li onClick={() => setContentType("likes")}
          className={contentType === "likes" ? "profile-type active" : "profile-type"}>Likes</li>
        <li onClick={() => setContentType("saved")}
          className={contentType === "saved" ? "profile-type active" : "profile-type"}>Saved</li>
      </ul>

      {contentType === 'posts' && posts !== null &&
        <div className='profile-post-content'>
        {posts && 
          posts.map((post, index) => {
            return <Post key={index} post={post} canModifyPost={true} removePost={removePost} />
          })
        }
        </div>
      }

      {contentType === 'likes' && 
        <div>You Currently Have nothing liked!</div>
      }

      {contentType === 'saved' && 
        <div>You Currently Have nothing saved!</div>
      }

    </div>
    }
    </>
  );

};