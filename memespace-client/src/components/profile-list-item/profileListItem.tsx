import React from 'react';
import robloxImg from '../../assets/roblox.png'; // Import the image
import "./profileListItem.scss";

export default function ProfileListItem(props) {
  return (
    <div className="profile-list-item-container" style={props.user?.bannerColor && {"backgroundColor": props.user?.bannerColor}}>
        <img className="profile-picture" src={props.user?.profilePictureURL ? "http://localhost:8000/uploads/profile/" + props.user.profilePictureURL : robloxImg} alt="no profile picture" />
        <div id="username">{props.user?.displayname}</div>
    </div>
  );
};