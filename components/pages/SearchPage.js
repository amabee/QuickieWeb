import React, { useState, useEffect, useCallback } from "react";
import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/SearchBar";
import Pagination from "@/components/shared/Pagination";
import { searchUser, suggestUsers } from "@/lib/actions/users";
import { useUser } from "@/lib/UserContext";
import debounce from "lodash/debounce";

const Search = () => {
  const userImagePath = process.env.NEXT_PUBLIC_USER_IMAGES_ENDPOINT;
  const [searchResults, setSearchResults] = useState([]);
  const [userInput, setUserInput] = useState("");
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
    setSuggestedUsers(data || []);
  };

  useEffect(() => {
    if (id !== null) {
      fetchSuggestedUsers();
    }
  }, [id]);

  const searchForUser = async (input) => {
    setIsLoading(true);
    setError(null);
    try {
      const { success, message, data } = await searchUser(input, id);
      setIsLoading(false);

      if (!success) {
        setError(true);
        setErrorMessage(message);
        setSearchResults([]);
        return;
      }

      setSearchResults(data);
      console.log(data);
    } catch (error) {
      setIsLoading(false);
      setError(true);
      setErrorMessage("An error occurred while searching");
      setSearchResults([]);
    }
  };

  // Debounce the search function
  const debouncedSearch = useCallback(
    debounce((input) => {
      if (input) {
        searchForUser(input);
      } else {
        setSearchResults([]);
      }
    }, 300),
    [currentPage]
  );

  useEffect(() => {
    debouncedSearch(userInput);
    return () => debouncedSearch.cancel();
  }, [userInput, debouncedSearch]);

  const handleSearch = (value) => {
    setUserInput(value);
    setCurrentPage(1);
  };

  return (
    <section>
      <div className="w-full max-w-4xl">
        <h1 className="head-text mb-10">Search</h1>

        <Searchbar
          routeType="search"
          value={userInput}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <div className="mt-14 flex flex-col gap-9">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <h3 className="head-text text-heading4-medium text-center">
              {errorMessage}
            </h3>
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <UserCard
                key={user.user_id}
                id={user.user_id}
                name={`${user.first_name || ""} ${user.last_name || ""}`}
                username={user.username || ""}
                imgUrl={
                  user.profile_image
                    ? `${userImagePath}${user.profile_image}`
                    : ""
                }
                personType="User"
                isFollowing={user.is_following === 1}
                isCurrentUser={user.user_id === id}
              />
            ))
          ) : userInput ? (
            <p className="head-text text-center text-heading4-medium">
              No results found
            </p>
          ) : suggestedUsers.length > 0 ? (
            suggestedUsers.map((user) => (
              <UserCard
                key={user.user_id}
                id={user.user_id}
                name={`${user.first_name || ""} ${user.last_name || ""}`}
                username={user.username || ""}
                imgUrl={
                  user.profile_image
                    ? `${userImagePath}${user.profile_image}`
                    : ""
                }
                personType="User"
                isFollowing={user.is_following === 1}
                isCurrentUser={user.user_id === id}
              />
            ))
          ) : (
            <p>No suggested users available</p>
          )}
        </div>

        {searchResults.length > 0 && (
          <Pagination
            path="search"
            pageNumber={currentPage}
            isNext={isNext}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        )}
      </div>
    </section>
  );
};

export default Search;
