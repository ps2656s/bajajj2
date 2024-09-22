import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

function App() {
  const [jsonData, setJsonData] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Multi-select filter options
  const filterOptions = [
    { value: 'Alphabets', label: 'Alphabets' },
    { value: 'Numbers', label: 'Numbers' },
    { value: 'Highest Lowercase Alphabet', label: 'Highest Lowercase Alphabet' }
  ];

  // Handle input change for API Input field
  const handleJsonChange = (event) => {
    setJsonData(event.target.value);
  };

  // Handle form submit to process JSON and call backend API
  const handleSubmit = async () => {
    try {
      // Validate JSON
      const parsedData = JSON.parse(jsonData);
      
      if (!parsedData.data) {
        throw new Error('Invalid JSON format');
      }

      // Call the backend API
      const response = await axios.post('http://localhost:3000/bfhl', parsedData);
      setResponseData(response.data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Invalid JSON input');
    }
  };

  // Handle filter selection in multi-select dropdown
  const handleFilterChange = (selectedOptions) => {
    setSelectedFilters(selectedOptions.map(option => option.value));
  };

  // Render the filtered response based on selected filters
  const renderResponse = () => {
    if (!responseData) return null;

    const filteredResponse = [];

    if (selectedFilters.includes('Alphabets')) {
      filteredResponse.push(`Alphabets: ${responseData.alphabets.join(', ')}`);
    }

    if (selectedFilters.includes('Numbers')) {
      filteredResponse.push(`Numbers: ${responseData.numbers.join(', ')}`);
    }

    if (selectedFilters.includes('Highest Lowercase Alphabet')) {
      filteredResponse.push(`Highest Lowercase Alphabet: ${responseData.highest_lowercase_alphabet.join(', ')}`);
    }

    return filteredResponse.map((item, index) => <div key={index}>{item}</div>);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1>RA2111003011872</h1>
      
      {/* API Input section */}
      <div style={{ marginBottom: '20px', textAlign: 'left', width: '80%', margin: '0 auto' }}>
        <label style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>API Input</label>
        <input
          type="text"
          placeholder="Enter JSON"
          value={jsonData}
          onChange={handleJsonChange}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '2px solid #ccc',
            fontSize: '16px',
            marginTop: '5px'
          }}
        />
      </div>

      {/* Submit button with more margin below the input */}
      <div style={{ margin: '20px 0' }}>
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            //width:'10px'
          }}
        >
          Submit
        </button>
      </div>

      {/* Error message display */}
      {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}

      {/* Filter and Response Section */}
      {responseData && (
        <div style={{ marginTop: '20px' }}>
          
          {/* Multi Filter section */}
          <div style={{ marginBottom: '10px', textAlign: 'left', width: '80%', margin: '0 auto' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Multi Filter</label>
            <Select
              isMulti
              options={filterOptions}
              onChange={handleFilterChange}
              placeholder="Select filters..."
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: '100%',
                }),
                control: (provided) => ({
                  ...provided,
                  borderRadius: '5px',
                  borderColor: '#ccc',
                  fontSize: '16px',
                })
              }}
            />
          </div>

          {/* Filtered Response section */}
          <div style={{ marginTop: '20px', textAlign: 'left', width: '80%', margin: '0 auto' }}>
            <h3>Filtered Response:</h3>
            <div
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                minHeight: '50px',
                fontSize: '16px'
              }}
            >
              {renderResponse()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
