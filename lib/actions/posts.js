import axios from "axios";

const POSTS_ENDPOINT = process.env.NEXT_PUBLIC_POST_URL;

export const createPost = async ({ formData }) => {
  try {
    const res = await axios({
      url: POSTS_ENDPOINT,
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status !== 200) {
      return {
        success: false,
        message: "Status Error: " + res.statusText,
        data: null,
      };
    }

    if (res.data.success) {
      return {
        success: true,
        message: "Post Submitted",
        data: null,
      };
    } else {
      return {
        success: false,
        message: JSON.stringify(res.data),
        data: null,
      };
    }
  } catch (e) {
    return { success: false, message: e, data: null };
  }
};

export const getPosts = async (userID, limit, offset) => {
  try {
    const res = await axios.get(POSTS_ENDPOINT, {
      params: {
        operation: "getPosts",
        json: JSON.stringify({
          userId: userID,
          limit: limit,
          offset: offset,
        }),
      },
    });

    if (res.status !== 200) {
      return {
        success: false,
        message: "Status Error: " + res.statusText,
        data: null,
      };
    }

    if (res.data.success) {
      return {
        success: true,
        message: JSON.stringify(res.data),
        data: res.data.success,
      };
    } else {
      return { success: false, message: JSON.stringify(res.data), data: null };
    }
  } catch (error) {
    return { success: false, message: e, data: null };
  }
};

export const likePost = async ({ formData }) => {
  try {
    const res = await axios({
      url: POSTS_ENDPOINT,
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status !== 200) {
      return {
        success: false,
        message: "Status Error: " + res.statusText,
        data: null,
      };
    }

    if (res.data.success) {
      return {
        success: true,
        message: "Post Submitted",
        data: null,
      };
    } else {
      return {
        success: false,
        message: JSON.stringify(res.data),
        data: null,
      };
    }
  } catch (e) {
    return { success: false, message: e, data: null };
  }
};

export const unlikePost = async ({ formData }) => {
  try {
    const res = await axios({
      url: POSTS_ENDPOINT,
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status !== 200) {
      return {
        success: false,
        message: "Status Error: " + res.statusText,
        data: null,
      };
    }

    if (res.data.success) {
      return {
        success: true,
        message: "Post Submitted",
        data: null,
      };
    } else {
      return {
        success: false,
        message: JSON.stringify(res.data),
        data: null,
      };
    }
  } catch (e) {
    return { success: false, message: e, data: null };
  }
};

export const getComments = async (postID) => {
  try {
    const res = await axios.get(POSTS_ENDPOINT, {
      params: {
        operation: "getComments",
        json: JSON.stringify({
          post_id: postID,
        }),
      },
    });

    if (res.status !== 200) {
      return {
        success: false,
        message: "Status Error: " + res.statusText,
        data: null,
      };
    }

    if (res.data.success) {
      return {
        success: true,
        message: "Comments unavailable",
        data: res.data.success,
      };
    } else {
      return { success: false, message: JSON.stringify(res.data), data: null };
    }
  } catch (error) {
    return { success: false, message: e, data: null };
  }
};

export const sendComment = async ({ formData }) => {
  try {
    const res = await axios({
      url: POSTS_ENDPOINT,
      method: "POST",
      data: formData,
    });

    if (res.status !== 200) {
      return {
        success: false,
        message: "Status Error: " + res.statusText,
        data: null,
      };
    }

    if (res.data.success) {
      return {
        success: true,
        message: "Comment Submitted",
        data: null,
      };
    } else {
      return {
        success: false,
        message: JSON.stringify(res.data),
        data: null,
      };
    }
  } catch (e) {
    return { success: false, message: e, data: null };
  }
};
