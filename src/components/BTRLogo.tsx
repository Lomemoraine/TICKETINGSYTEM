import React from 'react';
import Svg, {
  Circle,
  Path,
  Text as SvgText,
  G,
  Line,
} from 'react-native-svg';

interface BTRLogoProps {
  size?: number;
  color?: string;
  bgColor?: string;
}

/**
 * Inline SVG recreation of the BTR (Back to the Root of Worship) logo.
 * A circle with a cross + roots design, and "BTR" lettering.
 */
const BTRLogo: React.FC<BTRLogoProps> = ({
  size = 100,
  color = '#1A2B5E',
  bgColor = 'transparent',
}) => {
  const r = size / 2;
  const strokeW = size * 0.025;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Outer circle */}
      <Circle cx="50" cy="50" r="46" fill={bgColor} stroke={color} strokeWidth={strokeW * 1.5} />

      {/* Horizontal divider line */}
      <Line x1="12" y1="62" x2="88" y2="62" stroke={color} strokeWidth={strokeW} />

      {/* Cross — vertical bar */}
      <Path
        d="M50 18 L50 58"
        stroke={color}
        strokeWidth={strokeW * 2.5}
        strokeLinecap="round"
      />
      {/* Cross — horizontal bar */}
      <Path
        d="M37 30 L63 30"
        stroke={color}
        strokeWidth={strokeW * 2.5}
        strokeLinecap="round"
      />

      {/* Root branches below divider */}
      {/* Center root going down */}
      <Path d="M50 62 L50 80" stroke={color} strokeWidth={strokeW * 2} strokeLinecap="round" />
      {/* Left root */}
      <Path d="M50 70 Q38 74 32 82" stroke={color} strokeWidth={strokeW * 1.8} strokeLinecap="round" fill="none" />
      {/* Right root */}
      <Path d="M50 70 Q62 74 68 82" stroke={color} strokeWidth={strokeW * 1.8} strokeLinecap="round" fill="none" />
      {/* Far left root */}
      <Path d="M50 65 Q28 68 20 78" stroke={color} strokeWidth={strokeW * 1.2} strokeLinecap="round" fill="none" />
      {/* Far right root */}
      <Path d="M50 65 Q72 68 80 78" stroke={color} strokeWidth={strokeW * 1.2} strokeLinecap="round" fill="none" />

      {/* BTR text */}
      <SvgText
        x="50"
        y="55"
        textAnchor="middle"
        fontSize={size * 0.18}
        fontWeight="bold"
        fill={color}
        fontFamily="serif"
      >
        BTR
      </SvgText>
    </Svg>
  );
};

export default BTRLogo;
