import React, { useState } from 'react';
import Header from '../../shared/components/Header'; 
import Cards from '../../shared/components/Cards'; 
import MainPageProps from '../../shared/values/MainPageProps';
import styled from 'styled-components';
import {myStore} from '../../shared/store/MyStore'
import { observer } from 'mobx-react';

const StyledContainer = styled.div`
margin-top: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;  
    flex-wrap: wrap;
    padding: 30px;

    @media (min-width:768px) {
        display: grid;
    }
`;

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledP = styled.p`
position: absolute;
font-size: 64px;
left: 0;
font-weight: 500;
color:#527cfb;
`

const MainPage: React.FC<MainPageProps> = ({ user, items }) => {
    return (
        <StyledPage>
            <Header user={user} />
            <StyledContainer>
                {items?.map((item, index) => (
                    <Cards className={item.bank} key={index} items={[item]} swipable={true} index={index} />
                ))}
                {myStore.data.percent ? (
                <StyledP>+{myStore.data.percent}%</StyledP>
            ) : (
              <></>
            )}
            </StyledContainer>
        </StyledPage>
    );
};

export default observer(MainPage);

