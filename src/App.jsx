import { useState } from 'react';
import CustomWebcam from './CustomWebcam';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  return (
    <>
      <div className="flex">
        <Dashboard />
      </div>
    </>
  );
}

export default App;
