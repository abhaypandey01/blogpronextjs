"use client"; // because we'll use browser events (important in Next.js 13/14)

import { useEffect, useState } from "react";

const NoInternet = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateNetworkStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    // Initial check
    updateNetworkStatus();

    // Cleanup
    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  if (isOnline) {
    return null; // Don't render anything if online
  }

  return (
    <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center p-3 z-50">
      No Internet Connection. Please check your network!
    </div>
  );
};

export default NoInternet;
