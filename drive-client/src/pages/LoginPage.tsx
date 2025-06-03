import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getErrorMessage } from '../utils/errorUtils';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Clear error after 5 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { userName: username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(getErrorMessage(err, 'Login failed'));
    }
  };

  return (
    <>
      <Header />
      <main className="flex min-h-[80vh] items-center justify-center bg-white dark:bg-gray-900 py-8">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow p-8 flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Sign in to DriveApp
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="login-username" className="block text-gray-800 dark:text-gray-100 mb-1 font-medium">
                Username
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your username"
                aria-label="Username"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-gray-800 dark:text-gray-100 mb-1 font-medium">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                aria-label="Password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-blue font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Sign In
            </button>
          </form>
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-xl px-4 py-2 text-center mt-2" aria-live="polite">
              {error}
            </div>
          )}
          <div className="text-center text-gray-700 dark:text-gray-200 mt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
              Register
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LoginPage;
