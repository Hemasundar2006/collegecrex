import React, { useEffect } from 'react';

const AdBanner = () => {
    useEffect(() => {
        // Create the script element
        const script = document.createElement('script');
        script.src = 'https://motortape.com/bf44c24cfdb161528fa7d10fa744eabc/invoke.js';
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        
        // Append script to the body or the container
        document.body.appendChild(script);

        return () => {
            // Clean up: Optional, usually ads don't need cleanup but good practice
            // document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="flex justify-center my-12 overflow-hidden rounded-2xl shadow-lg border border-primary-50 bg-white min-h-[90px]">
            <div id="container-bf44c24cfdb161528fa7d10fa744eabc"></div>
        </div>
    );
};

export default AdBanner;
