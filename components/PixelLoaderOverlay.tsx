"use client";

import { AnimatePresence, motion } from "framer-motion";
import PixelLoader from "./PixelLoader";

export type PixelLoaderOverlayProps = {
  isLoading: boolean;
  contentReady?: boolean;
  onAnimationDone?: () => void;
  className?: string;
  loaderClassName?: string;
};

export default function PixelLoaderOverlay({
  isLoading,
  contentReady = true,
  onAnimationDone,
  className = "",
  loaderClassName = "",
}: PixelLoaderOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={`pixel-loader-overlay ${className}`.trim()}
        >
          <PixelLoader
            onBuilt={onAnimationDone}
            contentReady={contentReady}
            className={loaderClassName}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
