import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ShipmentsPage from './pages/ShipmentsPage';
import ShipmentDetailPage from './pages/ShipmentDetailPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import TrackingPage from './pages/TrackingPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/track',
    element: <TrackingPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'shipments', element: <ShipmentsPage /> },
      { path: 'shipments/new', element: <ShipmentDetailPage /> },
      { path: 'shipments/:id', element: <ShipmentDetailPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'customers/new', element: <CustomerDetailPage /> },
      { path: 'customers/:id', element: <CustomerDetailPage /> },
    ],
  },
]);
