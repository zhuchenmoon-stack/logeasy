import { type CSSProperties, useEffect, useRef } from "react";
import * as echarts from "echarts";

export type EChartProps = {
  option: echarts.EChartsCoreOption;
  className?: string;
  style?: CSSProperties;
  theme?: "light" | "dark";
  loading?: boolean;
  renderer?: "canvas" | "svg";
  notMerge?: boolean;
  lazyUpdate?: boolean;
  replaceMerge?: string[];
  onReady?: (chart: echarts.ECharts) => void;
};

export function EChart({
  option,
  className,
  style,
  theme = "dark",
  loading = false,
  renderer = "canvas",
  notMerge = false,
  lazyUpdate = true,
  replaceMerge,
  onReady,
}: EChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const chart = echarts.init(container, theme, { renderer });
    chartRef.current = chart;
    onReady?.(chart);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });

    resizeObserver.observe(container);
    const handleWindowResize = () => chart.resize();
    window.addEventListener("resize", handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      chart.dispose();
      chartRef.current = null;
    };
  }, [theme, renderer, onReady]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) {
      return;
    }

    chart.setOption(option, {
      notMerge,
      lazyUpdate,
      replaceMerge,
    });
  }, [option, notMerge, lazyUpdate, replaceMerge]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) {
      return;
    }

    if (loading) {
      chart.showLoading("default", {
        color: "#3566EC",
        textColor: "#ADADB6",
        maskColor: theme === "dark" ? "rgba(19,19,22,0.36)" : "rgba(255,255,255,0.48)",
      });
      return;
    }

    chart.hideLoading();
  }, [loading, theme]);

  return <div ref={containerRef} className={className} style={style} />;
}

