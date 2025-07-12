// src/context/ProductContext.js
import React, { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [details, setDetails] = useState({});
  const [movements, setMovements] = useState([]);

  const updateCard = (newCardData) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === newCardData.id ? { ...card, stock_actual: newCardData.stock_actual } : card
      )
    );
  };

  const updateDetail = (newDetailData) => {
    setDetails((prev) =>
      prev.id === newDetailData.id ? { ...newDetailData } : prev
    );
  };

  const addMovement = (newMovement) => {
    setMovements((prev) => [newMovement, ...prev]);
  };

  return (
    <ProductContext.Provider
      value={{
        cards,
        setCards,
        details,
        setDetails,
        movements,
        setMovements,
        updateCard,
        updateDetail,
        addMovement,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
