import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WalletConnect from './components/WalletConnect'
import './App.css';
import { Dashboard } from './components/Dashboard'

function App() {
  return (

    <div className='App'>
      <BrowserRouter>
        <h1 className='header'>VoteChain</h1>
        <Routes>
          <Route path="/" element={<WalletConnect />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
