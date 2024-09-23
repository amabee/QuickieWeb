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
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import "../../../public/styles/tailwind.css";
import { validateInputs } from "@/lib/helper";
import { signup } from "@/lib/lib";

const SignUpPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();

    const errors = validateInputs({
      firstName,
      lastName,
      email,
      username,
      password,
      confirmPassword,
    });

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      });
      return;
    }
    toast.promise(
      (async () => {
        const { success, message } = await signup(
          username,
          confirmPassword,
          firstName,
          lastName,
          email
        );
        if (!success) {
          throw new Error(message);
        }
        return message;
      })(),
      {
        loading: "Creating Account...",
        success: async (message) => {
          toast.success(message);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          window.location.href = "/auth/login";
        },
        error: (error) => error.message || "Account creation failed. Please try again.",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Toaster />
      <Card className="w-full max-w-md bg-gray-800 text-white">
        <CardHeader>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 relative">
              <Image
                src="/images/pic2.png"
                alt="Logo"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h2 className="text-2xl font-bold">Sign up</h2>
          </div>
          <p className="text-gray-400">
            Enter your details below to create your account and get started.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">Firstname</Label>
                <Input
                  id="firstname"
                  placeholder="Enter..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Lastname</Label>
                <Input
                  id="lastname"
                  placeholder="Enter..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Enter..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex space-x-4 w-full">
            <Button
              variant="destructive"
              className="w-1/2 border-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleSignUp}
            >
              Confirm
            </Button>
          </div>
          <p className="text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <a href="/auth/login" className="text-indigo-400 hover:underline">
              Login
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
