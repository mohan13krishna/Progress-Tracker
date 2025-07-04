'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react'; 
import Link from 'next/link';
 
function ErrorContent() { 
  const searchParams = useSearchParams(); 
  const [error, setError] = useState('');

  useEffect(() => {
    const errorType = searchParams.get('error');
    switch (errorType) {
      case 'AccessDenied':
        setError('access_denied');
        break;
      case 'Configuration':
        setError('configuration');
        break;
      case 'Verification':
        setError('verification');
        break;
      default:
        setError('default');
    }
  }, [searchParams]);

  const getErrorContent = () => {
    switch (error) {
      case 'access_denied':
        return {
          title: 'Access Not Authorized',
          message: 'Your GitLab account is not yet registered in our system.',
          description: 'To gain access, you need to be pre-registered.',
          icon: '🚫',
          color: 'red'
        };
      case 'configuration':
        return {
          title: 'Configuration Error',
          message: 'Problem with authentication config.',
          description: 'Contact the admin.',
          icon: '⚙️',
          color: 'yellow'
        };
      case 'verification':
        return {
          title: 'Verification Failed',
          message: 'GitLab verification failed.',
          description: 'Try again or contact support.',
          icon: '❌',
          color: 'red'
        };
      default:
        return {
          title: 'Authentication Error',
          message: 'Unexpected error occurred.',
          description: 'Try again later.',
          icon: '⚠️',
          color: 'yellow'
        };
    }
  };

  const errorContent = getErrorContent();
  const colorClasses = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      button: 'bg-red-600 hover:bg-red-700'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    }
  };

  const colors = colorClasses[errorContent.color];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Your existing JSX using errorContent */}
      <div className="text-center">
        <span className="text-6xl">{errorContent.icon}</span>
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          {errorContent.title}
        </h2>
        <p className="mt-4 text-sm text-gray-600">{errorContent.message}</p>
        <p className="text-xs text-gray-400">{errorContent.description}</p>
      </div>
    </div>
  );
}

// ✅ Wrap in Suspense
export default function AuthError() {
  return (
    <Suspense fallback={<div className="text-center mt-12 text-gray-600">Loading error info...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
