"use client";
import React, { useState, useEffect } from "react";
import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/SearchBar";
import Pagination from "@/components/shared/Pagination";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isNext, setIsNext] = useState(false);

  const performSearch = async (query, page) => {
    setIsLoading(true);
    setError(null);
    try {
      // Replace this with your actual search API call
      const response = await fetch(`/api/search?q=${query}&page=${page}`);
      if (!response.ok) {
        throw new Error("Search failed");
      }
      const data = await response.json();
      setSearchResults(data.users);
      setIsNext(data.isNext);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    performSearch("", currentPage);
  }, [currentPage]);

  const handleSearch = (query) => {
    setCurrentPage(1);
    performSearch(query, 1);
  };

  return (
    <section className="main-container">
      <div className="w-full max-w-4xl"></div>

      <h1 className="head-text mb-10">Search</h1>

      <Searchbar routeType="search" onSearch={handleSearch} />

      <div className="mt-14 flex flex-col gap-9">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="no-result">Error: {error}</p>
        ) : searchResults.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {searchResults.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}
        {/* Fallback UserCard */}
        {searchResults.length === 0 && !isLoading && !error && (
          <UserCard
            key={1}
            id={1}
            name={"John Doe"}
            username={"@john_doe"}
            imgUrl={"/default.jpg"}
            personType="User"
          />
        )}
      </div>

      <Pagination
        path="search"
        pageNumber={currentPage}
        isNext={isNext}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />
    </section>
  );
};

export default Search;
