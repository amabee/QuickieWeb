import React, { useEffect, useState } from "react";
import { getSession } from "./lib";

const SignedIn = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const session = await getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default SignedIn;
