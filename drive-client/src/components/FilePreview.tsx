import React, { useEffect, useState } from 'react';
import api from '../api';

interface FilePreviewProps {
  fileId: number;
  fileName: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileId, fileName }) => {
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    api.get(`/files/${fileId}`)
      .then(res => {
        if (!isMounted) return;
        if (res.data && typeof res.data.preview === 'string') {
          setPreview(res.data.preview);
        } else {
          setPreview('[Preview not available]');
        }
      })
      .catch(() => {
        if (isMounted) setPreview('[Preview not available]');
      })
      .finally(() => setLoading(false));
    return () => { isMounted = false; };
  }, [fileId]);

  if (loading) return <div className="text-xs text-primary-400">Loading preview...</div>;
  if (error) return <div className="text-xs text-red-400">{error}</div>;
  return (
    <pre className="text-xs bg-primary-100 dark:bg-primary-950 rounded p-2 overflow-x-auto max-h-24 whitespace-pre-wrap mt-1">
      {preview}
    </pre>
  );
};

export default FilePreview;
