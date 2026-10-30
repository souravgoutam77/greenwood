import React from 'react';

interface LogoLoaderProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LogoLoader: React.FC<LogoLoaderProps> = ({
  fullScreen = false,
  size = 'md',
}) => {
  const stageSizeClass = {
    sm: 'w-[100px] h-[100px]',
    md: 'w-[126px] h-[126px] sm:w-[134px] sm:h-[134px]',
    lg: 'w-[148px] h-[148px]',
  }[size];

  const logoSizeClass = {
    sm: 'w-16 h-[54px]',
    md: 'w-20 h-[68px] sm:w-[84px] sm:h-[71px]',
    lg: 'w-24 h-[81px] sm:w-28 sm:h-[95px]',
  }[size];

  const content = (
    <div className="relative flex items-center justify-center select-none">
      {/* Warm Ambient Golden Radial Halo */}
      <div
        className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-r from-[#C9A45C]/20 via-[#FFE094]/15 to-transparent blur-2xl opacity-75 pointer-events-none animate-pulse"
        style={{ animationDuration: '2.5s' }}
      />

      {/* Luxury Golden Orbit Ring Stage */}
      <div className={`relative ${stageSizeClass} flex items-center justify-center`}>
        {/* Hairline Rotating Golden Orbit Ring */}
        <div className="gw-loader-orbit-ring">
          <div className="gw-loader-orbit-jewel" />
        </div>

        {/* Floating 3D Brushed Gold Emblem */}
        <div className={`gw-loader-emblem ${logoSizeClass}`}>
          <img
            src="/greenwood-3d-gold-logo.png"
            alt="Greenwood"
            className="w-full h-full object-contain pointer-events-none select-none"
            loading="eager"
          />

          {/* Clean Specular Shimmer Sweep */}
          <div className="gw-loader-shine-mask" aria-hidden="true">
            <div className="gw-loader-shine-beam" />
          </div>

          {/* Diamond Sparkle Glint on Gold Arch */}
          <div className="gw-loader-sparkle">
            <svg
              viewBox="0 0 24 24"
              fill="#FFFFFF"
              className="w-full h-full filter drop-shadow-[0_0_4px_#FFD700] drop-shadow-[0_0_8px_#FFF]"
            >
              <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#FAF6EE] flex items-center justify-center animate-in fade-in duration-200">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full min-h-[60vh] bg-[#FAF6EE] flex items-center justify-center">
      {content}
    </div>
  );
};
