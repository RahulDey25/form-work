import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const FormDataDisplay = () => {
  const location = useLocation();
  const formData = location.state?.formData || {};
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries data
        const countriesResponse = await axios.get(`https://form-work.onrender.com/api/countries`);
        setCountries(countriesResponse.data);

        // Fetch states data
        const statesResponse = await axios.get(`https://form-work.onrender.com/api/states/${formData.country}`);
        setStates(statesResponse.data);

        // Fetch cities data
        const citiesResponse = await axios.get(`https://form-work.onrender.com/api/cities/${formData.state}`);
        setCities(citiesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to get name by ID
  const getNameById = (id, dataArray) => {
    const item = dataArray.find((item) => item._id === id);
    return item ? item.name : "";
  };

  return (
    <div>
      <h2>Submitted Form Data</h2>
      <div>
        <h3>Personal Information</h3>
        <p>First Name: {formData.firstName}</p>
        <p>Last Name: {formData.lastName}</p>
        <p>Email: {formData.email}</p>
        <p>Gender: {formData.gender}</p>
        <p>Date of Birth: {formData.dateOfBirth}</p>
        <p>Age: {formData.age}</p>
      </div>
      <div>
        <h3>Location</h3>
        <p>Country: {getNameById(formData.country, countries)}</p>
        <p>State: {getNameById(formData.state, states)}</p>
        <p>City: {getNameById(formData.city, cities)}</p>
      </div>
    </div>
  );
};

export default FormDataDisplay;
