import React, { useState, useEffect } from "react";
import { Edit, Trash2, PlusCircle } from "lucide-react";

const getAuthToken = () => localStorage.getItem("token");
const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = {
  get: async (url) => {
    const response = await fetch(`${backendUrl}${url}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  },
  post: async (url, data) => {
    const response = await fetch(`${backendUrl}${url}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: data,
    });
    return response.json();
  },
  put: async (url, data) => {
    const response = await fetch(`${backendUrl}${url}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: data,
    });
    return response.json();
  },
  delete: async (url) => {
    const response = await fetch(`${backendUrl}${url}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.json();
  },
};
const AdminDashboard = () => {
  const [houses, setHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHouse, setCurrentHouse] = useState(null); 

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    try {
      setIsLoading(true);
      const data = await api.get("/houses");
      setHouses(data.houses);
      setError(null);
    } catch (err) {
      setError("Failed to fetch houses. " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await api.delete(`/houses/${id}`);
        fetchHouses(); 
      } catch (err) {
        alert("Failed to delete house.");
      }
    }
  };

  const handleEdit = (house) => {
    setCurrentHouse(house);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentHouse(null); 
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (currentHouse) {
        await api.put(`/houses/${currentHouse._id}`, formData);
      } else {
        await api.post("/houses", formData);
      }
      fetchHouses(); 
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to save house. " + err.message);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Manage Listings
        </h1>
        <button
          onClick={handleAddNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition flex items-center"
        >
          <PlusCircle size={20} className="mr-2" />
          Add New
        </button>
      </div>

      {isLoading && <p>Loading listings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {houses.map((house) => (
                <tr key={house._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={house.img}
                      alt={house.title}
                      className="w-16 h-12 rounded object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/64x48/CCCCCC/FFFFFF?text=No+Image";
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {house.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{house.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {house.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(house)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(house._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <HouseFormModal
          house={currentHouse}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

const HouseFormModal = ({ house, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: house?.title || "",
    location: house?.location || "",
    price: house?.price || "",
    description: house?.description || "",
    type: house?.type || "PG",
    beds: house?.beds || "",
    baths: house?.baths || "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {house ? "Edit House" : "Add New House"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="PG">PG</option>
            <option value="Flat">Flat</option>
            <option value="Hostel">Hostel</option>
          </select>
          <input
            name="beds"
            type="number"
            value={formData.beds}
            onChange={handleChange}
            placeholder="Beds"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="baths"
            type="number"
            value={formData.baths}
            onChange={handleChange}
            placeholder="Baths"
            className="w-full p-2 border rounded"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              name="image"
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
              accept="image/*"
            />
            {house?.img && !formData.image && (
              <img
                src={house.img}
                alt="Current"
                className="w-24 h-24 mt-2 object-cover rounded"
              />
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;