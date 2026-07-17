import React from "react";
import Svg, {
  Rect,
  Ellipse,
  Line,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Path,
  G,
} from "react-native-svg";
import { View } from "react-native";
import tw from "twrnc";

interface PackagingPreviewProps {
  type: "rolled" | "stretched";
  width: number;
  height: number;
  depth: number;
}

export default function PackagingPreview({
  type,
  width,
  height,
  depth,
}: Readonly<PackagingPreviewProps>) {
  if (type === "rolled") {
    return <TubePreview width={width} height={height} />;
  }
  return <BoxPreview width={width} height={height} depth={depth} />;
}

// Tube Preview for Rolled Packaging
function TubePreview({
  width,
  height,
}: Readonly<{ width: number; height: number }>) {
  const scale = 3;
  const diameter = width * scale * 1.5;
  const pixelLength = Math.min(Math.max(height * 2, 100), 160);

  const vbW = 220;
  const vbH = 140;
  const startX = (vbW - pixelLength) / 2;
  const centerY = 70;

  return (
    <View style={tw`items-center justify-center`}>
      <Svg viewBox={`0 0 ${vbW} ${vbH}`} width={200} height={120}>
        <Defs>
          <LinearGradient id="tubeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#d1d5db" />
            <Stop offset="20%" stopColor="#ffffff" />
            <Stop offset="50%" stopColor="#f3f4f6" />
            <Stop offset="85%" stopColor="#e5e7eb" />
            <Stop offset="100%" stopColor="#9ca3af" />
          </LinearGradient>
          <LinearGradient id="capGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#374151" />
            <Stop offset="30%" stopColor="#4b5563" />
            <Stop offset="100%" stopColor="#1f2937" />
          </LinearGradient>
        </Defs>

        {/* Shadow */}
        <Ellipse
          cx={startX + pixelLength / 2}
          cy={centerY + diameter / 2 + 6}
          rx={pixelLength / 2 - 5}
          ry={4}
          fill="#000"
          opacity={0.15}
        />

        {/* Tube Body */}
        <Rect
          x={startX}
          y={centerY - diameter / 2}
          width={pixelLength}
          height={diameter}
          fill="url(#tubeGrad)"
        />

        {/* End Caps */}
        <Ellipse
          cx={startX}
          cy={centerY}
          rx={4}
          ry={diameter / 2 + 2}
          fill="#1f2937"
        />
        <Ellipse
          cx={startX + pixelLength}
          cy={centerY}
          rx={4}
          ry={diameter / 2 + 2}
          fill="#4b5563"
        />

        {/* Dimension Labels */}
        <Line
          x1={startX}
          y1={centerY + diameter / 2 + 15}
          x2={startX + pixelLength}
          y2={centerY + diameter / 2 + 15}
          stroke="#444"
          strokeWidth={1}
        />
        <SvgText
          x={startX + pixelLength / 2}
          y={centerY + diameter / 2 + 28}
          fontSize={10}
          fontWeight="bold"
          fill="#222"
          textAnchor="middle"
        >
          {height}"
        </SvgText>

        <Line
          x1={startX + pixelLength + 12}
          y1={centerY - diameter / 2}
          x2={startX + pixelLength + 12}
          y2={centerY + diameter / 2}
          stroke="#444"
          strokeWidth={1}
        />
        <SvgText
          x={startX + pixelLength + 22}
          y={centerY + 3}
          fontSize={10}
          fontWeight="bold"
          fill="#222"
        >
          {width}"
        </SvgText>
      </Svg>
    </View>
  );
}

