"use client";
import React, { useState, useEffect } from "react";
import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/SearchBar";
import Pagination from "@/components/shared/Pagination";
import { suggestUsers } from "@/lib/actions/users";
import { useUser } from "@/lib/UserContext";

const Search = () => {
  const userImagePath = process.env.NEXT_PUBLIC_USER_IMAGES_ENDPOINT;
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isNext, setIsNext] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const currentUserID = useUser();
  const id = currentUserID?.user_id ?? null;

  const fetchSuggestedUsers = async () => {
    const { success, message, data } = await suggestUsers(id);

    if (!success) {
      setSuggestedUsers([]);
      setError(true);
      setErrorMessage(message);
      return;
    }
    console.log(data);
    setSuggestedUsers(data);
  };

  useEffect(() => {
    if (id !== null) {
      fetchSuggestedUsers();
    }
  }, [id]);

  return (
    <section>
      <div className="w-full max-w-4xl"></div>

      <h1 className="head-text mb-10">Search</h1>

      <Searchbar routeType="search" />

      <div className="mt-14 flex flex-col gap-9">
        {suggestedUsers.length > 0 && !isLoading && !error ? (
          suggestedUsers.map((user) => (
            <UserCard
              key={user.id}
              id={user.id}
              name={user.first_name + " " + user.last_name}
              username={user.username}
              imgUrl={userImagePath + user.profile_image}
              personType="User"
            />
          ))
        ) : (
          <h3 className="head-text text-heading4-medium text-center">
            {errorMessage}
          </h3>
        )}
      </div>

      {/* <Pagination
        path="search"
        pageNumber={currentPage}
        isNext={isNext}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      /> */}
    </section>
  );
};

export default Search;
