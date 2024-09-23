"use server";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
const AUTH_ENDPOINT = process.env.AUTH_URL;

const secretKey = process.env.SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export async function encrpyt(item) {
  return await new SignJWT(item)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });

  return payload;
}

export async function login(username, password) {
  try {
    const res = await axios.get(AUTH_ENDPOINT, {
      params: {
        operation: "login",
        json: JSON.stringify({
          username: username,
          password: password,
        }),
      },
    });
    if (res.status === 200) {
      if (res.data !== null && res.data.success) {
        const userData = {
          user_id: res.data.success.user_id,
        };

        const expiration = new Date(Date.now() + 150 * 60 * 1000);
        const session = await encrpyt({ user: userData, expiration });

        cookies().set("session", session, {
          expires: expiration,
          httpOnly: true,
        });

        return { success: true, message: "Login successful" };
      } else {
        return { success: false, message: JSON.stringify(res.data) };
      }
    } else {
      return { success: false, message: "Network Error" };
    }
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
}

export const signup = async (
  username,
  password,
  firstname,
  lastname,
  email
) => {
  const formData = new FormData();
  formData.append("operation", "signup");
  formData.append(
    "json",
    JSON.stringify({
      username: username,
      password: password,
      firstname: firstname,
      lastname: lastname,
      email: email,
    })
  );

  try {
    const res = await axios({
      url: AUTH_ENDPOINT,
      method: "POST",
      data: formData,
    });

    if (res.status === 200) {
      if (res.data !== null && res.data.success) {
        return {
          success: true,
          message: res.data.success,
        };
      } else {
        return {
          success: false,
          message: res.data.error,
        };
      }
    } else {
      return {
        success: false,
        message: res.statusText,
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        "Seems like there is something wrong right now. Please try again later ",
    };
  }
};

export async function logout() {
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;

  if (!session) {
    return null;
  }

  return await decrypt(session);
}

export async function updateSession(request) {
  const session = request.cookies.get("session")?.value;

  if (!session) {
    return null;
  }

  const parsedData = await decrypt(session);

  parsedData.exp = new Date(Date.now() + 10 * 1000);

  const res = NextResponse.next();

  res.cookies.set({
    name: "session",
    value: await encrpyt(parsedData),
    httpOnly: true,
    expires: parsedData.exp,
  });

  return res;
}
