import React from 'react';

function PageNotFound() {
    return (
        <div className="flex justify-center justify-items-center content-center">
            <div>
                <p className='text-9xl font-bold tracking-tight text-gray-400 mb-10'>404</p>
                <p className='text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl'>We can't find that page.</p>
                <p class="mt-4 text-gray-500">
                    Try searching again, or return home to start from the beginning.
                </p>
                <button className="btn btn-primary text-white mt-10 font-medium px-5 py-3 text-md" onClick={() => window.location.href = '/'}>
                    {/* <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M11.3 3.3a1 1 0 0 1 1.4 0l6 6 2 2a1 1 0 0 1-1.4 1.4l-.3-.3V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3c0 .6-.4 1-1 1H7a2 2 0 0 1-2-2v-6.6l-.3.3a1 1 0 0 1-1.4-1.4l2-2 6-6Z" clip-rule="evenodd" />
                    </svg> */}
                    Go Back Home</button>
            </div>
        </div>
    );
}

export default PageNotFound;
