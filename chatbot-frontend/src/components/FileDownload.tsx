import type { FileDownload as FileDownloadType } from '../types/chat';
import { downloadFile } from '../services/api';

interface FileDownloadProps {
  file: FileDownloadType;
}

export function FileDownload({ file }: FileDownloadProps) {
  const handleDownload = async () => {
    try {
      const blob = await downloadFile(file.filename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium hover:bg-secondary/80"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {file.filename}
      </button>
    </div>
  );
} 