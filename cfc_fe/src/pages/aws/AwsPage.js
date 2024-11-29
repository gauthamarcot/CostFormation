import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { BiSearchAlt } from "react-icons/bi";

const PageContainer = styled.div`
  padding: 2rem;
  color: ${({ theme }) => theme.text};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 1rem;

  svg {
    margin-right: 0.5rem;
  }

  input {
    border: none;
    outline: none;
    flex-grow: 1;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 1rem;
`;

const ServiceCard = styled.div`
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Dropdown = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap; // Allow wrapping to multiple lines
`;

const PaginationButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.2rem; // Reduced margin for compactness
  padding: 0.3rem 0.6rem; // Reduced padding for compactness

  &:disabled {
    background-color: #ccc;
    cursor: default;
  }
`;
const Description = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines initially */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ViewMoreButton = styled.button`
  background-color: transparent;
  border: none;
  color: #007bff;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
`;

const ProceedButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  display: block; // Make it a block-level element
  width: fit-content; // Make the width fit the content
  margin-left: auto; // Push the button to the right
  margin-right: auto; // Center the button
`;

  


const AwsPage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedDescriptions, setExpandedDescriptions] = useState({}); // Store expanded state for each service
  const servicesPerPage = 10;
  const [selectedServices, setSelectedServices] = useState([]);

  const handleServiceSelect = (serviceName) => {
    setSelectedServices((prevSelected) => {
      if (prevSelected.includes(serviceName)) {
        return prevSelected.filter((name) => name !== serviceName);
      } else {
        return [...prevSelected, serviceName];
      }
    });
  };

  const handleProceed = () => {
    handleServiceSelect(selectedServices);
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/cfc/v1/auth/cp_service/aws/services"
        );
        setServices(response.data);
        setFilteredServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        // Handle error, e.g., display an error message to the user
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter((service) => {
      const search = searchTerm.toLowerCase();
      return (
        service.name.toLowerCase().includes(search) ||
        service.description.toLowerCase().includes(search) ||
        service.search_words.some((word) => word.toLowerCase().includes(search))
      );
    });
    setFilteredServices(filtered);
    setCurrentPage(1); // Reset to first page when search term changes
  }, [searchTerm, services]);

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirstService,
    indexOfLastService
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewMoreClick = (serviceName) => {
    setExpandedDescriptions({
      ...expandedDescriptions,
      [serviceName]: !expandedDescriptions[serviceName],
    });
  };

  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  return (
    <PageContainer>
      <h1>AWS Cost Estimation</h1>
      <SearchBar>
        <BiSearchAlt size={20} />
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchBar>
      <GridContainer>
        {currentServices.map((service) => {
          const isLongDescription = service.description.length > 100; // Adjust threshold as needed
          const showFullDescription = expandedDescriptions[service.name] || false;
          const isSelected = selectedServices.includes(service.name);

          return (
            <ServiceCard key={service.name}>
              <input
                type="checkbox"
                id={service.name}
                checked={isSelected}
                onChange={() => handleServiceSelect(service.name)}
              />
              <label htmlFor={service.name}>
                <h2>{service.name}</h2>
              </label>
              <Description>
                {showFullDescription
                  ? service.description
                  : service.description.slice(0, 100)}
                {/* Adjust slice length as needed */}
              </Description>
              {isLongDescription && (
                <ViewMoreButton onClick={() => handleViewMoreClick(service.name)}>
                  {showFullDescription ? "View Less" : "View More"}
                </ViewMoreButton>
              )}
              <h3>Supported Regions:</h3>
              <Dropdown>
                {service.regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </Dropdown>
            </ServiceCard>
          );
        })}
      </GridContainer>
      <PaginationContainer>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <PaginationButton
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            disabled={pageNumber === currentPage}
          >
            {pageNumber}
          </PaginationButton>
        ))}
      </PaginationContainer>
      <ProceedButton onClick={handleProceed} disabled={selectedServices.length === 0}>
        Proceed to Estimator
      </ProceedButton>
    </PageContainer>
  );
};

export default AwsPage;