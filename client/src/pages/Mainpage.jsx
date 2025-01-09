import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const SearchPincode = () => {
  const [searchType, setSearchType] = useState("code");
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError("Search input cannot be empty.");
      return;
    }
    setLoading(true);
    setError(null);

    const apiUrl = `https://api.postalpincode.in/${
      searchType === "code" ? `pincode/${searchInput}` : `postoffice/${searchInput}`
    }`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data[0].Status === "Success") {
        setResults(data[0].PostOffice || []);
      } else {
        setResults([]);
        setError("No results found.");
      }
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
    }
    setLoading(false);
  };

  const handleFavourite = async (item) => {
    try {
      const response = await fetch("/api/favourites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error("Failed to save favourite.");
      }
      alert("Marked as favourite successfully.");
    } catch (err) {
      alert("Failed to mark as favourite: " + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Search Indian Post/PIN Code</h1>

      <div className="mb-3">
        <label className="form-check-label me-3">
          <input
            type="radio"
            name="searchType"
            value="code"
            checked={searchType === "code"}
            onChange={() => setSearchType("code")}
            className="form-check-input me-1"
          />
          Search by Code
        </label>
        <label className="form-check-label">
          <input
            type="radio"
            name="searchType"
            value="name"
            checked={searchType === "name"}
            onChange={() => setSearchType("name")}
            className="form-check-input me-1"
          />
          Search by Name
        </label>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder={`Enter ${searchType === "code" ? "PIN Code" : "Post Office Name"}`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      <button
        className="btn btn-secondary ms-3"
        onClick={() => navigate("/favourites")}
      >
        View Favourites
      </button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {results.length > 0 && (
        <table className="table table-bordered mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>BranchType</th>
              <th>DeliveryStatus</th>
              <th>District</th>
              <th>Region</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr key={index}>
                <td>{item.Name}</td>
                <td>{item.BranchType}</td>
                <td>{item.DeliveryStatus}</td>
                <td>{item.District}</td>
                <td>{item.Region}</td>
                <td>{item.State}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleFavourite(item)}
                  >
                    Favourite
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchPincode;
