import React from 'react';
import { InventoryProvider } from './context/InventoryContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;
