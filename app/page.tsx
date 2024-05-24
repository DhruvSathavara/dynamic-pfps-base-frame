"use client";
import React from 'react';
import { PFPContextProvider } from './context/StatusContext';
import LandingPage from './components/landing';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Home = () => {
  return (
    <PFPContextProvider>
      <div>
        <ToastContainer />
        <LandingPage />
      </div>
    </PFPContextProvider>
  );
};

export default Home;