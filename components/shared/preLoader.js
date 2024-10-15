import React, { useEffect, useRef, useState } from "react";
import lottie from "lottie-web";

const LoadingScreen = () => {
  const container = useRef(null);
  const [loadingText, setLoadingText] = useState("Loading...");
  const [animationData, setAnimationData] = useState(null);

  const loadingPhrases = [
    "Scanning for impostors...",
    "Prepping emergency meeting...",
    "Fixing wires in electrical...",
    "Clearing asteroids...",
    "Uploading data to HQ...",
    "Fueling engines...",
    "Calibrating distributor...",
    "Emptying garbage chute...",
  ];

  useEffect(() => {
    const fetchAndCacheAnimation = async () => {
      try {
        // Check if the animation data is already in local storage
        const cachedData = localStorage.getItem('lottieAnimationData');
        
        if (cachedData) {
          // If cached data exists, use it
          setAnimationData(JSON.parse(cachedData));
        } else {
          // If not, fetch the data
          const response = await fetch("/assets/loading_anim.json");
          const data = await response.json();
          
          // Cache the fetched data in local storage
          localStorage.setItem('lottieAnimationData', JSON.stringify(data));
          
          setAnimationData(data);
        }
      } catch (error) {
        console.error("Error loading animation:", error);
      }
    };

    fetchAndCacheAnimation();
  }, []);

  useEffect(() => {
    let anim;
    if (animationData && container.current) {
      anim = lottie.loadAnimation({
        container: container.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData,
      });
    }

    const textInterval = setInterval(() => {
      setLoadingText(
        loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]
      );
    }, 3000);

    return () => {
      if (anim) anim.destroy();
      clearInterval(textInterval);
    };
  }, [animationData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div ref={container} className="w-64 h-64"></div>
      <p className="mt-4 text-xl">{loadingText}</p>
      <p className="mt-2 text-sm text-gray-400">
        Don't look sus while waiting!
      </p>
    </div>
  );
};

export default LoadingScreen;