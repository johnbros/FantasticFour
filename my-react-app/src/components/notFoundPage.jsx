import React from 'react';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <h2 className="text-2xl text-gray-600 mb-8">Page Not Found</h2>
            <p className="text-gray-500 mb-8">
                The page you're looking for doesn't exist or has been moved.
            </p>
        </div>
    );
};

export default NotFoundPage;