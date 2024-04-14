import React, { useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

import { myStore } from '../store/MyStore';
import { observer } from 'mobx-react';
interface CardProps {
  items: { image: string; title: string; bank: string }[];
  index: number;
}

const shineAnimation = keyframes`
  0% {
    border-color: #527cfb;
    box-shadow: 0 0 15px #527cfb;
    transform: translateY(0);
  }
  50% {
    border-color: #527cfb;
    box-shadow: 0 0 15px #527cfb;
    transform: translateY(-20px);
  }
  100% {
    border-color: #527cfb;
    box-shadow: 0 0 15px #527cfb;
    transform: translateY(0);
  }
`;


const StyledCard = styled.div<{ isHighlighted: boolean }>`
  border-radius: 13px;
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
  justify-content: center;
  height: 180px;
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  ${(props) =>
    props.isHighlighted &&
    css`
      animation: ${shineAnimation} 4s infinite;
    `}
`;

const Card: React.FC<CardProps> = ({ items, index }) => {
  const bankFromStore = myStore.data.bank;
  const isBankHighlighted = items.some((item) => item.bank === bankFromStore);

  return (
    <StyledCard isHighlighted={isBankHighlighted} className={isBankHighlighted ? 'shine-effect' : ''}>
      <img className="cardCover" src={items[0].image} alt={items[0].title} />
    </StyledCard>
  );
};

export default observer(Card); // Оберните компонент в observer
