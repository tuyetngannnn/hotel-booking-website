// eslint-disable-next-line no-unused-vars
import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchResults, setSearchResults] = useState([]);  // Khai báo searchResults
    const [isSearchExecuted, setIsSearchExecuted] = useState(false);
    const [searchId, setSearchId] = useState(null); // Thêm searchId để phân biệt các lần tìm kiếm

    return (
        <SearchContext.Provider value={{ 
            searchResults, 
            setSearchResults, 
            isSearchExecuted, 
            setIsSearchExecuted, 
            searchId, 
            setSearchId 
        }}>
            {children}
        </SearchContext.Provider>
    );
};

SearchProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
