import { useLocation } from 'react-router-dom';
import { useState } from 'react';

export const Dashboard = () => {
    const location = useLocation()
    const walletAddress = location.state?.walletAddress
    
}