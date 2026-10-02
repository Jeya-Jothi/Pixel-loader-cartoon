"use client";

import { useState } from "react";
import PixelLoaderOverlay from "../components/PixelLoaderOverlay";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <PixelLoaderOverlay
        isLoading={isLoading}
        contentReady={!isLoading}
        onAnimationDone={() => setIsLoading(false)}
      />
    </>
  );
}