// Box Preview for Stretched Packaging
function BoxPreview({
  width,
  height,
  depth,
}: Readonly<{
  width: number;
  height: number;
  depth: number;
}>) {
  const scale = 1.3;
  const cos30 = 0.866;
  const sin30 = 0.5;
  const w_scaled = width * scale;
  const l_scaled = height * scale;
  const h_scaled = depth * scale * 1.5;

  const vbW = 220;
  const vbH = 180;
  const startX = vbW / 2;
  const startY = 50;

  const vecW = { x: w_scaled * cos30, y: w_scaled * sin30 };
  const vecL = { x: -l_scaled * cos30, y: l_scaled * sin30 };
  const vecH = { x: 0, y: h_scaled };

  const top_center = { x: startX, y: startY };
  const top_right = { x: top_center.x + vecW.x, y: top_center.y + vecW.y };
  const top_left = { x: top_center.x + vecL.x, y: top_center.y + vecL.y };
  const top_bottom = {
    x: top_center.x + vecW.x + vecL.x,
    y: top_center.y + vecW.y + vecL.y,
  };
  const bot_right = { x: top_right.x + vecH.x, y: top_right.y + vecH.y };
  const bot_left = { x: top_left.x + vecH.x, y: top_left.y + vecH.y };
  const bot_bottom = { x: top_bottom.x + vecH.x, y: top_bottom.y + vecH.y };

  return (
    <View style={tw`items-center justify-center`}>
      <Svg viewBox={`0 0 ${vbW} ${vbH}`} width={200} height={160}>
        <Defs>
          <LinearGradient id="boxTop" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#f3e3ce" />
            <Stop offset="100%" stopColor="#e8d0b3" />
          </LinearGradient>
          <LinearGradient id="boxLeft" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#dcb386" />
            <Stop offset="100%" stopColor="#c49a6c" />
          </LinearGradient>
          <LinearGradient id="boxRight" x1="1" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#c49a6c" />
            <Stop offset="100%" stopColor="#a37e58" />
          </LinearGradient>
        </Defs>

        <G>
          {/* Left Face */}
          <Path
            d={`M${top_left.x},${top_left.y} L${top_bottom.x},${top_bottom.y} L${bot_bottom.x},${bot_bottom.y} L${bot_left.x},${bot_left.y} Z`}
            fill="url(#boxLeft)"
            stroke="#bfa07d"
            strokeWidth={0.5}
          />
          {/* Right Face */}
          <Path
            d={`M${top_bottom.x},${top_bottom.y} L${top_right.x},${top_right.y} L${bot_right.x},${bot_right.y} L${bot_bottom.x},${bot_bottom.y} Z`}
            fill="url(#boxRight)"
            stroke="#bfa07d"
            strokeWidth={0.5}
          />
          {/* Top Face */}
          <Path
            d={`M${top_center.x},${top_center.y} L${top_right.x},${top_right.y} L${top_bottom.x},${top_bottom.y} L${top_left.x},${top_left.y} Z`}
            fill="url(#boxTop)"
            stroke="#bfa07d"
            strokeWidth={0.5}
          />

          {/* Tape Seam */}
          <Line
            x1={(top_center.x + top_left.x) / 2}
            y1={(top_center.y + top_left.y) / 2}
            x2={(top_right.x + top_bottom.x) / 2}
            y2={(top_right.y + top_bottom.y) / 2}
            stroke="#f8eadd"
            strokeWidth={8}
            opacity={0.6}
          />

          {/* Dimension: Height */}
          <SvgText
            x={(bot_left.x + bot_bottom.x) / 2 - 10}
            y={(bot_left.y + bot_bottom.y) / 2 + 18}
            fontSize={9}
            fontWeight="bold"
            fill="#222"
          >
            {height}"
          </SvgText>

          {/* Dimension: Width */}
          <SvgText
            x={(bot_bottom.x + bot_right.x) / 2 + 5}
            y={(bot_bottom.y + bot_right.y) / 2 + 18}
            fontSize={9}
            fontWeight="bold"
            fill="#222"
          >
            {width}"
          </SvgText>

          {/* Dimension: Depth */}
          <SvgText
            x={bot_right.x + 8}
            y={(top_right.y + bot_right.y) / 2}
            fontSize={9}
            fontWeight="bold"
            fill="#222"
          >
            {depth}"
          </SvgText>
        </G>
      </Svg>
    </View>
  );
}
