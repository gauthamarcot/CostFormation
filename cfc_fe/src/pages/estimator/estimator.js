import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const EstimatorContainer = styled.div`
  padding: 2rem;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 1rem;
`;

const EstimatorPage = ({ selectedService }) => {
  const [formData, setFormData] = useState({});
  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    const fetchFormFields = async () => {
      try {
        const response = await axios.get(
          `/api/estimator?service=${selectedService}` // Replace with your actual API endpoint
        );
        setFormFields(response.data.formFields);
      } catch (error) {
        console.error("Error fetching form fields:", error);
        // Handle error, e.g., display an error message to the user
      }
    };

    if (selectedService) {
      fetchFormFields();
    }
  }, [selectedService]);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleExportToCSV = () => {
    // Logic to export formData to CSV
    console.log("Exporting to CSV:", formData);
  };

  const handleConvertToCode = () => {
    // Logic to convert formData to code
    console.log("Converting to code:", formData);
  };

  return (
    <EstimatorContainer>
      <h2>Estimator for {selectedService}</h2>
      {formFields.map((field) => {
        if (field.type === "text") {
          return (
            <div key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                onChange={handleInputChange}
              />
            </div>
          );
        } else if (field.type === "select") {
          return (
            <div key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <select id={field.name} name={field.name} onChange={handleInputChange}>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        // Add more field types as needed
        return null;
      })}
      <div>
        <Button onClick={handleExportToCSV}>Export to CSV</Button>
        <Button onClick={handleConvertToCode}>Convert to Code</Button>
      </div>
    </EstimatorContainer>
  );
};

export default EstimatorPage;