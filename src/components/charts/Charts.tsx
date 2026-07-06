import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, LineChart, Line, AreaChart, Area, Legend,
} from "recharts";

const C = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const axis = { fontSize: 11, fill: "var(--muted-foreground)" };
const grid = "var(--border)";

const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    fontSize: 12,
    boxShadow: "0 8px 24px -8px rgb(0 0 0 / 0.15)",
  },
  labelStyle: { color: "var(--foreground)", fontWeight: 600 },
};

export function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={95} paddingAngle={2} strokeWidth={0}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
        <Tooltip {...tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CompareBar({ data, keys, height = 280 }: { data: Record<string, unknown>[]; keys: { key: string; name: string; color?: string }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: -14, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
        <XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} interval={0} angle={-18} textAnchor="end" height={54} />
        <YAxis tick={axis} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "var(--accent)" }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        {keys.map((k, i) => <Bar key={k.key} dataKey={k.key} name={k.name} fill={k.color ?? C[i]} radius={[4, 4, 0, 0]} maxBarSize={38} />)}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendLine({ data, keys, height = 260 }: { data: Record<string, unknown>[]; keys: { key: string; name: string; color?: string }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ left: -14, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
        <XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} />
        <YAxis tick={axis} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        {keys.map((k, i) => <Line key={k.key} type="monotone" dataKey={k.key} name={k.name} stroke={k.color ?? C[i]} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />)}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AreaTrend({ data, dataKey, name, color = C[0], height = 260 }: { data: Record<string, unknown>[]; dataKey: string; name: string; color?: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ left: -14, right: 8, top: 8 }}>
        <defs>
          <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
        <XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} />
        <YAxis tick={axis} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        <Area type="monotone" dataKey={dataKey} name={name} stroke={color} strokeWidth={2.5} fill={`url(#grad-${dataKey})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
