import React, { useState, useEffect } from "react";

// Assuming Recharts is loaded globally via a script tag.
// We access its components from the window object.

interface ElevationPoint {
  distance: number;
  elevation: number;
}

interface ElevationChartProps {
  data: ElevationPoint[];
}

const ElevationChart: React.FC<ElevationChartProps> = ({ data }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Access components from the window object inside the render function to get the latest state.
  const Recharts = (window as any).Recharts;
  const {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } = Recharts || {};

  // Gracefully handle the case where the Recharts library hasn't loaded yet,
  // or we are in the initial server render / first client render pass.
  if (!isClient || !Recharts) {
    return (
      <div className="flex items-center justify-center h-48 w-full bg-ink-neutral-100 dark:bg-ink-neutral-800 rounded-lg">
        <p className="text-sm text-ink-neutral-500">Loading chart...</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg shadow-md border border-ink-neutral-200 dark:border-ink-neutral-700">
          <p className="text-sm font-semibold">{`Distance: ${label.toFixed(
            1
          )} km`}</p>
          <p className="text-sm text-primary">{`Elevation: ${payload[0].value.toFixed(
            0
          )} m`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-48 w-full text-ink-neutral-500 dark:text-ink-neutral-400">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, left: -15, bottom: 5 }}
        >
          <defs>
            <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6A3D" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#FF6A3D" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            strokeOpacity={0.2}
          />
          <XAxis
            dataKey="distance"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(value: number) => `${value.toFixed(1)}km`}
            tick={{ fontSize: 10, fill: "currentColor" }}
            stroke="currentColor"
          />

          <YAxis
            domain={["dataMin - 20", "dataMax + 20"]}
            tickFormatter={(value: number) => `${value.toFixed(0)}m`}
            tick={{ fontSize: 10, fill: "currentColor" }}
            stroke="currentColor"
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "currentColor",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
          />
          <Area
            type="monotone"
            dataKey="elevation"
            stroke="#FF6A3D"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#elevationGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ElevationChart;
