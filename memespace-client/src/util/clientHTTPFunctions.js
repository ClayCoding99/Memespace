import { axiosInstance } from "../context/AuthContext";

export async function getUserPosts() {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const endpoint = `http://localhost:8000/v1/post/userPost`;
    const options = {
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${accessToken}`
      }
    };
    const response = await axiosInstance.get(endpoint, options);
    return response.data;
  } catch (error) {
    console.error("Could not get user posts: " + error);
    return { error: error };
  }
}

export async function getUsers() {
  try {
    const response = await axiosInstance.get("http://localhost:8000/v1/user/all");
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: error };
  }
}

export async function getAuthUser() {
  try {
    const authToken = localStorage.getItem('accessToken');
    const response = await axiosInstance.get('http://localhost:8000/v1/user', {
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("could not get user: " + error);
    return { error: error };
  }
}

export async function getUser(email) {
  try {
    const response = await axiosInstance.get(`http://localhost:8000/v1/user/${email}`, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    return response.data; 
  } catch (error) {
    console.error("could not get user: " + error);
    return {error: error};
  }
}

export async function createPost(postData) {
  try {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('file', postData.postFile);
    formData.append('description', postData.description);
    formData.append('fileType', postData.fileType);

    const response = await axiosInstance.post('http://localhost:8000/v1/post/create', formData);
    return response.data;
  } catch (error) {
    console.error('could not create post: ' + error);
    return { error: error };
  }
}

export async function updateProfile(profileData) {
  try {
    const formData = new FormData();
    formData.append('displayname', profileData.displayname);
    formData.append('bio', profileData.bio);
    formData.append('profilePicture', profileData.profilePicture);
    formData.append('gender', profileData.gender);
    formData.append('bannerColor', profileData.bannerColor);

    const endpoint = `http://localhost:8000/v1/user/update`;
    const response = await axiosInstance.patch(endpoint, formData);
    return response.data;
  } catch (error) {
    console.error('could not update profile: ' + error);
    return { error: error };
  }
}

export async function getPosts(sortType = "updatedAt", asc = false, limit = 0, after = 0) {
  try {
    const endpoint = `http://localhost:8000/v1/post?sortType=${sortType}&asc=${asc}&limit=${limit}&after=${after}`;
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: error };
  }
}

export async function deletePost(postID) {
  try {
    const endpoint = `http://localhost:8000/v1/post/delete/${postID}`;
    const response = await axiosInstance.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: error };
  }
}