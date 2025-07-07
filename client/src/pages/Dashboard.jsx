import { useEffect, useState } from 'react';
import axiosPrivate from '../api/axios';

function Dashboard() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axiosPrivate.get('/auth/protected')
      .then(res => setMessage(res.data.msg))
      .catch(err => setMessage('Access denied.'));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>{message}</p>
    </div>
  );
}

export default Dashboard;