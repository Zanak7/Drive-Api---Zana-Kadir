import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentFolderId: string;
  onUploadSuccess: () => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  parentFolderId,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = async () => {
      // Convert ArrayBuffer to base64 string
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < uint8Array.length; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      const base64String = btoa(binary);
      const payload = {
        name: selectedFile.name,
        folderId: Number(parentFolderId),
        content: base64String,
      };
      console.log("Uploading payload:", payload);
      try {
        const res = await fetch("/api/files/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Upload failed");
        setProgress(100);
        toast.success("File uploaded!");
        setTimeout(() => {
          setSelectedFile(null);
          setIsUploading(false);
          setProgress(0);
          onUploadSuccess();
          onClose();
        }, 700);
      } catch {
        toast.error("Upload failed");
        setIsUploading(false);
      }
    };
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  if (!isOpen) return null;

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
      )}
      onClick={onClose}
    >
      <div
        className={clsx(
          "bg-white dark:bg-primary-950 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 relative",
          "transition-all duration-300",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-xl text-primary-400 hover:text-primary-600 dark:text-primary-200 dark:hover:text-primary-100 transition"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold mb-4 text-primary-700 dark:text-primary-100 text-center">
          Upload File
        </h3>
        <div
          className={clsx(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-8 px-4 mb-4 cursor-pointer transition",
            selectedFile
              ? "border-primary-400 bg-primary-50 dark:bg-primary-900"
              : "border-primary-200 hover:border-primary-400 dark:border-primary-800 dark:hover:border-primary-400"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
        >
          {selectedFile ? (
            <div className="flex flex-col items-center gap-2">
              <span className="font-medium text-primary-700 dark:text-primary-100">
                {selectedFile.name}
              </span>
              <span className="text-xs text-primary-400 dark:text-primary-300">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
              <button
                className="text-xs text-red-500 hover:underline mt-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg
                className="w-10 h-10 text-primary-400 dark:text-primary-200 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
              <span className="text-primary-500 dark:text-primary-200 font-medium">
                Drag & drop or click to select a file
              </span>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
        {isUploading && (
          <div className="w-full bg-primary-100 dark:bg-primary-900 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-400 to-accent-400 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <button
          className={clsx(
            "w-full py-2 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white",
            !selectedFile || isUploading
              ? "opacity-60 cursor-not-allowed"
              : "hover:brightness-105"
          )}
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.25s cubic-bezier(.4,2,.6,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default FileUploadModal;
