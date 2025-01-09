// src/components/Favorites.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch favorite locations from the API
  useEffect(() => {
    fetch('/api/favourites')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        return response.json();
      })
      .then((data) => {
        setFavorites(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Favorite Locations</h1>

      {/* Go Back Button */}
      <button className="btn btn-primary mb-3" onClick={() => navigate(-1)}>
        Go Back
      </button>

      {favorites.length === 0 ? (
        <p>No favorites found</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Branch Type</th>
              <th scope="col">Delivery Status</th>
              <th scope="col">Region</th>
              <th scope="col">Circle</th>
              <th scope="col">District</th>
              <th scope="col">State</th>
              <th scope="col">Country</th>
              <th scope="col">Pincode</th>
              <th scope="col">Division</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {favorites.map((fav) => (
              <tr key={fav.id}>
                <td>{fav.id}</td>
                <td>{fav.name}</td>
                <td>{fav.branch_type}</td>
                <td>{fav.delivery_status}</td>
                <td>{fav.region}</td>
                <td>{fav.circle}</td>
                <td>{fav.district}</td>
                <td>{fav.state}</td>
                <td>{fav.country}</td>
                <td>{fav.pincode}</td>
                <td>{fav.division}</td>
                <td>{fav.description || 'No Description'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Favorites;
