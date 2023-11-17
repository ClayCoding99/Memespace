import React, { useEffect, useState, useRef } from 'react'
import ProfileListItem from '../profile-list-item/profileListItem';
import ReadMoreText from '../readmoretext';

import robloxImg from "../../assets/roblox.png";

import "./post.scss";

import { faListDots } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Card, Button } from 'react-bootstrap';

import { faThumbsUp, faThumbsDown, faComment, faShare, faSave } from '@fortawesome/free-solid-svg-icons';
import { deletePost, getUser } from '../../util/clientHTTPFunctions';

import ModifyPostModal from '../modals/modifyPostModal';

export function Post(props) {

  // for modify post modal
  const [showModifyOptions, setShowModifyOptions] = useState(false);
  const handleShowModifyPostOptions = () => setShowModifyOptions(true);
  const handleCloseModifyPostOptions = () => setShowModifyOptions(false);

  const [postUser, setPostUser] = useState(null);

  const videoRef = useRef(null);

  // only let the video play if it is more than halfway on screen
  function handleWhenVideoShouldPlay() {
    const videoElement = videoRef.current;

    const options = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.5, // Play the video when at least 50% of the video is in the viewport
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Video is in the viewport, play it
        if (videoElement && !videoElement.paused) {
          videoElement.play();
        }
      } else {
        // Video is out of the viewport, pause it
        if (videoElement && !videoElement.paused) {
          videoElement.pause();
        }
      }
    }, options);

    if (videoElement) {
      observer.observe(videoElement);
    }

    // cleanup
    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }

  useEffect(() => {
    async function get() {
      if (!props.post.userID) {
        throw error("Cannot get post user because the post doesn't have the user ID!");
      }
      const postUserResponse = await getUser(props.post.userID);
      if (!postUserResponse.error) {
        console.log(postUserResponse.user.displayname);
        return setPostUser(postUserResponse.user);
      } else {
        throw error("Could not obtain user due to the following: " + postUserResponse.error);
      }
    }
    get();

    return handleWhenVideoShouldPlay();
  }, []);

  return (
      <>
        <ModifyPostModal post={props.post} removePost={props.removePost} show={showModifyOptions} handleShow={handleShowModifyPostOptions} handleClose={handleCloseModifyPostOptions}/>

        <Card className="text-left">
          <Card.Header>
            <div className="post-header">
              <div className="post-header-left">
                {postUser && <ProfileListItem user={postUser}/>}
                <img id="communityImg" src={robloxImg}/>
                <div id="post-time">{props.post.time}</div>
              </div>
              <div className="post-extras" style={props.canModifyPost && {"cursor": "pointer"}} onClick={() => props.canModifyPost && handleShowModifyPostOptions()}><FontAwesomeIcon icon={faListDots}></FontAwesomeIcon></div>
            </div>
          </Card.Header>
          <Card.Body>
            <Card.Title>{props.post.title}</Card.Title>

            {props.post.fileType === 'video/mp4' ? (
              <video ref={videoRef} width="100%" controls autoPlay>
                <source src={`http://localhost:8000/uploads/posts/${props.post.fileURL}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img className="d-block w-100" src={`http://localhost:8000/uploads/posts/${props.post.fileURL}`} alt="First slide" />
            )}

            <div className="post-description">
              <ReadMoreText text={props.post.description} maxLength={300} />
            </div>
          </Card.Body>
          <Card.Footer className="text-muted">
            <div className="post-bottom">
              <div className="post-bottom-left">
                <div>
                  <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon> <span> Like</span>
                </div>
                <div>
                  <FontAwesomeIcon icon={faThumbsDown}></FontAwesomeIcon> <span> Dislike</span>
                </div>
                <div>
                  <FontAwesomeIcon icon={faComment}></FontAwesomeIcon> <span>69 Comments</span>
                </div>
                <div>
                  <FontAwesomeIcon icon={faShare}></FontAwesomeIcon> <span> Share</span>
                </div>
              </div>
              <div className="post-bottom-right">
                <div>
                  <FontAwesomeIcon icon={faSave}></FontAwesomeIcon><span> Save</span>
                </div>
              </div>
            </div>
          </Card.Footer>
        </Card>
      </>
    )
}

{/* <Carousel data-bs-theme="dark">
  //   <Carousel.Item>
  //     <img
  //       className="d-block w-100"
  //       src={robloxImg}
  //       alt="First slide"
  //     />
  //     <Carousel.Caption>
  //       <h5></h5>
  //       <p></p>
  //     </Carousel.Caption>
  //   </Carousel.Item>
  //   {/* <Carousel.Item>
  //   <img
  //       className="d-block w-100"
  //       src={robloxImg}
  //       alt="First slide"
  //     />
  //     <Carousel.Caption>
  //       <h5></h5>
  //       <p></p>
  //     </Carousel.Caption>
  //   </Carousel.Item>
  //   <Carousel.Item>
  //       <img
  //       className="d-block w-100"
  //       src={robloxImg}
  //       alt="First slide"
  //     />
  //     <Carousel.Caption>
  //       <h5></h5>
  //       <p></p>
  //     </Carousel.Caption>
  //   </Carousel.Item>
  // </Carousel> */}