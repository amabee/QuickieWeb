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
        message: JSON.stringify(res.data) || "No user found",
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
