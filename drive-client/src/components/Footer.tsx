import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 py-4 mt-10 border-t border-gray-200 dark:border-gray-800">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-8 gap-2">
      <span>&copy; {new Date().getFullYear()} DriveApp. All rights reserved.</span>
      <div className="flex gap-4">
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 dark:text-blue-400">GitHub</a>
        <a href="/privacy" className="hover:underline text-blue-600 dark:text-blue-400">Privacy</a>
      </div>
    </div>
  </footer>
);

export default Footer;
