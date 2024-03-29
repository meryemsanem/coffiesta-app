import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const Order = () => {
  const [coffees, setCoffees] = useState([]);
  const [desserts, setDesserts] = useState([]);
  const [selectedCoffee, setSelectedCoffee] = useState('');
  const [selectedDessert, setSelectedDessert] = useState('');
  const [coffeeOrder, setCOrder] = useState([]);
  const [dessertOrder, setDOrder] = useState([]);
  const [orderMessage, setOrderMessage] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        const response = await axios.get(
          'https://api.sampleapis.com/coffee/hot',
        );
        setCoffees(response.data);
      } catch (error) {
        console.error('Error fetching coffees:', error);
      }
    };

    const fetchDesserts = async () => {
      try {
        const response = await axios.get(
          'https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert',
        );
        setDesserts(response.data.meals.slice(2, 17));
      } catch (error) {
        console.error('Error fetching desserts:', error);
      }
    };

    fetchCoffees();
    fetchDesserts();
  }, []);

  const handleCoffeeChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedCoffee(selectedIndex === '' ? '' : coffees[selectedIndex]);
  };

  const handleDessertChange = (event) => {
    const selectedId = event.target.value;
    const selectedDessert = desserts.find(
      (dessert) => dessert.idMeal === selectedId,
    );
    setSelectedDessert(selectedDessert || null);
  };

  const handleAddToOrder = () => {
    if (selectedCoffee && selectedCoffee.id) {
      console.log('Selected Coffee Id:', selectedCoffee.id);
      const existingCoffee = coffeeOrder.find(
        (order) => order.item.id === selectedCoffee.id,
      );

      if (existingCoffee) {
        setCOrder((prevOrder) => prevOrder.map((order) => (order.item.id === selectedCoffee.id
          ? { ...order, quantity: order.quantity + 1 }
          : order)));
      } else {
        setCOrder((prevOrder) => [
          ...prevOrder,
          { item: selectedCoffee, quantity: 1 },
        ]);
      }

      setSelectedCoffee('');
    }

    if (selectedDessert && selectedDessert.idMeal) {
      console.log('Selected Dessert Id:', selectedDessert.idMeal);
      const existingDessert = dessertOrder.find(
        (order) => order.item.idMeal === selectedDessert.idMeal,
      );

      if (existingDessert) {
        setDOrder((prevOrder) => prevOrder.map((order) => (order.item.idMeal === selectedDessert.idMeal
          ? { ...order, quantity: order.quantity + 1 }
          : order)));
      } else {
        setDOrder((prevOrder) => [
          ...prevOrder,
          { item: selectedDessert, quantity: 1 },
        ]);
      }

      setSelectedDessert('');
    }
  };

  const handleIncreaseQuantity = (item, type) => {
    if (type === 'coffee') {
      setCOrder((prevOrder) => prevOrder.map((order) => (order.item.id === item.id
        ? { ...order, quantity: order.quantity + 1 }
        : order)));
    }

    if (type === 'dessert') {
      setDOrder((prevOrder) => prevOrder.map((order) => (order.item.idMeal === item.idMeal
        ? { ...order, quantity: order.quantity + 1 }
        : order)));
    }
  };

  const handleDecreaseQuantity = (item, type) => {
    if (type === 'coffee') {
      setCOrder((prevOrder) => prevOrder.map((order) => (order.item.id === item.id && order.quantity > 1
        ? { ...order, quantity: order.quantity - 1 }
        : order)));
    }

    if (type === 'dessert') {
      setDOrder((prevOrder) => prevOrder.map((order) => (order.item.idMeal === item.idMeal && order.quantity > 1
        ? { ...order, quantity: order.quantity - 1 }
        : order)));
    }
  };

  const handleRemoveFromOrder = (item, type) => {
    if (type === 'coffee') {
      setCOrder((prevOrder) => prevOrder.filter((order) => order.item.id !== item.id));
    }

    if (type === 'dessert') {
      setDOrder((prevOrder) => prevOrder.filter((order) => order.item.idMeal !== item.idMeal));
    }
  };

  const handleSubmitOrder = () => {
    // Check if coffee or dessert is selected
    if (coffeeOrder.length === 0 && dessertOrder.length === 0) {
      setOrderMessage(
        'Please add at least one item (coffee or dessert) to your order.',
      );
    } else if (!name || !phone || !address) {
      // Check if information is empty
      setOrderMessage(
        'Please fill in all the personal information before submitting the order.',
      );
    } else {
      // All checks passed, proceed with submitting the order
      setOrderMessage(
        'We received your order. We will deliver it soon. Enjoy!',
      );
      setCOrder([]);
      setDOrder([]);
      setName('');
      setAddress('');
      setPhone('');
      setSelectedCoffee('');
      setSelectedDessert('');

      setTimeout(() => {
        setOrderMessage('');
      }, 5000);
    }
  };

  return (
    <div className="order" id="order">
      <div className="order-container">
        <h2>Place Your Order</h2>

        <div className="order-section">
          <h3>Coffees</h3>
          <select
            value={
              selectedCoffee
                ? coffees.findIndex((coffee) => coffee.id === selectedCoffee.id)
                : ''
            }
            onChange={handleCoffeeChange}
          >
            <option value="" disabled>
              Select a coffee
            </option>
            {coffees.slice(0, 15).map((coffee, index) => (
              <option key={coffee.id} value={index}>
                {coffee.title}
              </option>
            ))}
          </select>
        </div>

        <div className="order-section">
          <h3>Desserts</h3>
          <select
            value={selectedDessert.idMeal || ''}
            onChange={handleDessertChange}
          >
            <option value="" disabled>
              Select a dessert
            </option>
            {desserts.map((dessert) => (
              <option key={dessert.idMeal} value={dessert.idMeal}>
                {dessert.strMeal}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleAddToOrder}>
            Add to Order
          </button>
          <div className="info-container">
            <h3>Your Information</h3>
            <label htmlFor="name">
              Name:
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="name"
                required
              />
            </label>
            <label htmlFor="phone">
              Phone:
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="phone number
              "
                required
              />
            </label>
            <label htmlFor="address">
              Address:
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="address"
                required
              />
            </label>
          </div>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {coffeeOrder.length === 0 && dessertOrder.length === 0 ? (
            <p>You have no items added to your order.</p>
          ) : (
            <div className="order-items">
              {coffeeOrder.map((order) => (
                <div key={order.item.id} className="order-item">
                  <span>{order.item.title}</span>
                  <div className="order-item-quantity">
                    <button
                      type="button"
                      onClick={() => handleDecreaseQuantity(order.item, 'coffee')}
                    >
                      -
                    </button>
                    <span>{order.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleIncreaseQuantity(order.item, 'coffee')}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="remove"
                    onClick={() => handleRemoveFromOrder(order.item, 'coffee')}
                  >
                    Remove
                  </button>
                </div>
              ))}

              {dessertOrder.map((order) => (
                <div key={order.item.idMeal} className="order-item">
                  <span>{order.item.strMeal}</span>
                  <div className="order-item-quantity">
                    <button
                      type="button"
                      onClick={() => handleDecreaseQuantity(order.item, 'dessert')}
                    >
                      -
                    </button>
                    <span>{order.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleIncreaseQuantity(order.item, 'dessert')}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="remove"
                    onClick={() => handleRemoveFromOrder(order.item, 'dessert')}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          className="submit"
          disabled={
            !coffeeOrder.length
            && !dessertOrder.length
            && !name
            && !phone
            && !address
            && !selectedCoffee?.id
            && !selectedDessert?.idMeal
          }
          onClick={handleSubmitOrder}
        >
          Submit Order
        </button>
        {orderMessage && (
          <div className="order-message">
            <p>{orderMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
