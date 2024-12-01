import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Carousel from "react-elastic-carousel"; // Or any other carousel library

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

const EstimatorPage = () => {
  const { state } = useLocation();
  const selectedServices = state?.selectedServices || [];
  const [estimatorData, setEstimatorData] = useState([]);
  const [formData, setFormData] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate(); // Corrected the initialization of navigate

  useEffect(() => {
    const fetchEstimatorData = async () => {
      try {
        const responses = await Promise.all(
          selectedServices.map((service) =>
            axios.get("/api/estimator", {
              params: { provider: "aws", service: service.name },
            })
          )
        );
        setEstimatorData(responses.map((response) => response.data));
      } catch (error) {
        console.error("Error fetching estimator data:", error);
      }
    };

    fetchEstimatorData();
  }, [selectedServices]);

  const handleInputChange = (event, serviceIndex) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [serviceIndex]: {
        ...prevFormData[serviceIndex],
        [event.target.name]: event.target.value,
      },
    }));
  };

  const handleProceedToCalculation = async () => {
    try {
      const estimations = await axios.post(
        "/api/calculate_cost",
        estimatorData.map((data, index) => ({
          provider: data.provider,
          service: data.service,
          formData: formData[index],
        }))
      );
      navigate("/result", { state: { estimations: estimations.data } });
    } catch (error) {
      console.error("Error calculating cost:", error);
    }
  };

  const handleGenerateCode = () => {
    // Call iac_generator API with formData
    console.log("Generating code with formData:", formData);
  };

  return (
    <EstimatorContainer>
      <h2>Estimator</h2>
      <br />
      <Carousel
        itemsToShow={1}
        enableAutoPlay={false}
        onChange={(currentItem) => setActiveIndex(currentItem.index)}
      >
        {estimatorData.map((data, index) => (
          <div key={data.service}>
            <h3>{data.service}</h3>
            {data.formFields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                {field.type === "select" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    onChange={(e) => handleInputChange(e, index)}
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </Carousel>
      <div>
        <Button onClick={handleProceedToCalculation}>
          Proceed to Calculation
        </Button>
        <Button onClick={handleGenerateCode}>Generate Code</Button>
      </div>
    </EstimatorContainer>
  );
};

export default EstimatorPage;