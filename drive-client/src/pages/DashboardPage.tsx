import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FileUploadModal from '../components/FileUploadModal';
import { Toaster } from 'react-hot-toast';

interface File {
  id: number;
  name: string;
  folderId: number;
}

interface Folder {
  id: number;
  name: string;
  files?: File[];
}

const DashboardPage: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFolderId, setUploadFolderId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Utility to extract error message
  const getErrorMessage = (err: any, fallback = 'An error occurred') => {
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.message) return err.message;
    return fallback;
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    api.get('/folders/me')
      .then(res => {
        setFolders(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(getErrorMessage(err, 'Failed to load folders'));
        }
      });
  }, [navigate]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/folders', { name });
      setFolders([...folders, res.data]);
      setName('');
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to create folder'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <body className="bg-white dark:bg-gray-900">
      <Header />
      <main className="flex flex-col items-center justify-center min-h-[80vh] max-w-3xl mx-auto w-full px-4 py-8">
        <div className="dashboard-container w-full bg-white dark:bg-gray-800 rounded-2xl shadow p-8 mt-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">My Folders</h2>
          <button onClick={handleLogout} className="mb-6 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white w-full">Logout</button>
          <form onSubmit={handleCreate} className="flex gap-2 mb-8">
            <input
              type="text"
              placeholder="New folder name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">Create Folder</button>
          </form>
          {error && <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-xl px-4 py-2 mb-4 text-center">{error}</div>}
          <ul className="space-y-2 mb-8">
            {Array.isArray(folders) && folders.map(folder => (
              <li
                key={folder.id}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg flex justify-between items-center group transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl"
              >
                <span className="font-semibold">{folder.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setUploadFolderId(folder.id);
                      setIsUploadModalOpen(true);
                    }}
                    className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  >
                    Upload
                  </button>
                  <button onClick={async () => {
                    const newName = prompt('Rename folder:', folder.name);
                    if (!newName) return;
                    try {
                      await api.put(`/folders/${folder.id}`, { ...folder, name: newName });
                      setFolders(folders.map(f => f.id === folder.id ? { ...f, name: newName } : f));
                    } catch (err: any) {
                      setError(getErrorMessage(err, 'Failed to rename folder'));
                    }
                  }} className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs">Rename</button>
                  <button onClick={async () => {
                    try {
                      await api.delete(`/folders/${folder.id}`);
                      setFolders(folders.filter(f => f.id !== folder.id));
                    } catch (err: any) {
                      setError(getErrorMessage(err, 'Failed to delete folder'));
                    }
                  }} className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* User folders section */}
        <section className="w-full max-w-3xl mx-auto mt-8">
          <h3 className="text-xl font-bold mb-4 text-primary-800 dark:text-white">Your Folders</h3>
          {Array.isArray(folders) && folders.length === 0 ? (
            <div className="text-center text-primary-600 dark:text-primary-300 bg-gradient-to-r from-primary-50/80 to-accent-50/80 dark:from-primary-900/80 dark:to-accent-900/80 rounded-xl p-8 shadow-lg flex flex-col items-center gap-2 animate-fade-in">
              <svg className="w-12 h-12 text-blue-300 dark:text-blue-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9-4 9 4M3 7h18" /></svg>
              <span className="font-semibold text-lg">You don't have any folders yet.</span>
              <span className="text-sm">Click <span className="text-blue-500 font-bold">Create Folder</span> above to get started!</span>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {folders.map(folder => (
                <li key={folder.id} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white shadow">
                  <span className="truncate font-medium">{folder.name}</span>
                  {folder.files && folder.files.length > 0 && (
                    <ul className="mt-2 ml-4 space-y-1">
                      {folder.files.map(file => (
                        <li key={file.id} className="flex items-center justify-between text-sm bg-gray-100 dark:bg-gray-900 rounded px-2 py-1 text-gray-900 dark:text-white">
                          <span>{file.name}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  const res = await api.get(`/files/download/${file.id}`, {
                                    responseType: 'blob',
                                    headers: {
                                      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                                    },
                                  });
                                  const url = window.URL.createObjectURL(new Blob([res.data]));
                                  const link = document.createElement('a');
                                  link.href = url;
                                  link.setAttribute('download', file.name);
                                  document.body.appendChild(link);
                                  link.click();
                                  link.remove();
                                  window.URL.revokeObjectURL(url);
                                } catch (err: any) {
                                  setError(getErrorMessage(err, 'Failed to download file'));
                                }
                              }}
                              className="p-1 rounded bg-blue-600 hover:bg-blue-700 text-white shadow transition"
                              title="Download"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
                            </button>
                            <button onClick={async () => {
                              const newName = prompt('Rename file:', file.name);
                              if (!newName) return;
                              try {
                                await api.put(`/files/${file.id}`, { ...file, name: newName });
                                setFolders(folders => folders.map(f => f.id === folder.id ? {
                                  ...f,
                                  files: f.files?.map(fl => fl.id === file.id ? { ...fl, name: newName } : fl)
                                } : f));
                              } catch (err: any) {
                                setError(getErrorMessage(err, 'Failed to rename file'));
                              }
                            }} className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs">Rename</button>
                            <button onClick={async () => {
                              try {
                                await api.delete(`/files/${file.id}`);
                                setFolders(folders => folders.map(f => f.id === folder.id ? {
                                  ...f,
                                  files: f.files?.filter(fl => fl.id !== file.id)
                                } : f));
                              } catch (err: any) {
                                setError(getErrorMessage(err, 'Failed to delete file'));
                              }
                            }} className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs">Delete</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent Files section */}
        <section className="w-full max-w-3xl mx-auto mt-8">
          <h3 className="text-xl font-bold mb-4 text-primary-800 dark:text-white">Recent Files</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {folders
              .flatMap(folder => folder.files?.map(file => ({ ...file, folderName: folder.name })) || [])
              .sort((a, b) => b.id - a.id) // Assuming higher id = more recent
              .slice(0, 5)
              .map(file => (
                <li key={file.id} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white shadow flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="truncate font-medium">{file.name}</span>
                    <button
                      onClick={async () => {
                        try {
                          const res = await api.get(`/files/download/${file.id}`, {
                            responseType: 'blob',
                            headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
                          });
                          const url = window.URL.createObjectURL(new Blob([res.data]));
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', file.name);
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                          window.URL.revokeObjectURL(url);
                        } catch (err: any) {
                          setError(getErrorMessage(err, 'Failed to download file'));
                        }
                      }}
                      className="p-1 rounded bg-blue-600 hover:bg-blue-700 text-white shadow transition"
                      title="Download"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
                    </button>
                  </div>
                  <span className="text-xs text-primary-500 dark:text-primary-300">in {file.folderName}</span>
                </li>
              ))}
          </ul>
        </section>

        {/* All Files section */}
        <section className="w-full max-w-3xl mx-auto mt-8 mb-12">
          <h3 className="text-xl font-bold mb-4 text-primary-800 dark:text-white">All Files</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {folders
              .flatMap(folder => folder.files?.map(file => ({ ...file, folderName: folder.name })) || [])
              .map(file => (
                <li key={file.id} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white shadow flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="truncate font-medium">{file.name}</span>
                    <button
                      onClick={async () => {
                        try {
                          const res = await api.get(`/files/download/${file.id}`, {
                            responseType: 'blob',
                            headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
                          });
                          const url = window.URL.createObjectURL(new Blob([res.data]));
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', file.name);
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                          window.URL.revokeObjectURL(url);
                        } catch (err: any) {
                          setError(getErrorMessage(err, 'Failed to download file'));
                        }
                      }}
                      className="p-1 rounded bg-blue-600 hover:bg-blue-700 text-white shadow transition"
                      title="Download"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
                    </button>
                  </div>
                  <span className="text-xs text-primary-500 dark:text-primary-300">in {file.folderName}</span>
                </li>
              ))}
          </ul>
        </section>
      </main>
      <Footer />
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        parentFolderId={uploadFolderId ? uploadFolderId.toString() : ''}
        onUploadSuccess={async () => {
          // Refresh files after upload
          try {
            const res = await api.get('/files/me');
            setFolders(Array.isArray(res.data) ? res.data : []);
          } catch (err: any) {
            setError(getErrorMessage(err, 'Failed to load files'));
          }
        }}
      />
      <Toaster position="top-right" toastOptions={{
        style: { background: 'rgba(30,41,59,0.95)', color: '#fff', borderRadius: '0.75rem', fontWeight: 500 },
        className: 'shadow-2xl dark:bg-zinc-900 dark:text-white',
      }} />
      {/* Animations */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s cubic-bezier(.4,2,.6,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
      `}</style>
    </body>
  );
};

export default DashboardPage;
