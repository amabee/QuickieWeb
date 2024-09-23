"use client";
import { React, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import "../../../public/styles/tailwind.css";
import toast, { Toaster } from "react-hot-toast";
import { login } from "@/lib/lib";

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (emailOrUsername.length <= 0 || password.length <= 0) {
      return toast.error("Email/Username Or Password is empty!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }

    toast.promise(
      (async () => {
        const { success, message } = await login(emailOrUsername, password);
        if (!success) {
          throw new Error(message);
        }
        return message;
      })(),
      {
        loading: "Logging in...",
        success: async (message) => {
          toast.success(message);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          window.location.href = "/";
        },
        error: (error) => error.message || "Login failed. Please try again.",
      }
    );

    setEmailOrUsername("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Toaster  />
      <Card className="w-full max-w-md bg-gray-800 text-white">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 mb-4">
            <img
              src="/images/pic2.png"
              alt="Logo"
              className="w-full h-full object-cover"
              width={45}
              height={45}
            />
          </div>
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-gray-400">Please sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email or Username</Label>
                <Input
                  id="email"
                  placeholder="Enter your email or username"
                  type="text"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-800 text-white mt-4"
              >
                Sign In
              </Button>
              <p className="text-sm text-gray-400 text-center">
                Don't have an account?{" "}
                <a
                  href="/auth/signup"
                  className="text-blue-400 hover:underline"
                >
                  Sign up
                </a>
              </p>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
