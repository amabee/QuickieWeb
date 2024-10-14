import axios from "axios";

const USERS_ENDPONT = process.env.NEXT_PUBLIC_USERS_ACTIONS;

export const searchUser = async (searchData, id) => {
  try {
    const res = await axios.get(USERS_ENDPONT, {
      params: {
        operation: "searchUser",
        json: JSON.stringify({
          search_query: searchData,
          current_user_id: id,
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
        message: "Displaying list of users based on your input",
        data: res.data.success,
      };
    } else {
      return {
        success: false,
        message: "No user found",
        data: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Oopps! something went wrong with the system.",
      data: null,
    };
  }
};

export const suggestUsers = async (user_id) => {
  try {
    const res = await axios.get(USERS_ENDPONT, {
      params: {
        operation: "suggestUsersToFollow",
        json: JSON.stringify({
          user_id: user_id,
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
        message: "Showing the suggested users...",
        data: res.data.success,
      };
    } else {
      return {
        success: false,
        message:
          JSON.stringify(res.data) ||
          "Suggested Users Not Available Right Now...",
        data: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong fetching suggested users",
      data: null,
    };
  }
};

export const followUser = async ({ formData }) => {
  try {
    const res = await axios({
      url: USERS_ENDPONT,
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
        message: "success",
        data: null,
      };
    } else {
      return {
        success: false,
        message: JSON.stringify(res.data),
        data: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Oopps! something went wrong with the system.",
      data: null,
    };
  }
};

export const unfollowUser = async ({ formData }) => {
  try {
    const res = await axios({
      url: USERS_ENDPONT,
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
        message: "success",
        data: null,
      };
    } else {
      return {
        success: false,
        message: JSON.stringify(res.data),
        data: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Oopps! something went wrong with the system.",
      data: null,
    };
  }
};

export const getCurrentUser = async (user_id) => {
  try {
    const res = await axios.get(USERS_ENDPONT, {
      params: {
        operation: "getCurrentUser",
        json: JSON.stringify({
          current_user_id: user_id,
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
        message: "Showing current user data",
        data: res.data.success,
      };
    } else {
      return {
        success: false,
        message:
          JSON.stringify(res.data) ||
          "Something went wrong fetching current user data",
        data: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong with the system",
      data: null,
    };
  }
};

export const getCurrentUserPosts = async (user_id) => {
  try {
    const res = await axios.get(USERS_ENDPONT, {
      params: {
        operation: "getCurrentUserPosts",
        json: JSON.stringify({
          current_user_id: user_id,
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
        message: "Showing current user posts",
        data: res.data.success,
      };
    } else {
      return {
        success: false,
        message:
          JSON.stringify(res.data) ||
          "Something went wrong fetching current user posts",
        data: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong with the system",
      data: null,
    };
  }
};

export const getCurrentUserFollowers = async (user_id) => {
  try {
    const res = await axios.get(USERS_ENDPONT, {
      params: {
        operation: "getCurrentUserFollowers",
        json: JSON.stringify({
          current_user_id: user_id,
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
        message: "Showing current user followers",
        data: res.data.success,
      };
    } else {
      return {
        success: false,
        message:
          JSON.stringify(res.data) ||
          "Something went wrong fetching current user followers",
        data: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong with the system",
      data: null,
    };
  }
};

export const getCurrentUserFollowings = async (user_id) => {
  try {
    const res = await axios.get(USERS_ENDPONT, {
      params: {
        operation: "getCurrentUserFollowing",
        json: JSON.stringify({
          current_user_id: user_id,
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
        message: "Showing current user followers",
        data: res.data.success,
      };
    } else {
      return {
        success: false,
        message:
          JSON.stringify(res.data) ||
          "Something went wrong fetching current user followers",
        data: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong with the system",
      data: null,
    };
  }
};

export const updateProfile = async ({ formData }) => {
  try {
    const res = await axios({
      url: USERS_ENDPONT,
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
        message: "Profile updated successfully",
        data: res.data.success,
      };
    } else {
      return {
        success: false,
        message: JSON.stringify(res.data),
        data: null,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error,
      data: null,
    };
  }
};

export const canPostAgainFunc = async (user_id) => {
  try {
    const res = await axios.get(USERS_ENDPONT, {
      params: {
        operation: "canPostAgain",
        json: JSON.stringify({
          user_id,
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

    if (res.data.can_post == true) {
      return {
        success: true,
        message: "User can post again.",
        data: res.data,
      };
    } else {
      return {
        success: false,
        message: res.data.remaining_time
          ? `User cannot post yet. Remaining time: ${res.data.remaining_time}`
          : "Something went wrong fetching post status.",
        data: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong with the system: " + error.message,
      data: null,
    };
  }
};

export const updatePostCoolDown = async ({ formData }) => {
  try {
    const res = await axios({
      url: USERS_ENDPONT,
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
        message: "Cooldown",
        data: res.data.success,
      };
    } else {
      return {
        success: false,
        message: JSON.stringify(res.data),
        data: null,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error,
      data: null,
    };
  }
};

export const getNotifs = async (user_id) => {
  try {
    const res = await axios.get(USERS_ENDPONT, {
      params: {
        operation: "fetchNotifications",
        json: JSON.stringify({
          user_id: user_id,
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
        message: "Showing current user notifications",
        data: res.data.success,
      };
    } else {
      return {
        success: false,
        message:
          JSON.stringify(res.data) ||
          "Something went wrong fetching notifications",
        data: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong with the system",
      data: null,
    };
  }
};
