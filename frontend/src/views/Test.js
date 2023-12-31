import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../views/Test.scss"

const DishesManagement = () => {

  const [dishes, setDishes] = useState();
  const [editing, setEditing] = useState(false);
  const [currentDish, setCurrentDish] = useState({});
  
  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/dish/all");
      setDishes(response.data.data);
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  const handleCreateDish = async (newDish) => {
    try {
      const priceAsNumber = parseFloat(newDish.price);
      const idRestaurantAsNumber = parseInt(newDish.idRestaurant);
      if (!isNaN(priceAsNumber) && !isNaN(idRestaurantAsNumber)) {
        const dishWithNumberValues = {
          ...newDish,
          price: priceAsNumber,
          idRestaurant: idRestaurantAsNumber,
        };
        const response = await axios.post("http://localhost:3000/dish/create", dishWithNumberValues);
        setDishes([...dishes, response.data]);
      } else {
        console.error("Invalid price or idRestaurant value:", newDish);
      }
    } catch (error) {
      console.error("Error creating dish:", error);
    }
  };
  

  const handleDeleteDish = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/dish/delete/${id}`);
      const updatedDishes = dishes.filter((dish) => dish.id !== id);
      setDishes(updatedDishes);
    } catch (error) {
      console.error("Error deleting dish:", error);
    }
  };

  const handleEditDish = (dish) => {
    setEditing(true);
    setCurrentDish(dish);
  };

  const handleUpdateDish = async (id, updatedDish) => {
    try {
      await axios.patch(`http://localhost:3000/dish/update/${id}`, updatedDish);
      setEditing(false);
      setDishes(dishes.map((dish) => (dish.id === id ? updatedDish : dish)));
    } catch (error) {
      console.error("Error updating dish:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Dishes Management</h1>
      <div className="d-flex p-3">
        {editing ? (
          <EditDishForm
            currentDish={currentDish}
            onUpdateDish={handleUpdateDish}
          />
        ) : (
          <>
            <AddDishForm onCreateDish={handleCreateDish} />
            {dishes && dishes.length > 0 && (
              <DishList
                dishes={dishes}
                onDeleteDish={handleDeleteDish}
                onEditDish={handleEditDish}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
  
};

const AddDishForm = ({ onCreateDish }) => {

  const [dish, setDish] = useState({     
  
  name: "",
  price: 1,
  imageURL: "",
  idRestaurant: 1,
  productline: "",});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDish({ ...dish, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateDish({ ...dish });
    setDish({
      name: "",
      price: 1,
      imageURL: "",
      idRestaurant: 1,
      productline: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Dish Name"
          value={dish.name}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <div className="form-group">
      <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          value={dish.price}
          required
          className="form-control"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="imageURL"
          placeholder="Image URL"
          value={dish.image}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="productline"
          placeholder="Product Line"
          value={dish.productline}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <div className="form-group">
        <input
          type="number"
          name="idRestaurant"
          step="1"
          placeholder="ID Restaurant"
          value={dish.idRestaurant}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Add Dish
      </button>
    </form>
  );
};

const EditDishForm = ({ currentDish, onUpdateDish }) => {
  const [dish, setDish] = useState(currentDish);

  useEffect(() => {
    setDish(currentDish);
  }, [currentDish]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDish({ ...dish, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateDish(currentDish.id, dish);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          name="name"
          value={dish.name}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <div className="form-group">
      <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          value={dish.price}
          required
          className="form-control"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="image"
          value={dish.image}
          onChange={handleChange}
          required
          className="form-control"
        />
              <div className="form-group">
        <input
          type="text"
          name="productline"
          value={dish.productline}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <div className="form-group">
        <input
          type="number"
          name="idRestaurant"
          step="1"
          value={dish.idRestaurant}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Update Dish
      </button>
    </form>
  );
};

const DishList = ({ dishes, onDeleteDish, onEditDish }) => {
  return (
    <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
      <colgroup>
        <col style={{ width: "10%" }} />
        <col style={{ width: "40%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "20%" }} />
      </colgroup>
      <thead>
        <tr>
          <th>ID</th>
          <th>Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {dishes.map((dish) => (
          <tr key={dish.id}>
            <td>{dish.id}</td>
            <td>
              <img
                src={dish.imageURL}
                alt={dish.name}
                style={{ width: "250px" }}
              />
            </td>
            <td>{dish.name}</td>
            <td>${dish.price}</td>
            <td>
              <button onClick={() => onEditDish(dish)} className="btn btn-info">
                Edit
              </button>
              <button
                onClick={() => onDeleteDish(dish.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DishesManagement;