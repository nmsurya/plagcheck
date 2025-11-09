'use client';
import { useState } from 'react';
import { Upload, FileText, Loader2, Moon, Sun, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setResponse(null);
      setError(null);
    } else {
      setError('Please select a valid PDF file');
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8080/check', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data.response);
        setShowModal(true);
      } else {
        setError(data.reason || 'Something went wrong.');
      }
    } catch {
      setError('Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white'
          : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900'
      } flex flex-col items-center justify-center p-6`}
    >
      {/* Main Card */}
      <div
        className={`${
          darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
        } rounded-2xl shadow-lg p-8 w-full max-w-xl border border-gray-700/30 relative`}
      >
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <h1 className="text-2xl font-bold mb-4 text-center">
          🧠 AntiPlag AI PDF Checker
        </h1>

        {/* Upload Box */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition cursor-pointer ${
            darkMode
              ? 'border-gray-600 hover:border-blue-500 bg-gray-700/30'
              : 'border-gray-300 hover:border-blue-400 bg-gray-50'
          }`}
        >
          <input
            type="file"
            accept="application/pdf"
            id="pdf-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          <label htmlFor="pdf-upload" className="flex flex-col items-center cursor-pointer">
            {file ? (
              <>
                <FileText
                  className={`w-10 h-10 mb-2 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}
                />
                <p className="font-medium">{file.name}</p>
              </>
            ) : (
              <>
                <Upload
                  className={`w-10 h-10 mb-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
                <p
                  className={`${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  } text-sm`}
                >
                  Click or drag PDF here to upload
                </p>
              </>
            )}
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          className={`mt-6 w-full font-semibold py-3 rounded-lg transition disabled:opacity-50 flex justify-center items-center gap-2 ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Analyzing...
            </>
          ) : (
            'Check for AI / Plagiarism'
          )}
        </button>

        {/* Error Message */}
        {error && (
          <p
            className={`mt-4 text-center font-medium ${
              darkMode ? 'text-red-400' : 'text-red-600'
            }`}
          >
            {error}
          </p>
        )}
      </div>

      {/* 🧾 Response Modal */}
      <AnimatePresence>
        {showModal && response && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`relative w-[90%] max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 ${
                darkMode
                  ? 'bg-gray-900 text-gray-100 border border-gray-700'
                  : 'bg-white text-gray-900 border border-gray-200'
              } shadow-2xl`}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold mb-4 text-center">
                🧾 Final Verdict
              </h2>

              <div
                className={`prose prose-sm max-w-none ${
                  darkMode ? 'prose-invert' : ''
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h3: ({ node, ...props }) => (
                      <h3
                        className={`text-lg font-bold mt-4 mb-2 ${
                          darkMode ? 'text-blue-400' : 'text-blue-700'
                        }`}
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong
                        className={`font-semibold ${
                          darkMode ? 'text-blue-300' : 'text-blue-600'
                        }`}
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="ml-4 list-disc leading-relaxed" {...props} />
                    ),
                  }}
                >
                  {response}
                </ReactMarkdown>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
