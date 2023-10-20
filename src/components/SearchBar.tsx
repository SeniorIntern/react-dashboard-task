// SearchBar.tsx
import React, { useState, useEffect } from "react";

interface SearchBarProps {
  onQueryChange: (query: { name: string; country: string }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onQueryChange }) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>(""); // Initialize with an empty string or a default value
  const countries = ["np", "in", "us", "au", "af"]; // List of available countries

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      /* onQueryChange(`${selectedCountry} ${searchInput}`); */
      onQueryChange({ name: searchInput, country: selectedCountry });
    }, 1000); // 1 second debounce

    return () => clearTimeout(debounceTimeout);
  }, [searchInput, selectedCountry, onQueryChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  return (
    <div className="h-[70%] w-full flex">
      <input
        type="text"
        placeholder="Search players by name"
        value={searchInput}
        onChange={handleInputChange}
        className="h-full w-3/4 border-2 border-[var(--green)] rounded-lg p-2"
      />
      <select
        value={selectedCountry}
        onChange={handleCountryChange}
        className="h-full w-1/4 rounded-lg bg-green-400 text-center cursor-pointer"
      >
        <option value="">Countries</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;
