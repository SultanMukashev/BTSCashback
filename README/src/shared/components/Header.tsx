import React, { useEffect, useState } from 'react';
import UserInformation from '../values/UserInformation';
import Input from './Input'
import styled from 'styled-components';
import {API} from '../../shared/api.js'
import result from '../values/result.js';
import {myStore} from '../../shared/store/MyStore'

interface HeaderProps {
    user: UserInformation;
}

const StyledInput = styled.input`
margin-top: 24px;
  width: 100%;
  box-sizing: border-box;
  border: 0px solid black;
  height: 56px;
  border-radius: 16px;
  padding: 8px 16px;
  -webkit-box-shadow: 0px 4px 91px -17px rgba(0,0,0,0.36);
  -moz-box-shadow: 0px 4px 91px -17px rgba(0,0,0,0.36);
  box-shadow: 0px 4px 91px -17px rgba(0,0,0,0.36);
  border: 2px solid #527cfb
`;

const StyledHeader = styled.div`
    // Add your styles here
    display:flex;
    justify-content:space-between;  
    align-items: center;
`;

const SearchResultList = styled.div`
position: absolute; /* Change to relative */
border-radius: 12px;
border: 2px solid #527cfb;
  width: 200px;
  background-color: #fff;
  color:black;
  font-size:16px;
  font-weight: 400;
  padding:20px;
  overflow-y: auto;
  background: white;
  left:50%;
  top:100px;
`;

const Header: React.FC<HeaderProps> = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    try {
        const response = await API.get(`/lazy-search?q=${encodeURIComponent(term)}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }

    if (term.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

   

    setIsLoading(false);
  };
    return (
        <StyledHeader>
            <div>
                <h2>{user.name} </h2>
            </div>
            <div>
        <StyledInput onChange={handleChange} placeholder='Search'/>
        {searchResults.length > 0 && (
        <SearchResultList>
        {searchResults.map((result: result, index: number) => (
          <div key={index} onClick={() => {
            if (result.shop) { 
              API.get(`/most_profitable_bank/?shop=${result.shop}`).then((res) => {
                myStore.updateData(res.data);
              }).catch((error) => {
                console.error('Error fetching most profitable bank:', error);
              });
            } else {
                console.log(searchResults)
            }
          }}>
            {result.shop}
          </div>
        ))}
      </SearchResultList>
      
      )}
            </div>
        </StyledHeader>
    );
};

export default Header;
