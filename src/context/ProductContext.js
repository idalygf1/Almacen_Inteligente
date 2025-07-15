// src/context/ProductContext.js
import React, { createContext, useState, useEffect } from 'react';
import socket from '../services/socket';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [details, setDetails] = useState({});
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);

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

  const updateProduct = (newProductData) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === newProductData.id ? { ...p, stock_actual: newProductData.stock_actual } : p
      )
    );
  };

  useEffect(() => {
    socket.connect();
    socket.on('product-updated', (data) => {
      if (data.cardData) updateProduct(data.cardData);
      if (data.detailData) updateDetail(data.detailData);
      if (data.movementData) addMovement(data.movementData);
      if (data.cardData) updateCard(data.cardData);
    });

    return () => {
      socket.off('product-updated');
      socket.disconnect();
    };
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        updateProduct,
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
