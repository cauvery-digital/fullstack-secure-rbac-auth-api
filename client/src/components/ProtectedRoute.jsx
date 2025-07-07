import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { auth } = useContext(AuthContext);

  if (auth.loading) return <p>Loading...</p>;
  return auth.isAuthenticated ? children : <Navigate to="/" />;
}

export default ProtectedRoute;