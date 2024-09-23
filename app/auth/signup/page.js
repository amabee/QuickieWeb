import React from "react";
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
import Image from "next/image";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
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
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">Firstname</Label>
                <Input
                  id="firstname"
                  placeholder="enter..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Lastname</Label>
                <Input
                  id="lastname"
                  placeholder="enter..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="enter..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="enter..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="enter..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
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
            <Button className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white">
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
