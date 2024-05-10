// Form.jsx

import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Form = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    state: "",
    city: "",
    gender: "",
    dateOfBirth: "",
    age: "",
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/countries');
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        if (formData.country) {
          const response = await axios.get(`http://localhost:3000/api/states/${formData.country}`);
          setStates(response.data);
          setFormData((prevData) => ({ ...prevData, state: '', city: '' }));
        } else {
          setStates([]);
          setFormData((prevData) => ({ ...prevData, state: '', city: '' }));
        }
      } catch (error) {
        console.error(`Error fetching states for ${formData.country}:`, error);
      }
    };
    fetchStates();
  }, [formData.country]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        if (formData.state) {
          const response = await axios.get(`http://localhost:3000/api/cities/${formData.state}`);
          setCities(response.data);
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error(`Error fetching cities for ${formData.state}:`, error);
      }
    };
    fetchCities();
  }, [formData.state]);



  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Calculate age if date of birth is changed
    if (name === "dateOfBirth") {
      // Split the date string into year, month, and day
      const [year, month, day] = value.split('-');
  
      // Create a new date object in the format "YYYY-MM-DD"
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
      const currentDate = new Date();
      const birthDate = new Date(formattedDate);
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      setFormData((prevData) => ({
        ...prevData,
        dateOfBirth: formattedDate, // Update the dateOfBirth value with formattedDate
        age: age.toString(),
      }));
    } 
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      // Submit form data to the backend
      console.log(formData);
      navigate("/submitted", { state: { formData } });
    } else {
      setErrors(errors);
    }
  };

  const validateForm = () => {
    const errors = {};

    // First Name validation
    if (!formData.firstName || !/^[a-zA-Z]+$/.test(formData.firstName)) {
      errors.firstName = "First Name must contain only alphabets";
    }

    // Last Name validation
    if (!formData.lastName || !/^[a-zA-Z]+$/.test(formData.lastName)) {
      errors.lastName = "Last Name must contain only alphabets";
    }

    // Email validation
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    // Country validation
    if (!formData.country) {
      errors.country = "Country is required";
    }

    // State validation
    if (!formData.state) {
      errors.state = "State is required";
    }

    // City validation
    if (!formData.city) {
      errors.city = "City is required";
    }

    // Gender validation
    if (!formData.gender) {
      errors.gender = "Gender is required";
    }

      // Date of Birth validation
      const currentDate = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      if (age < 14 || age > 99) {
        errors.dateOfBirth = "Age must be between 14 and 99 years";
      } 
    return errors;
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Form Validation</h2>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="firstName" style={{ display: 'block', marginBottom: '5px' }}>First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          style={{ width: '100%', padding: '5px' }}
        />
        {errors.firstName && <span style={{ color: 'red' }}>{errors.firstName}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="lastName" style={{ display: 'block', marginBottom: '5px' }}>Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange} style={{ width: '100%', padding: '5px' }}
        />
        {errors.lastName && <span  style={{ color: 'red' }}>{errors.lastName}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange} style={{ width: '100%', padding: '5px' }}
        />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="country">Country</label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          style={{ width: '100%', padding: '5px' }}
        >
          <option value="">Select Country</option>
    {Array.isArray(countries) &&
      countries.map((country) => (
        <option key={country._id} value={country._id}>
          {country.name}
        </option>
          ))}
        </select>
        {errors.country && <span style={{ color: 'red' }}>{errors.country}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="state">State</label>
        <select
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          style={{ width: '100%', padding: '5px' }}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state._id} value={state._id}>
              {state.name}
            </option>
          ))}
        </select>
        {errors.state && <span style={{ color: 'red' }}>{errors.state}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="city">City</label>
        <select
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          style={{ width: '100%', padding: '5px' }}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city._id} value={city._id}>
              {city.name}
            </option>
          ))}
        </select>
        {errors.city && <span style={{ color: 'red' }}>{errors.city}</span>}
      </div>

      <div  style={{ width: '100%', padding: '5px', marginBottom:'10px' }}>
        <label>Gender</label>
        <div>
          <input
            type="radio"
            id="male"
            name="gender"
            value="male"
            checked={formData.gender === "male"}
            onChange={handleChange} 
          />
          <label htmlFor="male">Male</label>
        </div>
        <div>
          <input
            type="radio"
            id="female"
            name="gender"
            value="female"
            checked={formData.gender === "female"}
            onChange={handleChange}
          />
          <label htmlFor="female">Female</label>
        </div>
        {errors.gender && <span style={{ color: 'red' }}>{errors.gender}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="dateOfBirth">Date of Birth</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange} style={{ width: '100%', padding: '5px' }}
        />
        {errors.dateOfBirth && <span style={{ color: 'red' }}>{errors.dateOfBirth}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="age">Age</label>
        <input type="text" id="age" name="age" value={formData.age} readOnly />
      </div>

      <button type="submit" style={{ marginTop: '10px', padding: '8px 20px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Submit</button>
    </form>
  );
};

export default Form;
