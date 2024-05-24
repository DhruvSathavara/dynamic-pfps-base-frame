import React, { createContext, useContext, useState } from 'react';

const StatusContext = createContext();

export const usePFPContext = () => {
  const context = useContext(StatusContext);
  if (context === undefined) {
    throw new Error('useStatus must be used within a StatusProvider');
  }
  return context;
}

export const PFPContextProvider = ({ children }) => {
  const [status, setStatus] = useState(false);

  const [isListed, setIsListed] = useState({
    status: false,
    id: ''
  });

  const updateUserInfo = ({ status, id }) => {
    setIsListed({ status, id });
  };


  return (
    <StatusContext.Provider value={{ status, setStatus, updateUserInfo, isListed, setIsListed }}>
      {children}
    </StatusContext.Provider>
  );
};
