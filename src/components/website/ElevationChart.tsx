"use client";

import React, { useState, useEffect } from "react";

interface ElevationPoint {
  distance: number;
  elevation: number;
}

interface ElevationChartProps {
  data: ElevationPoint[];
}

const ElevationChart: React.FC<ElevationChartProps> = ({ data }) => {
  const [Recharts, setRecharts] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const waitForRecharts = () => {
      if ((window as any)?.Recharts) {
        setRecharts((window as any).Recharts);
        setIsLoading(false);
      } else {
        // Coba lagi setiap 50ms sampai Recharts muncul
        setTimeout(waitForRecharts, 50);
      }
    };

    waitForRecharts();
  }, []);

  if (isLoading || !Recharts) {
    return (
      <div className="flex items-center justify-center h-48 w-full rounded-sm bg-ink-neutral-100 dark:bg-ink-neutral-800">
        <p className="text-sm text-ink-neutral-500 animate-pulse">
          Loading elevation chart...
        </p>
      </div>
    );
  }

  const {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } = Recharts;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-sm shadow-xl border border-ink-neutral-200 dark:border-ink-neutral-700">
          <p className="text-sm font-semibold">
            Distance: <span className="text-ink-neutral-700 dark:text-ink-neutral-300">{label.toFixed(1)} km</span>
          </p>
          <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
            Elevation: {payload[0].value.toFixed(0)} m
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: -20, bottom: 5 }}>
          {/* Gradient */}
          <defs>
            <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6A3D" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#FF6A3D" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="currentColor"
            strokeOpacity={0.15}
          />

          <XAxis
            dataKey="distance"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(value: number) => `${value.toFixed(1)}`}
            tick={{ fontSize: 11, fill: "currentColor" }}
            stroke="currentColor"
            label={{ value: "km", position: "insideBottomRight", offset: -8 }}
          />

          <YAxis
            domain={[
              (dataMin: number) => Math.floor(dataMin - 30),
              (dataMax: number) => Math.ceil(dataMax + 30),
            ]}
            tickFormatter={(value: number) => `${value}`}
            tick={{ fontSize: 11, fill: "currentColor" }}
            stroke="currentColor"
            label={{ value: "m", angle: -90, position: "insideLeft" }}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#FF6A3D", strokeWidth: 2, strokeDasharray: "5 5" }}
          />

          <Area
            type="monotone"
            dataKey="elevation"
            stroke="#FF6A3D"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#elevationGradient)"
            dot={false}
            activeDot={{
              r: 6,
              stroke: "#FF6A3D",
              strokeWidth: 2,
              fill: "#ffffff",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ElevationChart;