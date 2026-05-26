import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import FindActivities from '../pages/FindActivities';
import MyActivities from '../pages/MyActivities';
import EventDetail from '../pages/EventDetail';
import CreateActivity from '../pages/CreateActivity';
import Profile from '../pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: <Navigate to="/activities" replace />,
          },
          {
            path: '/activities',
            element: <FindActivities />,
          },
          {
            path: '/my-activities',
            element: <MyActivities />,
          },
          {
            path: '/event/:id',
            element: <EventDetail />,
          },
          {
            path: '/create',
            element: <CreateActivity />,
          },
          {
            path: '/profile',
            element: <Profile />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/activities" replace />,
  },
]);
