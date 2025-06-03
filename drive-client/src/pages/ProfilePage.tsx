import React, { useState, useEffect } from 'react';
import api from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../utils/errorUtils';

const ProfilePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setUsername(res.data.userName || '');
        setEmail(res.data.email || '');
      } catch (err: any) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
    setSuccess('');
    try {
      await api.put('/auth/me', { userName: username, email });
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(getErrorMessage(err, 'Update failed'));
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>;

  return (
    <>
      <Header />
      <main className="flex min-h-[80vh] items-center justify-center bg-white dark:bg-gray-900 py-8">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow p-8 flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="profile-username" className="block text-gray-800 dark:text-gray-100 mb-1 font-medium">Username</label>
              <input
                id="profile-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Username"
                aria-label="Username"
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-gray-800 dark:text-gray-100 mb-1 font-medium">Email</label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Email"
                aria-label="Email"
              />
            </div>
            <button type="submit" className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400">Save Changes</button>
          </form>
          {error && <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-xl px-4 py-2 text-center mt-2" aria-live="polite">{error}</div>}
          {success && <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-xl px-4 py-2 text-center mt-2">{success}</div>}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;
