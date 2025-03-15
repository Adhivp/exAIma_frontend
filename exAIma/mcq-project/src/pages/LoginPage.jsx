import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessPopup from '../components/SuccessPopup';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      username,
      password,
    };

    try {
      const response = await fetch('http://4.240.76.3:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('token_type', data.token_type);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({ username }));
        setShowSuccess(true); // Show success popup
      } else {
        setError(data.detail || 'Invalid username or password');
      }
    } catch (error) {
      setError('Failed to connect to the server. Please try again later.');
    }
  };

  const handlePopupClose = () => {
    setShowSuccess(false);
    navigate('/user'); // Redirect to user page after popup closes
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center relative">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-green-800 text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 font-semibold"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Don’t have an account?{' '}
          <a href="/register" className="text-green-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
      <SuccessPopup
        message="Login successful"
        onClose={handlePopupClose}
        open={showSuccess}
      />
    </div>
  );
}