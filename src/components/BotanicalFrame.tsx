import React from 'react';
import { TrailingIvyLeft, TrailingIvyRight } from './Icons';

export const BotanicalFrame: React.FC = () => {
  return (
    <div className="pointer-events-none select-none leaf-accent overflow-hidden" aria-hidden="true">
      {/* Desktop Top-Left Ivy Vine */}
      <div className="hidden lg:block fixed left-0 top-0 w-16 xl:w-20 z-30 opacity-90 drop-shadow-2xs">
        <TrailingIvyLeft className="w-full h-auto" />
      </div>

      {/* Desktop Top-Right Ivy Vine */}
      <div className="hidden lg:block fixed right-0 top-0 w-16 xl:w-20 z-30 opacity-90 drop-shadow-2xs">
        <TrailingIvyRight className="w-full h-auto" />
      </div>

      {/* Desktop Bottom-Left Ivy Vine */}
      <div className="hidden lg:block fixed left-0 bottom-0 w-16 xl:w-20 z-30 opacity-85 drop-shadow-2xs scale-y-[-1]">
        <TrailingIvyLeft className="w-full h-auto" />
      </div>

      {/* Desktop Bottom-Right Ivy Vine */}
      <div className="hidden lg:block fixed right-0 bottom-0 w-16 xl:w-20 z-30 opacity-85 drop-shadow-2xs scale-y-[-1]">
        <TrailingIvyRight className="w-full h-auto" />
      </div>

      {/* Mobile Corner Vines */}
      <div className="md:hidden absolute top-16 left-0 w-9 z-30 opacity-80">
        <TrailingIvyLeft className="w-full h-auto" />
      </div>
      <div className="md:hidden absolute top-16 right-0 w-9 z-30 opacity-80">
        <TrailingIvyRight className="w-full h-auto" />
      </div>
    </div>
  );
};
