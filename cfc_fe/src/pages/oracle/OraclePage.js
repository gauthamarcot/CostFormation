import React, {  } from "react";
import styled from "styled-components";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap; // Allow wrapping to multiple lines
`;

const PageContainer = styled.div`
  padding: 2rem;
  color: ${({ theme }) => theme.text};
`;

const OraclePage = () => {
//     const [services, setServices] = useState([]);
//     const [filteredServices, setFilteredServices] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [expandedDescriptions, setExpandedDescriptions] = useState({}); // Store expanded state for each service
//     const servicesPerPage = 10;
  
//     useEffect(() => {
//       const fetchServices = async () => {
//         try {
//           const response = await axios.get(
//             "http://127.0.0.1:5000/cfc/v1/auth/cp_service/aws/services"
//           );
//           setServices(response.data);
//           setFilteredServices(response.data);
//         } catch (error) {
//           console.error("Error fetching services:", error);
//           // Handle error, e.g., display an error message to the user
//         }
//       };
  
//       fetchServices();
//     }, []);
  
//     useEffect(() => {
//       const filtered = services.filter((service) => {
//         const search = searchTerm.toLowerCase();
//         return (
//           service.name.toLowerCase().includes(search) ||
//           service.description.toLowerCase().includes(search) ||
//           service.search_words.some((word) => word.toLowerCase().includes(search))
//         );
//       });
//       setFilteredServices(filtered);
//       setCurrentPage(1); // Reset to first page when search term changes
//     }, [searchTerm, services]);
  
//     const indexOfLastService = currentPage * servicesPerPage;
//     const indexOfFirstService = indexOfLastService - servicesPerPage;
//     const currentServices   
//    = filteredServices.slice(
//       indexOfFirstService,
//       indexOfLastService
//     );
  
//     const   
//    handleSearchChange = (event) => {
//       setSearchTerm(event.target.value);
//     };
  
//     const handlePageChange = (pageNumber) => {
//       setCurrentPage(pageNumber);
//     };
  
//     const handleViewMoreClick = (serviceName) => {
//       setExpandedDescriptions({
//         ...expandedDescriptions,
//         [serviceName]: !expandedDescriptions[serviceName],
//       });
//     };
  
//     const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  
    return (
      <PageContainer>
        <h1>Oracle Cloud Cost Estimation</h1>
        <p> Coming Soon ......</p>
      </PageContainer> )
}

export default OraclePage; 