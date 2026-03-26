import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ fallback = '/' }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallback);
  };

  return (
    <button
      type="button"
      onClick={handleGoBack}
      aria-label="Go back"
      className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/90 px-3.5 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-white hover:text-neutral-900"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
};

export default BackButton;
