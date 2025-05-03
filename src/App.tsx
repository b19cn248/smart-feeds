import React from 'react';
import Layout from './components/Layout';
import { FolderProvider } from './context/FolderContext';
import { ToastProvider } from './context/ToastContext';
import './styles/global.css';

const App: React.FC = () => {
  return (
      <ToastProvider>
        <FolderProvider>
          <Layout />
        </FolderProvider>
      </ToastProvider>
  );
};

export default App;