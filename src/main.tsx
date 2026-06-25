import { Fragment, type CSSProperties, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Database,
  RefreshCw,
  Search,
  Server,
  Share2,
  ShieldCheck,
  Sparkles,
  Tag as TagIconGlyph,
  UserRound,
  X,
} from "lucide-react";
import expandSidebarSvg from "../ICON/展开侧边栏.svg?raw";
import collapseSidebarSvg from "../ICON/收起侧边栏.svg?raw";
import dayModeSvg from "../ICON/切换白天模式.svg?raw";
import nightModeSvg from "../ICON/切换黑夜模式.svg?raw";
import logSearchSidebarSvg from "../ICON/日志搜索.svg?raw";
import dashboardSidebarSvg from "../ICON/左侧导航ICON/仪表盘.svg?raw";
import productSidebarSvg from "../ICON/左侧导航ICON/产品订购.svg?raw";
import monitorSidebarSvg from "../ICON/左侧导航ICON/流量监控.svg?raw";
import centerSidebarSvg from "../ICON/左侧导航ICON/功能中心.svg?raw";
import settingsSidebarSvg from "../ICON/左侧导航ICON/系统设置.svg?raw";
import searchLargeSvg from "../ICON/搜索-大(1).svg?raw";
import messageNotificationSvg from "../ICON/消息通知(1).svg?raw";
import defaultAvatarSvg from "../ICON/默认头像.svg?raw";
import profileCenterSvg from "../ICON/个人中心.svg?raw";
import couponSvg from "../ICON/优惠券.svg?raw";
import logoutSvg from "../ICON/退出登录.svg?raw";
import sortSvg from "../ICON/排序.svg?raw";
import filterSvg from "../ICON/筛选.svg?raw";
import timeSvg from "../ICON/时间.svg?raw";
import downloadSvg from "../ICON/下载.svg?raw";
import displayConfigSvg from "../ICON/展示配置.svg?raw";
import searchGuideSvg from "../ICON/搜索指南.svg?raw";
import searchPropertySvg from "../ICON/搜索属性.svg?raw";
import searchConfigSvg from "../ICON/搜索配置.svg?raw";
import savedSearchSvg from "../ICON/已存搜索.svg?raw";
import newMonitorSvg from "../ICON/新建监控.svg?raw";
import showSvg from "../ICON/显示.svg?raw";
import hideSvg from "../ICON/隐藏.svg?raw";
import uploadSvg from "../ICON/上传.svg?raw";
import imagePlaceholderSvg from "../ICON/图片.svg?raw";
import documentSvg from "../ICON/文档.svg?raw";
import deleteSvg from "../ICON/删除.svg?raw";
import toastSuccessSvg from "../ICON/成功ICON.svg?raw";
import toastInfoSvg from "../ICON/提示ICON.svg?raw";
import toastErrorSvg from "../ICON/失败ICON.svg?raw";
import toastWarningSvg from "../ICON/警示ICON.svg?raw";
import stepNumber1Svg from "../ICON/1.svg?raw";
import stepNumber2Svg from "../ICON/2.svg?raw";
import stepNumber3Svg from "../ICON/3.svg?raw";
import stepNumber4Svg from "../ICON/4.svg?raw";
import stepNumber5Svg from "../ICON/5.svg?raw";
import stepCompletedSvg from "../ICON/步骤已完成.svg?raw";
import dashboardAgentIcon from "../ICON/Agent数量.png";
import dashboardAverageCostIcon from "../ICON/今日平均耗时.png";
import dashboardPeakIcon from "../ICON/今日单笔峰值.png";
import dashboardSuccessIcon from "../ICON/今日提取成功率.png";
import dashboardLogExtractIcon from "../ICON/日志提取量.png";
import dashboardIndexIcon from "../ICON/索引数.png";
import dashboardAlertIcon from "../ICON/告警.svg?raw";
import dashboardInterceptIcon from "../ICON/拦截.svg?raw";
import dashboardLatestThreatIcon from "../ICON/最新威胁.svg?raw";
import { EChart } from "./components/EChart";
import "./styles.css";

type InputPhase = "default" | "hover" | "typing" | "complete";
type DashboardPage = "dashboard" | "threatAlerts" | "notifications" | "library" | "form" | "codeLog" | "trafficSearch" | "blank";
type GlobalSearchIconType = "dashboard" | "search" | "threat" | "library" | "form" | "code";

const cn = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" ");
const normalizeSvgSize = (svg: string) =>
  svg.replace(/<svg([^>]*)width=\"[^\"]+\" height=\"[^\"]+\"([^>]*)>/, '<svg$1width="100%" height="100%"$2>');

const svgToCurrentColor = (svg: string) => normalizeSvgSize(svg).replace(/#ADADB6/gi, "currentColor");
const svgToFillColor = (svg: string, color: string) =>
  normalizeSvgSize(svg).replace(/fill=\"(?:#[^\"]+|white)\"/gi, `fill="${color}"`);
const setSvgFillAt = (svg: string, index: number, color: string) => {
  let matchIndex = -1;
  return svg.replace(/fill=\"#[^\"]+\"/gi, (match) => {
    matchIndex += 1;
    return matchIndex === index ? `fill="${color}"` : match;
  });
};

const sortSvgForState = (state: SortState) => {
  const active = "#3566EC";
  const idle = "#ADADB6";
  let svg = normalizeSvgSize(sortSvg);
  svg = setSvgFillAt(svg, 0, state === "asc" ? active : idle);
  svg = setSvgFillAt(svg, 1, state === "desc" ? active : idle);
  return svg;
};

function RawSvgIcon({
  svg,
  className,
  useCurrentColor = true,
}: {
  svg: string;
  className?: string;
  useCurrentColor?: boolean;
}) {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: useCurrentColor ? svgToCurrentColor(svg) : normalizeSvgSize(svg) }}
    />
  );
}

const buttonTypography: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "16px",
};

const grayButtonHoverOverlay =
  "absolute inset-0 rounded-[6px] opacity-0 transition-opacity group-hover:opacity-100";

const compactTypography: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "14px",
};

const visual: Record<InputPhase, React.CSSProperties> = {
  default: {
    borderColor: "#52525c",
    backgroundColor: "rgba(33,33,38,0.6)",
    boxShadow: "0 0 2px 0 rgba(0,0,0,0.8)",
  },
  hover: {
    borderColor: "#71717c",
    backgroundColor: "rgba(33,33,38,0.2)",
    boxShadow: "0 0 2px 0 rgba(0,0,0,0.8)",
  },
  typing: {
    borderColor: "#3566ec",
    backgroundColor: "rgba(33,33,38,0.2)",
    boxShadow: "0 0 0 2px rgba(53,102,236,0.24)",
  },
  complete: {
    borderColor: "#52525c",
    backgroundColor: "rgba(33,33,38,0.6)",
    boxShadow: "0 0 2px 0 rgba(0,0,0,0.8)",
  },
};

function EmailInput({ className = "w-[240px]" }: { className?: string }) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const phase: InputPhase = isFocused ? "typing" : value ? "complete" : isHovered ? "hover" : "default";
  const shouldShowClear = isFocused && value.length > 0;

  return (
    <label
      className={cn(
        "relative flex h-8 min-w-[240px] items-center rounded-[6px] border py-2 pl-2 pr-8 text-[14px] leading-4 transition-colors",
        className
      )}
      style={visual[phase]}
      data-state={phase}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        ref={inputRef}
        className="h-4 min-w-0 flex-1 bg-transparent p-0 font-normal text-[14px] leading-4 text-[#f6f6f7] outline-none placeholder:text-[#4A4A50]"
        placeholder="请输入邮箱"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {shouldShowClear ? (
        <button
          type="button"
          className="absolute right-2 grid size-4 shrink-0 place-items-center text-[#adadb6] transition-colors hover:text-[#f6f6f7]"
          aria-label="清空"
          onPointerDown={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
          }}
          onClick={() => {
            setValue("");
            inputRef.current?.focus();
          }}
        >
          <X className="size-4" strokeWidth={1.6} />
        </button>
      ) : null}
    </label>
  );
}

function SearchInput({ className = "w-[240px]" }: { className?: string }) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const phase: InputPhase = isFocused ? "typing" : value ? "complete" : isHovered ? "hover" : "default";
  const shouldShowClear = isFocused && value.length > 0;

  return (
    <label
      className={cn("relative flex h-8 min-w-[240px] items-center gap-1.5 rounded-[6px] border py-2 pl-1.5 pr-8 text-[14px] leading-4 transition-colors", className)}
      style={visual[phase]}
      data-state={phase}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Search className="size-4 shrink-0 text-[#adadb6]" strokeWidth={1.6} />
      <input
        ref={inputRef}
        className="h-4 min-w-0 flex-1 bg-transparent p-0 font-normal text-[14px] leading-4 text-[#f6f6f7] outline-none placeholder:text-[#4A4A50]"
        placeholder="请输入名称/标签"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {shouldShowClear ? (
        <button
          type="button"
          className="absolute right-2 grid size-4 shrink-0 place-items-center text-[#adadb6] transition-colors hover:text-[#f6f6f7]"
          aria-label="清空"
          onPointerDown={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
          }}
          onClick={() => {
            setValue("");
            inputRef.current?.focus();
          }}
        >
          <X className="size-4" strokeWidth={1.6} />
        </button>
      ) : null}
    </label>
  );
}

function SuffixInput({ className = "w-[240px]" }: { className?: string }) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const phase: InputPhase = isFocused ? "typing" : value ? "complete" : isHovered ? "hover" : "default";
  const suffixDivider = phase === "typing" ? "border-transparent" : phase === "hover" ? "border-[#71717c]" : "border-[#52525c]";

  return (
    <label
      className={cn("flex h-8 min-w-[240px] items-center overflow-hidden rounded-[6px] border pl-2 text-[14px] leading-4 transition-colors", className)}
      style={visual[phase]}
      data-state={phase}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        ref={inputRef}
        className="h-4 min-w-0 flex-[1_0_0] bg-transparent p-0 font-normal text-[14px] leading-4 text-[#f6f6f7] outline-none placeholder:text-[#4A4A50]"
        inputMode="numeric"
        placeholder="请输入数字"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <span
        className={cn(
          "flex h-8 min-h-6 min-w-16 shrink-0 items-center justify-center whitespace-nowrap border-l bg-[rgba(47,47,56,0.6)] px-3 text-center text-[14px] leading-4 text-[#ADADB6]",
          suffixDivider
        )}
        onPointerDown={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        单位名称
      </span>
    </label>
  );
}

function PasswordInput({ className = "w-[240px]" }: { className?: string }) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const phase: InputPhase = isFocused ? "typing" : value ? "complete" : isHovered ? "hover" : "default";
  const shouldShowToggle = isFocused && value.length > 0;

  const togglePasswordVisibility = () => {
    const input = inputRef.current;
    const selectionStart = input?.selectionStart ?? null;
    const selectionEnd = input?.selectionEnd ?? null;

    setIsPasswordVisible((visible) => !visible);
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      if (selectionStart !== null && selectionEnd !== null) {
        inputRef.current?.setSelectionRange(selectionStart, selectionEnd);
      }
    });
  };

  return (
    <label
      className={cn(
        "relative flex h-8 min-w-[240px] items-center rounded-[6px] border py-2 pl-2 pr-8 text-[14px] leading-4 transition-colors",
        className
      )}
      style={visual[phase]}
      data-state={phase}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        ref={inputRef}
        type={isPasswordVisible ? "text" : "password"}
        className="h-4 min-w-0 flex-1 bg-transparent p-0 font-normal text-[14px] leading-4 text-[#f6f6f7] outline-none placeholder:text-[#4A4A50]"
        placeholder="请输入密码"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {shouldShowToggle ? (
        <button
          type="button"
          aria-label={isPasswordVisible ? "隐藏密码" : "显示密码"}
          className="absolute right-2 grid size-4 shrink-0 place-items-center text-[#adadb6] transition-colors hover:text-[#f6f6f7]"
          onPointerDown={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
          }}
          onClick={togglePasswordVisibility}
        >
          <RawSvgIcon
            svg={svgToFillColor(isPasswordVisible ? showSvg : hideSvg, "currentColor")}
            className="size-4"
            useCurrentColor={false}
          />
        </button>
      ) : null}
    </label>
  );
}

function ComponentFrame({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid h-[152px] w-[360px] place-items-center rounded-[20px] bg-[#17171a]">
      {children}
    </section>
  );
}

type ButtonVariant = "gray" | "primary" | "ghost" | "icon";
type ButtonSize = "32" | "28";

function DesignButton({
  variant = "gray",
  size = "32",
  children = "确认",
  onClick,
  disabled = false,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const isCompact = size === "28";
  const base =
    "group relative flex items-center justify-center overflow-hidden rounded-[6px] text-center text-[14px] leading-4 text-[#f6f6f7]";
  const textButtonSize = isCompact ? "h-7 min-h-7 min-w-14 px-3" : "h-8 min-h-8 min-w-20 px-3";
  const iconButtonSize = isCompact ? "h-7 min-h-7 gap-1 pl-1.5 pr-2" : "h-8 min-h-8 gap-1 pl-1.5 pr-2";

  if (variant === "primary") {
    return (
      <button
        type="button"
        disabled={disabled}
        className={cn(base, textButtonSize, disabled ? "cursor-not-allowed text-[rgba(246,246,247,0.24)]" : "text-[#f6f6f7]")}
        style={buttonTypography}
        onClick={disabled ? undefined : onClick}
      >
        <span
          className={cn(
            "absolute inset-0 rounded-[6px]",
            disabled
              ? "bg-[linear-gradient(0deg,rgba(0,0,0,0.2),rgba(0,0,0,0.2)),linear-gradient(180deg,#6E93F8_0%,#3566EC_100%)]"
              : "bg-gradient-to-b from-[#6e93f8] to-[#3566ec]"
          )}
        />
        {!disabled ? (
          <span className="absolute inset-0 rounded-[6px] opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08))" }} />
        ) : null}
        <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
        {!disabled ? <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]" /> : null}
        <span className={cn("relative flex-1", disabled && "text-[rgba(246,246,247,0.24)]")}>{children}</span>
      </button>
    );
  }

  if (variant === "ghost") {
    return (
      <button type="button" disabled={disabled} className={cn(base, textButtonSize, "bg-[rgba(33,33,38,0.6)]", disabled && "cursor-not-allowed")} style={buttonTypography} onClick={disabled ? undefined : onClick}>
        <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_#52525c] transition-opacity group-hover:opacity-0" />
        <span className="absolute inset-0 rounded-[inherit] opacity-0 shadow-[inset_0_0_0_1px_#71717c] transition-opacity group-hover:opacity-100" />
        <span className={grayButtonHoverOverlay} style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08))" }} />
        <span className="relative flex-1">{children}</span>
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button type="button" disabled={disabled} className={cn(base, iconButtonSize, disabled && "cursor-not-allowed")} style={buttonTypography} onClick={disabled ? undefined : onClick}>
        <span className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-[#34343e] to-[#2d2d36]" />
        <span className={grayButtonHoverOverlay} style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08))" }} />
        <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
        <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]" />
        <span className="relative grid size-4 shrink-0 place-items-center">
          <Sparkles className="size-3 text-[#adadb6]" strokeWidth={1.7} />
        </span>
        <span className="relative whitespace-nowrap">{children}</span>
      </button>
    );
  }

  return (
    <button type="button" disabled={disabled} className={cn(base, textButtonSize, disabled && "cursor-not-allowed")} style={buttonTypography} onClick={disabled ? undefined : onClick}>
      <span className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-[#34343e] to-[#2d2d36]" />
      <span className={grayButtonHoverOverlay} style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08))" }} />
      <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
      <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]" />
      <span className="relative whitespace-nowrap">{children}</span>
    </button>
  );
}

function ButtonFrame() {
  return (
    <section className="grid h-[180px] w-[500px] place-items-center rounded-[20px] bg-[#17171a]">
      <div className="flex flex-col gap-7">
        <div className="flex items-center gap-6">
          <DesignButton />
          <DesignButton variant="primary" />
          <DesignButton variant="ghost" />
          <DesignButton variant="icon">Copilot</DesignButton>
        </div>
        <div className="flex items-center gap-6">
          <DesignButton size="28" />
          <DesignButton size="28" variant="primary" />
          <DesignButton size="28" variant="ghost" />
          <DesignButton size="28" variant="icon">Copilot</DesignButton>
        </div>
      </div>
    </section>
  );
}

function FilterIconButton() {
  return (
    <button
      type="button"
      aria-label="筛选"
      className="group relative grid size-8 min-h-8 min-w-8 place-items-center overflow-hidden rounded-[6px]"
      style={buttonTypography}
    >
      <span className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-[#34343e] to-[#2d2d36]" />
      <span
        className={grayButtonHoverOverlay}
        style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08))" }}
      />
      <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
      <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]" />
      <RawSvgIcon svg={filterSvg} className="relative size-4 text-[#adadb6]" />
    </button>
  );
}

function ShareIconButton() {
  return (
    <button
      type="button"
      aria-label="分享"
      className="grid size-8 place-items-center rounded-[6px] bg-[rgba(255,255,255,0)] text-[#adadb6] transition-colors hover:bg-[rgba(255,255,255,0.08)]"
      style={buttonTypography}
    >
      <Share2 className="size-4" strokeWidth={1.6} />
    </button>
  );
}

function GoSettingsButton({ label = "前往设置", onClick }: { label?: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 w-[90px] items-center gap-1 rounded-[6px] bg-[rgba(255,255,255,0)] pl-2 pr-0.5 text-[14px] leading-4 text-[#adadb6] transition-colors hover:bg-[rgba(255,255,255,0.08)]"
      style={buttonTypography}
    >
      <span className="text-left">{label}</span>
      <ChevronRight className="size-4 shrink-0" strokeWidth={1.6} />
    </button>
  );
}

function ComponentIconButton({
  label,
  children,
  disabled = false,
  onClick,
  size = "32",
}: {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  size?: ButtonSize;
}) {
  const isCompact = size === "28";
  const dimensionClass = isCompact ? "h-7 w-7 min-h-7 min-w-7" : "h-8 w-8 min-h-8 min-w-8";
  const disabledPadding = isCompact ? "6px" : "8px";

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-center overflow-hidden rounded-[6px] text-[#adadb6]",
        dimensionClass,
        disabled ? "cursor-not-allowed text-[#767683]" : "text-[#adadb6]"
      )}
      style={{ ...buttonTypography, padding: disabled ? disabledPadding : undefined, gap: disabled ? 4 : undefined }}
    >
      {disabled ? (
        <>
          <span className="absolute inset-0 rounded-[6px] bg-[linear-gradient(0deg,rgba(0,0,0,0.2),rgba(0,0,0,0.2)),linear-gradient(180deg,#34343E_0%,#2D2D36_100%)]" />
          <span className="absolute inset-0 rounded-[6px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
          <span className="relative grid size-4 place-items-center text-[rgba(173,173,182,0.24)]">{children}</span>
        </>
      ) : (
        <>
          <span className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-[#34343e] to-[#2d2d36]" />
          <span
            className="absolute inset-0 rounded-[6px] opacity-0 transition-opacity group-hover:opacity-100"
            style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08))" }}
          />
          <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
          <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]" />
          <span className="relative grid size-4 place-items-center">{children}</span>
        </>
      )}
    </button>
  );
}

function OtherButtonFrame() {
  return (
    <section className="grid h-[134px] w-[354px] place-items-center rounded-[20px] bg-[#17171a]">
      <div className="flex items-center gap-[38px]">
        <FilterIconButton />
        <ShareIconButton />
        <GoSettingsButton />
      </div>
    </section>
  );
}

function RadioMark({ checked = false, hover = false }: { checked?: boolean; hover?: boolean }) {
  return (
    <span
      className={cn(
        "absolute size-[14px] rounded-full",
        checked ? "bg-[#3566ec]" : hover ? "border border-[#71717c] bg-[rgba(33,33,38,0.2)]" : "border border-[#52525c] bg-[rgba(33,33,38,0.6)]"
      )}
      style={{ left: 0, top: 0, width: 16, height: 16, boxShadow: checked ? "inset 0 0 0 1px rgba(255,255,255,0.12)" : undefined }}
    >
      {checked && <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f6f6f7]" />}
    </span>
  );
}

function CheckboxMark({ checked = false, hover = false }: { checked?: boolean; hover?: boolean }) {
  return (
    <span
      className={cn(
        "absolute size-[14px] rounded-[4px]",
        checked ? "bg-[#3566ec]" : hover ? "border border-[#71717c] bg-[rgba(33,33,38,0.2)]" : "border border-[#52525c] bg-[rgba(33,33,38,0.6)]"
      )}
      style={{ left: 0, top: 0, width: 16, height: 16, boxShadow: checked ? "inset 0 0 0 1px rgba(255,255,255,0.12)" : undefined }}
    >
      {checked && (
        <svg className="absolute left-[3px] top-[3px] size-2.5" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1.5 5.1L3.8 7.4L8.5 2.6" stroke="#f6f6f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

function SwitchMark({ checked = false, hover = false }: { checked?: boolean; hover?: boolean }) {
  const trackColor = checked ? "#3566ec" : hover ? "rgba(33,33,38,0.2)" : "rgba(33,33,38,0.6)";
  const borderColor = checked ? "rgba(255,255,255,0.12)" : hover ? "#71717c" : "#52525c";

  return (
    <span className="absolute overflow-visible" style={{ left: 0, top: 0, width: 24, height: 16 }}>
      <span
        className="absolute rounded-full"
        style={{
          left: 0,
          top: 0,
          width: 24,
          height: 16,
          backgroundColor: trackColor,
          border: `1px solid ${borderColor}`,
          boxShadow: "0 0 0 2px rgba(0,0,0,0.12)",
        }}
      />
      <span
        className="absolute rounded-full"
        style={{ left: checked ? 10 : 2, top: 2, width: 12, height: 12, backgroundColor: checked ? "#f6f6f7" : "#adadb6", transition: "left 160ms ease-in" }}
      />
    </span>
  );
}

function ChoiceItem({
  label,
  checked,
  left,
  top,
  width,
  labelOffset,
  labelColor = "#adadb6",
  children,
  onClick,
}: {
  label: string;
  checked: boolean;
  left: number;
  top: number;
  width: number;
  labelOffset: number;
  labelColor?: string;
  children: (hovered: boolean) => React.ReactNode;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      className="absolute h-4"
      aria-label={label}
      aria-pressed={checked}
      style={{ ...buttonTypography, left, top, width }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="absolute left-0 top-0 h-4" style={{ width }}>
        {children(!checked && isHovered)}
        <span className="absolute h-4 whitespace-nowrap text-[14px] leading-4" style={{ ...buttonTypography, left: labelOffset, color: labelColor }}>
          {label}
        </span>
      </span>
    </button>
  );
}

function RadioChoiceFrame() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section className="relative h-[164px] w-[124px] rounded-[20px] bg-[#17171a]">
      {[0, 1].map((index) => (
        <ChoiceItem
          key={index}
          label="单选框"
          checked={selectedIndex === index}
          left={32}
          top={index === 0 ? 56 : 92}
          width={80}
          labelOffset={22}
          labelColor={selectedIndex === index ? "#f6f6f7" : "#adadb6"}
          onClick={() => setSelectedIndex(index)}
        >
          {(hovered) => <RadioMark checked={selectedIndex === index} hover={hovered} />}
        </ChoiceItem>
      ))}
    </section>
  );
}

function CheckboxChoiceFrame() {
  const [checkedItems, setCheckedItems] = useState([false, false]);

  return (
    <section className="relative h-[164px] w-[124px] rounded-[20px] bg-[#17171a]">
      {[0, 1].map((index) => (
        <ChoiceItem
          key={index}
          label="多选框"
          checked={checkedItems[index]}
          left={32}
          top={index === 0 ? 56 : 92}
          width={80}
          labelOffset={22}
          labelColor={checkedItems[index] ? "#f6f6f7" : "#adadb6"}
          onClick={() => setCheckedItems((items) => items.map((value, itemIndex) => (itemIndex === index ? !value : value)))}
        >
          {(hovered) => <CheckboxMark checked={checkedItems[index]} hover={hovered} />}
        </ChoiceItem>
      ))}
    </section>
  );
}

function SwitchChoiceFrame() {
  const [checked, setChecked] = useState(false);

  return (
    <section className="relative h-[164px] w-[124px] rounded-[20px] bg-[#17171a]">
      <ChoiceItem
        label="开关"
        checked={checked}
        left={30}
        top={74}
        width={68}
        labelOffset={30}
        labelColor={checked ? "#f6f6f7" : "#adadb6"}
        onClick={() => setChecked((value) => !value)}
      >
        {(hovered) => <SwitchMark checked={checked} hover={hovered} />}
      </ChoiceItem>
    </section>
  );
}

function SelectionSwitchFrame() {
  return (
    <div className="flex items-start gap-[33px]">
      <RadioChoiceFrame />
      <CheckboxChoiceFrame />
      <SwitchChoiceFrame />
    </div>
  );
}

const dropdownOptions = ["选中了这个选项", "选项二选项二选项二", "选项三", "这里是hover效果", "选项一", "最后一个"];
const dropdownScrollbarClass = "cascade-scrollbar overflow-y-scroll";

function measureUiTextWidth(text: string) {
  if (typeof document === "undefined") {
    return text.length * 14;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return text.length * 14;
  }

  context.font = '14px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
  return context.measureText(text).width;
}

function getDropdownTriggerWidth(label: string) {
  return Math.ceil(measureUiTextWidth(label)) + 32;
}

function getDropdownMenuWidth(options: string[]) {
  const longestWidth = Math.max(...options.map((option) => measureUiTextWidth(option)));
  return Math.ceil(longestWidth) + 44;
}

function getDropdownMenuHeight(optionCount: number) {
  return 8 + optionCount * 32 + Math.max(optionCount - 1, 0) * 4;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderHighlightedText(text: string, query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return text;
  }

  const segments = text.split(new RegExp(`(${escapeRegExp(trimmedQuery)})`, "gi"));

  return segments.map((segment, index) =>
    segment.toLowerCase() === trimmedQuery.toLowerCase() ? (
      <span key={`${segment}-${index}`} className="text-[#3566ec]">
        {segment}
      </span>
    ) : (
      <span key={`${segment}-${index}`}>{segment}</span>
    )
  );
}

function DropdownSelect({ className = "absolute left-[57px] top-[124px] w-[240px] min-w-[240px]" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const value = selected ?? "请选择一个选项";
  const isActive = isOpen;
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const triggerStyle: React.CSSProperties = {
    ...buttonTypography,
    height: 32,
    backgroundColor: "rgba(33,33,38,0.6)",
    border: `1px solid ${isActive ? "#3566ec" : isHovered ? "#71717c" : "#52525c"}`,
    borderRadius: 6,
    boxShadow: isActive ? "0 0 0 2px rgba(53,102,236,0.24)" : "0 0 2px 0 rgba(0,0,0,0.8)",
  };

  return (
    <div ref={containerRef} className={className}>
      <button
        type="button"
        className="relative flex h-8 w-full min-w-[240px] items-center rounded-[6px] py-2 pl-2 pr-1 text-left"
        style={triggerStyle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={cn("relative min-w-0 flex-1 truncate whitespace-nowrap", selected ? "text-[#f6f6f7]" : "text-[#4A4A50]")}>{value}</span>
        <ChevronDown className={cn("absolute right-1 top-2 size-4 shrink-0 text-[#adadb6]", isOpen && "rotate-180")} strokeWidth={1.8} />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-[42px] z-20 inline-flex w-full min-w-[240px] flex-col gap-1 rounded-[6px] border border-[rgba(255,255,255,0.04)] bg-[#28282e] p-1"
          style={{ boxShadow: "0 0 2px 0 rgba(0,0,0,0.8)" }}
          role="listbox"
        >
          {dropdownOptions.map((option) => {
            const isSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={isSelected}
                className="flex h-8 w-full items-center gap-1 rounded-[6px] pl-1 pr-3 text-left text-[#f6f6f7] transition-colors hover:bg-[rgba(255,255,255,0.08)]"
                style={buttonTypography}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
              >
                <span className="grid size-4 shrink-0 place-items-center">
                  {isSelected && <Check className="size-4 text-[#f6f6f7]" strokeWidth={1.8} />}
                </span>
                <span className="min-w-0 whitespace-nowrap">{option}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SearchableDropdownSelect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const clearSearchTimer = () => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
  };

  const showAllOptions = () => {
    clearSearchTimer();
    setQuery("");
    setAppliedQuery("");
    setIsLoading(false);
  };

  const applySearchAfterDelay = (nextQuery: string) => {
    clearSearchTimer();
    setIsLoading(true);
    searchTimerRef.current = setTimeout(() => {
      setAppliedQuery(nextQuery);
      setIsLoading(false);
      searchTimerRef.current = null;
    }, 600);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    return () => clearSearchTimer();
  }, []);

  const normalizedQuery = appliedQuery.trim().toLowerCase();
  const filteredOptions = normalizedQuery
    ? dropdownOptions.filter((option) => option.toLowerCase().includes(normalizedQuery))
    : dropdownOptions;
  const value = selected ?? "请选择一个选项";
  const isSearchActive = isSearchHovered || isSearchFocused || query.length > 0;
  const resultAreaHeight = filteredOptions.length === 0 ? 40 : getDropdownMenuHeight(filteredOptions.length);
  const menuHeight = 44 + resultAreaHeight;

  const triggerStyle: React.CSSProperties = {
    ...buttonTypography,
    height: 32,
    padding: "8px 4px 8px 8px",
    backgroundColor: "rgba(33,33,38,0.6)",
    border: `1px solid ${isOpen ? "#3566ec" : isHovered ? "#71717c" : "#52525c"}`,
    borderRadius: 6,
    boxShadow: isOpen ? "0 0 0 2px rgba(53,102,236,0.24)" : "0 0 2px 0 rgba(0,0,0,0.8)",
  };

  const searchInputStyle: React.CSSProperties = {
    ...buttonTypography,
    height: 32,
    backgroundColor: isSearchActive ? "rgba(33,33,38,0.2)" : "rgba(33,33,38,0.6)",
    border: `1px solid ${isSearchActive ? "#71717c" : "#52525c"}`,
    borderRadius: 6,
  };

  return (
    <div ref={containerRef} className="absolute left-[57px] top-[60px] w-[240px] min-w-[240px]">
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          type="button"
          className="flex h-8 w-full min-w-[240px] items-center justify-between text-left"
          style={triggerStyle}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => {
            showAllOptions();
            setIsOpen((open) => !open);
          }}
        >
          <span className={cn("h-4 whitespace-nowrap", selected ? "text-[#f6f6f7]" : "text-[#4A4A50]")}>{value}</span>
          <ChevronDown className={cn("size-4 shrink-0 text-[#adadb6]", isOpen && "rotate-180")} strokeWidth={1.8} />
        </button>

        {isOpen && (
          <div
            className="absolute left-0 top-[42px] z-20 w-full min-w-[240px] rounded-[6px] border border-[rgba(255,255,255,0.04)] bg-[#28282e]"
            style={{ height: menuHeight, boxShadow: "0 0 2px 0 rgba(0,0,0,0.8)" }}
            role="listbox"
          >
            <div
              className="absolute left-1 right-1 top-1 flex items-center gap-1.5 px-1.5"
              style={searchInputStyle}
              onMouseEnter={() => setIsSearchHovered(true)}
              onMouseLeave={() => setIsSearchHovered(false)}
            >
              <Search className="size-4 shrink-0 text-[#adadb6]" strokeWidth={1.6} />
              <input
                className="h-4 min-w-0 flex-1 bg-transparent p-0 text-[14px] leading-4 text-[#f6f6f7] outline-none placeholder:text-[#4A4A50]"
                style={buttonTypography}
                value={query}
                placeholder="搜索"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  setQuery(nextQuery);
                  applySearchAfterDelay(nextQuery);
                }}
              />
              {isLoading && (
                <span
                  className="pointer-events-none shrink-0 rounded-full border-[#adadb6] border-r-transparent animate-spin"
                  style={{ width: 10, height: 10, borderWidth: 1.5 }}
                  aria-hidden="true"
                />
              )}
            </div>
            {filteredOptions.length === 0 ? (
              <div
                className="absolute left-0 h-4 w-full text-center text-[#4A4A50]"
                style={{ ...buttonTypography, top: 56 }}
              >
                未找到选项
              </div>
            ) : (
              <div className="absolute left-1 right-1 top-11 flex flex-col gap-1">
                {filteredOptions.map((option) => {
                  const isSelected = option === selected;
                  return (
                    <button
                      key={option}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className="flex h-8 w-full items-center gap-1 rounded-[6px] pl-1 pr-3 text-left text-[#f6f6f7] transition-colors hover:bg-[rgba(255,255,255,0.08)]"
                      style={buttonTypography}
                      onClick={() => {
                        setSelected(option);
                        setQuery("");
                        setAppliedQuery("");
                        setIsLoading(false);
                        clearSearchTimer();
                        setIsOpen(false);
                      }}
                    >
                      <span className="grid size-4 shrink-0 place-items-center">
                        {isSelected && <Check className="size-4 text-[#f6f6f7]" strokeWidth={1.8} />}
                      </span>
                      <span className="min-w-0 whitespace-nowrap">
                        {renderHighlightedText(option, appliedQuery)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const unitOptions = ["秒", "分钟", "小时", "天"];

function UnitDropdownMenu({
  selected,
  onSelect,
  width = getDropdownMenuWidth(unitOptions),
}: {
  selected: string;
  onSelect: (value: string) => void;
  width?: number;
}) {
  return (
    <div
      className="inline-flex flex-col gap-1 rounded-[6px] border border-[rgba(255,255,255,0.04)] bg-[#28282e] p-1"
      style={{ width, boxShadow: "0 0 2px 0 rgba(0,0,0,0.8)" }}
      role="listbox"
    >
      {unitOptions.map((option) => {
        const isSelected = option === selected;
        return (
          <button
            key={option}
            type="button"
            role="option"
            aria-selected={isSelected}
            className="flex h-8 items-center gap-1 rounded-[6px] pl-1 pr-3 text-left text-[#f6f6f7] transition-colors hover:bg-[rgba(255,255,255,0.08)]"
            style={{ ...buttonTypography, width: width - 8 }}
            onClick={() => onSelect(option)}
          >
            <span className="grid size-4 shrink-0 place-items-center">
              {isSelected && <Check className="size-4 text-[#f6f6f7]" strokeWidth={1.8} />}
            </span>
            <span className="min-w-0 whitespace-nowrap text-[#f6f6f7]">{option}</span>
          </button>
        );
      })}
    </div>
  );
}

function StandaloneUnitDropdown({ className = "absolute left-[154px] top-[60px]" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState("小时");
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const triggerWidth = getDropdownTriggerWidth(selected);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={className}>
      <button
        type="button"
        className="relative flex h-8 items-center gap-1 rounded-[6px] py-2 pl-2 pr-1 text-[#f6f6f7]"
        style={{ ...buttonTypography, width: triggerWidth, boxSizing: "border-box" }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-[#34343e] to-[#2d2d36]" />
        <span className={cn("absolute inset-0 rounded-[6px] opacity-0", isHovered && "opacity-100")} style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08))" }} />
        <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
        <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]" />
        <span className="relative whitespace-nowrap">{selected}</span>
        <ChevronDown className={cn("relative size-4 shrink-0 text-[#adadb6]", isOpen && "rotate-180")} strokeWidth={1.8} />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-10 z-20">
          <UnitDropdownMenu
            selected={selected}
            onSelect={(value) => {
              setSelected(value);
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function SuffixUnitDropdownInput({ className = "absolute left-[296px] top-[60px] w-[240px]" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState("分钟");
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setIsActive(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const phase: InputPhase = isOpen || isFocused || isActive ? "typing" : value ? "complete" : isHovered ? "hover" : "default";
  const suffixDivider = phase === "typing" ? "border-transparent" : phase === "hover" ? "border-[#71717c]" : "border-[#52525c]";
  const suffixTriggerWidth = getDropdownTriggerWidth(selected);

  return (
    <div ref={containerRef} className={className}>
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex h-8 w-[240px] items-center overflow-hidden rounded-[6px] border" style={visual[phase]}>
              <input
              className="h-4 min-w-0 flex-1 bg-transparent px-2 text-[14px] leading-4 text-[#f6f6f7] outline-none placeholder:text-[#4A4A50]"
            placeholder="请输入数字"
            style={buttonTypography}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className="relative h-8 shrink-0" style={{ width: suffixTriggerWidth }}>
            <button
              type="button"
              className="relative flex h-8 items-center gap-1 rounded-br-[6px] rounded-tr-[6px] bg-[rgba(47,47,56,0.6)] py-2 pl-2 pr-1 text-[#adadb6]"
              style={{ ...buttonTypography, width: suffixTriggerWidth }}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              onPointerDown={() => setIsActive(true)}
              onClick={() => {
                setIsActive(true);
                setIsOpen((open) => !open);
              }}
            >
              <span className="whitespace-nowrap text-[#ADADB6]">{selected}</span>
              <ChevronDown className={cn("relative size-4 shrink-0 text-[#adadb6]", isOpen && "rotate-180")} strokeWidth={1.8} />
            </button>
            <span className={cn("pointer-events-none absolute left-0 top-0 h-8 border-l", suffixDivider)} />
          </div>
        </div>
        {isOpen && (
          <div className="absolute right-0 top-10 z-30">
            <UnitDropdownMenu
              width={getDropdownMenuWidth(unitOptions)}
              selected={selected}
              onSelect={(nextValue) => {
                setSelected(nextValue);
                setIsOpen(false);
                setIsActive(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DropdownControlsFrame() {
  return (
    <section className="relative h-[152px] w-[704px] rounded-[20px] bg-[#17171a]">
      <DropdownSelect className="absolute left-[57px] top-[60px] w-[240px]" />
      <StandaloneUnitDropdown className="absolute left-[338px] top-[60px]" />
      <SuffixUnitDropdownInput className="absolute left-[428px] top-[60px] w-[240px]" />
    </section>
  );
}

function SearchableDropdownFrame() {
  return (
    <section className="relative h-[152px] w-[354px] rounded-[20px] bg-[#17171a]">
      <SearchableDropdownSelect />
    </section>
  );
}

const mitreGroups = [
  {
    id: "TA0043",
    label: "TA0043 侦查",
    children: [
      { id: "T1595", label: "T1595 主动扫描", children: ["扫描IP块", "漏洞扫描", "字典扫描"] },
      { id: "T1592", label: "T1592 收集主机信息", children: ["硬件信息", "软件信息", "固件信息"] },
      { id: "T1589", label: "T1589 收集身份信息", children: ["凭证信息", "邮箱地址", "员工姓名"] },
      { id: "T1598", label: "T1598 网络钓鱼信息收集", children: ["钓鱼附件", "钓鱼链接", "钓鱼服务"] },
    ],
  },
  {
    id: "TA0042",
    label: "TA0042 资源开发",
    children: [
      { id: "T1583", label: "T1583 获取基础设施", children: ["域名", "服务器", "虚拟专用服务器"] },
      { id: "T1587", label: "T1587 开发能力", children: ["恶意软件", "代码签名证书", "数字证书"] },
      { id: "T1584", label: "T1584 入侵基础设施", children: ["代理", "服务器", "网络设备"] },
      { id: "T1588", label: "T1588 获取能力", children: ["漏洞利用", "工具", "凭证"] },
    ],
  },
  {
    id: "TA0001",
    label: "TA0001 初始访问",
    children: [
      { id: "T1047", label: "T1047 Windows管理规范", children: ["WMI执行", "远程查询", "事件订阅"] },
      { id: "T1053", label: "T1053 计划任务", children: ["计划任务", "Cron", "系统计时器"] },
      { id: "T1566", label: "T1566 网络钓鱼", children: ["鱼叉式附件", "鱼叉式链接", "服务钓鱼"] },
      { id: "T1190", label: "T1190 利用公开应用程序", children: ["Web漏洞", "API漏洞", "边界服务"] },
    ],
  },
  {
    id: "TA0002",
    label: "TA0002 执行",
    children: [
      { id: "T1059", label: "T1059 命令和脚本解释器", children: ["PowerShell", "Windows命令Shell", "Unix Shell"] },
      { id: "T1053", label: "T1053 计划任务", children: ["计划任务", "Cron", "Systemd计时器"] },
      { id: "T1204", label: "T1204 用户执行", children: ["恶意文件", "恶意链接", "用户打开附件"] },
      { id: "T1106", label: "T1106 原生API", children: ["WinAPI", "NtAPI", "系统调用"] },
      { id: "T1129", label: "T1129 共享模块", children: ["DLL模块", "共享对象", "运行时模块"] },
    ],
  },
  {
    id: "TA0003",
    label: "TA0003 权限维持",
    children: [
      { id: "T1098", label: "T1098 账户操作", children: ["添加凭据", "添加组成员", "交换邮箱规则"] },
      { id: "T1136", label: "T1136 创建账户", children: ["本地账户", "域账户", "云账户"] },
      { id: "T1547", label: "T1547 启动或登录自启", children: ["注册表运行键", "启动文件夹", "登录脚本"] },
      { id: "T1574", label: "T1574 劫持执行流", children: ["DLL搜索顺序", "路径拦截", "服务劫持"] },
    ],
  },
  {
    id: "TA0004",
    label: "TA0004 权限提升",
    children: [
      { id: "T1068", label: "T1068 权限提升漏洞利用", children: ["内核漏洞", "服务漏洞", "驱动漏洞"] },
      { id: "T1548", label: "T1548 滥用提升控制机制", children: ["Sudo缓存", "绕过UAC", "Setuid"] },
      { id: "T1134", label: "T1134 访问令牌操作", children: ["令牌模拟", "令牌窃取", "创建进程"] },
      { id: "T1484", label: "T1484 域策略修改", children: ["组策略修改", "域信任修改", "策略注入"] },
    ],
  },
];

const cityCascadeOptions = [
  {
    id: "zhejiang",
    label: "浙江省",
    children: [
      { id: "hangzhou", label: "杭州市", children: ["上城区", "西湖区", "滨江区", "萧山区", "余杭区", "钱塘区"] },
      { id: "ningbo", label: "宁波市", children: ["海曙区", "江北区", "鄞州区", "北仑区", "镇海区"] },
      { id: "wenzhou", label: "温州市", children: ["鹿城区", "龙湾区", "瓯海区", "洞头区", "瑞安市"] },
    ],
  },
  {
    id: "guangdong",
    label: "广东省",
    children: [
      { id: "guangzhou", label: "广州市", children: ["越秀区", "天河区", "海珠区", "番禺区", "白云区", "黄埔区"] },
      { id: "shenzhen", label: "深圳市", children: ["福田区", "南山区", "罗湖区", "宝安区", "龙岗区"] },
      { id: "foshan", label: "佛山市", children: ["禅城区", "南海区", "顺德区", "三水区", "高明区"] },
    ],
  },
  {
    id: "jiangsu",
    label: "江苏省",
    children: [
      { id: "nanjing", label: "南京市", children: ["玄武区", "秦淮区", "建邺区", "鼓楼区", "江宁区"] },
      { id: "suzhou", label: "苏州市", children: ["姑苏区", "虎丘区", "吴中区", "相城区", "昆山市"] },
      { id: "wuxi", label: "无锡市", children: ["梁溪区", "锡山区", "惠山区", "滨湖区", "江阴市"] },
    ],
  },
  {
    id: "sichuan",
    label: "四川省",
    children: [
      { id: "chengdu", label: "成都市", children: ["锦江区", "青羊区", "武侯区", "成华区", "高新区"] },
      { id: "mianyang", label: "绵阳市", children: ["涪城区", "游仙区", "安州区", "江油市"] },
      { id: "leshan", label: "乐山市", children: ["市中区", "沙湾区", "五通桥区", "峨眉山市"] },
    ],
  },
  {
    id: "hubei",
    label: "湖北省",
    children: [
      { id: "wuhan", label: "武汉市", children: ["江岸区", "武昌区", "洪山区", "汉阳区", "东西湖区"] },
      { id: "yichang", label: "宜昌市", children: ["西陵区", "伍家岗区", "点军区", "夷陵区"] },
      { id: "xiangyang", label: "襄阳市", children: ["襄城区", "樊城区", "襄州区", "枣阳市"] },
    ],
  },
  {
    id: "fujian",
    label: "福建省",
    children: [
      { id: "fuzhou", label: "福州市", children: ["鼓楼区", "台江区", "仓山区", "晋安区"] },
      { id: "xiamen", label: "厦门市", children: ["思明区", "湖里区", "集美区", "海沧区"] },
      { id: "quanzhou", label: "泉州市", children: ["鲤城区", "丰泽区", "洛江区", "晋江市"] },
    ],
  },
];

function HierarchicalCheckboxMark({ checked = false, partial = false, hover = false }: { checked?: boolean; partial?: boolean; hover?: boolean }) {
  return (
    <span
      className={cn(
        "absolute left-0 top-0 size-4 rounded-[4px]",
        checked || partial ? "bg-[#3566ec]" : hover ? "border border-[#71717c] bg-[rgba(33,33,38,0.2)]" : "border border-[#52525c] bg-[rgba(33,33,38,0.6)]"
      )}
      style={{ boxShadow: checked || partial ? "inset 0 0 0 1px rgba(255,255,255,0.12)" : undefined }}
    >
      {checked && (
        <svg className="absolute left-[3px] top-[3px] size-2.5" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1.5 5.1L3.8 7.4L8.5 2.6" stroke="#f6f6f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {partial && !checked && <span className="absolute left-1/2 top-1/2 h-0.5 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f6f6f7]" />}
    </span>
  );
}

function CascadeColumn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative max-h-[202px] shrink-0 overflow-hidden p-1", className)}>
      <div className={cn("max-h-[194px]", dropdownScrollbarClass)}>
        {children}
      </div>
    </div>
  );
}

function MultiLevelDropdownSelect({
  className = "absolute left-[40px] top-[52px] w-[300px]",
  onSelectionChange,
}: {
  className?: string;
  onSelectionChange?: (items: string[]) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState("");
  const [activeTechniqueId, setActiveTechniqueId] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const activeGroup = mitreGroups.find((group) => group.id === activeGroupId) ?? mitreGroups[0];
  const activeTechnique = activeGroup.children.find((child) => child.id === activeTechniqueId) ?? activeGroup.children[0];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node) && !panelRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const updatePanelPosition = () => {
      const triggerRect = containerRef.current?.getBoundingClientRect();
      const panelRect = panelRef.current?.getBoundingClientRect();
      if (!triggerRect || !panelRect) return;

      const left = Math.max(12, Math.min(triggerRect.left, window.innerWidth - panelRect.width - 12));
      const top = Math.max(12, Math.min(triggerRect.bottom + 10, window.innerHeight - panelRect.height - 12));

      setPanelStyle({
        position: "fixed",
        left,
        top,
        zIndex: 30,
        maxWidth: "calc(100vw - 24px)",
      });
    };

    const frame = requestAnimationFrame(updatePanelPosition);
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [isOpen, activeGroupId, activeTechniqueId, selectedItems.length]);

  const triggerStyle: React.CSSProperties = {
    ...buttonTypography,
    height: 32,
    backgroundColor: isOpen ? "rgba(33,33,38,0.32)" : isHovered ? "rgba(33,33,38,0.2)" : "rgba(33,33,38,0.6)",
    border: `1px solid ${isOpen ? "#3566ec" : isHovered ? "#71717c" : "#52525c"}`,
    borderRadius: 6,
    boxShadow: isOpen ? "0 0 0 2px rgba(53,102,236,0.24)" : "0 0 2px 0 rgba(0,0,0,0.8)",
  };

  const getItemKey = (group: (typeof mitreGroups)[number], technique: (typeof mitreGroups)[number]["children"][number], child: string) => `${group.id}/${technique.id}/${child}`;
  const getItemLabel = (key: string) => {
    const [groupId, techniqueId, child] = key.split("/");
    const group = mitreGroups.find((item) => item.id === groupId);
    const technique = group?.children.find((item) => item.id === techniqueId);
    return technique ? `${technique.label} / ${child}` : key;
  };
  const getTechniqueItems = (group: (typeof mitreGroups)[number], technique: (typeof mitreGroups)[number]["children"][number]) => technique.children.map((child) => getItemKey(group, technique, child));
  const getGroupItems = (group: (typeof mitreGroups)[number]) => group.children.flatMap((technique) => getTechniqueItems(group, technique));

  const updateSelectedItems = (updater: (items: string[]) => string[]) => {
    setSelectedItems((items) => {
      const nextItems = updater(items);
      onSelectionChange?.(nextItems);
      return nextItems;
    });
  };

  const toggleItem = (item: string) => {
    updateSelectedItems((items) => (items.includes(item) ? items.filter((value) => value !== item) : [...items, item]));
  };

  const toggleGroup = (group: (typeof mitreGroups)[number]) => {
    const groupItems = getGroupItems(group);
    updateSelectedItems((items) => {
      const selectedChildren = groupItems.filter((child) => items.includes(child));
      if (selectedChildren.length === groupItems.length) {
        return items.filter((item) => !groupItems.includes(item));
      }
      return Array.from(new Set([...items, ...groupItems]));
    });
  };

  const toggleTechnique = (technique: (typeof mitreGroups)[number]["children"][number]) => {
    const techniqueItems = getTechniqueItems(activeGroup, technique);
    updateSelectedItems((items) => {
      const selectedChildren = techniqueItems.filter((child) => items.includes(child));
      if (selectedChildren.length === techniqueItems.length) {
        return items.filter((item) => !techniqueItems.includes(item));
      }
      return Array.from(new Set([...items, ...techniqueItems]));
    });
  };

  const measureTagWidth = (item: string) => Math.min(104, getItemLabel(item).length * 7 + 28);
  const getVisibleSelectedItems = () => {
    const maxContentWidth = 260;
    const maxVisible = Math.min(2, selectedItems.length);
    let visible = selectedItems.slice(0, maxVisible);

    while (visible.length > 0) {
      const hiddenCount = selectedItems.length - visible.length;
      const plusWidth = hiddenCount > 0 ? 38 : 0;
      const tagsWidth = visible.reduce((width, item, index) => width + measureTagWidth(item) + (index > 0 ? 4 : 0), 0);
      if (tagsWidth + plusWidth <= maxContentWidth) {
        break;
      }
      visible = visible.slice(0, -1);
    }

    return {
      visible,
      hiddenCount: selectedItems.length - visible.length,
    };
  };

  const visibleSelection = getVisibleSelectedItems();
  const collapsePathPreview = () => {
    setActiveGroupId("");
    setActiveTechniqueId("");
  };

  return (
    <div ref={containerRef} className={className}>
      <button
        type="button"
        className="relative flex h-8 w-full items-center text-left"
        style={triggerStyle}
        aria-haspopup="tree"
        aria-expanded={isOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          setIsOpen((open) => {
            const nextOpen = !open;
            if (nextOpen) {
              collapsePathPreview();
            }
            return nextOpen;
          });
        }}
      >
        <div className="flex h-full min-w-0 flex-1 items-center gap-1 overflow-hidden pl-2 pr-10">
          {selectedItems.length === 0 ? (
          <span className="text-[#4A4A50]">请选择</span>
        ) : (
            visibleSelection.visible.map((item) => (
              <span key={item} className="flex h-5 max-w-[112px] items-center gap-1 rounded-[4px] bg-[rgba(255,255,255,0.04)] pl-1.5 pr-1 text-[12px] leading-3 text-[#f6f6f7]">
                <span className="truncate">{getItemLabel(item)}</span>
                <span
                  role="button"
                  tabIndex={0}
                  className="grid size-3.5 shrink-0 place-items-center rounded-[4px] text-[#f6f6f7] hover:bg-[rgba(255,255,255,0.08)]"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleItem(item);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleItem(item);
                    }
                  }}
                >
                  <X className="size-3" strokeWidth={1.6} />
                </span>
              </span>
            ))
          )}
          {visibleSelection.hiddenCount > 0 && <span className="ml-1 mr-2 shrink-0 text-[12px] leading-3 text-[#f6f6f7]">+{visibleSelection.hiddenCount}</span>}
        </div>
        <ChevronDown className={cn("absolute right-2 size-4 shrink-0 text-[#adadb6]", isOpen && "rotate-180")} strokeWidth={1.8} />
      </button>

      {isOpen && createPortal(
        <div
          ref={panelRef}
          className="inline-flex w-max overflow-hidden rounded-[6px] border border-[rgba(255,255,255,0.04)] bg-[#28282e]"
          style={{ ...panelStyle, boxShadow: "0 0 2px 0 rgba(0,0,0,0.8)" }}
          role="tree"
          onMouseLeave={collapsePathPreview}
        >
          <CascadeColumn className="min-w-[192px] border-r border-[rgba(255,255,255,0.04)]">
            {mitreGroups.map((group, index) => {
              const groupItems = getGroupItems(group);
              const selectedCount = groupItems.filter((child) => selectedItems.includes(child)).length;
              const checked = selectedCount === groupItems.length;
              const partial = selectedCount > 0 && !checked;
              return (
                <button
                  key={group.id}
                  type="button"
                  className={cn(
                    "group/item relative flex h-8 w-full items-center rounded-[6px] text-left transition-colors hover:bg-[rgba(255,255,255,0.08)]",
                    group.id === activeGroupId && "bg-[rgba(255,255,255,0.08)]",
                    checked || partial ? "text-[#f6f6f7]" : "text-[#adadb6]"
                  )}
                  style={{ ...buttonTypography, marginTop: index === 0 ? 0 : 4 }}
                  onMouseEnter={() => {
                    setActiveGroupId(group.id);
                    setActiveTechniqueId("");
                  }}
                  onMouseMove={() => {
                    setActiveGroupId(group.id);
                    setActiveTechniqueId("");
                  }}
                  onClick={() => {
                    setActiveGroupId(group.id);
                    setActiveTechniqueId("");
                  }}
                >
                  <span
                    className="absolute left-2 top-2 size-4"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleGroup(group);
                      setActiveGroupId(group.id);
                      setActiveTechniqueId("");
                    }}
                  >
                    <HierarchicalCheckboxMark checked={checked} partial={partial} />
                  </span>
                  <span className="min-w-0 flex-1 whitespace-nowrap pl-[30px] pr-14">{group.label}</span>
                  <ChevronRight className="absolute right-2 size-4 text-[#adadb6]" strokeWidth={1.6} />
                </button>
              );
            })}
          </CascadeColumn>
          {activeGroupId && (
          <CascadeColumn className="min-w-[216px] border-r border-[rgba(255,255,255,0.04)]">
            {activeGroup.children.map((child, index) => {
              const techniqueItems = getTechniqueItems(activeGroup, child);
              const selectedCount = techniqueItems.filter((item) => selectedItems.includes(item)).length;
              const checked = selectedCount === techniqueItems.length;
              const partial = selectedCount > 0 && !checked;
              return (
                <button
                  key={child.id}
                  type="button"
                  className={cn(
                    "relative flex h-8 w-full items-center rounded-[6px] text-left transition-colors hover:bg-[rgba(255,255,255,0.08)]",
                    child.id === activeTechniqueId && "bg-[rgba(255,255,255,0.08)]",
                    checked || partial ? "text-[#f6f6f7]" : "text-[#adadb6]"
                  )}
                  style={{ ...buttonTypography, marginTop: index === 0 ? 0 : 4 }}
                  onMouseEnter={() => setActiveTechniqueId(child.id)}
                  onMouseMove={() => setActiveTechniqueId(child.id)}
                  onClick={() => setActiveTechniqueId(child.id)}
                >
                  <span
                    className="absolute left-2 top-2 size-4"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleTechnique(child);
                      setActiveTechniqueId(child.id);
                    }}
                  >
                    <HierarchicalCheckboxMark checked={checked} partial={partial} />
                  </span>
                  <span className="min-w-0 flex-1 whitespace-nowrap pl-[30px] pr-14">{child.label}</span>
                  <ChevronRight className="absolute right-2 size-4 text-[#adadb6]" strokeWidth={1.6} />
                </button>
              );
            })}
          </CascadeColumn>
          )}
          {activeTechniqueId && (
          <CascadeColumn className="min-w-[188px]">
            {activeTechnique.children.map((child, index) => {
              const itemValue = getItemKey(activeGroup, activeTechnique, child);
              const checked = selectedItems.includes(itemValue);
              return (
                <button
                  key={itemValue}
                  type="button"
                  className={cn(
                    "relative flex h-8 w-full items-center rounded-[6px] text-left transition-colors hover:bg-[rgba(255,255,255,0.08)]",
                    checked ? "text-[#f6f6f7]" : "text-[#adadb6]"
                  )}
                  style={{ ...buttonTypography, marginTop: index === 0 ? 0 : 4 }}
                  onClick={() => toggleItem(itemValue)}
                >
                  <span className="absolute left-2 top-2 size-4">
                    <HierarchicalCheckboxMark checked={checked} />
                  </span>
                  <span className="min-w-0 flex-1 whitespace-nowrap pl-[30px] pr-6">{child}</span>
                </button>
              );
            })}
          </CascadeColumn>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

function SingleCascadeSelect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [activeProvinceId, setActiveProvinceId] = useState("");
  const [activeCityId, setActiveCityId] = useState("");
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});

  const getAreaKey = (province: (typeof cityCascadeOptions)[number], city: (typeof cityCascadeOptions)[number]["children"][number], area: string) => `${province.id}/${city.id}/${area}`;
  const getSelectedParts = () => {
    const [provinceId, cityId, area] = selectedKey.split("/");
    const province = cityCascadeOptions.find((item) => item.id === provinceId);
    const city = province?.children.find((item) => item.id === cityId);
    return { province, city, area };
  };
  const selectedParts = getSelectedParts();
  const activeProvince = cityCascadeOptions.find((province) => province.id === activeProvinceId) ?? selectedParts.province ?? cityCascadeOptions[0];
  const activeCity = activeProvince.children.find((city) => city.id === activeCityId) ?? selectedParts.city ?? activeProvince.children[0];
  const triggerLabel = selectedParts.province && selectedParts.city && selectedParts.area ? `${selectedParts.province.label} / ${selectedParts.city.label} / ${selectedParts.area}` : "请选择";

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node) && !panelRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const updatePanelPosition = () => {
      const triggerRect = containerRef.current?.getBoundingClientRect();
      const panelRect = panelRef.current?.getBoundingClientRect();
      if (!triggerRect || !panelRect) return;

      const left = Math.max(12, Math.min(triggerRect.left, window.innerWidth - panelRect.width - 12));
      const top = Math.max(12, Math.min(triggerRect.bottom + 10, window.innerHeight - panelRect.height - 12));

      setPanelStyle({
        position: "fixed",
        left,
        top,
        zIndex: 30,
        maxWidth: "calc(100vw - 24px)",
      });
    };

    const frame = requestAnimationFrame(updatePanelPosition);
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [isOpen, activeProvinceId, activeCityId, selectedKey]);

  const syncActiveToSelected = () => {
    const { province, city } = getSelectedParts();
    setActiveProvinceId(province?.id ?? "");
    setActiveCityId(city?.id ?? "");
  };

  const triggerStyle: React.CSSProperties = {
    ...buttonTypography,
    height: 32,
    backgroundColor: isOpen ? "rgba(33,33,38,0.32)" : isHovered ? "rgba(33,33,38,0.2)" : "rgba(33,33,38,0.6)",
    border: `1px solid ${isOpen ? "#3566ec" : isHovered ? "#71717c" : "#52525c"}`,
    borderRadius: 6,
    boxShadow: isOpen ? "0 0 0 2px rgba(53,102,236,0.24)" : "0 0 2px 0 rgba(0,0,0,0.8)",
  };

  return (
    <div ref={containerRef} className="absolute left-[380px] top-[52px] w-[300px]">
      <button
        type="button"
        className="relative flex h-8 w-[300px] items-center text-left"
        style={triggerStyle}
        aria-haspopup="tree"
        aria-expanded={isOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          setIsOpen((open) => {
            const nextOpen = !open;
            if (nextOpen) {
              syncActiveToSelected();
            }
            return nextOpen;
          });
        }}
      >
        <span className={cn("min-w-0 flex-1 truncate pl-2 pr-10 text-[14px] leading-4", selectedKey ? "text-[#f6f6f7]" : "text-[#4A4A50]")}>{triggerLabel}</span>
        <ChevronDown className={cn("absolute right-2 size-4 shrink-0 text-[#adadb6]", isOpen && "rotate-180")} strokeWidth={1.8} />
      </button>

      {isOpen && createPortal(
        <div
          ref={panelRef}
          className="inline-flex w-max overflow-hidden rounded-[6px] border border-[rgba(255,255,255,0.04)] bg-[#28282e]"
          style={{ ...panelStyle, boxShadow: "0 0 2px 0 rgba(0,0,0,0.8)" }}
          role="tree"
          onMouseLeave={syncActiveToSelected}
        >
          <CascadeColumn className="min-w-[152px] border-r border-[rgba(255,255,255,0.04)]">
            {cityCascadeOptions.map((province, index) => {
              const provinceSelected = selectedParts.province?.id === province.id;
              const pathActive = activeProvinceId === province.id;
              return (
                <button
                  key={province.id}
                  type="button"
                  className={cn(
                    "relative flex h-8 w-full items-center rounded-[6px] text-left transition-colors hover:bg-[rgba(255,255,255,0.08)]",
                    pathActive && "bg-[rgba(255,255,255,0.08)]",
                    provinceSelected ? "text-[#f6f6f7]" : "text-[#adadb6]"
                  )}
                  style={{ ...buttonTypography, marginTop: index === 0 ? 0 : 4 }}
                  onMouseEnter={() => {
                    setActiveProvinceId(province.id);
                    setActiveCityId("");
                  }}
                  onMouseMove={() => {
                    setActiveProvinceId(province.id);
                    setActiveCityId("");
                  }}
                  onClick={() => {
                    setActiveProvinceId(province.id);
                    setActiveCityId("");
                  }}
                >
                  {provinceSelected && <Check className="absolute left-2 top-2 size-4 text-[#f6f6f7]" strokeWidth={1.8} />}
                  <span className="min-w-0 flex-1 whitespace-nowrap pl-[30px] pr-14">{province.label}</span>
                  <ChevronRight className="absolute right-2 size-4 text-[#adadb6]" strokeWidth={1.6} />
                </button>
              );
            })}
          </CascadeColumn>
          {activeProvinceId && (
            <CascadeColumn className="min-w-[140px] border-r border-[rgba(255,255,255,0.04)]">
              {activeProvince.children.map((city, index) => {
                const citySelected = selectedParts.province?.id === activeProvince.id && selectedParts.city?.id === city.id;
                const pathActive = activeCityId === city.id;
                return (
                  <button
                    key={city.id}
                    type="button"
                    className={cn(
                      "relative flex h-8 w-full items-center rounded-[6px] text-left transition-colors hover:bg-[rgba(255,255,255,0.08)]",
                      pathActive && "bg-[rgba(255,255,255,0.08)]",
                      citySelected ? "text-[#f6f6f7]" : "text-[#adadb6]"
                    )}
                    style={{ ...buttonTypography, marginTop: index === 0 ? 0 : 4 }}
                    onMouseEnter={() => setActiveCityId(city.id)}
                    onMouseMove={() => setActiveCityId(city.id)}
                    onClick={() => setActiveCityId(city.id)}
                  >
                    {citySelected && <Check className="absolute left-2 top-2 size-4 text-[#f6f6f7]" strokeWidth={1.8} />}
                    <span className="min-w-0 flex-1 whitespace-nowrap pl-[30px] pr-14">{city.label}</span>
                    <ChevronRight className="absolute right-2 size-4 text-[#adadb6]" strokeWidth={1.6} />
                  </button>
                );
              })}
            </CascadeColumn>
          )}
          {activeCityId && (
            <CascadeColumn className="min-w-[140px]">
              {activeCity.children.map((area, index) => {
                const areaKey = getAreaKey(activeProvince, activeCity, area);
                const selected = selectedKey === areaKey;
                return (
                  <button
                    key={areaKey}
                    type="button"
                    className={cn(
                      "relative flex h-8 w-full items-center rounded-[6px] text-left transition-colors hover:bg-[rgba(255,255,255,0.08)]",
                      selected ? "text-[#f6f6f7]" : "text-[#adadb6]"
                    )}
                    style={{ ...buttonTypography, marginTop: index === 0 ? 0 : 4 }}
                    onClick={() => {
                      setSelectedKey(areaKey);
                      setActiveProvinceId(activeProvince.id);
                      setActiveCityId(activeCity.id);
                    }}
                  >
                    {selected && <Check className="absolute left-2 top-2 size-4 text-[#f6f6f7]" strokeWidth={1.8} />}
                    <span className="min-w-0 flex-1 whitespace-nowrap pl-[30px] pr-6">{area}</span>
                  </button>
                );
              })}
            </CascadeColumn>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

function MultiLevelDropdownFrame() {
  return (
    <section className="relative h-[450px] w-[740px] rounded-[20px] bg-[#17171a]">
      <div className="absolute left-[40px] top-6 text-[16px] leading-4 text-[#f6f6f7]" style={buttonTypography}>
        级联选择器-多选
      </div>
      <MultiLevelDropdownSelect />
      <div className="absolute left-[380px] top-6 text-[16px] leading-4 text-[#f6f6f7]" style={buttonTypography}>
        级联选择器-单选
      </div>
      <SingleCascadeSelect />
    </section>
  );
}

const uploadedImagePreview =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%233566EC'/%3E%3Cstop offset='0.55' stop-color='%2328282E'/%3E%3Cstop offset='1' stop-color='%2368F1C1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='36' fill='%2317171A'/%3E%3Cpath d='M68 410 206 264l82 86 62-66 182 126v80H68z' fill='url(%23g)'/%3E%3Ccircle cx='418' cy='168' r='54' fill='%23F1E860'/%3E%3Crect x='68' y='68' width='464' height='464' rx='24' fill='none' stroke='%23ADADB6' stroke-opacity='.35' stroke-width='2'/%3E%3C/svg%3E";

function ImagePreviewModal({ onClose }: { onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[rgba(0,0,0,0.64)] p-6">
      <div className="flex flex-col items-center gap-4">
        <img src={uploadedImagePreview} alt="已上传图片预览" className="size-[600px] rounded-[6px] object-cover" />
        <DesignButton onClick={onClose}>关闭</DesignButton>
      </div>
    </div>,
    document.body
  );
}

function UploadedImageThumb({ onPreview }: { onPreview: () => void }) {
  return (
    <button
      type="button"
      aria-label="预览已上传图片"
      className="group relative grid size-20 place-items-center overflow-hidden rounded-[6px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]"
      onClick={onPreview}
    >
      <img src={uploadedImagePreview} alt="已上传图片" className="size-full object-cover transition-transform group-hover:scale-105" />
      <span className="absolute inset-0 opacity-0 transition-opacity group-hover:bg-black/20 group-hover:opacity-100" />
    </button>
  );
}

function ImageUploadControl({
  buttonClassName = "absolute left-[132px] top-[72px]",
  helperClassName = "absolute left-[132px] top-[112px]",
  placeholderClassName = "absolute left-[35px] top-[58px]",
}: {
  buttonClassName?: string;
  helperClassName?: string;
  placeholderClassName?: string;
}) {
  const [hasImage, setHasImage] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <div className={placeholderClassName}>
        {hasImage ? (
          <UploadedImageThumb onPreview={() => setIsPreviewOpen(true)} />
        ) : (
          <div className="grid size-20 place-items-center rounded-[6px] bg-[rgba(255,255,255,0.04)]">
            <RawSvgIcon svg={imagePlaceholderSvg} className="size-10" useCurrentColor={false} />
          </div>
        )}
      </div>
      <div className={buttonClassName}>
        <UploadActionButton onClick={() => setHasImage(true)}>{hasImage ? "重新上传" : "上传图片"}</UploadActionButton>
      </div>
      <div className={cn("text-[14px] leading-4 text-[#767683]", helperClassName)} style={buttonTypography}>
        请上传1:1的图片，大小不超过10M
      </div>
      {isPreviewOpen && <ImagePreviewModal onClose={() => setIsPreviewOpen(false)} />}
    </>
  );
}

function UploadedFileRow({ onDelete }: { onDelete: () => void }) {
  return (
    <div className="flex h-12 w-full min-w-[400px] items-center rounded-[6px] border border-dashed border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
      <RawSvgIcon svg={documentSvg} className="ml-4 size-6 shrink-0" useCurrentColor={false} />
      <span className="ml-1 min-w-0 flex-1 truncate text-[14px] leading-4 text-[#f6f6f7]" style={buttonTypography}>
        这里是文件名称.docx
      </span>
      <button
        type="button"
        aria-label="删除已上传文件"
        className="mr-4 grid size-6 shrink-0 place-items-center rounded-[4px] transition-colors hover:bg-[rgba(255,255,255,0.08)]"
        onClick={onDelete}
      >
        <RawSvgIcon svg={deleteSvg} className="size-6" useCurrentColor={false} />
      </button>
    </div>
  );
}

function DeleteFileDialog({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[rgba(0,0,0,0.64)] p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-file-dialog-title"
        className="w-[410px] rounded-[12px] border border-[rgba(255,255,255,0.04)] bg-[#212126] shadow-[0_0_1px_rgba(0,0,0,0.8)]"
        style={{ height: 156 }}
      >
        <div className="flex h-full flex-col px-6 py-6">
          <div className="w-[362px]">
            <h3 id="delete-file-dialog-title" className="text-[16px] font-semibold leading-[18px] text-[#f6f6f7]">
              确认删除？
            </h3>
            <p className="mt-4 w-[362px] break-words text-[14px] leading-5 text-[#676772]">删除后无法恢复，请确认</p>
          </div>
          <div className="mt-6 flex items-center justify-end gap-2">
            <DesignButton onClick={onCancel}>取消</DesignButton>
            <DesignButton variant="primary" onClick={onConfirm}>确认</DesignButton>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function FileUploadControl({ className = "absolute left-[35px] top-[58px] w-[640px]" }: { className?: string }) {
  const [hasFile, setHasFile] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (hasFile) {
    return (
      <div className={className}>
        <UploadedFileRow onDelete={() => setIsDeleteDialogOpen(true)} />
        {isDeleteDialogOpen && (
          <DeleteFileDialog
            onCancel={() => setIsDeleteDialogOpen(false)}
            onConfirm={() => {
              setIsDeleteDialogOpen(false);
              setHasFile(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn("h-[76px] min-w-[400px] rounded-[6px] border border-dashed border-[#232328] bg-[rgba(255,255,255,0.01)]", className)}>
      <div className="absolute left-1/2 top-3 -translate-x-1/2">
        <UploadActionButton onClick={() => setHasFile(true)}>上传文件</UploadActionButton>
      </div>
      <div className="absolute left-0 top-12 w-full text-center text-[14px] leading-4 text-[#767683]" style={buttonTypography}>
        文件大小不得超过100M
      </div>
    </div>
  );
}

function FormImageUploadControl() {
  const [hasImage, setHasImage] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-[18px]">
        {hasImage ? (
          <UploadedImageThumb onPreview={() => setIsPreviewOpen(true)} />
        ) : (
          <div className="grid size-20 place-items-center rounded-[6px] border border-dashed border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
            <RawSvgIcon svg={imagePlaceholderSvg} className="size-10" useCurrentColor={false} />
          </div>
        )}
        <div className="flex flex-col gap-3">
          <FormUploadButton onClick={() => setHasImage(true)}>{hasImage ? "重新上传" : "上传图片"}</FormUploadButton>
          <p className="text-[14px] leading-4 text-[#767683]" style={buttonTypography}>
            请上传1:1的图片，大小不超过10M
          </p>
        </div>
      </div>
      {isPreviewOpen && <ImagePreviewModal onClose={() => setIsPreviewOpen(false)} />}
    </>
  );
}

function UploadActionButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      className="group relative flex h-7 min-h-7 w-fit items-center gap-1 overflow-hidden rounded-[6px] pl-1.5 pr-2 text-[14px] leading-4 text-[#f6f6f7]"
      style={buttonTypography}
      onClick={onClick}
    >
      <span className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-[#34343e] to-[#2d2d36]" />
      <span className="absolute inset-0 rounded-[6px] opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08))" }} />
      <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
      <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]" />
      <span className="relative grid size-4 shrink-0 place-items-center text-[#adadb6]">
        <RawSvgIcon svg={uploadSvg} className="size-4" />
      </span>
      <span className="relative whitespace-nowrap">{children}</span>
    </button>
  );
}

function UploadComponentsFrame() {
  return (
    <section className="flex w-[710px] flex-col gap-[42px]">
      <div className="relative h-[162px] w-[710px] rounded-[20px] bg-[#17171a]">
        <div className="absolute left-[35px] top-[34px] text-[14px] leading-4 text-[#f6f6f7]" style={buttonTypography}>
          图片上传
        </div>
        <ImageUploadControl />
      </div>

      <div className="relative h-[162px] w-[710px] rounded-[20px] bg-[#17171a]">
        <div className="absolute left-[35px] top-[34px] text-[14px] leading-4 text-[#f6f6f7]" style={buttonTypography}>
          文件上传
        </div>
        <FileUploadControl />
      </div>
    </section>
  );
}

function FormField({
  label,
  rightAddon,
  children,
}: {
  label: string;
  rightAddon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex h-4 items-center justify-between">
        <span className="text-[14px] leading-4 text-[#adadb6]" style={buttonTypography}>
          {label}
        </span>
        {rightAddon}
      </div>
      {children}
    </div>
  );
}

function FormTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="flex h-5 min-w-12 items-center justify-center rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.08)] px-1.5 text-[12px] leading-[14px] text-[#adadb6]"
      style={buttonTypography}
    >
      {children}
    </span>
  );
}

function FormTextInput({
  placeholder = "请输入项目名称",
  value,
  onChange,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <input
      className="h-8 w-full rounded-[6px] border border-[#52525c] bg-[rgba(33,33,38,0.6)] px-2 text-[14px] leading-4 text-[#f6f6f7] shadow-[0_0_2px_0_rgba(0,0,0,0.8)] outline-none placeholder:text-[#4A4A50] hover:border-[#71717c] focus:border-[#3566ec] focus:bg-[rgba(33,33,38,0.32)] focus:shadow-[0_0_0_2px_rgba(53,102,236,0.24)]"
      style={buttonTypography}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}

function FormDropdownSelect({
  placeholder = "请选择一个选项",
  options = dropdownOptions,
  value: controlledValue,
  onChange,
}: {
  placeholder?: string;
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const selected = controlledValue !== undefined ? controlledValue || null : internalSelected;
  const value = selected ?? placeholder;
  const isActive = isOpen;
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const triggerStyle: React.CSSProperties = {
    ...buttonTypography,
    height: 32,
    backgroundColor: isActive ? "rgba(33,33,38,0.32)" : isHovered ? "rgba(255,255,255,0.08)" : "rgba(33,33,38,0.6)",
    border: `1px solid ${isActive ? "#3566ec" : isHovered ? "#71717c" : "#52525c"}`,
    borderRadius: 6,
    boxShadow: isActive ? "0 0 0 2px rgba(53,102,236,0.24)" : "0 0 2px 0 rgba(0,0,0,0.8)",
  };

  return (
    <div ref={containerRef} className="relative w-full min-w-[240px]">
      <button
        type="button"
        className="relative flex h-8 w-full items-center text-left"
        style={triggerStyle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={cn("h-4 min-w-0 flex-1 truncate pl-2 pr-8 text-[14px] leading-4", selected ? "text-[#f6f6f7]" : "text-[#767683]")}>{value}</span>
        <ChevronDown className={cn("absolute right-2 size-4 shrink-0 text-[#adadb6] transition-transform", isOpen && "rotate-180")} strokeWidth={1.8} />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-[42px] z-30 inline-flex w-full min-w-[240px] flex-col gap-1 rounded-[6px] border border-[rgba(255,255,255,0.04)] bg-[#28282e] p-1"
          style={{ boxShadow: "0 0 2px 0 rgba(0,0,0,0.8)" }}
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={isSelected}
                className="flex h-8 w-full items-center gap-1 rounded-[6px] pl-1 pr-3 text-left text-[#f6f6f7] transition-colors hover:bg-[rgba(255,255,255,0.08)]"
                style={buttonTypography}
                onClick={() => {
                  if (controlledValue === undefined) setInternalSelected(option);
                  onChange?.(option);
                  setIsOpen(false);
                }}
              >
                <span className="grid size-4 shrink-0 place-items-center">
                  {isSelected && <Check className="size-4 text-[#f6f6f7]" strokeWidth={1.8} />}
                </span>
                <span className="min-w-0 whitespace-nowrap text-[#f6f6f7]">{option}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FormUploadButton({ children = "上传图片", onClick }: { children?: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      className="group relative flex h-7 min-h-7 w-fit items-center overflow-hidden rounded-[6px] pl-1.5 pr-2 text-[14px] leading-4 text-[#f6f6f7]"
      style={buttonTypography}
      onClick={onClick}
    >
      <span className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-[#34343e] to-[#2d2d36]" />
      <span className="absolute inset-0 rounded-[6px] opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.04))" }} />
      <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
      <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]" />
      <span className="relative grid size-4 shrink-0 place-items-center text-[#adadb6]">
        <RawSvgIcon svg={uploadSvg} className="size-4" />
      </span>
      <span className="relative ml-1 whitespace-nowrap">{children}</span>
    </button>
  );
}

function FormSuffixNumberInput() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [unit, setUnit] = useState("小时");

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setIsActive(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const phase: InputPhase = isOpen || isFocused || isActive ? "typing" : value ? "complete" : isHovered ? "hover" : "default";
  const suffixDivider = phase === "typing" ? "border-transparent" : phase === "hover" ? "border-[#71717c]" : "border-[#52525c]";
  const triggerWidth = getDropdownTriggerWidth(unit);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex h-8 w-full items-center overflow-hidden rounded-[6px] border" style={visual[phase]}>
        <input
        className="h-4 min-w-0 flex-1 bg-transparent px-2 text-[14px] leading-4 text-[#f6f6f7] outline-none placeholder:text-[#4A4A50]"
          style={buttonTypography}
          inputMode="numeric"
          placeholder="请输入数字"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="relative h-8 shrink-0" style={{ width: triggerWidth }}>
          <button
            type="button"
            className="relative flex h-8 items-center gap-1 rounded-br-[6px] rounded-tr-[6px] bg-[rgba(47,47,56,0.6)] py-2 pl-2 pr-1 text-[#adadb6]"
            style={{ ...buttonTypography, width: triggerWidth }}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onPointerDown={() => setIsActive(true)}
            onClick={() => {
              setIsActive(true);
              setIsOpen((open) => !open);
            }}
          >
            <span className="whitespace-nowrap text-[#f6f6f7]">{unit}</span>
            <ChevronDown className={cn("relative size-4 shrink-0 text-[#adadb6]", isOpen && "rotate-180")} strokeWidth={1.8} />
          </button>
          <span className={cn("pointer-events-none absolute left-0 top-0 h-8 border-l", suffixDivider)} />
        </div>
      </div>
        {isOpen && (
          <div className="absolute right-0 top-10 z-30">
            <UnitDropdownMenu
              width={getDropdownMenuWidth(unitOptions)}
              selected={unit}
              onSelect={(nextValue) => {
                setUnit(nextValue);
                setIsOpen(false);
                setIsActive(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function FormRadioList() {
  const [selected, setSelected] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const items = ["个人项目", "团队项目", "小组项目"];

  return (
    <div className="flex h-8 items-center gap-6">
      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          className="flex h-8 items-center text-[14px] leading-4"
          style={{ ...buttonTypography, color: selected === index ? "#f6f6f7" : "#adadb6" }}
          onClick={() => setSelected(index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex((value) => (value === index ? null : value))}
        >
          <span className="relative size-4 shrink-0">
            <RadioMark checked={selected === index} hover={selected !== index && hoveredIndex === index} />
          </span>
          <span className="ml-1.5 whitespace-nowrap">{item}</span>
        </button>
      ))}
    </div>
  );
}

function FormCheckboxList() {
  const [checkedItems, setCheckedItems] = useState([true, true, false, true, false]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const items = ["人群类型二", "人群类型二", "人群类型一", "人群类型二", "人群类型一"];

  return (
    <div className="flex h-8 items-center gap-6">
      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          className="flex h-8 items-center text-[14px] leading-4"
          style={{ ...buttonTypography, color: checkedItems[index] ? "#f6f6f7" : "#adadb6" }}
          onClick={() => setCheckedItems((values) => values.map((value, valueIndex) => (valueIndex === index ? !value : value)))}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex((value) => (value === index ? null : value))}
        >
          <span className="relative size-4 shrink-0">
            <CheckboxMark checked={checkedItems[index]} hover={!checkedItems[index] && hoveredIndex === index} />
          </span>
          <span className="ml-1.5 whitespace-nowrap">{item}</span>
        </button>
      ))}
    </div>
  );
}

function FormSwitchRow({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  const [enabled, setEnabled] = useState(defaultChecked);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={cn("w-full", description ? "min-h-[72px]" : "h-8")}>
      <button
        type="button"
        className="flex h-8 items-center text-[14px] leading-4"
        style={{ ...buttonTypography, color: enabled ? "#f6f6f7" : "#adadb6" }}
        onClick={() => setEnabled((value) => !value)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="relative h-4 w-6 shrink-0">
          <SwitchMark checked={enabled} hover={!enabled && isHovered} />
        </span>
        <span className="ml-1.5 whitespace-nowrap">{label}</span>
      </button>
      {description && (
        <p className="ml-[30px] mt-0 text-[14px] text-[#767683]" style={{ ...buttonTypography, lineHeight: "21px" }}>
          {description}
        </p>
      )}
    </div>
  );
}

function FormPage() {
  return (
    <section className="mx-auto flex w-[640px] flex-col gap-4">
        <FormField label="项目名称">
          <FormTextInput />
        </FormField>
        <FormField label="请输入创建者姓名" rightAddon={<FormTag>管理员</FormTag>}>
          <FormTextInput />
        </FormField>
        <FormField label="选择一个上传目录">
          <FormDropdownSelect />
        </FormField>
        <FormField label="项目持续时间">
          <FormSuffixNumberInput />
        </FormField>
        <FormField label="项目类型">
          <FormRadioList />
        </FormField>
        <FormField label="适用人群">
          <FormCheckboxList />
        </FormField>
        <FormField label="图片上传">
          <FormImageUploadControl />
        </FormField>
        <FormField label="文件上传">
          <FileUploadControl className="relative w-full" />
        </FormField>
        <div className="pt-1">
          <FormSwitchRow label="允许任何人加入" defaultChecked />
        </div>
        <FormSwitchRow
          label="这里是带说明的开关"
          description="开启后将允许任何人在未经允许的情况下加入开启后将允许任何人在未经允许的情况下加入开启后将允许任何人在未经允许的情况下加入"
        />
    </section>
  );
}

const codeContainerLines = [
  "export async function handleRequest(request: Request) {",
  "  const traceId = request.headers.get(\"x-trace-id\") ?? createTraceId();",
  "  const payload = await request.json();",
  "",
  "  logger.info(\"request.received\", { traceId, path: request.url });",
  "  const result = await service.run(payload, { traceId });",
  "",
  "  return Response.json({ ok: true, data: result });",
  "}",
];

const logContainerRows = [
  { time: "10:24:18.482", level: "info", tone: "blue" as TagTone, source: "api-gateway", message: "request.received trace_id=7f8a path=/v1/events latency=14ms" },
  { time: "10:24:18.519", level: "debug", tone: "neutral" as TagTone, source: "auth-service", message: "token verified subject=ops-admin scope=read:events" },
  { time: "10:24:18.781", level: "warn", tone: "yellow" as TagTone, source: "event-worker", message: "retry scheduled queue=events attempt=2 backoff=1200ms" },
  { time: "10:24:19.042", level: "error", tone: "red" as TagTone, source: "storage", message: "write failed bucket=archive code=timeout elapsed=3000ms" },
  { time: "10:24:19.284", level: "info", tone: "green" as TagTone, source: "api-gateway", message: "response.sent status=200 trace_id=7f8a duration=812ms" },
];

function CodeLogPage() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(24,minmax(0,1fr))] gap-4">
      <section className="rounded-[6px] border border-[#232328] bg-[#17171a] p-4" style={{ gridColumn: "span 12 / span 12" }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold leading-[18px] text-[#f6f6f7]">代码容器</h2>
            <p className="mt-2 text-[13px] leading-4 text-[#767683]">用于展示脚本、配置片段和执行上下文。</p>
          </div>
          <div className="flex items-center gap-2">
            <Tag tone="blue">TypeScript</Tag>
            <DesignButton size="28">复制</DesignButton>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-[6px] border border-[#232328] bg-[#111114]">
          <div className="flex h-9 items-center justify-between border-b border-[#232328] bg-[#17171a] px-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#f68888]" />
              <span className="size-2 rounded-full bg-[#f1e860]" />
              <span className="size-2 rounded-full bg-[#68f1c1]" />
            </div>
            <span className="text-[12px] leading-4 text-[#767683]">handler.ts</span>
          </div>
          <div className="app-scrollbar max-h-[360px] overflow-auto py-3">
            {codeContainerLines.map((line, index) => (
              <div key={`${index}-${line}`} className="grid min-h-6 grid-cols-[44px_1fr] px-3 font-mono text-[13px] leading-6">
                <span className="select-none text-right text-[#4A4A50]">{String(index + 1).padStart(2, "0")}</span>
                <code className="min-w-0 whitespace-pre pl-4 text-[#d7d7dc]">{line || " "}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[6px] border border-[#232328] bg-[#17171a] p-4" style={{ gridColumn: "span 12 / span 12" }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold leading-[18px] text-[#f6f6f7]">日志容器</h2>
            <p className="mt-2 text-[13px] leading-4 text-[#767683]">用于承载实时日志、事件流和运行诊断信息。</p>
          </div>
          <SegmentedTabs tabs={["全部", "错误", "警告"]} />
        </div>

        <div className="mt-4 overflow-hidden rounded-[6px] border border-[#232328] bg-[#111114]">
          <div className="grid h-10 grid-cols-[108px_76px_132px_1fr] items-center border-b border-[#232328] bg-[#30333c] px-3 text-[13px] leading-4 text-[#adadb6]">
            <span>时间</span>
            <span>级别</span>
            <span>来源</span>
            <span>内容</span>
          </div>
          <div className="app-scrollbar max-h-[360px] overflow-auto">
            {logContainerRows.map((row) => (
              <div key={`${row.time}-${row.source}-${row.level}`} className="grid min-h-[52px] grid-cols-[108px_76px_132px_1fr] items-center border-b border-[#232328] px-3 transition-colors last:border-b-0 hover:bg-[rgba(255,255,255,0.04)]">
                <span className="font-mono text-[12px] leading-4 text-[#767683]">{row.time}</span>
                <span><Tag tone={row.tone}>{row.level}</Tag></span>
                <span className="truncate text-[13px] leading-4 text-[#adadb6]">{row.source}</span>
                <span className="truncate font-mono text-[12px] leading-4 text-[#d7d7dc]">{row.message}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const trafficSearchFields = [
  "user_id",
  "api_version",
  "page_referer",
  "source",
  "appname",
  "hostname",
  "result",
  "module",
  "request_id",
  "remote_addr",
  "domain",
  "action_type",
];

const trafficSearchEvents = [
  {
    time: "2026/06/05 14:59:36.000",
    source: "Agent管理",
    level: "success" as const,
    summary:
      "{\"api_version\":\"v3\",\"timestamp\":\"2026-06-05 14:59:36\",\"action\":\"read\",\"module\":\"Agent\",\"user_name\":\"liumingyu\",\"user_id\":7,\"domain\":\"ops\",\"remote_addr\":\"10.200.0.26\",\"target\":\"agent_list\",\"result\":\"success\"}",
  },
  {
    time: "2026/06/05 14:59:34.812",
    source: "审计日志",
    level: "info" as const,
    summary:
      "{\"api_version\":\"v3\",\"action\":\"search\",\"page_module\":\"数据流量\",\"page_referer\":\"/traffic/search\",\"audit_resource_name\":\"query\",\"audit_operate_type\":\"read\",\"duration\":428}",
  },
  {
    time: "2026/06/05 14:59:31.208",
    source: "网关",
    level: "warn" as const,
    summary:
      "{\"request_id\":\"bf2c9a\",\"host\":\"traffic-gateway-03\",\"path\":\"/api/events\",\"result\":\"partial\",\"message\":\"upstream retry triggered\",\"retry_count\":2}",
  },
  {
    time: "2026/06/05 14:59:29.640",
    source: "Agent管理",
    level: "success" as const,
    summary:
      "{\"api_version\":\"v3\",\"timestamp\":\"2026-06-05 14:59:29\",\"action\":\"export\",\"module\":\"Agent\",\"user_name\":\"liumingyu\",\"result\":\"success\",\"rows\":3862}",
  },
];

function DownloadIconButton({ size = "32" }: { size?: ButtonSize }) {
  const isCompact = size === "28";

  return (
    <button
      type="button"
      className={cn(
        "group relative flex items-center gap-1 overflow-hidden rounded-[6px] pl-1.5 pr-2 text-[14px] leading-4 text-[#f6f6f7]",
        isCompact ? "h-7 min-h-7" : "h-8 min-h-8"
      )}
      style={buttonTypography}
    >
      <span className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-[#34343e] to-[#2d2d36]" />
      <span
        className="absolute inset-0 rounded-[6px] opacity-0 transition-opacity group-hover:opacity-100"
        style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08))" }}
      />
      <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
      <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]" />
      <RawSvgIcon svg={downloadSvg} className="relative size-4 shrink-0 text-[#adadb6]" />
      <span className="relative whitespace-nowrap">下载</span>
    </button>
  );
}

function DisplayConfigButton({ size = "32" }: { size?: ButtonSize }) {
  const isCompact = size === "28";

  return (
    <button
      type="button"
      className={cn(
        "group relative flex items-center gap-1 overflow-hidden rounded-[6px] pl-1.5 pr-2 text-[14px] leading-4 text-[#f6f6f7]",
        isCompact ? "h-7 min-h-7" : "h-8 min-h-8"
      )}
      style={buttonTypography}
    >
      <span className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-[#34343e] to-[#2d2d36]" />
      <span
        className="absolute inset-0 rounded-[6px] opacity-0 transition-opacity group-hover:opacity-100"
        style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08))" }}
      />
      <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
      <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]" />
      <RawSvgIcon svg={displayConfigSvg} className="relative size-4 shrink-0 text-[#adadb6]" />
      <span className="relative whitespace-nowrap">展示配置</span>
    </button>
  );
}

function TrafficResultTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = [{ label: "列表" }, { label: "统计" }, { label: "模式" }];

  return (
    <UnderlineTabs
      tabs={tabs}
      activeIndex={activeIndex}
      onChange={setActiveIndex}
      gapClassName="gap-6"
      heightClassName="h-10"
      buttonHeightClassName="h-10"
      labelClassName="top-3 text-[16px] leading-[18px]"
      activeColor="#f6f6f7"
      inactiveColor="#767683"
      showBaseLine={false}
    />
  );
}

const newSearchToolActions = [
  { label: "搜索指南", icon: searchGuideSvg },
  { label: "搜索属性", icon: searchPropertySvg },
  { label: "搜索配置", icon: searchConfigSvg },
  { label: "已存搜索", icon: savedSearchSvg },
  { label: "新建监控", icon: newMonitorSvg },
];

const newSearchHistoryItems = [
  "*AND iklosxxsa",
  "s*AND iklosxxsa *AND iklosxxsa",
  "ssa*AND iklosxxsa",
  "ssa*AND sxxsa",
  "*AND iklosxxsa*AND iklosxxsa*AND iklosxxsa*AND iklosxxsa*AND iklosxxsa",
  "s*AND iklosxxsa*AND iklosxxsa",
  "s*AND iklosxxsa*AND iklosxxsa",
  "*AND iklosxxsa",
];

type TrafficResultField = {
  id: string;
  visible: boolean;
  label: string;
  value: string;
  tone?: "purple";
  required?: boolean;
};

const trafficResultFieldRows: TrafficResultField[][] = [
  [
    { id: "timestamp", visible: true, label: "timestamp", value: "2026/06/11 10:54:25.184", tone: "purple" },
    { id: "api_version", visible: true, label: "api_version", value: "splserver" },
    { id: "result", visible: false, label: "result", value: "other" },
    { id: "source", visible: false, label: "source", value: "/data/rizhiyi/logs/splserver/splserver.log" },
    { id: "hostname", visible: false, label: "hostname", value: "1.123" },
  ],
  [
    { id: "page_referer", visible: true, label: "page_referer", value: "loplspqpoisuf./sdjcxz" },
    { id: "hostname_alt", visible: false, label: "hostname", value: "dnskdz" },
  ],
];

const trafficRawMessage =
  "2026-06-11 10:14:04,859 INFO [task-9] c.y.pipe.stream.actions.preview.PreviewAction [58bfecf8-c957-4383-a4ff-7112639d0b98]: preview result state:[COMPLETED] size:[1000] ver:[1 ]ED] size:[1000] ver:[1]";

const trafficResultText =
  "{\"api_version\":\"v3\",\"timestamp\":\"2026-06-05 14:59:36\",\"action\":\"read\",\"module\":\"Agent\",\"user_name\":\"liumingyu\",\"user_id\":7,\"domain\"";

function ResultTimestampTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-5 min-h-5 shrink-0 items-center whitespace-nowrap rounded-[4px] bg-[rgba(207,117,255,0.42)] px-1.5 text-[12px] leading-[14px] text-[#f0c7ff]" style={{ ...buttonTypography, fontSize: "12px", lineHeight: "14px" }}>
      {children}
    </span>
  );
}

function ResultFieldTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-5 min-h-5 items-center rounded-[4px] bg-[rgba(255,255,255,0.08)] px-1.5 text-[12px] leading-[14px] text-[#adadb6]" style={{ ...buttonTypography, fontSize: "12px", lineHeight: "14px" }}>
      {children}
    </span>
  );
}

function ResultField({
  field,
  onToggle,
  showToggle = true,
  useNeutralValueColor = false,
}: {
  field: TrafficResultField;
  onToggle?: () => void;
  showToggle?: boolean;
  useNeutralValueColor?: boolean;
}) {
  return (
    <div className="flex min-h-5 max-w-full min-w-0 items-center gap-0.5">
      {showToggle && !field.required ? (
        <button
          type="button"
          aria-label={field.visible ? "隐藏字段" : "显示字段"}
          className="grid size-[14px] shrink-0 place-items-center text-[#f6f6f7]"
          onClick={onToggle}
        >
          <RawSvgIcon svg={svgToFillColor(field.visible ? showSvg : hideSvg, "#F6F6F7")} className="size-[14px]" useCurrentColor={false} />
        </button>
      ) : null}
      <ResultFieldTag>{field.label}</ResultFieldTag>
      <span
        className={cn(
          "min-w-0 break-all text-[12px] leading-4",
          useNeutralValueColor ? "text-[#f6f6f7]" : field.tone === "purple" ? "text-[#d98cff]" : "text-[#e0a767]"
        )}
        style={{ ...buttonTypography, fontSize: "12px", lineHeight: "16px" }}
      >
        {field.value}
      </span>
    </div>
  );
}

function ResultScrollableText({
  children,
  textClassName = "text-[#f6f6f7]",
  scrollbarInset = 0,
}: {
  children: React.ReactNode;
  textClassName?: string;
  scrollbarInset?: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollbar, setScrollbar] = useState({ left: 0, width: 100, visible: false });

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const updateScrollbar = () => {
      const maxScroll = content.scrollWidth - content.clientWidth;
      if (maxScroll <= 1) {
        setScrollbar({ left: 0, width: 100, visible: false });
        return;
      }

      const width = (content.clientWidth / content.scrollWidth) * 100;
      const left = (content.scrollLeft / maxScroll) * (100 - width);
      setScrollbar({ left, width, visible: true });
    };

    updateScrollbar();
    content.addEventListener("scroll", updateScrollbar, { passive: true });
    window.addEventListener("resize", updateScrollbar);

    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(content);

    return () => {
      content.removeEventListener("scroll", updateScrollbar);
      window.removeEventListener("resize", updateScrollbar);
      resizeObserver.disconnect();
    };
  }, [children]);

  return (
    <div className="relative min-w-0 flex-1 self-stretch">
      <div ref={contentRef} className="log-scrollbar flex h-full items-center overflow-x-auto overflow-y-hidden">
        <span className={cn("whitespace-nowrap font-mono text-[12px] leading-4", textClassName)}>{children}</span>
      </div>
      {scrollbar.visible && (
        <div
          className="absolute bottom-0.5 h-0.5 overflow-hidden rounded-full bg-transparent opacity-0 transition-opacity group-hover:opacity-100"
          style={{ left: `${scrollbarInset}px`, right: `${scrollbarInset}px` }}
        >
          <div
            className="h-0.5 rounded-full bg-[#767683]"
            style={{ marginLeft: `${scrollbar.left}%`, width: `${scrollbar.width}%` }}
          />
        </div>
      )}
    </div>
  );
}

function ResultScrollableLogLine({ event }: { event: (typeof trafficSearchEvents)[number] }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollbar, setScrollbar] = useState({ left: 0, width: 100, visible: false });

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const updateScrollbar = () => {
      const maxScroll = content.scrollWidth - content.clientWidth;
      if (maxScroll <= 1) {
        setScrollbar({ left: 0, width: 100, visible: false });
        return;
      }

      const width = (content.clientWidth / content.scrollWidth) * 100;
      const left = (content.scrollLeft / maxScroll) * (100 - width);
      setScrollbar({ left, width, visible: true });
    };

    updateScrollbar();
    content.addEventListener("scroll", updateScrollbar, { passive: true });
    window.addEventListener("resize", updateScrollbar);

    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(content);

    return () => {
      content.removeEventListener("scroll", updateScrollbar);
      window.removeEventListener("resize", updateScrollbar);
      resizeObserver.disconnect();
    };
  }, [event.summary, event.time]);

  return (
    <div className="relative min-w-0 flex-1 self-stretch">
      <div ref={contentRef} className="log-scrollbar flex h-full items-center overflow-x-auto overflow-y-hidden">
        <div className="flex w-max items-center gap-2">
          <ResultTimestampTag>{event.time}</ResultTimestampTag>
          <span className="whitespace-nowrap font-mono text-[12px] leading-4 text-[#f6f6f7]">{event.summary}</span>
        </div>
      </div>
      {scrollbar.visible && (
        <div className="absolute bottom-0.5 left-0 right-0 h-0.5 overflow-hidden rounded-full bg-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <div
            className="h-0.5 rounded-full bg-[#767683]"
            style={{ marginLeft: `${scrollbar.left}%`, width: `${scrollbar.width}%` }}
          />
        </div>
      )}
    </div>
  );
}

function NewSearchToolButton({ label, icon, onClick }: { label: string; icon: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      className="group flex h-7 items-center rounded-[4px] pl-1.5 pr-1.5 text-[14px] leading-4 text-[#adadb6] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-[#f6f6f7]"
      style={buttonTypography}
      onClick={onClick}
    >
      <RawSvgIcon svg={icon} className="size-4 shrink-0" />
      <span className="ml-1 whitespace-nowrap">{label}</span>
    </button>
  );
}

function SearchGuideModal({ onClose }: { onClose: () => void }) {
  const inlineCodeClass = "inline-flex items-center rounded-[4px] bg-[rgba(255,255,255,0.04)] px-1.5 text-[#f6f6f7]";

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[rgba(0,0,0,0.64)] p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-guide-modal-title"
        className="w-[640px] rounded-[12px] border border-[rgba(255,255,255,0.04)] bg-[#212126] shadow-[0_0_1px_rgba(0,0,0,0.8)]"
      >
        <div className="flex h-12 items-center justify-between border-b border-[rgba(255,255,255,0.04)] px-4">
          <h3 id="search-guide-modal-title" className="text-[16px] font-semibold leading-[18px] text-[#f6f6f7]">
            如何搜索
          </h3>
          <button
            type="button"
            aria-label="关闭搜索指南"
            className="grid size-4 place-items-center text-[#adadb6] transition-colors hover:text-[#f6f6f7]"
            onClick={onClose}
          >
            <X className="size-4" strokeWidth={1.6} />
          </button>
        </div>

        <div className="px-4 py-4 text-[#adadb6]">
          <div className="space-y-5">
            <section>
              <h4 className="text-[16px] font-semibold leading-5 text-[#f6f6f7]">步骤 1：检索事件</h4>
              <div className="mt-3 space-y-2 text-[14px] leading-6">
                <p>全文检索：<span className={inlineCodeClass}>hello world</span></p>
                <p>短语查询：<span className={inlineCodeClass}>"hello world"</span></p>
                <p>通配符：<span className={inlineCodeClass}>*</span>，<span className={inlineCodeClass}>?</span></p>
                <p>逻辑运算符：<span className={inlineCodeClass}>AND, OR, NOT, ( )</span></p>
                <p>字段值完全匹配：<span className={inlineCodeClass}>apache.method:"get"</span></p>
                <p>字段值模糊匹配：<span className={inlineCodeClass}>apache.status:*</span></p>
                <p>字段数值范围：<span className={inlineCodeClass}>apache.status:[400 TO 500]</span> 或 <span className={inlineCodeClass}>apache.status:&gt;400</span></p>
                <p>简单正则表达式：<span className={inlineCodeClass}>/frontend[0-9]{2}/</span></p>
              </div>
            </section>

            <section>
              <h4 className="text-[16px] font-semibold leading-5 text-[#f6f6f7]">步骤 2：使用搜索命令</h4>
              <div className="mt-3 space-y-2 text-[14px] leading-6">
                <p>更多高级搜索使用命令来转换、过滤以及聚合检索的事件。</p>
                <p>使用竖线或管道符将命令应用到检索的事件。</p>
                <p className="pl-6"><span className={inlineCodeClass}>logtype:apache error | stats count()</span></p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function NewSearchHistoryPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      className="group flex h-8 max-w-full items-center rounded-[6px] bg-[rgba(33,33,38,0.42)] pl-2 pr-1 text-left text-[14px] leading-4 text-[#adadb6] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-[#f6f6f7]"
      style={buttonTypography}
    >
      <span className="min-w-0 truncate">{label}</span>
      <span
        role="button"
        tabIndex={0}
        aria-label="删除搜索历史"
        className="ml-2 grid size-6 shrink-0 place-items-center text-[#767683] transition-colors hover:text-[#f6f6f7]"
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            onRemove();
          }
        }}
      >
        <X className="size-4" strokeWidth={1.6} />
      </span>
    </button>
  );
}

function SearchHistoryPill({
  label,
  onRemove,
  onSelect,
}: {
  label: string;
  onRemove: () => void;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className="group flex h-8 max-w-full items-center rounded-[6px] bg-[rgba(33,33,38,0.42)] pl-2 pr-1 text-left text-[14px] leading-4 text-[#adadb6] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-[#f6f6f7]"
      style={buttonTypography}
      onClick={onSelect}
    >
      <span className="min-w-0 truncate">{label}</span>
      <span
        role="button"
        tabIndex={0}
        aria-label="删除搜索历史"
        className="ml-2 grid size-6 shrink-0 place-items-center text-[#767683] transition-colors hover:text-[#f6f6f7]"
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            onRemove();
          }
        }}
      >
        <X className="size-4" strokeWidth={1.6} />
      </span>
    </button>
  );
}

const pageSizeOptions = ["每页20条", "每页40条"];

function getPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | "ellipsis"> = [];
  const pushRange = (start: number, end: number) => {
    for (let page = start; page <= end; page += 1) {
      items.push(page);
    }
  };

  if (currentPage <= 3) {
    pushRange(1, Math.min(3, totalPages));
    if (totalPages > 3) {
      if (totalPages === 4) {
        items.push(4);
      } else {
        items.push("ellipsis");
        items.push(totalPages);
      }
    }
    return items;
  }

  if (currentPage >= totalPages - 2) {
    items.push(1);
    if (totalPages - 2 === 2) {
      items.push(2);
    } else {
      items.push("ellipsis");
    }
    pushRange(Math.max(totalPages - 2, 2), totalPages);
    return items;
  }

  items.push(1);
  if (currentPage === 3) {
    items.push(2);
  } else {
    items.push("ellipsis");
  }
  items.push(currentPage);
  if (currentPage === totalPages - 2) {
    items.push(totalPages - 1);
  } else {
    items.push("ellipsis");
  }
  items.push(totalPages);
  return items;
}

function PaginationPageSizeSelect({
  value,
  onChange,
  size = "32",
}: {
  value: string;
  onChange: (value: string) => void;
  size?: ButtonSize;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const triggerWidth = getDropdownTriggerWidth(value);
  const menuWidth = getDropdownMenuWidth(pageSizeOptions);
  const isCompact = size === "28";
  const triggerHeightClass = isCompact ? "h-7" : "h-8";
  const triggerPaddingClass = isCompact ? "py-1.5 pl-2 pr-1" : "py-2 pl-2 pr-1";
  const menuTopClass = isCompact ? "top-9" : "top-10";

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        className={cn("relative flex items-center gap-1 rounded-[6px] text-[#f6f6f7]", triggerHeightClass, triggerPaddingClass)}
        style={{ ...buttonTypography, width: triggerWidth, boxSizing: "border-box" }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-[#34343e] to-[#2d2d36]" />
        <span className={cn("absolute inset-0 rounded-[6px] opacity-0 transition-opacity", isHovered && "opacity-100")} style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08))" }} />
        <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
        <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]" />
        <span className="relative whitespace-nowrap">{value}</span>
        <ChevronDown className={cn("relative size-4 shrink-0 text-[#adadb6] transition-transform", isOpen && "rotate-180")} strokeWidth={1.8} />
      </button>

      {isOpen && (
        <div
          className={cn("absolute left-0 z-30 inline-flex flex-col gap-1 rounded-[6px] border border-[rgba(255,255,255,0.04)] bg-[#28282e] p-1", menuTopClass)}
          style={{ width: menuWidth, boxSizing: "border-box", boxShadow: "0 0 2px 0 rgba(0,0,0,0.8)" }}
          role="listbox"
        >
          {pageSizeOptions.map((option) => {
            const isSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={isSelected}
                className="flex h-8 w-full items-center gap-1 rounded-[6px] px-1 text-left text-[#f6f6f7] transition-colors hover:bg-[rgba(255,255,255,0.08)]"
                style={buttonTypography}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                <span className="grid size-4 shrink-0 place-items-center">
                  {isSelected && <Check className="size-4 text-[#f6f6f7]" strokeWidth={1.8} />}
                </span>
                <span className="min-w-0 whitespace-nowrap text-[#f6f6f7]">{option}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PaginationNumberGroup({
  activePage,
  totalPages,
  onChange,
  size = "32",
}: {
  activePage: number;
  totalPages: number;
  onChange: (page: number) => void;
  size?: ButtonSize;
}) {
  const items = getPaginationItems(activePage, totalPages);
  const prevDisabled = activePage <= 1;
  const nextDisabled = activePage >= totalPages;
  const isCompact = size === "28";
  const pageButtonClass =
    isCompact
      ? "inline-flex h-7 min-w-7 items-center justify-center rounded-[6px] px-3 text-[14px] leading-4 transition-colors"
      : "inline-flex h-8 min-w-8 items-center justify-center rounded-[6px] px-3 text-[14px] leading-4 transition-colors";
  const ellipsisClass = isCompact
    ? "grid size-7 place-items-center text-[14px] leading-4 text-[#767683]"
    : "grid size-8 place-items-center text-[14px] leading-4 text-[#767683]";

  return (
    <div className={cn("flex shrink-0 items-center justify-end gap-1", isCompact ? "h-7" : "h-8")}>
      <ComponentIconButton label="上一页" disabled={prevDisabled} size={size} onClick={() => onChange(activePage - 1)}>
        <ChevronLeft className="size-4" strokeWidth={1.8} />
      </ComponentIconButton>
      {items.map((item, index) =>
        typeof item === "number" ? (
          <button
            key={`${item}-${index}`}
            type="button"
            onClick={() => onChange(item)}
            className={cn(
              pageButtonClass,
              item === activePage
                ? "bg-[#3566ec] text-[#f6f6f7] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_0_rgba(255,255,255,0.12)]"
                : "bg-[rgba(255,255,255,0.04)] text-[#adadb6] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#adadb6]"
            )}
            style={buttonTypography}
          >
            {item}
          </button>
        ) : (
          <span key={`${item}-${index}`} className={ellipsisClass} style={buttonTypography}>
            ...
          </span>
        )
      )}
      <ComponentIconButton label="下一页" disabled={nextDisabled} size={size} onClick={() => onChange(activePage + 1)}>
        <ChevronRight className="size-4" strokeWidth={1.8} />
      </ComponentIconButton>
    </div>
  );
}

function PaginationControl({
  activePage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  size = "32",
}: {
  activePage: number;
  totalPages: number;
  pageSize: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string) => void;
  size?: ButtonSize;
}) {
  return (
    <div className="flex items-center gap-2">
      <PaginationPageSizeSelect value={pageSize} onChange={onPageSizeChange} size={size} />
      <PaginationNumberGroup activePage={activePage} totalPages={totalPages} onChange={onPageChange} size={size} />
    </div>
  );
}

function PaginationFrame() {
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState("每页20条");
  const [compactActivePage, setCompactActivePage] = useState(1);
  const [compactPageSize, setCompactPageSize] = useState("每页20条");

  return (
    <div className="flex flex-col gap-4">
      <section className="grid h-[152px] w-[560px] place-items-center rounded-[20px] bg-[#17171a]">
        <PaginationControl
          activePage={activePage}
          totalPages={542}
          pageSize={pageSize}
          onPageChange={setActivePage}
          onPageSizeChange={setPageSize}
        />
      </section>
      <section className="grid h-[124px] w-[500px] place-items-center rounded-[20px] bg-[#17171a]">
        <PaginationControl
          activePage={compactActivePage}
          totalPages={542}
          pageSize={compactPageSize}
          onPageChange={setCompactActivePage}
          onPageSizeChange={setCompactPageSize}
          size="28"
        />
      </section>
    </div>
  );
}

function TrafficPager({
  activePage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  size = "32",
}: {
  activePage: number;
  totalPages: number;
  pageSize: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string) => void;
  size?: ButtonSize;
}) {
  return (
    <div className="ml-auto">
      <PaginationControl
        activePage={activePage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        size={size}
      />
    </div>
  );
}

type ResultDisplayMode = "单行展示" | "展示完整事件";

function ResultDisplayModeSelect({
  value,
  onChange,
  size = "32",
}: {
  value: ResultDisplayMode;
  onChange: (value: ResultDisplayMode) => void;
  size?: ButtonSize;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const options: ResultDisplayMode[] = ["单行展示", "展示完整事件"];
  const triggerWidth = getDropdownTriggerWidth(value);
  const menuWidth = getDropdownMenuWidth(options);
  const isCompact = size === "28";
  const triggerHeightClass = isCompact ? "h-7" : "h-8";
  const triggerPaddingClass = isCompact ? "py-1.5 pl-2 pr-1" : "py-2 pl-2 pr-1";
  const menuTopClass = isCompact ? "top-9" : "top-10";

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        className={cn("relative flex items-center gap-1 rounded-[6px] text-[#f6f6f7]", triggerHeightClass, triggerPaddingClass)}
        style={{ ...buttonTypography, width: triggerWidth }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="absolute inset-0 rounded-[6px] bg-gradient-to-b from-[#34343e] to-[#2d2d36]" />
        <span
          className={cn("absolute inset-0 rounded-[6px] opacity-0", isHovered && "opacity-100")}
          style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08))" }}
        />
        <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
        <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]" />
        <span className="relative whitespace-nowrap">{value}</span>
        <ChevronDown className={cn("relative size-4 shrink-0 text-[#adadb6] transition-transform", isOpen && "rotate-180")} strokeWidth={1.8} />
      </button>

      {isOpen && (
        <div
          className={cn("absolute left-0 z-30 inline-flex flex-col gap-1 rounded-[6px] border border-[rgba(255,255,255,0.04)] bg-[#28282e] p-1", menuTopClass)}
          style={{ width: menuWidth, boxSizing: "border-box", boxShadow: "0 0 2px 0 rgba(0,0,0,0.8)" }}
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={isSelected}
                className="flex h-8 w-full items-center gap-1 rounded-[6px] px-1 text-left text-[#f6f6f7] transition-colors hover:bg-[rgba(255,255,255,0.08)]"
                style={buttonTypography}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                <span className="grid size-4 shrink-0 place-items-center">
                  {isSelected && <Check className="size-4 text-[#f6f6f7]" strokeWidth={1.8} />}
                </span>
                <span className="min-w-0 whitespace-nowrap text-[#f6f6f7]">{option}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TrafficSingleLineEvent({ event }: { event: (typeof trafficSearchEvents)[number] }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollbar, setScrollbar] = useState({ left: 0, width: 100, visible: false });

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const updateScrollbar = () => {
      const maxScroll = content.scrollWidth - content.clientWidth;
      if (maxScroll <= 1) {
        setScrollbar({ left: 0, width: 100, visible: false });
        return;
      }

      const width = (content.clientWidth / content.scrollWidth) * 100;
      const left = (content.scrollLeft / maxScroll) * (100 - width);
      setScrollbar({ left, width, visible: true });
    };

    updateScrollbar();
    content.addEventListener("scroll", updateScrollbar, { passive: true });
    window.addEventListener("resize", updateScrollbar);

    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(content);

    return () => {
      content.removeEventListener("scroll", updateScrollbar);
      window.removeEventListener("resize", updateScrollbar);
      resizeObserver.disconnect();
    };
  }, [event.summary]);

  return (
    <article className="group relative rounded-[6px] border border-[#232328] bg-[#111114] px-3 py-2 transition-colors">
      <div ref={contentRef} className="log-scrollbar overflow-x-auto overflow-y-hidden">
        <div className="flex w-max items-center gap-2">
          <span className="shrink-0 rounded-[4px] bg-[rgba(53,102,236,0.32)] px-1.5 py-[3px] font-mono text-[12px] leading-[14px] text-[#789af9]">{event.time}</span>
          <span className="whitespace-nowrap font-mono text-[12px] leading-4 text-[#d7d7dc]">({event.summary})</span>
        </div>
      </div>
      {scrollbar.visible && (
        <div className="absolute bottom-0.5 left-3 right-3 h-0.5 overflow-hidden rounded-full bg-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <div
            className="h-0.5 rounded-full bg-[#767683]"
            style={{ marginLeft: `${scrollbar.left}%`, width: `${scrollbar.width}%` }}
          />
        </div>
      )}
    </article>
  );
}

function TrafficFullEventPreview({
  event,
  fields,
  onToggle,
}: {
  event: (typeof trafficSearchEvents)[number];
  fields: TrafficResultField[][];
  onToggle: () => void;
}) {
  const visibleFields = fields.flat().filter((field) => field.visible);

  return (
    <article className="group overflow-hidden rounded-[6px] border border-[#232328] bg-[#111114] px-3 py-3 shadow-[0_0_2px_rgba(0,0,0,0.8)] transition-colors hover:bg-[rgba(255,255,255,0.04)]">
      <div className="flex min-w-0 items-start gap-2">
        <button type="button" aria-label="展开事件" className="mt-0.5 grid size-4 shrink-0 place-items-center text-[#767683] hover:text-[#f6f6f7]" onClick={onToggle}>
          <ChevronRight className="size-4" strokeWidth={1.7} />
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            {visibleFields.map((field) => (
              <ResultField key={field.id} field={field} showToggle={false} useNeutralValueColor />
            ))}
          </div>
          <div className="flex min-w-0 items-start gap-2">
            <ResultTimestampTag>{event.time}</ResultTimestampTag>
            <p className="min-w-0 flex-1 break-words pt-0.5 font-mono text-[12px] leading-4 text-[#f6f6f7]">
              {event.summary}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function TrafficResultLine({
  event,
  fields,
  displayMode,
  expanded = false,
  onToggle,
  onFieldToggle,
}: {
  event: (typeof trafficSearchEvents)[number];
  fields: TrafficResultField[][];
  displayMode: ResultDisplayMode;
  expanded?: boolean;
  onToggle: () => void;
  onFieldToggle: (fieldId: string) => void;
}) {
  if (expanded) {
    return (
      <article className="overflow-hidden rounded-[6px] border border-[#232328] bg-[#1f1f24] px-3 py-3 shadow-[0_0_2px_rgba(0,0,0,0.8)]">
        <div className="flex h-4 items-center gap-6 text-[12px] leading-3 text-[#adadb6]" style={{ ...buttonTypography, fontSize: "12px", lineHeight: "12px" }}>
          <button type="button" aria-label="收起事件" className="grid size-4 place-items-center text-[#adadb6] hover:text-[#f6f6f7]" onClick={onToggle}>
            <ChevronDown className="size-4" strokeWidth={1.6} />
          </button>
          {["查看上下文", "实时查看", "配置字段提取", "添加到知识库", "添加动态字段"].map((action) => (
            <button key={action} type="button" className="text-[#f6f6f7] transition-colors hover:text-[#3566ec]">
              {action}
            </button>
          ))}
        </div>

        <div className="mt-4 flex min-w-0 flex-col gap-3 pl-0">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            {fields.flat().map((field) => (
              <ResultField key={field.id} field={field} onToggle={() => onFieldToggle(field.id)} />
            ))}
          </div>
          <div className="flex min-w-0 items-start gap-2 overflow-hidden">
            <ResultFieldTag>raw_message</ResultFieldTag>
            <p className="min-w-0 flex-1 break-words pt-0.5 text-[12px] leading-4 text-[#e0a767]" style={{ ...buttonTypography, fontSize: "12px", lineHeight: "16px" }}>
              {trafficRawMessage}
            </p>
          </div>
        </div>
      </article>
    );
  }

  if (displayMode === "展示完整事件") {
    return <TrafficFullEventPreview event={event} fields={fields} onToggle={onToggle} />;
  }

  return (
    <article className="group relative flex h-11 items-center rounded-[6px] border border-[#232328] bg-[#111114] px-3 shadow-[0_0_2px_rgba(0,0,0,0.8)] transition-colors hover:bg-[rgba(255,255,255,0.04)]">
      <button type="button" aria-label="展开事件" className="mr-2 grid size-4 shrink-0 place-items-center text-[#767683] hover:text-[#f6f6f7]" onClick={onToggle}>
        <ChevronRight className="size-4" strokeWidth={1.7} />
      </button>
      <ResultScrollableLogLine event={event} />
    </article>
  );
}

function SearchSkeletonBlock({
  className,
  background = "rgba(255,255,255,0.06)",
}: {
  className: string;
  background?: string;
}) {
  return <span className={cn("search-skeleton-shimmer block rounded-[4px]", className)} style={{ "--search-skeleton-bg": background } as CSSProperties} />;
}

function TrafficResultsLoadingPage() {
  return (
    <div className="flex w-full min-w-0 flex-col">
      <SearchSkeletonBlock className="h-9 w-[158px]" background="rgba(255,255,255,0.08)" />

      <SearchSkeletonBlock className="mt-2 h-9 w-full" background="rgba(255,255,255,0.04)" />

      <div className="mt-3 flex h-8 items-center gap-2">
        <SearchSkeletonBlock className="h-8 w-[88px]" background="rgba(255,255,255,0.08)" />
        <SearchSkeletonBlock className="h-8 w-[62px]" background="rgba(255,255,255,0.08)" />
        <SearchSkeletonBlock className="h-8 w-[90px]" background="rgba(255,255,255,0.08)" />
      </div>

      <section className="mt-2 flex flex-col gap-2">
        {Array.from({ length: 12 }).map((_, index) => (
          <SearchSkeletonBlock key={index} className="h-11 w-full" background="rgba(255,255,255,0.02)" />
        ))}
      </section>
    </div>
  );
}

function TrafficResultsListLoading({
  rowCount,
}: {
  rowCount: number;
}) {
  return (
    <section className="mt-3 flex flex-col gap-2">
      {Array.from({ length: rowCount }).map((_, index) => (
        <article
          key={index}
          className="overflow-hidden rounded-[6px] border border-[#232328] bg-[#111114] px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <SearchSkeletonBlock className="size-4 rounded-[4px]" background="rgba(255,255,255,0.08)" />
            <SearchSkeletonBlock className="h-5 w-[168px]" background="rgba(207,117,255,0.32)" />
            <SearchSkeletonBlock className="h-4 flex-1" background="rgba(255,255,255,0.08)" />
          </div>
        </article>
      ))}
    </section>
  );
}

function TrafficResultsPage({
  timeRange,
  onTimeRangeCommit,
}: {
  timeRange: TimeRangeSelection;
  onTimeRangeCommit: (value: TimeRangeSelection) => void;
}) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(() => new Set());
  const [displayMode, setDisplayMode] = useState<ResultDisplayMode>("单行展示");
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState("每页20条");
  const [isListLoading, setIsListLoading] = useState(false);
  const [fields, setFields] = useState<TrafficResultField[][]>(() =>
    trafficResultFieldRows.map((row) => row.map((field) => ({ ...field })))
  );
  const listLoadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rowsPerPage = pageSize === "每页40条" ? 40 : 20;
  const visibleEvents = Array.from({ length: rowsPerPage }, (_, index) => {
    const baseEvent = trafficSearchEvents[(index + (activePage - 1) * rowsPerPage) % trafficSearchEvents.length];
    return {
      ...baseEvent,
      time: baseEvent.time,
      summary: baseEvent.summary,
    };
  });

  useEffect(() => {
    return () => {
      if (listLoadingTimerRef.current) {
        clearTimeout(listLoadingTimerRef.current);
      }
    };
  }, []);

  const triggerListLoading = (nextPage: number, nextPageSize = pageSize) => {
    if (listLoadingTimerRef.current) {
      clearTimeout(listLoadingTimerRef.current);
    }

    setIsListLoading(true);
    setExpandedRows(new Set());
    listLoadingTimerRef.current = setTimeout(() => {
      setActivePage(nextPage);
      setPageSize(nextPageSize);
      setIsListLoading(false);
      listLoadingTimerRef.current = null;
    }, 1200);
  };

  const toggleRow = (index: number) => {
    setExpandedRows((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };
  const toggleField = (fieldId: string) => {
    setFields((current) =>
      current.map((row) =>
        row.map((field) => (field.id === fieldId ? { ...field, visible: !field.visible } : field))
      )
    );
  };

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div className="flex h-9 items-center justify-between">
        <div className="flex items-center">
          <div className="inline-flex h-9 w-fit items-center gap-2 rounded-[8px] bg-[#20346f] px-2 text-[#f6f6f7]">
            <span className="whitespace-nowrap text-[14px] font-semibold leading-[14px]">事件总数</span>
            <span
              className="whitespace-nowrap text-[18px] font-semibold leading-[18px]"
              style={{ fontFamily: '"LogEaseNumber", "Avenir Next", sans-serif', fontWeight: 600 }}
            >
              3172
            </span>
          </div>
        </div>
        <TimeRangePicker className="w-fit shrink-0" value={timeRange} onCommit={onTimeRangeCommit} />
      </div>

      <div className="mt-3 rounded-[4px] bg-[#17171a] px-4 pb-2">
        <div className="relative -mx-4 flex items-end px-4 pb-0">
          <span className="absolute bottom-0 left-0 h-px w-full bg-[#232328]" />
          <TrafficResultTabs />
        </div>

        <div className="mt-3 flex h-7 items-center gap-2">
          <ResultDisplayModeSelect value={displayMode} onChange={setDisplayMode} size="28" />
          <DownloadIconButton size="28" />
          <DisplayConfigButton size="28" />
          <TrafficPager
            activePage={activePage}
            totalPages={542}
            pageSize={pageSize}
            size="28"
            onPageChange={(nextPage) => {
              if (nextPage === activePage || isListLoading) return;
              triggerListLoading(nextPage);
            }}
            onPageSizeChange={(nextPageSize) => {
              if (nextPageSize === pageSize || isListLoading) return;
              triggerListLoading(1, nextPageSize);
            }}
          />
        </div>

        {isListLoading ? (
          <TrafficResultsListLoading rowCount={rowsPerPage} />
        ) : (
          <section className="mt-3 flex flex-col gap-2">
            {visibleEvents.map((event, index) => (
              <TrafficResultLine
                key={`${activePage}-${pageSize}-${index}`}
                event={event}
                fields={fields}
                displayMode={displayMode}
                expanded={expandedRows.has(index)}
                onToggle={() => toggleRow(index)}
                onFieldToggle={toggleField}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

function TrafficSearchPage({
  searchQuery,
  onSearchComplete,
  isLoading,
  timeRange,
  onTimeRangeCommit,
}: {
  searchQuery: string;
  onSearchComplete: (query: string) => void;
  isLoading: boolean;
  timeRange: TimeRangeSelection;
  onTimeRangeCommit: (value: TimeRangeSelection) => void;
}) {
  const [keyword, setKeyword] = useState("");
  const [historyItems, setHistoryItems] = useState(newSearchHistoryItems);
  const [isSearchGuideOpen, setIsSearchGuideOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isInputHovered, setIsInputHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const phase: InputPhase = isInputFocused ? "typing" : keyword ? "complete" : isInputHovered ? "hover" : "default";
  const isSearchDisabled = !keyword.trim();
  const panelVisual = isInputFocused
    ? visual.typing
    : {
        borderColor: "#232328",
        boxShadow: "0 0 2px 0 rgba(0,0,0,0.8)",
      };
  const panelBackgroundColor = isInputFocused ? "rgba(33,33,38,0.2)" : "rgba(33,33,38,0.6)";

  useEffect(() => {
    if (!searchQuery) {
      setKeyword("");
    }
  }, [searchQuery]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "24px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [keyword]);

  if (searchQuery) {
    if (isLoading) {
      return <TrafficResultsLoadingPage />;
    }

    return <TrafficResultsPage timeRange={timeRange} onTimeRangeCommit={onTimeRangeCommit} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1216px] min-w-0 pt-[22px]">
      <div className="ml-[169px] flex w-[800px] min-w-0 flex-col">
        <div className="flex h-8 items-start justify-between">
          <h2 className="pt-1.5 text-[20px] font-normal leading-5 text-[#f6f6f7]">
            新搜索
          </h2>
          <TimeRangePicker className="w-fit shrink-0" value={timeRange} onCommit={onTimeRangeCommit} />
        </div>

        <section
          className="mt-2 w-[800px] rounded-[6px] border px-4 pb-2 pt-4 transition-colors"
          style={{
            borderColor: panelVisual.borderColor,
            boxShadow: panelVisual.boxShadow,
            backgroundColor: panelBackgroundColor,
          }}
          onMouseEnter={() => setIsInputHovered(true)}
          onMouseLeave={() => setIsInputHovered(false)}
        >
          <label className="flex w-full text-[16px] leading-6">
            <textarea
              ref={textareaRef}
              rows={1}
              className="min-h-6 w-full resize-none overflow-hidden bg-transparent p-0 text-[16px] leading-6 text-[#f6f6f7] outline-none placeholder:text-[#767683]"
              placeholder="请输入搜索字段"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
          </label>

          <div className="mt-6 flex min-h-7 items-center">
            <div className="flex items-center gap-2">
              {newSearchToolActions.map((action) => (
                <NewSearchToolButton
                  key={action.label}
                  label={action.label}
                  icon={action.icon}
                  onClick={action.label === "搜索指南" ? () => setIsSearchGuideOpen(true) : undefined}
                />
              ))}
            </div>
            <div className="ml-auto">
              <DesignButton
                size="28"
                variant="primary"
                disabled={isSearchDisabled}
                onClick={() => onSearchComplete(keyword.trim())}
              >
                搜索
              </DesignButton>
            </div>
          </div>
        </section>

        <section className="mt-[34px]">
          <h3 className="text-[14px] font-normal leading-4 text-[#767683]" style={buttonTypography}>搜索历史</h3>
          <div className="mt-2 flex w-[800px] flex-wrap gap-x-2 gap-y-2">
            {historyItems.map((item, index) => (
              <SearchHistoryPill
                key={`${item}-${index}`}
                label={item}
                onSelect={() => setKeyword(item)}
                onRemove={() => setHistoryItems((items) => items.filter((_, itemIndex) => itemIndex !== index))}
              />
            ))}
          </div>
        </section>
      </div>
      {isSearchGuideOpen && <SearchGuideModal onClose={() => setIsSearchGuideOpen(false)} />}
    </div>
  );
}

function DashboardContentGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto grid w-full min-w-[1200px] max-w-[2560px] grid-cols-[repeat(24,minmax(0,1fr))] gap-4 px-4">{children}</div>;
}

function DashboardContentGridItem({
  span = 24,
  start,
  className,
  children,
}: {
  span?: number;
  start?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("min-w-0", className)}
      style={{ gridColumn: start ? `${start} / span ${span}` : `span ${span} / span ${span}` }}
    >
      {children}
    </div>
  );
}

function UnderlineTabs({
  tabs = [
    { label: "选项一", width: 42 },
    { label: "这里是选项二", width: 84 },
    { label: "选项三", width: 42 },
  ],
  activeIndex,
  onChange,
  gapClassName = "gap-4",
  heightClassName = "h-10",
  buttonHeightClassName = "h-10",
  labelClassName = "top-3 text-[14px] leading-4",
  activeColor = "#f6f6f7",
  inactiveColor = "#adadb6",
  showBaseLine = true,
}: {
  tabs?: Array<{ label: string; width?: number }>;
  activeIndex?: number;
  onChange?: (index: number) => void;
  gapClassName?: string;
  heightClassName?: string;
  buttonHeightClassName?: string;
  labelClassName?: string;
  activeColor?: string;
  inactiveColor?: string;
  showBaseLine?: boolean;
}) {
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const currentActiveIndex = activeIndex ?? internalActiveIndex;

  return (
    <div className={cn("relative w-fit", heightClassName)}>
      {showBaseLine && <span className="absolute bottom-0 left-0 h-px w-full bg-[#232328]" />}
      <div className={cn("relative z-10 flex items-start", heightClassName, gapClassName)}>
        {tabs.map((tab, index) => {
          const selected = index === currentActiveIndex;
          const hasFixedWidth = typeof tab.width === "number";

          return (
            <button
              key={tab.label}
              type="button"
              className={cn("relative shrink-0", buttonHeightClassName, !hasFixedWidth && "flex items-start")}
              style={tab.width ? { width: tab.width } : undefined}
              onClick={() => {
                if (activeIndex === undefined) {
                  setInternalActiveIndex(index);
                }
                onChange?.(index);
              }}
            >
              <span
                className={cn(hasFixedWidth ? "absolute left-0" : "relative", "whitespace-nowrap", labelClassName)}
                style={{ ...buttonTypography, color: selected ? activeColor : inactiveColor }}
              >
                {tab.label}
              </span>
              {selected && <span className="absolute bottom-0 left-0 h-px w-full bg-[#f6f6f7]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SegmentedTabs({
  tabs = ["选项一", "选项二", "多个字选项"],
  activeIndex,
  onChange,
  size = "32",
}: {
  tabs?: string[];
  activeIndex?: number;
  onChange?: (index: number) => void;
  size?: "28" | "32";
}) {
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const currentActiveIndex = activeIndex ?? internalActiveIndex;

  const handleChange = (index: number) => {
    if (onChange) {
      onChange(index);
      return;
    }

    setInternalActiveIndex(index);
  };

  return (
    <div className={cn("relative inline-flex w-fit items-center rounded-[6px]", size === "28" ? "h-7" : "h-8")}>
      <span className="pointer-events-none absolute inset-0 rounded-[6px] shadow-[inset_0_0_0_1px_#52525c]" />
      <div className="relative m-[2px] flex h-[calc(100%-4px)] items-center gap-[2px]">
        {tabs.map((tab, index) => {
          const selected = index === currentActiveIndex;
          const hovered = hoveredIndex === index;

          return (
            <button
              key={tab}
              type="button"
              className="relative flex h-full shrink-0 items-center justify-center rounded-[4px] px-4"
              style={{
                ...buttonTypography,
                backgroundColor: selected ? "#4c4c59" : hovered ? "#27272d" : "transparent",
                color: selected ? "#f6f6f7" : "#adadb6",
              }}
              onClick={() => handleChange(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
            >
              <span className="whitespace-nowrap">{tab}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TabsFrame() {
  return (
    <section className="grid h-[152px] w-[320px] place-items-center rounded-[20px] bg-[#17171a] px-8">
      <div className="flex flex-col items-center gap-6">
        <UnderlineTabs />
        <SegmentedTabs />
      </div>
    </section>
  );
}

function ModalShell({
  withFooter = true,
  width = 400,
}: {
  withFooter?: boolean;
  width?: number;
}) {
  const contentMinHeight = withFooter ? 160 : 208;

  return (
    <div className="flex flex-col rounded-[12px] border border-[rgba(255,255,255,0.04)] bg-[#212126] shadow-[0_0_1px_rgba(0,0,0,0.8)]" style={{ width }}>
      <div className="flex h-12 w-full shrink-0 items-center justify-between rounded-t-[12px] border-b border-[rgba(255,255,255,0.04)] px-4">
        <h3 className="h-4 text-[16px] font-semibold leading-[18px] text-[#f6f6f7]">Modal 标题</h3>
        {!withFooter && (
          <button type="button" aria-label="关闭弹窗" className="grid size-4 place-items-center text-[#adadb6] transition-colors hover:text-[#f6f6f7]">
            <X className="size-4" strokeWidth={1.6} />
          </button>
        )}
      </div>
      <div className="w-full p-4">
        <div
          className="flex w-full items-center justify-center bg-[rgba(255,255,255,0.04)] text-[14px] leading-4 text-[rgba(255,255,255,0.24)]"
          style={{ minHeight: contentMinHeight }}
        >
          内容区域
        </div>
      </div>
      {withFooter && (
        <div className="flex h-12 w-full shrink-0 items-center justify-end gap-2 rounded-b-[12px] border-t border-[rgba(255,255,255,0.04)] px-4">
          <DesignButton>取消</DesignButton>
          <DesignButton variant="primary">确认</DesignButton>
        </div>
      )}
    </div>
  );
}

function ModalFrame() {
  const [visibleModal, setVisibleModal] = useState<"footer" | "plain" | null>("footer");
  const [modalSize, setModalSize] = useState<"small" | "large">("small");
  const modalTabs = ["带底部按钮", "无底部按钮"];
  const sizeTabs = ["大尺寸", "小尺寸"];
  const activeModalIndex = visibleModal === "plain" ? 1 : 0;
  const activeSizeIndex = modalSize === "large" ? 0 : 1;
  const modalWidth = modalSize === "large" ? 640 : 400;

  return (
    <section className="relative h-[440px] w-[760px] rounded-[20px] bg-[#17171a]">
      <div className="absolute left-1/2 top-10 -translate-x-1/2">
        <SegmentedTabs
          tabs={modalTabs}
          activeIndex={activeModalIndex}
          onChange={(index) => setVisibleModal(index === 0 ? "footer" : "plain")}
        />
      </div>
      <div className="absolute left-1/2 top-20 -translate-x-1/2">
        <SegmentedTabs tabs={sizeTabs} activeIndex={activeSizeIndex} onChange={(index) => setModalSize(index === 0 ? "large" : "small")} />
      </div>
      {visibleModal && (
        <div className="absolute left-1/2 top-32 -translate-x-1/2">
          <ModalShell withFooter={visibleModal === "footer"} width={modalWidth} />
        </div>
      )}
    </section>
  );
}

function AlertDialogCard({
  description,
  height,
}: {
  description: string;
  height: number;
}) {
  return (
    <div className="w-[410px] rounded-[12px] border border-[rgba(255,255,255,0.04)] bg-[#212126] shadow-[0_0_1px_rgba(0,0,0,0.8)]" style={{ height }}>
      <div className="flex h-full flex-col px-6 py-6">
        <div className="w-[362px]">
          <h3 className="text-[16px] font-semibold leading-[18px] text-[#f6f6f7]">确认删除该内容？</h3>
          <p className="mt-4 w-[362px] break-words text-[14px] leading-5 text-[#676772]">{description}</p>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <DesignButton>取消</DesignButton>
          <DesignButton variant="primary">确认</DesignButton>
        </div>
      </div>
    </div>
  );
}

function AlertDialogFrame() {
  return (
    <section className="h-[372px] w-[450px] rounded-[20px] bg-[#17171a] p-5">
      <div className="flex flex-col gap-[10px]">
        <AlertDialogCard height={156} description="删除后无法恢复，请谨慎删除" />
        <AlertDialogCard height={176} description="删除后无法恢复，请谨慎删除删除后无法恢复，请谨慎删除删除后无法恢复，请谨慎删除" />
      </div>
    </section>
  );
}

type GlobalToastTone = "success" | "info" | "error" | "warning";

type GlobalToastItem = {
  id: number;
  tone: GlobalToastTone;
  message: string;
};

const globalToastPresets: Array<Pick<GlobalToastItem, "tone" | "message">> = [
  { tone: "success", message: "这里是一句成功提示" },
  { tone: "info", message: "这里是一句提示" },
  { tone: "error", message: "这里是错误提示" },
  { tone: "warning", message: "这里是警告提示" },
];

const globalToastToneStyles: Record<
  GlobalToastTone,
  { background: string; icon: string; shadow: string }
> = {
  success: {
    background: "rgba(53, 236, 172, 0.04)",
    icon: toastSuccessSvg,
    shadow: "inset 0 0 12px rgba(53, 236, 172, 0.20)",
  },
  info: {
    background: "rgba(53, 102, 236, 0.04)",
    icon: toastInfoSvg,
    shadow: "inset 0 0 12px rgba(53, 102, 236, 0.32)",
  },
  error: {
    background: "rgba(236, 53, 53, 0.04)",
    icon: toastErrorSvg,
    shadow: "inset 0 0 12px rgba(236, 53, 53, 0.20)",
  },
  warning: {
    background: "rgba(236, 224, 53, 0.04)",
    icon: toastWarningSvg,
    shadow: "inset 0 0 12px rgba(236, 224, 53, 0.20)",
  },
};

function GlobalToast({
  item,
  onDone,
}: {
  item: GlobalToastItem;
  onDone: (id: number) => void;
}) {
  const [visible, setVisible] = useState(false);
  const onDoneRef = useRef(onDone);
  const toneStyle = globalToastToneStyles[item.tone];

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setVisible(true), 16);
    const exitTimer = window.setTimeout(() => setVisible(false), 2800);
    const removeTimer = window.setTimeout(() => onDoneRef.current(item.id), 3000);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, [item.id]);

  return (
    <div
      className="global-toast-motion flex h-10 w-fit self-center items-center rounded-[6px] pl-2 pr-4"
      data-visible={visible}
      style={{
        backgroundColor: toneStyle.background,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        boxShadow: toneStyle.shadow,
      }}
    >
      <RawSvgIcon svg={toneStyle.icon} className="size-4 shrink-0" useCurrentColor={false} />
      <span className="ml-2 whitespace-nowrap text-[14px] leading-4 text-[#f6f6f7]" style={buttonTypography}>
        {item.message}
      </span>
    </div>
  );
}

function GlobalToastViewport({
  items,
  onDone,
}: {
  items: GlobalToastItem[];
  onDone: (id: number) => void;
}) {
  if (!items.length) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed left-0 right-0 top-4 z-[1000] flex flex-col items-center gap-4">
      {items.map((item) => (
        <GlobalToast key={item.id} item={item} onDone={onDone} />
      ))}
    </div>,
    document.body
  );
}

function GlobalToastFrame() {
  const [items, setItems] = useState<GlobalToastItem[]>([]);
  const nextToastIndexRef = useRef(0);
  const nextToastIdRef = useRef(1);

  const enqueueToast = () => {
    const preset = globalToastPresets[nextToastIndexRef.current % globalToastPresets.length];
    const nextItem: GlobalToastItem = {
      id: nextToastIdRef.current,
      tone: preset.tone,
      message: preset.message,
    };

    nextToastIdRef.current += 1;
    nextToastIndexRef.current += 1;
    setItems((current) => [...current, nextItem]);
  };

  const removeToast = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <>
      <section className="grid h-[180px] w-[240px] place-items-center rounded-[20px] bg-[#17171a]">
        <DesignButton onClick={enqueueToast}>全局提示</DesignButton>
      </section>
      <GlobalToastViewport items={items} onDone={removeToast} />
    </>
  );
}

type TableStatus = "online" | "offline";
type SortState = "none" | "asc" | "desc";
type TagTone = "neutral" | "blue" | "green" | "yellow" | "red";

const tableRows: Array<{
  id: number;
  name: string;
  category: string;
  content: string;
  status: TableStatus;
}> = [
  { id: 1, name: "这里是名称", category: "付费客户", content: "内容描述", status: "online" },
  { id: 2, name: "这里是名称", category: "付费客户", content: "内容描述", status: "offline" },
  { id: 3, name: "这里是名称", category: "付费客户", content: "内容描述", status: "offline" },
  { id: 4, name: "这里是名称", category: "付费客户", content: "内容描述", status: "online" },
  { id: 5, name: "这里是名称", category: "付费客户", content: "内容描述", status: "online" },
  { id: 6, name: "这里是名称", category: "付费客户", content: "内容描述", status: "online" },
  { id: 7, name: "这里是名称", category: "付费客户", content: "内容描述", status: "offline" },
  { id: 8, name: "这里是名称", category: "付费客户", content: "内容描述", status: "offline" },
  { id: 9, name: "这里是名称", category: "付费客户", content: "内容描述", status: "offline" },
  { id: 10, name: "这里是名称", category: "付费客户", content: "内容描述", status: "offline" },
];

const tagTones: Record<TagTone, { background: string; border: string; text: string }> = {
  neutral: { background: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.08)", text: "#adadb6" },
  blue: { background: "rgba(53,102,236,0.32)", border: "rgba(255,255,255,0.08)", text: "#789af9" },
  green: { background: "rgba(53,236,172,0.32)", border: "rgba(255,255,255,0.08)", text: "#68f1c1" },
  yellow: { background: "rgba(236,224,53,0.32)", border: "rgba(255,255,255,0.08)", text: "#f1e860" },
  red: { background: "rgba(236,53,53,0.32)", border: "rgba(255,255,255,0.08)", text: "#f68888" },
};

function Tag({
  tone,
  children,
  withIcon = false,
}: {
  tone: TagTone;
  children: React.ReactNode;
  withIcon?: boolean;
}) {
  const colors = tagTones[tone];

  return (
    <span
      className="inline-flex h-5 min-h-5 min-w-12 items-center justify-center rounded-[4px] border px-1.5 py-[3px] text-center text-[12px] leading-[14px]"
      style={{
        ...buttonTypography,
        fontSize: "12px",
        lineHeight: "14px",
        backgroundColor: colors.background,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      {withIcon && <TagIconGlyph className="mr-[3px] size-[10px] shrink-0" strokeWidth={1.7} />}
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
}

function StatusTag({ status }: { status: TableStatus }) {
  return <Tag tone={status === "online" ? "green" : "red"}>{status === "online" ? "在线" : "离线"}</Tag>;
}

function SortIcon({ state }: { state: SortState }) {
  return (
    <span
      className="block size-4 shrink-0"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: sortSvgForState(state) }}
    />
  );
}

function StatusFilterDropdown({
  selected,
  onSelect,
}: {
  selected: "all" | TableStatus;
  onSelect: (value: "all" | TableStatus) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredValue, setHoveredValue] = useState<"all" | TableStatus | null>(null);
  const options: Array<{ label: string; value: "all" | TableStatus }> = [
    { label: "全部", value: "all" },
    { label: "在线", value: "online" },
    { label: "离线", value: "offline" },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative flex h-10 items-center">
      <button
        type="button"
        className="flex items-center gap-[2px] text-left text-[14px] leading-[14px] text-[#adadb6]"
        style={buttonTypography}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="whitespace-nowrap">状态</span>
        <RawSvgIcon
          svg={filterSvg}
          className={cn("size-4 shrink-0", selected === "all" ? "text-[#adadb6]" : "text-[#3566ec]")}
        />
      </button>
      {isOpen && (
        <div
          className="absolute left-[38px] top-2 z-40 h-[88px] w-14 rounded-[8px] border border-[rgba(255,255,255,0.04)] bg-[#28282e] p-1"
          style={{ boxShadow: "0 0 4px 0 rgba(0,0,0,0.56)" }}
          role="listbox"
        >
          <div className="flex flex-col gap-1">
            {options.map((option) => {
              const isSelected = option.value === selected;
              const isHovered = hoveredValue === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className="flex h-6 items-center justify-center rounded-[6px] px-3 text-center transition-colors"
                  style={{
                    fontSize: "12px",
                    lineHeight: "12px",
                    backgroundColor: isSelected || isHovered ? "rgba(255,255,255,0.08)" : "transparent",
                    color: isSelected ? "#f6f6f7" : "#adadb6",
                  }}
                  onMouseEnter={() => setHoveredValue(option.value)}
                  onMouseLeave={() => setHoveredValue((current) => (current === option.value ? null : current))}
                  onClick={() => {
                    onSelect(option.value);
                    setIsOpen(false);
                  }}
                >
                  <span className="whitespace-nowrap">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function TableFrame() {
  const [sortState, setSortState] = useState<SortState>("none");
  const [statusFilter, setStatusFilter] = useState<"all" | TableStatus>("all");

  const rows = tableRows
    .filter((row) => (statusFilter === "all" ? true : row.status === statusFilter))
    .sort((a, b) => {
      if (sortState === "none") return a.id - b.id;
      return sortState === "asc" ? a.id - b.id : b.id - a.id;
    });

  const cycleSortState = () => {
    setSortState((current) => (current === "none" ? "asc" : current === "asc" ? "desc" : "none"));
  };

  return (
    <section className="w-[758px] rounded-[20px] bg-[#17171a] px-7 py-[22px]">
      <div className="rounded-[20px] bg-[#17171a] p-[10px]">
        <div className="w-full rounded-[6px] bg-[#17171a]">
          <div className="overflow-x-auto rounded-[6px]">
            <div className="min-w-[675px]">
              <div
                className="grid h-10 rounded-t-[6px] border border-[#232328] bg-[#30333c]"
                style={{ gridTemplateColumns: "148fr 126fr 126fr 149fr 106fr" }}
              >
                <button type="button" className="flex items-center gap-[2px] pl-5 text-left text-[14px] leading-[14px] text-[#adadb6]" style={buttonTypography} onClick={cycleSortState}>
                  <span>名称</span>
                  <SortIcon state={sortState} />
                </button>
                <div className="flex items-center text-[14px] leading-[14px] text-[#adadb6]" style={buttonTypography}>
                  分类
                </div>
                <div className="flex items-center text-[14px] leading-[14px] text-[#adadb6]" style={buttonTypography}>
                  内容
                </div>
                <StatusFilterDropdown selected={statusFilter} onSelect={setStatusFilter} />
                <div className="flex items-center text-[14px] leading-[14px] text-[#adadb6]" style={buttonTypography}>
                  操作
                </div>
              </div>

              {rows.map((row) => (
                <div
                  key={row.id}
                  className="grid h-10 border border-t-0 border-[#232328] bg-[#17171a] transition-colors hover:bg-[rgba(255,255,255,0.08)]"
                  style={{ gridTemplateColumns: "148fr 126fr 126fr 149fr 106fr" }}
                >
                  <div className="flex items-center pl-5 text-[14px] leading-4 text-[#f6f6f7]" style={buttonTypography}>
                    {row.name}
                  </div>
                  <div className="flex items-center text-[14px] leading-4 text-[#f6f6f7]" style={buttonTypography}>
                    {row.category}
                  </div>
                  <div className="flex items-center text-[14px] leading-4 text-[#f6f6f7]" style={buttonTypography}>
                    {row.content}
                  </div>
                  <div className="flex items-center">
                    <StatusTag status={row.status} />
                  </div>
                  <div className="flex items-center gap-5 text-[14px] leading-4" style={buttonTypography}>
                    <button type="button" className="text-[#6e93f8]">
                      编辑
                    </button>
                    <button type="button" className="text-[#f15252]">
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TagFrame() {
  return (
    <section className="h-[440px] w-[500px] rounded-[20px] bg-[#17171a]">
      <div className="flex h-full items-center justify-center px-[149px]">
        <div className="flex gap-[93px]">
          <div className="flex flex-col gap-2">
            <Tag tone="neutral">标签项</Tag>
            <Tag tone="blue">标签项</Tag>
            <Tag tone="green">标签项</Tag>
            <Tag tone="yellow">标签项</Tag>
            <Tag tone="red">标签项</Tag>
          </div>
          <div className="flex flex-col gap-2">
            <Tag tone="neutral" withIcon>
              标签项
            </Tag>
            <Tag tone="blue" withIcon>
              标签项
            </Tag>
            <Tag tone="green" withIcon>
              标签项
            </Tag>
            <Tag tone="yellow" withIcon>
              标签项
            </Tag>
            <Tag tone="red" withIcon>
              标签项
            </Tag>
          </div>
        </div>
      </div>
    </section>
  );
}

const formStepLabels = ["第一步", "这里是第二步", "第三步名称", "第四步", "第五步名称"];
const formStepNumberSvgs = [stepNumber1Svg, stepNumber2Svg, stepNumber3Svg, stepNumber4Svg, stepNumber5Svg];

function FormSteps() {
  const [currentStep, setCurrentStep] = useState(0);

  const goBack = () => {
    setCurrentStep((step) => Math.max(0, step - 1));
  };

  const goForward = () => {
    if (currentStep < formStepLabels.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="inline-flex w-fit items-center gap-px rounded-[6px] p-0.5 shadow-[inset_0_0_0_1px_#52525c]">
        {formStepLabels.map((label, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;
          const iconColor = active || completed ? "#F6F6F7" : "#768383";
          const stepNumberSvg = formStepNumberSvgs[index];

          return (
            <div
              key={label}
              className={cn(
                "flex h-8 w-fit items-center gap-0 pr-3 text-[14px] leading-4",
                index === 0 && "rounded-l-[4px]",
                index === formStepLabels.length - 1 && "rounded-r-[4px]",
                completed ? "bg-[rgba(53,102,236,0.32)] text-[#f6f6f7]" : active ? "bg-[#3566ec] text-[#f6f6f7]" : "bg-[rgba(33,33,38,0.6)] text-[#767683]"
              )}
              style={buttonTypography}
            >
              {completed ? (
                <span
                  className="ml-1 mr-0 flex size-4 shrink-0 items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: svgToFillColor(stepCompletedSvg, iconColor) }}
                />
              ) : (
                <span
                  className="ml-1 mr-0 flex size-4 shrink-0 items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: svgToFillColor(stepNumberSvg, iconColor) }}
                />
              )}
              <span className="whitespace-nowrap">{label}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        {currentStep > 0 && <DesignButton onClick={goBack}>上一步</DesignButton>}
        <DesignButton variant="primary" onClick={goForward}>
          {currentStep === formStepLabels.length - 1 ? "完成" : "下一步"}
        </DesignButton>
      </div>
    </div>
  );
}

function FormStepsFrame() {
  return (
    <section className="flex min-h-[180px] w-fit min-w-[620px] items-center justify-center rounded-[20px] bg-[#17171a] px-10 py-8">
      <FormSteps />
    </section>
  );
}

const timeRangePresets = ["最近15分钟", "最近1小时", "最近3小时", "最近24小时", "最近3天", "最近1周", "所有时间"];
const calendarWeekdays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const calendarToday = "2026-06-18";

const padNumber = (value: number) => String(value).padStart(2, "0");
const formatCalendarDate = (date: Date) => `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
const parseCalendarDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};
const formatDateInput = (value: string) => value.replaceAll("-", " / ");
const formatRangeTriggerDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return `${year}.${month}.${day}`;
};
const formatRangeTriggerLabel = ({ start, end, startTime, endTime }: { start: string; end: string; startTime: string; endTime: string }) =>
  `${formatRangeTriggerDate(start)} ${startTime}–${formatRangeTriggerDate(end)} ${endTime}`;
const isSameCalendarDay = (left: string, right: string) => left === right;
const isCalendarDateBetween = (value: string, start: string, end: string) => value > start && value < end;
const calendarNow = { date: "2026-06-18", time: "22:12" };
const timeToMinutes = (value: string) => {
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number(hours || 0) * 60 + Number(minutes || 0);
};
const compareDateTime = (leftDate: string, leftTime: string, rightDate: string, rightTime: string) =>
  leftDate === rightDate ? timeToMinutes(leftTime) - timeToMinutes(rightTime) : leftDate.localeCompare(rightDate);

function buildCalendarDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDayOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  return Array.from({ length: firstDayOffset + daysInMonth }, (_, index) => {
    const day = index - firstDayOffset + 1;
    if (day < 1) {
      return null;
    }
    const date = new Date(year, monthIndex, day);
    return { date, value: formatCalendarDate(date) };
  });
}

function chunkCalendarRows<T>(items: T[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, index * size + size));
}

type TimeRangeSelection = {
  preset: string;
  range: {
    start: string;
    end: string;
    startTime: string;
    endTime: string;
  };
};

const defaultTimeRangeSelection: TimeRangeSelection = {
  preset: "最近24小时",
  range: {
    start: "2026-06-18",
    end: "2026-06-18",
    startTime: "00:00",
    endTime: "22:12",
  },
};

function CompactDateDisplay({ value }: { value: string }) {
  return (
    <div className="flex h-8 w-[124px] items-center justify-center rounded-[6px] border border-[rgba(255,255,255,0.04)] bg-[rgba(33,33,38,0.6)] px-2 text-[14px] leading-4 text-[#adadb6]">
      {formatDateInput(value)}
    </div>
  );
}

function CompactTimeInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [hours = "00", minutes = "00"] = value.split(":");
  const updateSegment = (segment: "hours" | "minutes", rawValue: string) => {
    const digits = rawValue.replace(/\D/g, "").slice(0, 2);
    const max = segment === "hours" ? 24 : 59;
    const nextValue = digits === "" ? "" : String(Math.min(Number(digits), max));
    if (segment === "hours") {
      onChange(`${nextValue}:${nextValue === "24" ? "00" : minutes}`);
      return;
    }
    onChange(`${hours}:${hours === "24" ? "00" : nextValue}`);
  };
  const normalizeSegment = (segment: "hours" | "minutes", rawValue: string) => {
    const max = segment === "hours" ? 24 : 59;
    const nextValue = padNumber(Math.min(Number(rawValue || 0), max));
    if (segment === "hours") {
      onChange(`${nextValue}:${nextValue === "24" ? "00" : minutes}`);
      return;
    }
    onChange(`${hours}:${hours === "24" ? "00" : nextValue}`);
  };

  return (
    <div className="flex h-8 w-[72px] items-center justify-center gap-1 rounded-[6px] border border-[#52525c] bg-[rgba(33,33,38,0.6)] text-[14px] leading-4 text-[#adadb6] shadow-[0_0_2px_0_rgba(0,0,0,0.8)]">
      <input
        type="text"
        inputMode="numeric"
        value={hours}
        aria-label="小时"
        className="h-[18px] w-[19px] rounded-[2px] bg-transparent text-center outline-none focus:bg-[#3566ec] focus:text-[#f6f6f7]"
        onFocus={(event) => event.currentTarget.select()}
        onChange={(event) => updateSegment("hours", event.target.value)}
        onBlur={(event) => normalizeSegment("hours", event.target.value)}
      />
      <span>:</span>
      <input
        type="text"
        inputMode="numeric"
        value={minutes}
        aria-label="分钟"
        className="h-[18px] w-[19px] rounded-[2px] bg-transparent text-center outline-none focus:bg-[#3566ec] focus:text-[#f6f6f7]"
        onFocus={(event) => event.currentTarget.select()}
        onChange={(event) => updateSegment("minutes", event.target.value)}
        onBlur={(event) => normalizeSegment("minutes", event.target.value)}
      />
    </div>
  );
}

function TimeRangePicker({
  className = "w-[460px]",
  value,
  onCommit,
}: {
  className?: string;
  value?: TimeRangeSelection;
  onCommit?: (value: TimeRangeSelection) => void;
}) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(value?.preset ?? defaultTimeRangeSelection.preset);
  const [committedPreset, setCommittedPreset] = useState(value?.preset ?? defaultTimeRangeSelection.preset);
  const [committedRange, setCommittedRange] = useState(value?.range ?? defaultTimeRangeSelection.range);
  const [draftRange, setDraftRange] = useState(value?.range ?? defaultTimeRangeSelection.range);
  const [viewMonth, setViewMonth] = useState(new Date(2026, 5, 1));
  const [selectingEnd, setSelectingEnd] = useState(false);
  const calendarDays = buildCalendarDays(viewMonth);
  const calendarRows = chunkCalendarRows(calendarDays, 7);

  useEffect(() => {
    if (!value) return;
    setSelectedPreset(value.preset);
    setCommittedPreset(value.preset);
    setCommittedRange(value.range);
    setDraftRange(value.range);
    setViewMonth(parseCalendarDate(value.range.start));
    setSelectingEnd(false);
  }, [value?.preset, value?.range.start, value?.range.end, value?.range.startTime, value?.range.endTime]);

  const choosePreset = (preset: string) => {
    setSelectedPreset(preset);
    setCommittedPreset(preset);
    onCommit?.({ preset, range: committedRange });
    setOpen(false);
    setSelectingEnd(false);
  };

  const updateDraftRange = (next: Partial<typeof draftRange>, source: "start" | "end" = "end") => {
    setDraftRange((value) => {
      const updated = { ...value, ...next };
      if (compareDateTime(updated.end, updated.endTime, calendarNow.date, calendarNow.time) > 0) {
        updated.end = calendarNow.date;
        updated.endTime = calendarNow.time;
      }
      if (compareDateTime(updated.start, updated.startTime, updated.end, updated.endTime) > 0) {
        if (source === "start") {
          updated.start = updated.end;
          updated.startTime = updated.endTime;
        } else {
          updated.end = updated.start;
          updated.endTime = updated.startTime;
        }
      }
      return updated;
    });
    setSelectedPreset("");
  };

  const selectDay = (value: string) => {
    if (value > calendarToday) {
      return;
    }
    if (!selectingEnd || value < draftRange.start) {
      updateDraftRange({ start: value, end: value }, "start");
      setSelectingEnd(true);
      return;
    }
    updateDraftRange({ end: value, endTime: value === calendarNow.date ? calendarNow.time : "24:00" }, "end");
    setSelectingEnd(false);
  };

  const closeWithoutSaving = () => {
    setDraftRange(committedRange);
    setSelectedPreset(committedPreset);
    setOpen(false);
    setSelectingEnd(false);
  };

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) {
        closeWithoutSaving();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, committedPreset, committedRange]);

  const commitRange = () => {
    setCommittedRange(draftRange);
    setCommittedPreset(selectedPreset);
    onCommit?.({ preset: selectedPreset, range: draftRange });
    setOpen(false);
    setSelectingEnd(false);
  };

  return (
    <div ref={pickerRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        className="group relative ml-auto flex h-8 min-w-[160px] w-fit items-center overflow-hidden rounded-[6px] border border-[rgba(255,255,255,0.04)] bg-gradient-to-b from-[#34343e] to-[#2d2d36] pl-[3px] pr-[7px] text-[#f6f6f7] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
        onClick={() => {
          if (open) {
            closeWithoutSaving();
            return;
          }
          setOpen(true);
        }}
      >
        <span className="pointer-events-none absolute inset-0 bg-[rgba(255,255,255,0.04)] opacity-0 group-hover:opacity-100" />
        <RawSvgIcon svg={timeSvg} className="relative size-6 shrink-0 text-[#adadb6]" />
        <span className="relative ml-0.5 whitespace-nowrap text-left text-[14px] leading-4">{committedPreset || formatRangeTriggerLabel(committedRange)}</span>
        <span className="relative ml-auto pl-3">
          <ChevronDown className={cn("size-4 shrink-0 text-[#adadb6] transition-transform", open && "rotate-180")} strokeWidth={1.5} />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[42px] z-30 flex w-[464px] overflow-hidden rounded-[12px] border border-[rgba(255,255,255,0.04)] bg-[#212126] shadow-[0_0_2px_0_rgba(0,0,0,0.8)]">
          <div className="w-[176px] shrink-0 border-r border-[rgba(255,255,255,0.04)] px-4 py-4">
            <div className="flex flex-col gap-1.5">
            {timeRangePresets.map((preset) => (
              <button
                key={preset}
                type="button"
                className={cn(
                  "flex h-8 w-[144px] items-center gap-1 rounded-[6px] px-2 text-left text-[14px] leading-[14px] transition-colors",
                  selectedPreset === preset ? "bg-[rgba(53,102,236,0.32)] text-[#f6f6f7]" : "text-[#adadb6] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#f6f6f7]"
                )}
                onClick={() => choosePreset(preset)}
                style={compactTypography}
              >
                <span className="flex size-4 shrink-0 items-center justify-center">{selectedPreset === preset && <Check className="size-4" strokeWidth={1.8} />}</span>
                {preset}
              </button>
            ))}
            </div>
          </div>

          <div className="flex w-[288px] flex-col">
          <div className="px-6 pb-4 pt-4">
            <div className="grid grid-cols-[20px_124px_72px] items-center gap-x-2 gap-y-2">
              <span className="text-[14px] leading-4 text-[#f6f6f7]">从</span>
              <CompactDateDisplay value={draftRange.start} />
              <CompactTimeInput value={draftRange.startTime} onChange={(startTime) => updateDraftRange({ startTime }, "start")} />
              <span className="text-[14px] leading-4 text-[#f6f6f7]">至</span>
              <CompactDateDisplay value={draftRange.end} />
              <CompactTimeInput value={draftRange.endTime} onChange={(endTime) => updateDraftRange({ endTime }, "end")} />
            </div>

            <div className="mt-4">
              <div className="flex h-4 items-center justify-between">
                <button type="button" aria-label="上一个月" className="grid size-4 place-items-center text-[#adadb6] hover:text-[#f6f6f7]" onClick={() => setViewMonth((value) => new Date(value.getFullYear(), value.getMonth() - 1, 1))}>
                  <ChevronLeft className="size-4" strokeWidth={1.5} />
                </button>
                <span className="text-[14px] leading-4 text-[#f6f6f7]">{viewMonth.getFullYear()}年{viewMonth.getMonth() + 1}月</span>
                <button type="button" aria-label="下一个月" className="grid size-4 place-items-center text-[#adadb6] hover:text-[#f6f6f7]" onClick={() => setViewMonth((value) => new Date(value.getFullYear(), value.getMonth() + 1, 1))}>
                  <ChevronRight className="size-4" strokeWidth={1.5} />
                </button>
              </div>
              <div className="mt-4 grid w-[240px] grid-cols-7 gap-x-3">
                {calendarWeekdays.map((weekday) => (
                  <span key={weekday} className="w-6 text-center text-[12px] leading-3 text-[#767683]">{weekday}</span>
                ))}
              </div>
              <div className="mt-4 flex w-[240px] flex-col gap-y-4">
                {calendarRows.map((row, rowIndex) => {
                  const rangeColumns = row
                    .map((day, columnIndex) => {
                      if (!day) {
                        return null;
                      }
                      const selected = isSameCalendarDay(day.value, draftRange.start) || isSameCalendarDay(day.value, draftRange.end);
                      const inRange = isCalendarDateBetween(day.value, draftRange.start, draftRange.end);
                      return selected || inRange ? columnIndex : null;
                    })
                    .filter((value): value is number => value !== null);

                  const rowRangeStart = rangeColumns[0];
                  const rowRangeEnd = rangeColumns[rangeColumns.length - 1];

                  return (
                    <div key={`row-${rowIndex}`} className="relative flex gap-x-3">
                      {rowRangeStart !== undefined && rowRangeEnd !== undefined && (
                        <span
                          className="absolute top-0 h-6 bg-[rgba(53,102,236,0.32)]"
                          style={{ left: rowRangeStart * 36, width: (rowRangeEnd - rowRangeStart) * 36 + 24 }}
                        />
                      )}
                      {row.map((day, columnIndex) => {
                        if (!day) {
                          return <span key={`empty-${rowIndex}-${columnIndex}`} className="size-6 shrink-0" />;
                        }
                        const { value } = day;
                        const selected = isSameCalendarDay(value, draftRange.start) || isSameCalendarDay(value, draftRange.end);
                        const inRange = isCalendarDateBetween(value, draftRange.start, draftRange.end);
                        const disabled = value > calendarToday;
                        const rangeSelected = selected || inRange;

                        return (
                          <button
                            key={value}
                            type="button"
                            disabled={disabled}
                          className={cn(
                              "relative flex size-6 shrink-0 items-center justify-center rounded-[6px] text-[14px] leading-4 transition-colors",
                              rangeSelected ? "text-[#f6f6f7]" : value === calendarToday ? "bg-[rgba(255,255,255,0.04)] text-[#f6f6f7]" : "text-[#adadb6] hover:bg-[rgba(255,255,255,0.08)]",
                              disabled && "pointer-events-none opacity-40"
                            )}
                            onClick={() => selectDay(value)}
                            style={buttonTypography}
                          >
                            {selected && <span className="absolute inset-0 rounded-[6px] bg-[#3566ec]" />}
                            <span className="relative z-10">{padNumber(parseCalendarDate(value).getDate())}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="flex h-12 shrink-0 items-center justify-end gap-2 border-t border-[rgba(255,255,255,0.04)] pl-6 pr-4">
            <DesignButton variant="primary" onClick={commitRange}>确认</DesignButton>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TimeRangePickerFrame() {
  return (
    <section className="min-h-[520px] w-[560px] rounded-[20px] bg-[#17171a] px-[50px] py-12">
      <TimeRangePicker />
    </section>
  );
}

type SidebarIcon = string;

function DashboardNavItem({
  icon,
  label,
  active = false,
  hovered = false,
  expanded,
  isDayMode = false,
  onClick,
}: {
  icon?: SidebarIcon;
  label: string;
  active?: boolean;
  hovered?: boolean;
  expanded?: boolean;
  isDayMode?: boolean;
  onClick?: () => void;
}) {
  const navTextColor = isDayMode ? (active ? "#FFFFFF" : "#323336") : active ? "#f6f6f7" : "#adadb6";
  const hoverBackground = isDayMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.08)";
  const hoverBackgroundClass = isDayMode ? "day-hover-bg" : "dark-hover-bg-8";

  return (
    <button
      type="button"
      className={cn(
        "group relative flex h-9 w-full items-center rounded-[6px] text-left text-[16px] leading-4",
        active ? "bg-[#3566EC]" : hoverBackgroundClass
      )}
      style={{ fontSize: "16px", lineHeight: "16px", color: navTextColor, backgroundColor: !active && hovered ? hoverBackground : undefined }}
      onClick={onClick}
    >
      <span className="ml-2 grid size-6 shrink-0 place-items-center">
        {icon && (
          <span
            className="size-6"
            style={{ color: navTextColor }}
            dangerouslySetInnerHTML={{ __html: svgToCurrentColor(icon) }}
          />
        )}
      </span>
      <span className={cn("ml-1.5 min-w-0 flex-1 truncate", typeof expanded === "boolean" && "pr-7")}>{label}</span>
      {typeof expanded === "boolean" && (
        <ChevronRight className={cn("absolute right-2 size-4 shrink-0", expanded && "rotate-90")} style={{ color: navTextColor }} strokeWidth={1.7} />
      )}
    </button>
  );
}

function DashboardSubItem({
  label,
  selected = false,
  isDayMode = false,
  onClick,
}: {
  label: string;
  selected?: boolean;
  isDayMode?: boolean;
  onClick?: () => void;
}) {
  const navTextColor = isDayMode ? "#323336" : selected ? "#f6f6f7" : "#adadb6";
  const hoverBackgroundClass = isDayMode ? "day-hover-bg" : "dark-hover-bg-8";
  const selectedLineColor = isDayMode ? "#36383C" : navTextColor;

  return (
    <button
      type="button"
      className={cn(
        "relative flex h-9 w-full items-center rounded-[6px] text-left text-[14px] leading-[14px]",
        selected ? "bg-[rgba(53,102,236,0.32)]" : hoverBackgroundClass
      )}
      style={{ fontSize: "14px", lineHeight: "14px", color: navTextColor }}
      onClick={onClick}
    >
      <span
        className={cn("pointer-events-none absolute left-5 top-2 z-30 h-5 w-px", selected ? "opacity-100" : "opacity-0")}
        style={{ backgroundColor: selectedLineColor }}
      />
      <span className="relative z-20 pl-[38px]">{label}</span>
    </button>
  );
}

function HeaderIconTooltip({ label }: { label: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none invisible absolute left-1/2 top-[38px] z-[80] -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-[rgba(0,0,0,0.8)] px-2 py-1 text-[12px] leading-4 text-[#f6f6f7] opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100"
    >
      {label}
    </span>
  );
}

const globalSearchItems: Array<{
  id: string;
  title: string;
  subtitle: string;
  page: DashboardPage;
  icon: GlobalSearchIconType;
  keywords: string[];
}> = [
  {
    id: "dashboard",
    title: "仪表盘",
    subtitle: "概览 / 数据卡片 / 趋势图 / 最新威胁",
    page: "dashboard",
    icon: "dashboard",
    keywords: ["dashboard", "仪表", "图表", "趋势", "最新威胁", "数据卡片"],
  },
  {
    id: "traffic-search",
    title: "日志搜索",
    subtitle: "日志检索 / 搜索结果 / 展示配置",
    page: "trafficSearch",
    icon: "search",
    keywords: ["log", "search", "日志", "搜索", "检索", "结果"],
  },
  {
    id: "threat-alerts",
    title: "威胁告警",
    subtitle: "风险筛选 / 条件查询 / 威胁列表",
    page: "threatAlerts",
    icon: "threat",
    keywords: ["threat", "alert", "威胁", "告警", "风险", "mitre", "attack"],
  },
  {
    id: "notifications",
    title: "消息通知",
    subtitle: "消息 / 权限变更 / 监控告警",
    page: "notifications",
    icon: "form",
    keywords: ["消息", "通知", "权限", "监控告警", "离线任务", "许可证"],
  },
  {
    id: "component-library",
    title: "组件库",
    subtitle: "功能中心 / 基础组件 / 交互规范",
    page: "library",
    icon: "library",
    keywords: ["component", "组件", "按钮", "下拉", "翻页器", "提示"],
  },
  {
    id: "form",
    title: "表单",
    subtitle: "功能中心 / 表单样式 / 上传组件",
    page: "form",
    icon: "form",
    keywords: ["form", "表单", "上传", "输入框", "单选", "多选"],
  },
  {
    id: "code-log",
    title: "代码/日志容器",
    subtitle: "功能中心 / 代码块 / 日志展示",
    page: "codeLog",
    icon: "code",
    keywords: ["code", "log", "代码", "日志容器", "容器"],
  },
  {
    id: "latest-threat",
    title: "最新威胁",
    subtitle: "仪表盘 / 实时威胁告警 / 查看更多",
    page: "dashboard",
    icon: "threat",
    keywords: ["最新威胁", "实时", "高风险", "中风险", "告警"],
  },
  {
    id: "disposition",
    title: "告警处置统计",
    subtitle: "仪表盘 / 待处理 / 处理中 / 已关闭",
    page: "dashboard",
    icon: "dashboard",
    keywords: ["告警处置", "统计", "环形图", "待处理", "已关闭"],
  },
  {
    id: "search-guide",
    title: "搜索指南",
    subtitle: "日志搜索 / 检索语法 / 搜索命令",
    page: "trafficSearch",
    icon: "search",
    keywords: ["搜索指南", "语法", "命令", "检索", "帮助"],
  },
  {
    id: "display-config",
    title: "展示配置",
    subtitle: "日志搜索 / 字段显示 / 完整事件",
    page: "trafficSearch",
    icon: "form",
    keywords: ["展示配置", "字段", "显示", "隐藏", "完整事件"],
  },
  {
    id: "mitre-attack",
    title: "MITRE ATT&CK",
    subtitle: "威胁告警 / 级联选择器 / 技术选择",
    page: "threatAlerts",
    icon: "threat",
    keywords: ["mitre", "attack", "级联选择器", "威胁", "技术"],
  },
  {
    id: "threat-filter",
    title: "条件查询",
    subtitle: "威胁告警 / ID / 威胁名称 / 高级查询",
    page: "threatAlerts",
    icon: "search",
    keywords: ["条件查询", "高级查询", "威胁名称", "重置", "搜索"],
  },
  {
    id: "pagination",
    title: "翻页器",
    subtitle: "组件库 / 32px / 28px / 每页条数",
    page: "library",
    icon: "library",
    keywords: ["翻页器", "pagination", "每页", "分页", "组件"],
  },
  {
    id: "upload",
    title: "图片/文件上传",
    subtitle: "组件库 / 图片预览 / 文件删除确认",
    page: "library",
    icon: "form",
    keywords: ["上传", "图片", "文件", "预览", "删除"],
  },
];

function GlobalSearchResultIcon({ type }: { type: GlobalSearchIconType }) {
  const iconClassName = "size-4 text-[#adadb6]";
  if (type === "dashboard") {
    return <ChartNoAxesCombined className={iconClassName} strokeWidth={1.6} />;
  }
  if (type === "search") {
    return <Search className={iconClassName} strokeWidth={1.6} />;
  }
  if (type === "threat") {
    return <AlertTriangle className={iconClassName} strokeWidth={1.6} />;
  }
  if (type === "library") {
    return <Database className={iconClassName} strokeWidth={1.6} />;
  }
  if (type === "form") {
    return <Check className={iconClassName} strokeWidth={1.6} />;
  }
  return <Server className={iconClassName} strokeWidth={1.6} />;
}

function HighlightSearchMatch({ text, query }: { text: string; query: string }) {
  const keyword = query.trim();
  if (!keyword) {
    return <>{text}</>;
  }

  const index = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (index < 0) {
    return <>{text}</>;
  }

  return (
    <>
      {text.slice(0, index)}
      <span className="rounded-[3px] bg-[rgba(255,255,255,0.08)] px-0.5 text-[#f6f6f7]">
        {text.slice(index, index + keyword.length)}
      </span>
      {text.slice(index + keyword.length)}
    </>
  );
}

function GlobalSearchDialog({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  isDayMode: boolean;
  onClose: () => void;
  onSelect: (page: DashboardPage) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setQuery("");
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = normalizedQuery
    ? globalSearchItems.filter((item) => {
        const searchableText = [item.title, item.subtitle, ...item.keywords].join(" ").toLowerCase();
        return searchableText.includes(normalizedQuery);
      })
    : [];
  const shouldShowResults = normalizedQuery.length > 0 && filteredItems.length > 0;
  const resultListMaxHeight = 6 * 72;
  const rowHover = "hover:bg-[rgba(255,255,255,0.08)]";
  const mutedTextColor = "#adadb6";
  const mainTextColor = "#f6f6f7";

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center bg-[rgba(0,0,0,0.72)] px-8 pt-[132px] backdrop-blur-[6px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="max-h-[calc(100vh-180px)] w-[min(680px,calc(100vw-64px))] overflow-hidden rounded-[10px] border"
        style={{
          backgroundColor: "#212126",
          borderColor: "rgba(255,255,255,0.04)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div
          className={cn("flex h-14 items-center gap-3 px-4", shouldShowResults && "border-b")}
          style={{ borderColor: "#34343e" }}
        >
          <Search className="size-5 shrink-0 text-[#adadb6]" strokeWidth={1.6} />
          <input
            ref={inputRef}
            value={query}
            placeholder="搜索功能"
            className="h-6 min-w-0 flex-1 bg-transparent text-[18px] leading-6 outline-none placeholder:text-[#ADADB6]"
            style={{ color: mainTextColor }}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
              }
            }}
          />
          <button
            type="button"
            aria-label="关闭全局搜索"
            className="grid size-7 shrink-0 place-items-center rounded-[6px] transition-colors hover:bg-[rgba(255,255,255,0.08)]"
            style={{ color: mainTextColor }}
            onClick={onClose}
          >
            <X className="size-4" strokeWidth={2.4} />
          </button>
        </div>
        {shouldShowResults ? (
          <div className="app-scrollbar overflow-y-auto" style={{ maxHeight: resultListMaxHeight }}>
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn("flex h-[72px] w-full items-center gap-2.5 border-b px-4 text-left transition-colors last:border-b-0", rowHover)}
                style={{ borderColor: "#34343e" }}
                onClick={() => {
                  onSelect(item.page);
                  onClose();
                }}
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center">
                  <GlobalSearchResultIcon type={item.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold leading-4" style={{ color: mainTextColor }}>
                    <HighlightSearchMatch text={item.title} query={query} />
                  </span>
                  <span className="mt-1 block truncate text-[12px] leading-4" style={{ color: mutedTextColor }}>
                    <HighlightSearchMatch text={item.subtitle} query={query} />
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}

function DashboardHeader({
  isDayMode,
  sidebarOffset,
  onToggleDayMode,
  onOpenGlobalSearch,
  onOpenNotifications,
}: {
  isDayMode: boolean;
  sidebarOffset: number;
  onToggleDayMode: () => void;
  onOpenGlobalSearch: () => void;
  onOpenNotifications: () => void;
}) {
  const [userCardOpen, setUserCardOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const userActions = [
    { label: "个人中心", icon: profileCenterSvg },
    { label: "代金券", icon: couponSvg },
    { label: "系统设置", icon: settingsSidebarSvg },
    { label: "退出登录", icon: logoutSvg },
  ] as const;

  useEffect(() => {
    if (!userCardOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setUserCardOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [userCardOpen]);

  return (
    <header
      className="absolute right-0 top-0 z-50 h-[60px] border-b transition-[left] duration-[300ms] ease-in-out"
      style={{ left: sidebarOffset, backgroundColor: isDayMode ? "#FFFFFF" : "#17171A", borderColor: isDayMode ? "#EBEBEB" : "#232328" }}
    >
      <div className="fixed left-[256px] top-[14px] z-40">
        <DesignButton variant="icon">Copilot</DesignButton>
      </div>

      <button
        type="button"
        aria-label="搜索"
        className={cn(
          "group absolute right-[140px] top-[14px] grid size-8 place-items-center rounded-[6px] text-[#adadb6] transition-colors",
          isDayMode ? "day-hover-bg" : "dark-hover-bg-8"
        )}
        onClick={onOpenGlobalSearch}
      >
        <RawSvgIcon svg={searchLargeSvg} className="size-8" />
        <HeaderIconTooltip label="全局搜索" />
      </button>

      <button
        type="button"
        aria-label="通知"
        className={cn(
          "group absolute right-[100px] top-[14px] grid size-8 place-items-center rounded-[6px] text-[#adadb6] transition-colors",
          isDayMode ? "day-hover-bg" : "dark-hover-bg-8"
        )}
        onClick={onOpenNotifications}
      >
        <RawSvgIcon svg={messageNotificationSvg} className="size-8" />
        <HeaderIconTooltip label="消息通知" />
      </button>

      <button
        type="button"
        aria-label={isDayMode ? "切换黑夜模式" : "切换白天模式"}
        aria-pressed={isDayMode}
        className={cn(
          "group absolute right-[60px] top-[14px] grid size-8 place-items-center rounded-[6px] transition-colors",
          isDayMode ? "day-hover-bg" : "dark-hover-bg-8"
        )}
        style={{ color: isDayMode ? "#67686C" : "#adadb6" }}
        onClick={onToggleDayMode}
      >
        <RawSvgIcon svg={isDayMode ? nightModeSvg : dayModeSvg} className="size-8" />
        <HeaderIconTooltip label="主题模式" />
      </button>

      <div ref={userMenuRef} className="absolute right-4 top-[14px] z-[60]">
        <button
          type="button"
          className="block size-8"
          aria-label="用户菜单"
          onClick={() => setUserCardOpen((open) => !open)}
        >
          <RawSvgIcon svg={defaultAvatarSvg} className="block size-8" useCurrentColor={false} />
        </button>

        {userCardOpen && (
          <div
            className="absolute right-0 top-[38px] w-[198px] overflow-hidden rounded-[8px] border border-[rgba(255,255,255,0.04)] bg-[#28282e]"
            style={{ boxShadow: "0 0 4px 0 rgba(0,0,0,0.56)" }}
          >
            <div className="flex items-start gap-3 border-b border-[rgba(255,255,255,0.04)] px-4 py-3">
              <RawSvgIcon svg={defaultAvatarSvg} className="block size-10 shrink-0" useCurrentColor={false} />
              <div className="min-w-0 pt-[2px]">
                <div className="truncate text-[12px] leading-4 text-[#f6f6f7]" style={buttonTypography}>
                  管理员iusdu
                </div>
                <div className="mt-1 truncate text-[12px] leading-4 text-[#767683]">默认组织</div>
              </div>
            </div>
            <div className="p-1">
              {userActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="group flex h-8 w-full items-center gap-1.5 rounded-[6px] pl-2 pr-3 text-left text-[12px] leading-4 text-[#adadb6] transition-colors hover:bg-[#3566ec] hover:text-[#f6f6f7]"
                  style={buttonTypography}
                >
                  <RawSvgIcon svg={action.icon} className="size-6 shrink-0" />
                  <span className="whitespace-nowrap">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function DashboardBrandControls({
  expanded,
  isDayMode,
  onPreviewStart,
  onToggle,
}: {
  expanded: boolean;
  isDayMode: boolean;
  onPreviewStart: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="pointer-events-none absolute left-0 top-0 z-50 h-[60px] w-[240px]">
      <button
        type="button"
        aria-label={expanded ? "收起侧边栏" : "展开侧边栏"}
        className={cn(
          "pointer-events-auto absolute left-4 top-[14px] grid size-8 place-items-center rounded-[6px] text-[#adadb6] transition-colors",
          isDayMode ? "day-hover-bg" : "dark-hover-bg-8"
        )}
        onMouseEnter={() => {
          if (!expanded) {
            onPreviewStart();
          }
        }}
        onClick={onToggle}
      >
        <RawSvgIcon svg={expanded ? collapseSidebarSvg : expandSidebarSvg} className="size-8" />
      </button>

      <div className="absolute left-[58px] right-3 top-4 h-7 rounded-[4px] bg-[rgba(255,255,255,0.04)]" />
    </div>
  );
}

function DashboardSidebar({
  expanded,
  isDayMode,
  activePage,
  onSelectionChange,
  onPreviewEnd,
}: {
  expanded: boolean;
  isDayMode: boolean;
  activePage: DashboardPage;
  onSelectionChange: (page: DashboardPage) => void;
  onPreviewEnd?: () => void;
}) {
  const expandedWidth = 240;
  const collapsedWidth = 0;
  const collapsedOffset = expandedWidth;
  const navItems = [
    { label: "仪表盘", icon: dashboardSidebarSvg },
    { label: "日志搜索", icon: logSearchSidebarSvg },
    { label: "功能中心", icon: centerSidebarSvg },
  ] as const;
  const submenuParents = ["功能中心"] as const;
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    功能中心: true,
  });
  const [activePrimary, setActivePrimary] = useState("仪表盘");
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  useEffect(() => {
    if (activePage === "dashboard") {
      setActivePrimary("仪表盘");
      setActiveSub(null);
      return;
    }
    if (activePage === "trafficSearch") {
      setActivePrimary("日志搜索");
      setActiveSub(null);
      return;
    }
    if (activePage === "library") {
      setActivePrimary("功能中心");
      setActiveSub("组件库");
      setOpenMenus((value) => ({ ...value, 功能中心: true }));
      return;
    }
    if (activePage === "form") {
      setActivePrimary("功能中心");
      setActiveSub("表单");
      setOpenMenus((value) => ({ ...value, 功能中心: true }));
      return;
    }
    if (activePage === "codeLog") {
      setActivePrimary("功能中心");
      setActiveSub("代码/日志容器");
      setOpenMenus((value) => ({ ...value, 功能中心: true }));
      return;
    }
    if (activePage === "threatAlerts") {
      setActivePrimary("仪表盘");
      setActiveSub(null);
      return;
    }
    if (activePage === "notifications") {
      setActivePrimary("");
      setActiveSub(null);
    }
  }, [activePage]);
  const toggleMenu = (label: string) => {
    setOpenMenus((value) => ({ ...value, [label]: !value[label] }));
  };
  const selectPrimary = (label: string) => {
    setActivePrimary(label);
    setActiveSub(null);
    onSelectionChange(
      label === "日志搜索"
        ? "trafficSearch"
        : label === "仪表盘"
          ? "dashboard"
          : "blank"
    );
  };
  const selectSub = (primary: string, label: string) => {
    setActivePrimary(primary);
    setActiveSub(label);
    onSelectionChange(
      primary === "功能中心" && label === "组件库"
        ? "library"
        : primary === "功能中心" && label === "表单"
          ? "form"
          : primary === "功能中心" && label === "代码/日志容器"
            ? "codeLog"
            : primary === "流量监控" && label === "搜索"
              ? "trafficSearch"
          : "blank"
    );
  };
  const submenuGroups: Record<string, string[]> = {
    功能中心: ["组件库", "表单", "代码/日志容器"],
  };

  return (
    <aside
      className="absolute bottom-0 left-0 top-0 z-40 overflow-hidden transition-[width] duration-[300ms] ease-in-out"
      style={{ width: expanded ? expandedWidth : collapsedWidth }}
      onMouseLeave={onPreviewEnd}
    >
      <div
        className="relative h-full border-r transition-transform duration-[300ms] ease-in-out"
        style={{
          width: expandedWidth,
          transform: expanded ? "translateX(0)" : `translateX(-${collapsedOffset}px)`,
          backgroundColor: isDayMode ? "#FFFFFF" : "#17171A",
          borderColor: isDayMode ? "#EBEBEB" : "#232328",
        }}
      >
        <nav className="sidebar-scrollbar absolute bottom-0 left-0 top-[72px] w-[240px] overflow-y-auto overflow-x-hidden px-3 pb-6">
        <div className="flex flex-col gap-1">
          {navItems.map((item) =>
              submenuParents.includes(item.label as (typeof submenuParents)[number]) ? (
                <div key={item.label} onMouseEnter={() => setHoveredMenu(item.label)} onMouseLeave={() => setHoveredMenu(null)}>
                  <DashboardNavItem
                    icon={item.icon}
                    label={item.label}
                    active={activePrimary === item.label}
                    hovered={hoveredMenu === item.label}
                    expanded={openMenus[item.label]}
                    isDayMode={isDayMode}
                    onClick={() => toggleMenu(item.label)}
                  />
                  {openMenus[item.label] && (
                    <div
                      className="relative mt-1 w-full"
                      style={{ height: submenuGroups[item.label].length * 36 + (submenuGroups[item.label].length - 1) * 2 }}
                    >
                      <span
                        className="pointer-events-none absolute bottom-2 left-5 top-2 z-10 w-px"
                        style={{ backgroundColor: isDayMode ? "#DFDFDF" : "#52525c" }}
                      />
                      <div className="relative flex flex-col gap-[2px]">
                        {submenuGroups[item.label].map((label) => (
                          <DashboardSubItem
                            key={label}
                            label={label}
                            selected={activeSub === label}
                            isDayMode={isDayMode}
                            onClick={() => selectSub(item.label, label)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <DashboardNavItem key={item.label} icon={item.icon} label={item.label} active={activePrimary === item.label} isDayMode={isDayMode} onClick={() => selectPrimary(item.label)} />
              )
            )}
        </div>

        </nav>
      </div>
    </aside>
  );
}

type DashboardMetricCardData = {
  label: string;
  value: string;
  suffix?: string;
  iconSrc: string;
  accent: string;
  glow: [string, string];
  chartType?: "line" | "bar-background" | "block" | "storage-percent" | "border-stat";
  footerLabel?: string;
  footerValue?: string;
  data: number[];
};

const recent30DayTrend = [
  68, 42, 76, 51, 88, 57, 71, 46, 95, 63,
  82, 54, 73, 91, 49, 86, 61, 78, 44, 97,
  69, 84, 56, 75, 93, 52, 80, 66, 89, 74,
];

const recent30DayPeakTrend = [
  39, 72, 48, 84, 55, 67, 43, 91, 62, 76,
  51, 88, 46, 70, 59, 95, 64, 81, 53, 74,
  44, 86, 68, 57, 92, 49, 79, 60, 83, 71,
];

const dashboardCards: DashboardMetricCardData[] = [
  {
    label: "今日日志提取量",
    value: "231.23",
    suffix: "K",
    iconSrc: dashboardLogExtractIcon,
    accent: "#66FFFC",
    glow: ["#8DFFF2", "#4E80FF"],
    chartType: "bar-background",
    data: recent30DayTrend,
  },
  {
    label: "今日单笔峰值",
    value: "975",
    iconSrc: dashboardPeakIcon,
    accent: "#DE66FF",
    glow: ["#FFFD9B", "#D665FF"],
    chartType: "bar-background",
    data: recent30DayPeakTrend,
  },
  {
    label: "今日平均耗时",
    value: "73",
    suffix: "μs",
    iconSrc: dashboardAverageCostIcon,
    accent: "#FFD24A",
    glow: ["#FFF189", "#FFA62A"],
    data: [8, 14, 12, 17, 15, 19, 16, 22, 18, 23, 20, 24],
  },
  {
    label: "今日提取成功率",
    value: "99.98",
    suffix: "%",
    iconSrc: dashboardSuccessIcon,
    accent: "#FF4C4C",
    glow: ["#9CFF8F", "#44F9FF"],
    chartType: "border-stat",
    footerLabel: "错误数",
    footerValue: "89",
    data: [26, 26, 25, 26, 25, 24, 25, 26, 25, 26, 25, 25],
  },
  {
    label: "索引数",
    value: "29",
    iconSrc: dashboardIndexIcon,
    accent: "#2C71B1",
    glow: ["#CD7A35", "#4D60EF"],
    chartType: "storage-percent",
    data: [9, 11, 10, 14, 13, 15, 18, 16, 17, 20, 19, 21],
  },
  {
    label: "Agent数量",
    value: "322",
    iconSrc: dashboardAgentIcon,
    accent: "#FF4C4C",
    glow: ["#C4FF72", "#72D7FF"],
    chartType: "border-stat",
    footerLabel: "失联数",
    footerValue: "0",
    data: [13, 15, 14, 19, 18, 21, 20, 24, 22, 25, 23, 26],
  },
];

function DashboardMetricBarBackground({
  color,
  data,
  isDayMode = false,
}: {
  color: string;
  data: number[];
  isDayMode?: boolean;
}) {
  const maxValue = Math.max(...data);

  return (
    <EChart
      className="h-8 w-full"
      theme="light"
      option={{
        animation: false,
        backgroundColor: "transparent",
        grid: { left: 1, right: 1, top: 3, bottom: 0 },
        xAxis: {
          type: "category",
          boundaryGap: false,
          show: false,
          data: data.map((_, index) => index),
        },
        yAxis: {
          type: "value",
          show: false,
        },
        series: [
          {
            type: "bar",
            data: data.map(() => maxValue),
            clip: false,
            barWidth: 2,
            barGap: "-100%",
            z: 1,
            itemStyle: {
              color: isDayMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)",
              borderRadius: 999,
            },
          },
          {
            type: "bar",
            data,
            clip: false,
            barWidth: 2,
            barGap: "-100%",
            z: 2,
            itemStyle: {
              color: ({ dataIndex }: { dataIndex: number }) =>
                dataIndex === data.length - 1 ? color : `${color}52`,
              borderRadius: 999,
            },
          },
        ],
      }}
    />
  );
}

function DashboardMetricLine({
  color,
  data,
  isDayMode = false,
}: {
  color: string;
  data: number[];
  isDayMode?: boolean;
}) {
  return (
    <EChart
      className="h-8 w-full"
      theme="light"
      option={{
        animation: false,
        backgroundColor: "transparent",
        grid: { left: 0, right: 0, top: 3, bottom: 0 },
        xAxis: {
          type: "category",
          boundaryGap: false,
          show: false,
          data: data.map((_, index) => index),
        },
        yAxis: {
          type: "value",
          show: false,
        },
        series: [
          {
            type: "line",
            data,
            clip: false,
            smooth: true,
            showSymbol: false,
            symbol: "none",
            lineStyle: {
              color,
              width: 1,
            },
            itemStyle: {
              color,
              borderColor: "rgba(255,255,255,0.32)",
              borderWidth: 1,
            },
            areaStyle: {
              color,
              opacity: isDayMode ? 0.18 : 0.12,
            },
          },
        ],
      }}
    />
  );
}

function DashboardStoragePercentChart({ isDayMode = false }: { isDayMode?: boolean }) {
  return (
    <div
      className="relative flex h-7 w-full items-center overflow-hidden rounded-[4px] border border-[#CD8F3F] bg-[rgba(205,143,63,0.12)] text-[14px] leading-4"
      style={{ color: isDayMode ? "#323336" : "#f6f6f7" }}
    >
      <div className="absolute inset-y-0 left-0 w-[56.28%] bg-[#CD8F3F]" />
      <span className="relative z-10 pl-2 font-normal text-[#f6f6f7]">占用存储</span>
      <span
        className="relative z-10 ml-auto pr-2 text-right"
        style={{ fontFamily: '"LogEaseNumber", "Avenir Next", sans-serif', fontWeight: 500 }}
      >
        8GB
      </span>
    </div>
  );
}

function DashboardBorderStatChart({
  label,
  value,
  isDayMode = false,
}: {
  label: string;
  value: string;
  isDayMode?: boolean;
}) {
  return (
    <div
      className="flex h-7 w-full items-center rounded-[4px] border border-[#6A3C3C] bg-[rgba(106,60,60,0.12)] px-2 text-[14px] leading-4 shadow-none"
      style={{ color: isDayMode ? "#323336" : "#f6f6f7" }}
    >
      <span className="font-normal">{label}</span>
      <span
        className="ml-auto text-right"
        style={{ fontFamily: '"LogEaseNumber", "Avenir Next", sans-serif', fontWeight: 500 }}
      >
        {value}
      </span>
    </div>
  );
}

function DashboardMetricCard({
  card,
  isDayMode = false,
}: {
  card: DashboardMetricCardData;
  isDayMode?: boolean;
}) {
  return (
    <section className="relative h-[140px] rounded-[6px]">
      <div
        className={cn(
          "absolute bottom-4 right-4 top-9 left-6 rounded-br-[6px] blur-[10px]",
          isDayMode ? "opacity-40" : "opacity-75"
        )}
        style={{
          backgroundImage: `linear-gradient(135deg, ${card.glow[0]} 0%, ${card.glow[1]} 100%)`,
          maskImage: "linear-gradient(135deg, transparent 0%, black 34%, black 72%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(135deg, transparent 0%, black 34%, black 72%, transparent 100%)",
        }}
      />
      <div
        className={cn(
          "relative h-full overflow-hidden rounded-[6px] border backdrop-blur-[36px]",
          !isDayMode && "dashboard-card-breathe",
          isDayMode
            ? "border-[rgba(210,210,210,0.88)] bg-[rgba(255,255,255,0.86)] shadow-[inset_0_0_8px_2px_rgba(255,255,255,0.68),0_8px_24px_rgba(17,17,20,0.06)]"
            : "border-[rgba(255,255,255,0.04)] bg-[rgba(23,23,26,0.84)] shadow-[inset_0_0_8px_2px_rgba(255,255,255,0.04)]"
        )}
      >
        <img
          src={card.iconSrc}
          alt=""
          className="pointer-events-none absolute right-3 top-3 size-8 select-none"
          draggable={false}
        />
        <div className="pl-3 pt-[21px]">
          <div
            className="text-[14px] font-normal leading-[14px]"
            style={{ color: isDayMode ? "#323336" : "#ffffff" }}
          >
            {card.label}
          </div>
          <div className="mt-4 flex items-end gap-1" style={{ color: isDayMode ? "#17171A" : "#f6f6f7" }}>
            <span
              className="text-[32px] leading-[32px]"
              style={{ fontFamily: '"LogEaseNumber", "Avenir Next", sans-serif', fontWeight: 500 }}
            >
              {card.value}
            </span>
            {card.suffix ? (
              <span
                className="pb-[4px] text-[16px] leading-4"
                style={{ fontFamily: '"LogEaseNumber", "Avenir Next", sans-serif', fontWeight: 500 }}
              >
                {card.suffix}
              </span>
            ) : null}
          </div>
        </div>
        <div className="mt-4 px-3">
          {card.chartType === "storage-percent" ? (
            <DashboardStoragePercentChart isDayMode={isDayMode} />
          ) : card.chartType === "border-stat" ? (
            <DashboardBorderStatChart label={card.footerLabel ?? ""} value={card.footerValue ?? ""} isDayMode={isDayMode} />
          ) : card.chartType === "bar-background" ? (
            <DashboardMetricBarBackground color={card.accent} data={card.data} isDayMode={isDayMode} />
          ) : card.chartType === "block" ? (
            <div
              className="h-7 w-full rounded-[6px]"
              style={{ backgroundColor: `${card.accent}1F` }}
            />
          ) : (
            <DashboardMetricLine color={card.accent} data={card.data} isDayMode={isDayMode} />
          )}
        </div>
      </div>
    </section>
  );
}

type DashboardPeriod = "today" | "week";

const dashboardTrendData = {
  alert: {
    today: [46, 55, 43, 67, 59, 76, 71, 84, 65, 56, 73, 68, 82, 75, 91, 70, 86, 63, 78, 95, 80, 88, 76, 92],
    week: [584, 493, 671, 548, 706, 612, 648],
  },
  intercept: {
    today: [38, 45, 41, 62, 53, 70, 66, 79, 61, 73, 57, 76, 69, 84, 72, 78, 64, 86, 74, 90, 68, 82, 77, 88],
    week: [392, 468, 431, 604, 512, 556, 529],
  },
} as const;

const dashboardTrendComparisonData = {
  alert: {
    today: [41, 49, 46, 58, 63, 69, 64, 77, 72, 61, 67, 74, 76, 69, 83, 78, 73, 68, 81, 87, 75, 82, 79, 84],
    week: [552, 518, 603, 579, 661, 588, 621],
  },
  intercept: {
    today: [35, 42, 39, 54, 57, 63, 60, 71, 67, 65, 62, 70, 73, 77, 69, 75, 71, 79, 76, 83, 72, 78, 81, 80],
    week: [371, 445, 417, 558, 489, 531, 506],
  },
} as const;

const dashboardWeekLabels = ["6.13", "6.14", "6.15", "6.16", "6.17", "6.18", "6.19"];

const getDashboardTodayHourCount = () => Math.max(1, Math.min(24, new Date().getHours() + 1));

function DashboardPeriodTabs({
  value,
  onChange,
}: {
  value: DashboardPeriod;
  onChange: (value: DashboardPeriod) => void;
}) {
  return (
    <SegmentedTabs
      tabs={["今日", "近 7 天"]}
      size="28"
      activeIndex={value === "today" ? 0 : 1}
      onChange={(index) => onChange(index === 0 ? "today" : "week")}
    />
  );
}

function DashboardPanel({
  title,
  period,
  onPeriodChange,
  headerAction,
  isDayMode = false,
  className,
  children,
}: {
  title: string;
  period?: DashboardPeriod;
  onPeriodChange?: (value: DashboardPeriod) => void;
  headerAction?: React.ReactNode;
  isDayMode?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      data-dashboard-panel={title}
      className={cn("overflow-hidden rounded-[6px]", className)}
      style={{ backgroundColor: isDayMode ? "#ffffff" : "#17171a" }}
    >
      <header
        className="flex h-12 items-center justify-between border-b px-3"
        style={{ borderColor: isDayMode ? "#dfdfdf" : "#232328" }}
      >
        <h3 className="text-[14px] font-medium leading-4" style={{ color: isDayMode ? "#323336" : "#C1C7E2" }}>
          {title}
        </h3>
        <div className="flex items-center">
          {period && onPeriodChange ? <DashboardPeriodTabs value={period} onChange={onPeriodChange} /> : null}
          {headerAction}
        </div>
      </header>
      {children}
    </section>
  );
}

function DashboardVolumePanel({
  kind,
  isDayMode = false,
}: {
  kind: "alert" | "intercept";
  isDayMode?: boolean;
}) {
  const [period, setPeriod] = useState<DashboardPeriod>("today");
  const isToday = period === "today";
  const todayHourCount = getDashboardTodayHourCount();
  const values = isToday ? dashboardTrendData[kind].today.slice(0, todayHourCount) : dashboardTrendData[kind][period];
  const comparisonValues = isToday
    ? dashboardTrendComparisonData[kind].today.slice(0, todayHourCount)
    : dashboardTrendComparisonData[kind][period];
  const labels = isToday ? values.map((_, index) => `${index + 1}:00`) : dashboardWeekLabels;
  const trendMaximum = Math.max(...values, ...comparisonValues);
  const yAxisStep = Math.max(10, Math.ceil(trendMaximum / 30) * 10);
  const yAxisMaximum = yAxisStep * 3;
  const total = values.reduce((sum, value) => sum + value, 0);
  const accent = kind === "alert" ? "#FF6B6B" : "#32FF69";
  const title = kind === "alert" ? "告警量" : "拦截量";
  const summaryPrefix = isToday ? "今日" : "近 7 天";
  const summaryTitle = kind === "alert" ? `${summaryPrefix}总告警数` : `${summaryPrefix}总拦截量`;
  const summaryIcon = kind === "alert" ? dashboardAlertIcon : dashboardInterceptIcon;
  const summaryBorderColor = kind === "alert" ? "#6A3C3C" : "#3D7A45";
  const summaryBackgroundColor = kind === "alert" ? "rgba(106,60,60,0.24)" : "rgba(60,106,60,0.24)";
  const summaryIconColor = kind === "alert" ? "#FF6B6B" : "#45DD72";

  return (
    <DashboardPanel title={title} period={period} onPeriodChange={setPeriod} isDayMode={isDayMode} className="h-[348px]">
      <div className="flex h-[300px] flex-col px-3 pb-3 pt-3">
        <div className="flex justify-center">
          <div
            className="relative flex h-7 w-[232px] max-w-full shrink-0 items-center rounded-[6px] border px-1 py-0.5"
            style={{
              borderColor: summaryBorderColor,
              backgroundColor: summaryBackgroundColor,
            }}
          >
            <RawSvgIcon
              svg={svgToFillColor(summaryIcon, summaryIconColor)}
              className="pointer-events-none size-6 shrink-0 select-none"
              useCurrentColor={false}
            />
            <span
              className="shrink-0 whitespace-nowrap text-[14px] font-medium leading-4"
              style={{ color: isDayMode ? "#323336" : "#f6f6f7" }}
            >
              {summaryTitle}
            </span>
            <span
              className="absolute right-[7px] top-[5px] h-4 text-right text-[16px] leading-4"
              style={{ color: isDayMode ? "#323336" : "#f6f6f7", fontFamily: '"LogEaseNumber", "Avenir Next", sans-serif', fontWeight: 500 }}
            >
              {String(total)}
            </span>
          </div>
        </div>
        <div className="mt-3 min-h-0 flex-1">
          <EChart
            className="h-full w-full"
            theme="light"
            notMerge
            option={{
              animation: false,
              backgroundColor: "transparent",
              grid: { left: 36, right: 4, top: 8, bottom: 24 },
              tooltip: {
                trigger: "axis",
                backgroundColor: "#28282E",
                borderColor: "rgba(255,255,255,0.04)",
                borderWidth: 1,
                extraCssText: "box-shadow: 0 0 2px rgba(0,0,0,0.8); text-align: left;",
                textStyle: { color: "#f6f6f7", fontSize: 12 },
                axisPointer: {
                  type: "line",
                  lineStyle: { color: "rgba(255,255,255,0.08)", width: 1, type: "solid" },
                },
                position: (
                  _mousePoint: [number, number],
                  params: Array<{ dataIndex: number; value: number; seriesName?: string }>,
                  _tooltipElement: HTMLElement,
                  _targetRect: unknown,
                  size: { contentSize: [number, number]; viewSize: [number, number] }
                ) => {
                  const point = params.find((item) => item.seriesName === "当前周期") ?? params[0];
                  const dataIndex = point?.dataIndex ?? 0;
                  const value = Number(point?.value ?? 0);
                  const plotWidth = Math.max(0, size.viewSize[0] - 40);
                  const plotHeight = Math.max(0, size.viewSize[1] - 32);
                  const pointX = 36 + (labels.length > 1 ? (dataIndex / (labels.length - 1)) * plotWidth : 0);
                  const pointY = 8 + (1 - value / yAxisMaximum) * plotHeight;
                  const left = Math.min(
                    Math.max(0, pointX + 8),
                    size.viewSize[0] - size.contentSize[0]
                  );
                  const top = Math.min(
                    Math.max(0, pointY + 8),
                    size.viewSize[1] - size.contentSize[1]
                  );
                  return [left, top];
                },
                formatter: (params: Array<{ dataIndex: number; axisValue: string; value: number; seriesName?: string }>) => {
                  const point = params.find((item) => item.seriesName === "当前周期") ?? params[0];
                  if (!point) return "";
                  const label = isToday
                    ? `${point.dataIndex}:00-${point.dataIndex + 1}:00`
                    : point.axisValue;

                  return `<div style="text-align:left;white-space:nowrap;">
                    <div style="font-size:12px;line-height:16px;color:#ADADB6;">${label}</div>
                    <div style="margin-top:4px;font-family:'LogEaseNumber','Avenir Next',sans-serif;font-size:16px;font-weight:500;line-height:20px;color:#F6F6F7;">${point.value}</div>
                  </div>`;
                },
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                data: labels,
                axisTick: { show: false },
                axisLine: {
                  show: true,
                  lineStyle: { color: "#232326", width: 1, type: [1, 2] },
                },
                splitLine: {
                  show: false,
                },
                axisLabel: {
                  color: isDayMode ? "#67686c" : "#767683",
                  fontSize: 11,
                  interval: true,
                },
              },
              yAxis: {
                type: "value",
                max: yAxisMaximum,
                splitNumber: 3,
                axisLine: {
                  show: true,
                  lineStyle: { color: "#232326", width: 1, type: [1, 2] },
                },
                axisTick: { show: false },
                axisLabel: {
                  color: isDayMode ? "#67686c" : "#767683",
                  fontSize: 11,
                  formatter: (value: number) => (value === 0 ? "" : String(value)),
                },
                splitLine: {
                  show: true,
                  lineStyle: { color: "#232326", width: 1, type: [1, 2] },
                },
              },
              series: [
                {
                  name: "上一周期",
                  type: "line",
                  data: comparisonValues,
                  smooth: 0.5,
                  showSymbol: false,
                  lineStyle: {
                    color: isDayMode ? "#a5a5b2" : "#676772",
                    width: 1,
                    type: "dashed",
                    opacity: 0.48,
                  },
                  tooltip: { show: false },
                  z: 1,
                },
                {
                  name: "当前周期柔光",
                  type: "line",
                  data: values,
                  smooth: 0.5,
                  showSymbol: false,
                  silent: true,
                  lineStyle: { color: accent, width: 4, opacity: 0.08 },
                  tooltip: { show: false },
                  z: 2,
                },
                {
                  name: "当前周期",
                  type: "line",
                  data: values.map((value, index) => index === values.length - 1
                    ? {
                        value,
                        symbol: "circle",
                        symbolSize: 6,
                        itemStyle: {
                          color: accent,
                          borderColor: isDayMode ? "#ffffff" : "#17171a",
                          borderWidth: 2,
                          shadowBlur: 8,
                          shadowColor: accent,
                        },
                      }
                    : {
                        value,
                        symbol: "circle",
                        symbolSize: 4,
                        itemStyle: { color: accent, opacity: 0 },
                        emphasis: {
                          itemStyle: {
                            color: accent,
                            opacity: 1,
                            borderColor: "#ffffff",
                            borderWidth: 1,
                          },
                        },
                      }),
                  smooth: 0.5,
                  showSymbol: true,
                  lineStyle: { color: accent, width: 1 },
                  areaStyle: { color: `${accent}14` },
                  z: 3,
                },
              ],
            }}
          />
        </div>
      </div>
    </DashboardPanel>
  );
}

const dashboardDispositionData = {
  today: [38, 21, 147],
  week: [186, 92, 824],
} as const;

const dashboardDispositionItems = [
  { label: "待处理", color: "#FF6B6B" },
  { label: "处理中", color: "#FFD24A" },
  { label: "已关闭", color: "#66D9A3" },
] as const;

function DashboardDispositionPanel({ isDayMode = false }: { isDayMode?: boolean }) {
  const [period, setPeriod] = useState<DashboardPeriod>("today");
  const values = dashboardDispositionData[period];
  const total = values.reduce((sum, value) => sum + value, 0);
  const labelColor = isDayMode ? "#323336" : "#f6f6f7";
  const mutedColor = isDayMode ? "#67686c" : "#adadb6";

  return (
    <DashboardPanel title="告警处置统计" period={period} onPeriodChange={setPeriod} isDayMode={isDayMode} className="h-[420px]">
      <div className="flex h-[372px] flex-col items-center px-4 pb-5 pt-12">
        <EChart
          className="h-[230px] w-full"
          theme="light"
          notMerge
          option={{
            animation: false,
            backgroundColor: "transparent",
            title: {
              text: total.toLocaleString("zh-CN"),
              subtext: "告警总数",
              left: "center",
              top: "35%",
              textStyle: {
                color: labelColor,
                fontFamily: '"LogEaseNumber", "Avenir Next", sans-serif',
                fontSize: 24,
                fontWeight: 500,
              },
              subtextStyle: { color: mutedColor, fontSize: 12, lineHeight: 20 },
            },
            tooltip: {
              trigger: "item",
              backgroundColor: "#28282E",
              borderColor: "rgba(255,255,255,0.04)",
              borderWidth: 1,
              extraCssText: "box-shadow: 0 0 2px rgba(0,0,0,0.8);",
              textStyle: { color: "#f6f6f7", fontSize: 12 },
            },
            series: [
              {
                type: "pie",
                radius: ["58%", "76%"],
                center: ["50%", "48%"],
                startAngle: 90,
                padAngle: 4,
                minAngle: 8,
                label: {
                  show: true,
                  position: "outside",
                  color: mutedColor,
                  fontSize: 12,
                  lineHeight: 16,
                  formatter: ({ name, percent }: { name: string; percent: number }) => `${name}\n${percent.toFixed(0)}%`,
                },
                labelLine: { show: true, length: 14, length2: 10, lineStyle: { color: mutedColor, width: 1 } },
                labelLayout: { hideOverlap: true },
                itemStyle: {
                  borderRadius: 12,
                  borderColor: isDayMode ? "#ffffff" : "#17171a",
                  borderWidth: 2,
                },
                data: dashboardDispositionItems.map((item, index) => ({
                  name: item.label,
                  value: values[index],
                  itemStyle: { color: item.color },
                })),
              },
            ],
          }}
            />
        <div className="mt-auto grid w-full grid-cols-3 gap-2">
          {dashboardDispositionItems.map((item, index) => (
            <div key={item.label} className="min-w-0 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[12px] leading-4" style={{ color: mutedColor }}>
                <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
              <div
                className="mt-1 text-[18px] leading-6"
                style={{ color: labelColor, fontFamily: '"LogEaseNumber", "Avenir Next", sans-serif', fontWeight: 500 }}
              >
                {values[index]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardPanel>
  );
}

const dashboardThreatTemplates = [
  { time: "2026-06-18 10:42:36", module: "身份认证", content: "检测到异常账号连续登录失败，来源地址 10.24.18.73", level: "critical" },
  { time: "2026-06-18 10:41:08", module: "Agent", content: "主机 Agent 心跳延迟超过预警阈值，请关注运行状态", level: "warning" },
  { time: "2026-06-18 10:40:26", module: "存储管理", content: "日志存储空间使用率超过 80%，请及时扩容", level: "warning" },
  { time: "2026-06-18 10:39:54", module: "证书管理", content: "服务证书将在 7 天后到期，请及时更新", level: "warning" },
  { time: "2026-06-18 10:39:31", module: "采集任务", content: "部分日志采集延迟超过预设阈值，请检查链路状态", level: "warning" },
  { time: "2026-06-18 10:39:12", module: "API 网关", content: "高频访问命中接口防护规则，已限制请求速率", level: "critical" },
  { time: "2026-06-18 10:31:48", module: "权限管理", content: "普通用户尝试访问管理员资源，操作已阻断", level: "critical" },
  { time: "2026-06-18 10:27:05", module: "流量监控", content: "发现针对生产网段的端口扫描行为", level: "critical" },
  { time: "2026-06-18 10:18:43", module: "数据安全", content: "敏感字段下载量超过基线阈值，请及时核查", level: "critical" },
  { time: "2026-06-18 10:06:29", module: "Agent", content: "主机 Agent 连续三次心跳超时，状态已标记异常", level: "critical" },
] as const;

type DashboardThreat = {
  id: string;
  time: string;
  module: string;
  content: string;
  level: "critical" | "warning";
};

const colorizeDashboardThreatIcon = (color: string) => {
  if (color === "#FF4848") return dashboardLatestThreatIcon;

  return dashboardLatestThreatIcon
    .replace(/#FF4848/gi, color)
    .replace(/rgba\(255,\s*72,\s*72,/gi, "rgba(255, 198, 76,")
    .replace(/rgba\(255,\s*71,\s*71,/gi, "rgba(255, 198, 76,");
};

function createDashboardThreat(templateIndex: number, sequence: number): DashboardThreat {
  const template = dashboardThreatTemplates[templateIndex % dashboardThreatTemplates.length];
  const now = new Date();
  const time = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-") + ` ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  return {
    ...template,
    id: `threat-${now.getTime()}-${sequence}`,
    time,
  };
}

function DashboardThreatRow({
  threat,
  isDayMode,
  className,
}: {
  threat: DashboardThreat;
  isDayMode: boolean;
  className?: string;
}) {
  const mutedColor = isDayMode ? "#67686c" : "#adadb6";
  const textColor = isDayMode ? "#323336" : "#f6f6f7";
  const isWarning = threat.level === "warning";
  const accentColor = isWarning ? "#FFC64C" : "#FF4848";
  const glowColor = isWarning ? "rgba(255, 198, 76, 0.08)" : "rgba(255, 76, 76, 0.08)";
  const glowEndColor = isWarning ? "#FFC64C" : "#FF4C4C";

  return (
    <div className={cn("relative isolate flex h-9 shrink-0 items-center overflow-hidden rounded-[6px]", className)}>
      <span
        aria-hidden="true"
        data-threat-glow="true"
        className="pointer-events-none absolute inset-x-0 bottom-1.5 z-0 h-[21px] rounded-[6px]"
        style={{ background: `linear-gradient(180deg, ${glowColor} 78.85%, ${glowEndColor} 100%)` }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] rounded-[6px]"
        style={{
          backgroundColor: isDayMode ? "rgba(255,255,255,0.72)" : "rgba(23,23,26,0.12)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          boxShadow: "inset 0 0 8px rgba(255,255,255,0.04)",
        }}
      />
      <div className="relative z-[2] flex w-full items-center pl-2 pr-3">
        <div className="flex min-w-0 flex-1 items-center">
          <RawSvgIcon
            svg={colorizeDashboardThreatIcon(accentColor)}
            className="dashboard-latest-threat-icon mr-1 size-6 shrink-0"
            useCurrentColor={false}
          />
          <Tag tone={isWarning ? "yellow" : "red"}>{isWarning ? "中风险" : "高风险"}</Tag>
          <span
            className="ml-3 min-w-0 truncate text-[13px] leading-4"
            style={{ color: textColor }}
            title={`${threat.module} · ${threat.content}`}
          >
            <span className="font-medium">{threat.module}</span>
            <span className="mx-2" style={{ color: mutedColor }}>·</span>
            {threat.content}
          </span>
        </div>
        <span className="ml-3 shrink-0 whitespace-nowrap text-[12px] leading-4" style={{ color: mutedColor }}>
          {threat.time}
        </span>
      </div>
    </div>
  );
}

function DashboardThreatPanel({
  isDayMode = false,
  onViewMore,
}: {
  isDayMode?: boolean;
  onViewMore?: () => void;
}) {
  const initialThreats = useRef<DashboardThreat[]>(Array.from({ length: 8 }, (_, index) => ({
    ...dashboardThreatTemplates[index % dashboardThreatTemplates.length],
    id: `initial-threat-${index}`,
  })));
  const initialBufferedThreat = useRef<DashboardThreat>(createDashboardThreat(0, 0));
  const [threats, setThreats] = useState<DashboardThreat[]>(initialThreats.current);
  const [bufferedThreat, setBufferedThreat] = useState<DashboardThreat>(initialBufferedThreat.current);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGlowSettling, setIsGlowSettling] = useState(false);
  const threatsRef = useRef(initialThreats.current);
  const bufferedThreatRef = useRef(initialBufferedThreat.current);
  const isRefreshingRef = useRef(false);
  const transitionTimerRef = useRef<number | null>(null);
  const glowTimerRef = useRef<number | null>(null);
  const threatCursor = useRef(1);

  useEffect(() => {
    const refreshTimer = window.setInterval(() => {
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;
      setIsGlowSettling(false);
      setIsRefreshing(true);

      transitionTimerRef.current = window.setTimeout(() => {
        const settledThreats = [bufferedThreatRef.current, ...threatsRef.current].slice(0, 8);
        threatsRef.current = settledThreats;
        setThreats(settledThreats);

        const nextBufferedThreat = createDashboardThreat(threatCursor.current, threatCursor.current);
        threatCursor.current += 1;
        bufferedThreatRef.current = nextBufferedThreat;
        setBufferedThreat(nextBufferedThreat);
        isRefreshingRef.current = false;
        setIsRefreshing(false);
        setIsGlowSettling(true);
        glowTimerRef.current = window.setTimeout(() => setIsGlowSettling(false), 300);
      }, 300);
    }, 5000);

    return () => {
      window.clearInterval(refreshTimer);
      if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
      if (glowTimerRef.current !== null) window.clearTimeout(glowTimerRef.current);
    };
  }, []);

  return (
    <DashboardPanel
      title="最新威胁"
      isDayMode={isDayMode}
      className="h-[420px]"
      headerAction={<GoSettingsButton label="查看更多" onClick={onViewMore} />}
    >
      <div className="relative h-[372px] overflow-hidden px-3 py-3">
        <div
          className={cn(
            "dashboard-threat-buffer absolute inset-x-3 top-3 z-10",
            isRefreshing && "dashboard-threat-buffer-enter"
          )}
        >
          <DashboardThreatRow threat={bufferedThreat} isDayMode={isDayMode} />
        </div>
        <div className="flex flex-col gap-2">
          {threats.map((threat, index) => (
            <DashboardThreatRow
              key={`threat-slot-${index}`}
              threat={threat}
              isDayMode={isDayMode}
              className={cn(
                isRefreshing && index < 7 && "dashboard-threat-visible-shift",
                isRefreshing && index === 7 && "dashboard-threat-last-hidden",
                isGlowSettling && index === 0 && "dashboard-threat-glow-settle"
              )}
            />
          ))}
        </div>
      </div>
    </DashboardPanel>
  );
}

function DashboardOverviewPage({
  isDayMode = false,
  onViewThreatAlerts,
}: {
  isDayMode?: boolean;
  onViewThreatAlerts?: () => void;
}) {
  return (
    <div className="-mx-4 min-h-[940px] px-4 pt-0">
      <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-4">
        {dashboardCards.map((card) => (
          <div key={card.label} className="col-span-4 min-w-0">
            <DashboardMetricCard card={card} isDayMode={isDayMode} />
          </div>
        ))}
        <div className="col-span-12 min-w-0">
          <DashboardVolumePanel kind="alert" isDayMode={isDayMode} />
        </div>
        <div className="col-span-12 min-w-0">
          <DashboardVolumePanel kind="intercept" isDayMode={isDayMode} />
        </div>
        <div className="col-span-7 min-w-0">
          <DashboardDispositionPanel isDayMode={isDayMode} />
        </div>
        <div className="col-span-17 min-w-0">
          <DashboardThreatPanel isDayMode={isDayMode} onViewMore={onViewThreatAlerts} />
        </div>
      </div>
    </div>
  );
}

const threatSeverityStats = [
  {
    label: "高风险",
    value: 975,
    color: "#FF4848",
    tone: "red" as TagTone,
    statuses: [112, 88, 64, 90, 402, 54, 121],
  },
  {
    label: "中风险",
    value: 199,
    color: "#FFC64C",
    tone: "yellow" as TagTone,
    statuses: [32, 18, 26, 14, 61, 24, 24],
  },
  {
    label: "低风险",
    value: 8726,
    color: "#66D9A3",
    tone: "green" as TagTone,
    statuses: [331, 86, 522, 91, 303, 417, 267],
  },
] as const;

const threatStatusOptions = [
  { id: "all", label: "全部" },
  { id: "pending-analysis", label: "待分析" },
  { id: "failed", label: "未成功" },
  { id: "success", label: "成功" },
  { id: "false-positive", label: "误报" },
  { id: "pending", label: "待处理" },
  { id: "processed", label: "已处理" },
  { id: "pending-analysis-secondary", label: "待分析" },
] as const;

const threatScenarioTemplates = [
  { name: "异常登录行为", stage: "凭证访问", origin: "身份认证", tags: ["暴力破解", "外网"], mitre: ["T1078"] },
  { name: "敏感数据异常下载", stage: "数据渗出", origin: "数据安全", tags: ["敏感数据", "下载异常"], mitre: ["T1041"] },
  { name: "主机心跳异常", stage: "持久化", origin: "Agent", tags: ["主机异常", "心跳"], mitre: ["T1543"] },
  { name: "API 高频访问", stage: "初始访问", origin: "API 网关", tags: ["频率异常", "接口"], mitre: ["T1190"] },
  { name: "端口扫描行为", stage: "发现", origin: "流量监控", tags: ["横向扫描", "端口"], mitre: ["T1046"] },
  { name: "服务证书即将到期", stage: "资源开发", origin: "证书管理", tags: ["证书", "到期"], mitre: ["T1588"] },
  { name: "管理员资源越权访问", stage: "权限提升", origin: "权限管理", tags: ["越权", "高危"], mitre: ["T1068"] },
  { name: "日志采集延迟", stage: "命令执行", origin: "采集任务", tags: ["采集链路", "延迟"], mitre: ["T1059"] },
] as const;

const threatDispositionPool = ["待分析", "未成功", "成功", "误报", "待处理", "处理中", "已关闭", "已拦截"] as const;
const threatUserPool = ["admin", "ops-li", "system", "guest", "scanner", "collector", "sec-ops", "user-1042", "analyst-wu", "auditor-01"] as const;

function padThreatNumber(value: number) {
  return String(value).padStart(4, "0");
}

function createThreatRows(severity: "高风险" | "中风险" | "低风险", count: number, offset: number) {
  return Array.from({ length: count }, (_, index) => {
    const template = threatScenarioTemplates[(index + offset) % threatScenarioTemplates.length];
    const day = 22 - Math.floor(index / 14);
    const hour = 23 - ((index * 3 + offset) % 24);
    const minute = (48 - index * 5 + 60) % 60;
    const second = (26 + index * 7) % 60;
    const octetA = 10 + ((index + offset) % 180);
    const octetB = 8 + ((index * 3 + offset) % 40);
    const octetC = 3 + ((index * 5 + offset) % 60);
    const octetD = 5 + ((index * 7 + offset) % 200);
    const destA = 172 + ((index + offset) % 8);
    const destB = 16 + ((index * 2 + offset) % 12);
    const destC = 4 + ((index * 4 + offset) % 24);
    const destD = 11 + ((index * 6 + offset) % 210);
    const disposition = threatDispositionPool[(index + offset) % threatDispositionPool.length];
    const user = threatUserPool[(index * 2 + offset) % threatUserPool.length];
    const idBase = 1048 - offset * 100 - index;
    const action = disposition === "待分析" || disposition === "待处理" ? "分析" : "查看";

    return {
      source: `${octetA}.${octetB}.${octetC}.${octetD}`,
      name: template.name,
      destination: `${destA}.${destB}.${destC}.${destD}`,
      id: `THR-202606${String(Math.max(day, 1)).padStart(2, "0")}-${padThreatNumber(Math.max(idBase, 1))}`,
      createdAt: `2026-06-${String(Math.max(day, 1)).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`,
      user,
      stage: template.stage,
      severity,
      disposition,
      origin: template.origin,
      tags: template.tags,
      mitre: template.mitre,
      action,
    };
  });
}

const highThreatRows = createThreatRows("高风险", 42, 0);
const mediumThreatRows = createThreatRows("中风险", 42, 1);
const lowThreatRows = createThreatRows("低风险", 42, 2);

const threatAlertRows = [
  highThreatRows[0],
  mediumThreatRows[0],
  highThreatRows[1],
  lowThreatRows[0],
  mediumThreatRows[1],
  highThreatRows[2],
  mediumThreatRows[2],
  highThreatRows[3],
  lowThreatRows[1],
  mediumThreatRows[3],
  highThreatRows[4],
  mediumThreatRows[4],
  highThreatRows[5],
  lowThreatRows[2],
  mediumThreatRows[5],
  highThreatRows[6],
  mediumThreatRows[6],
  highThreatRows[7],
  lowThreatRows[3],
  mediumThreatRows[7],
  ...highThreatRows.slice(8),
  ...mediumThreatRows.slice(8),
  ...lowThreatRows.slice(4),
] as const;

function ThreatFilterField({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <span className="text-[14px] leading-4 text-[#adadb6]" style={buttonTypography}>{label}</span>
      {children}
    </div>
  );
}

function ThreatEmptyState({ isDayMode = false }: { isDayMode?: boolean }) {
  const textColor = isDayMode ? "#323336" : "#f6f6f7";
  const mutedColor = isDayMode ? "#a5a5b2" : "#adadb6";
  const panelBg = isDayMode ? "#f8f8f8" : "#17171a";
  const lineColor = isDayMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
  const glowColor = isDayMode ? "rgba(53,102,236,0.12)" : "rgba(53,102,236,0.18)";

  return (
    <div className="grid h-[320px] place-items-center rounded-[6px] border border-[#232328]" style={{ backgroundColor: panelBg }}>
      <div className="flex flex-col items-center">
        <div className="relative mb-6 h-[104px] w-[148px]">
          <span className="absolute left-4 top-5 h-[58px] w-[44px] rounded-[6px] border" style={{ borderColor: lineColor, backgroundColor: glowColor }} />
          <span className="absolute left-[52px] top-3 h-[72px] w-[54px] rounded-[8px] border" style={{ borderColor: lineColor, backgroundColor: isDayMode ? "#ffffff" : "#1d1d22" }} />
          <span className="absolute left-[68px] top-[24px] h-[4px] w-[22px] rounded-full" style={{ backgroundColor: lineColor }} />
          <span className="absolute left-[68px] top-[36px] h-[4px] w-[28px] rounded-full" style={{ backgroundColor: lineColor }} />
          <span className="absolute left-[68px] top-[48px] h-[4px] w-[18px] rounded-full" style={{ backgroundColor: lineColor }} />
          <span className="absolute right-4 top-[52px] size-[40px] rounded-full border-2" style={{ borderColor: "#3566EC" }} />
          <span className="absolute right-[6px] top-[84px] h-[2px] w-[20px] rotate-45 rounded-full" style={{ backgroundColor: "#3566EC" }} />
        </div>
        <div className="text-[16px] leading-6" style={{ color: textColor }}>暂无符合条件的威胁告警</div>
        <div className="mt-2 text-[14px] leading-5" style={{ color: mutedColor }}>调整筛选条件后再试，或重置为默认查询</div>
      </div>
    </div>
  );
}

function ThreatTableLoadingSkeleton({ isDayMode = false }: { isDayMode?: boolean }) {
  const headerBg = isDayMode ? "#F2F2F2" : "#30333c";
  const lineBg = isDayMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.02)";
  const strongBg = isDayMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";

  return (
    <div className="p-3">
      <div className="overflow-hidden rounded-[6px] border border-[#232328]">
        <div className="grid h-10 grid-cols-[130px_170px_130px_175px_170px_100px_120px_100px_110px_120px_180px_80px] items-center gap-0 px-4" style={{ backgroundColor: headerBg }}>
          {Array.from({ length: 12 }).map((_, index) => (
            <SearchSkeletonBlock
              key={index}
              className={index === 10 ? "h-4 w-[92px]" : index === 11 ? "h-4 w-10" : "h-4 w-[68px]"}
              background={strongBg}
            />
          ))}
        </div>
        <div className="flex flex-col">
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="grid h-10 grid-cols-[130px_170px_130px_175px_170px_100px_120px_100px_110px_120px_180px_80px] items-center gap-0 border-t border-[#232328] px-4"
              style={{ backgroundColor: lineBg }}
            >
              <SearchSkeletonBlock className="h-4 w-[84px]" background="rgba(255,255,255,0.06)" />
              <SearchSkeletonBlock className="h-4 w-[116px]" background="rgba(255,255,255,0.06)" />
              <SearchSkeletonBlock className="h-4 w-[88px]" background="rgba(255,255,255,0.06)" />
              <SearchSkeletonBlock className="h-4 w-[138px]" background="rgba(255,255,255,0.06)" />
              <SearchSkeletonBlock className="h-4 w-[146px]" background="rgba(255,255,255,0.06)" />
              <SearchSkeletonBlock className="h-4 w-[56px]" background="rgba(255,255,255,0.06)" />
              <SearchSkeletonBlock className="h-4 w-[72px]" background="rgba(255,255,255,0.06)" />
              <SearchSkeletonBlock className="h-5 w-[52px]" background="rgba(255,255,255,0.08)" />
              <SearchSkeletonBlock className="h-4 w-[64px]" background="rgba(255,255,255,0.06)" />
              <SearchSkeletonBlock className="h-4 w-[70px]" background="rgba(255,255,255,0.06)" />
              <div className="flex gap-1">
                <SearchSkeletonBlock className="h-5 w-[48px]" background="rgba(255,255,255,0.08)" />
                <SearchSkeletonBlock className="h-5 w-[52px]" background="rgba(255,255,255,0.08)" />
              </div>
              <SearchSkeletonBlock className="h-4 w-8" background="rgba(255,255,255,0.06)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThreatAlertsPage({ isDayMode = false }: { isDayMode?: boolean }) {
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>(["高风险"]);
  const [selectedStatusId, setSelectedStatusId] = useState<string>("all");
  const [threatId, setThreatId] = useState("");
  const [threatName, setThreatName] = useState("");
  const [stage, setStage] = useState("");
  const [advancedQuery, setAdvancedQuery] = useState("");
  const [mitreSelection, setMitreSelection] = useState<string[]>([]);
  const [cascadeKey, setCascadeKey] = useState(0);
  const [submittedFilters, setSubmittedFilters] = useState({ threatId: "", threatName: "", stage: "", advancedQuery: "", mitreSelection: [] as string[] });
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState("每页20条");
  const [hoveredThreatRowId, setHoveredThreatRowId] = useState<string | null>(null);
  const [isThreatTableLoading, setIsThreatTableLoading] = useState(false);
  const threatTableScrollRef = useRef<HTMLDivElement>(null);
  const threatTableLoadingTimerRef = useRef<number | null>(null);
  const [threatTableScroll, setThreatTableScroll] = useState({ left: 0, width: 100, visible: false, showShadow: false });
  const panelColor = isDayMode ? "#ffffff" : "#17171a";
  const borderColor = isDayMode ? "#dfdfdf" : "#232328";
  const primaryText = isDayMode ? "#323336" : "#f6f6f7";
  const mutedText = isDayMode ? "#67686c" : "#adadb6";
  const visibleSeverityStats = threatSeverityStats.filter((item) => selectedSeverities.includes(item.label));
  const statusCounts = threatStatusOptions.map((_, statusIndex) => statusIndex === 0
    ? visibleSeverityStats.reduce((total, item) => total + item.value, 0)
    : visibleSeverityStats.reduce((total, item) => total + item.statuses[statusIndex - 1], 0));
  const selectedStatus = threatStatusOptions.find((item) => item.id === selectedStatusId);

  const filteredRows = threatAlertRows.filter((row) => {
    const severityMatched = selectedSeverities.includes(row.severity);
    const statusMatched = selectedStatusId === "all"
      ? true
      : selectedStatus?.label === "已处理"
        ? ["处理中", "已关闭", "已拦截"].includes(row.disposition)
        : row.disposition === selectedStatus?.label;
    const idMatched = !submittedFilters.threatId || row.id.toLowerCase().includes(submittedFilters.threatId.toLowerCase());
    const nameMatched = !submittedFilters.threatName || row.name.includes(submittedFilters.threatName);
    const stageMatched = !submittedFilters.stage || row.stage === submittedFilters.stage;
    const mitreMatched = submittedFilters.mitreSelection.length === 0
      || submittedFilters.mitreSelection.some((selection) => row.mitre.some((technique) => selection.includes(technique)));
    const query = submittedFilters.advancedQuery.trim().toLowerCase();
    const queryMatched = !query || Object.values(row).flat().join(" ").toLowerCase().includes(query);
    return severityMatched && statusMatched && idMatched && nameMatched && stageMatched && mitreMatched && queryMatched;
  });
  const rowsPerPage = pageSize === "每页40条" ? 40 : 20;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const pagedRows = filteredRows.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage);
  const hasThreatQueryValues = Boolean(threatId.trim() || threatName.trim() || stage || advancedQuery.trim() || mitreSelection.length > 0);

  const resetFilters = () => {
    setThreatId("");
    setThreatName("");
    setStage("");
    setAdvancedQuery("");
    setMitreSelection([]);
    setCascadeKey((value) => value + 1);
    setSubmittedFilters({ threatId: "", threatName: "", stage: "", advancedQuery: "", mitreSelection: [] });
    setActivePage(1);
  };

  const triggerThreatTableLoading = (updater: () => void) => {
    updater();
    setIsThreatTableLoading(true);
    if (threatTableLoadingTimerRef.current !== null) {
      window.clearTimeout(threatTableLoadingTimerRef.current);
    }
    threatTableLoadingTimerRef.current = window.setTimeout(() => {
      setIsThreatTableLoading(false);
      threatTableLoadingTimerRef.current = null;
    }, 900);
  };

  const toggleSeverity = (label: string) => {
    triggerThreatTableLoading(() => {
      setSelectedSeverities((values) => {
        const checked = values.includes(label);
        if (checked) {
          return values.length === 1 ? values : values.filter((value) => value !== label);
        }
        return [...values, label];
      });
      setActivePage(1);
    });
  };

  useEffect(() => {
    const content = threatTableScrollRef.current;
    if (!content) return;

    const updateScrollbar = () => {
      const maxScroll = content.scrollWidth - content.clientWidth;
      if (maxScroll <= 1) {
        setThreatTableScroll({ left: 0, width: 100, visible: false, showShadow: false });
        return;
      }

      const width = (content.clientWidth / content.scrollWidth) * 100;
      const left = (content.scrollLeft / maxScroll) * (100 - width);
      const showShadow = true;
      setThreatTableScroll({ left, width, visible: true, showShadow });
    };

    updateScrollbar();
    content.addEventListener("scroll", updateScrollbar, { passive: true });
    window.addEventListener("resize", updateScrollbar);

    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(content);

    return () => {
      content.removeEventListener("scroll", updateScrollbar);
      window.removeEventListener("resize", updateScrollbar);
      resizeObserver.disconnect();
    };
  }, [filteredRows, isDayMode]);

  useEffect(() => {
    return () => {
      if (threatTableLoadingTimerRef.current !== null) {
        window.clearTimeout(threatTableLoadingTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex min-h-[900px] w-full flex-col gap-4 pb-4">
      <section className="h-[124px] overflow-hidden rounded-[6px]" style={{ backgroundColor: panelColor }}>
        <div className="flex h-16 items-center gap-3 border-b px-3" style={{ borderColor }}>
            {threatSeverityStats.map((item) => {
              const checked = selectedSeverities.includes(item.label);
              return (
                <button
                  key={item.label}
                  type="button"
                  className="relative flex h-10 w-[264px] shrink-0 items-center overflow-hidden rounded-[6px] px-2 text-left"
                  onClick={() => toggleSeverity(item.label)}
                >
                  <span className="absolute inset-0 rounded-[6px]" style={{ background: `linear-gradient(180deg, ${item.color}10 0%, ${item.color}30 100%)` }} />
                  <span
                    className="absolute inset-0 rounded-[6px] shadow-[inset_0_0_8px_2px_rgba(255,255,255,0.04)] backdrop-blur-[12px]"
                    style={{ backgroundColor: checked ? "rgba(23,23,26,0)" : "rgba(23,23,26,0.92)" }}
                  />
                  {checked ? <Check className="relative mr-2 size-4 shrink-0 text-[#f6f6f7]" strokeWidth={1.8} /> : null}
                  <span className="relative text-[14px] leading-4" style={{ color: checked ? primaryText : "#ADADB6" }}>{item.label}</span>
                  <span
                    className="absolute right-3 top-2.5 text-right text-[20px] leading-5"
                    style={{ color: checked ? primaryText : "#ADADB6", fontFamily: '"LogEaseNumber", "Avenir Next", sans-serif', fontWeight: 600 }}
                  >
                    {item.value}
                  </span>
                </button>
              );
            })}
        </div>
        <div className="grid h-[60px] grid-cols-8 items-center gap-3 px-3">
            {threatStatusOptions.map((option, index) => {
              const checked = selectedStatusId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  className="flex h-9 min-w-0 items-center justify-between rounded-[6px] px-3 text-left text-[#f6f6f7] transition-colors"
                  style={{
                    backgroundColor: checked ? "rgba(53,102,236,0.32)" : "rgba(53,102,236,0.08)",
                    border: checked ? "1px solid #3566ec" : "1px solid transparent",
                  }}
                  onClick={() =>
                    triggerThreatTableLoading(() => {
                      setSelectedStatusId(option.id);
                      setActivePage(1);
                    })
                  }
                >
                  <span className="truncate text-[14px] leading-4">{option.label}</span>
                  <span
                    className="shrink-0 text-right text-[16px] leading-4"
                    style={{ fontFamily: '"LogEaseNumber", "Avenir Next", sans-serif', fontWeight: 600 }}
                  >{statusCounts[index]}</span>
                </button>
              );
            })}
        </div>
      </section>

      <section className="relative z-20 h-[196px] rounded-[6px]" style={{ backgroundColor: panelColor }}>
        <header className="flex h-12 items-center border-b px-4" style={{ borderColor }}>
          <h2 className="text-[14px] font-medium leading-4" style={{ color: isDayMode ? "#323336" : "#C1C7E2" }}>条件查询</h2>
        </header>
        <div className="grid grid-cols-[335fr_335fr_335fr_602fr] grid-rows-2 gap-x-3 gap-y-3 p-3">
          <ThreatFilterField label="ID">
            <FormTextInput placeholder="请输入威胁ID" value={threatId} onChange={setThreatId} />
          </ThreatFilterField>
          <ThreatFilterField label="威胁名称">
            <FormTextInput placeholder="请输入威胁名称" value={threatName} onChange={setThreatName} />
          </ThreatFilterField>
          <ThreatFilterField label="威胁阶段">
            <FormDropdownSelect
              placeholder="请选择威胁阶段"
              options={["初始访问", "执行", "持久化", "权限提升", "凭证访问", "发现", "资源开发", "命令执行", "数据渗出"]}
              value={stage}
              onChange={setStage}
            />
          </ThreatFilterField>
          <ThreatFilterField label="MITRE ATT&CK">
            <MultiLevelDropdownSelect
              key={cascadeKey}
              className="relative w-full min-w-[240px]"
              onSelectionChange={setMitreSelection}
            />
          </ThreatFilterField>
          <ThreatFilterField label="高级查询" className="col-span-2">
            <FormTextInput placeholder="请输入搜索语句，例如 severity:high AND status:pending" value={advancedQuery} onChange={setAdvancedQuery} />
          </ThreatFilterField>
          <div className="flex items-end gap-2">
            {hasThreatQueryValues ? <DesignButton onClick={() => triggerThreatTableLoading(resetFilters)}>重置</DesignButton> : null}
            <DesignButton
              variant="primary"
              onClick={() =>
                triggerThreatTableLoading(() => {
                  setSubmittedFilters({ threatId, threatName, stage, advancedQuery, mitreSelection });
                  setActivePage(1);
                })
              }
            >
              搜索
            </DesignButton>
          </div>
        </div>
        <span className="sr-only">{mitreSelection.length} 个 MITRE ATT&CK 选项已选择</span>
      </section>

      <section className="relative z-10 -mt-1 min-w-0 rounded-[6px]" style={{ backgroundColor: panelColor }}>
        <header className="flex h-12 items-center border-b px-4" style={{ borderColor }}>
          <h2 className="text-[14px] font-medium leading-4" style={{ color: isDayMode ? "#323336" : "#C1C7E2" }}>威胁列表</h2>
        </header>
        {isThreatTableLoading ? (
          <ThreatTableLoadingSkeleton isDayMode={isDayMode} />
        ) : (
        <div className="p-3">
          {filteredRows.length === 0 ? (
            <ThreatEmptyState isDayMode={isDayMode} />
          ) : (
            <>
          <div className="flex min-w-0 rounded-[6px]">
            <div className="relative z-10 w-[430px] shrink-0">
              {threatTableScroll.showShadow ? (
                <span className="pointer-events-none absolute bottom-0 right-[-18px] top-0 z-20 w-[18px] bg-gradient-to-r from-[rgba(0,0,0,0.28)] to-transparent" />
              ) : null}
              <div
                className="grid h-10 items-center rounded-tl-[6px] border border-r-0 border-[#232328] px-4 text-[14px] leading-[14px] text-[#adadb6]"
                style={{
                  gridTemplateColumns: "130px 170px 130px",
                  backgroundColor: isDayMode ? "#F2F2F2" : "#30333c",
                }}
              >
                {["源地址", "威胁名称", "目的地址"].map((label) => <span key={label}>{label}</span>)}
              </div>
              {pagedRows.map((row) => (
                <div
                  key={row.id}
                  className="grid h-10 items-center border border-r-0 border-t-0 border-[#232328] px-4 text-[14px] leading-4 transition-colors"
                  style={{
                    gridTemplateColumns: "130px 170px 130px",
                    color: primaryText,
                    backgroundColor: hoveredThreatRowId === row.id ? "rgba(255,255,255,0.08)" : "transparent",
                  }}
                  onMouseEnter={() => setHoveredThreatRowId(row.id)}
                  onMouseLeave={() => setHoveredThreatRowId((current) => (current === row.id ? null : current))}
                >
                  <span className="truncate pr-3">{row.source}</span>
                  <span className="truncate pr-3" title={row.name}>{row.name}</span>
                  <span className="truncate pr-3">{row.destination}</span>
                </div>
              ))}
            </div>
            <div className="relative min-w-0 flex-1 overflow-hidden rounded-r-[6px] border-r border-[#232328]">
            <div ref={threatTableScrollRef} className="log-scrollbar min-w-0 overflow-x-auto overflow-y-hidden">
              <div className="min-w-[1290px] w-full">
                <div
                  className="grid h-10 items-center rounded-tr-[6px] border border-l-0 border-r-0 border-[#232328] px-4 text-[14px] leading-[14px] text-[#adadb6]"
                  style={{
                    gridTemplateColumns: "minmax(175px,1.35fr) minmax(170px,1.3fr) minmax(100px,0.75fr) minmax(120px,0.9fr) minmax(100px,0.75fr) minmax(110px,0.85fr) minmax(120px,0.9fr) minmax(180px,1.4fr) minmax(80px,0.6fr)",
                    backgroundColor: isDayMode ? "#F2F2F2" : "#30333c",
                  }}
                >
                  {["威胁 ID", "创建时间", "用户", "威胁阶段", "威胁状态", "处置状态", "告警来源", "标签", "操作"].map((label) => <span key={label}>{label}</span>)}
                </div>
                {pagedRows.map((row) => (
                  <div
                    key={row.id}
                    className="grid h-10 items-center border border-l-0 border-r-0 border-t-0 border-[#232328] px-4 text-[14px] leading-4 transition-colors"
                    style={{
                      gridTemplateColumns: "minmax(175px,1.35fr) minmax(170px,1.3fr) minmax(100px,0.75fr) minmax(120px,0.9fr) minmax(100px,0.75fr) minmax(110px,0.85fr) minmax(120px,0.9fr) minmax(180px,1.4fr) minmax(80px,0.6fr)",
                      color: primaryText,
                      backgroundColor: hoveredThreatRowId === row.id ? "rgba(255,255,255,0.08)" : "transparent",
                    }}
                    onMouseEnter={() => setHoveredThreatRowId(row.id)}
                    onMouseLeave={() => setHoveredThreatRowId((current) => (current === row.id ? null : current))}
                  >
                    <span className="truncate pr-3 text-[#789af9]">{row.id}</span>
                    <span className="truncate pr-3" style={{ color: mutedText }}>{row.createdAt}</span>
                    <span className="truncate pr-3">{row.user}</span>
                    <span className="truncate pr-3">{row.stage}</span>
                    <span><Tag tone={row.severity === "高风险" ? "red" : row.severity === "中风险" ? "yellow" : "green"}>{row.severity}</Tag></span>
                    <span className="truncate pr-3">{row.disposition}</span>
                    <span className="truncate pr-3">{row.origin}</span>
                    <span className="flex min-w-0 gap-1 overflow-hidden">
                      {row.tags.map((tag) => <Tag key={tag} tone="neutral">{tag}</Tag>)}
                    </span>
                    <button type="button" className="text-left text-[#6e93f8]">{row.action}</button>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
          {threatTableScroll.visible ? (
            <div className="mt-2 ml-[430px] h-0.5 overflow-hidden rounded-full bg-transparent">
              <div
                className="h-0.5 rounded-full bg-[#767683]"
                style={{ marginLeft: `${threatTableScroll.left}%`, width: `${threatTableScroll.width}%` }}
              />
            </div>
          ) : null}
          <footer className="mt-3 flex justify-end">
            <PaginationControl
              activePage={activePage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setActivePage}
              onPageSizeChange={(value) => {
                setPageSize(value);
                setActivePage(1);
              }}
              size="32"
            />
          </footer>
            </>
          )}
        </div>
        )}
      </section>
    </div>
  );
}

const searchFields = [
  { label: "host", count: "18" },
  { label: "source", count: "42" },
  { label: "sourcetype", count: "12" },
  { label: "service", count: "26" },
  { label: "level", count: "5" },
  { label: "region", count: "8" },
] as const;

const logEvents = [
  {
    time: "10:42:18.482",
    host: "prod-api-07",
    source: "api-gateway",
    level: "error",
    tone: "red" as TagTone,
    message: "upstream request failed status=502 route=/checkout/payment latency=1842ms request_id=8c13f2",
  },
  {
    time: "10:42:16.094",
    host: "prod-api-03",
    source: "api-gateway",
    level: "warn",
    tone: "yellow" as TagTone,
    message: "retrying upstream request attempt=2 route=/checkout/payment upstream=payment-service",
  },
  {
    time: "10:42:14.776",
    host: "prod-pay-02",
    source: "payment-service",
    level: "error",
    tone: "red" as TagTone,
    message: "database connection timeout pool=transactions elapsed=1200ms available=0",
  },
  {
    time: "10:42:09.441",
    host: "prod-web-12",
    source: "frontend-access",
    level: "info",
    tone: "blue" as TagTone,
    message: "POST /checkout/payment HTTP/2 502 duration=1918ms user_agent=Mozilla/5.0",
  },
  {
    time: "10:41:58.029",
    host: "prod-api-11",
    source: "api-gateway",
    level: "info",
    tone: "blue" as TagTone,
    message: "request completed status=200 route=/cart/summary latency=84ms request_id=b2099a",
  },
  {
    time: "10:41:51.638",
    host: "prod-auth-04",
    source: "identity-service",
    level: "warn",
    tone: "yellow" as TagTone,
    message: "login attempts above baseline region=cn-east client=mobile count=143 window=5m",
  },
] as const;

function LogSearchPage() {
  const [query, setQuery] = useState('index=production service="api-gateway" | search status>=500');
  const [isQueryFocused, setIsQueryFocused] = useState(false);
  const [isQueryHovered, setIsQueryHovered] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState(0);
  const [selectedLogIndex, setSelectedLogIndex] = useState<number | null>(null);
  const queryPhase: InputPhase = isQueryFocused ? "typing" : query ? "complete" : isQueryHovered ? "hover" : "default";
  const querySuffixDivider = queryPhase === "typing" ? "border-transparent" : queryPhase === "hover" ? "border-[#71717c]" : "border-[#52525c]";

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[13px] leading-4 text-[#767683]">数据分析 / 搜索</div>
          <h1 className="mt-2 text-[24px] font-semibold leading-7 text-[#f6f6f7]">日志搜索</h1>
          <p className="mt-2 text-[14px] leading-5 text-[#767683]">检索、筛选和分析生产环境日志。</p>
        </div>
        <DesignButton>
          <span className="flex items-center gap-1.5">
            <Clock3 className="size-4" strokeWidth={1.6} />
            搜索历史
          </span>
        </DesignButton>
      </div>

      <section className="rounded-[6px] border border-[#232328] bg-[#17171a] p-4">
        <div className="flex flex-wrap gap-2">
          <div
            className="flex h-8 min-w-[420px] flex-1 items-center overflow-hidden rounded-[6px] border transition-colors"
            style={visual[queryPhase]}
            data-state={queryPhase}
            onMouseEnter={() => setIsQueryHovered(true)}
            onMouseLeave={() => setIsQueryHovered(false)}
          >
            <Search className="ml-1.5 mr-1.5 size-4 shrink-0 text-[#adadb6]" strokeWidth={1.6} />
            <input
              aria-label="日志搜索语句"
              className="h-4 min-w-0 flex-1 bg-transparent p-0 font-mono text-[13px] leading-4 text-[#f6f6f7] outline-none"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setIsQueryFocused(true)}
              onBlur={() => setIsQueryFocused(false)}
            />
            <button
              type="button"
              className={cn(
                "flex h-8 min-w-[132px] shrink-0 items-center justify-between gap-2 border-l bg-[rgba(47,47,56,0.6)] px-2 text-[14px] leading-4 text-[#f6f6f7]",
                querySuffixDivider
              )}
            >
              <span>最近 24 小时</span>
              <ChevronDown className="size-4 shrink-0 text-[#adadb6]" strokeWidth={1.6} />
            </button>
          </div>
          <DesignButton variant="primary">搜索</DesignButton>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] leading-4 text-[#767683]">
          <span>搜索模式：智能</span>
          <span className="size-1 rounded-full bg-[#52525c]" />
          <span>时间范围：绝对时间</span>
          <span className="size-1 rounded-full bg-[#52525c]" />
          <span>最近完成：0.428 秒</span>
        </div>
      </section>

      <div className="grid min-h-[640px] gap-4 xl:grid-cols-[220px_1fr]">
        <aside className="rounded-[6px] border border-[#232328] bg-[#17171a] p-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold leading-4 text-[#f6f6f7]">字段</h2>
            <button type="button" className="text-[12px] leading-4 text-[#6e93f8]">全部字段</button>
          </div>
          <div className="mt-3">
            <SearchInput className="min-w-0 w-full" />
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="px-2 py-1 text-[12px] leading-4 text-[#767683]">常用字段</div>
            {searchFields.map((field) => (
              <button key={field.label} type="button" className="flex h-8 items-center justify-between rounded-[6px] px-2 text-left text-[13px] leading-4 text-[#adadb6] transition-colors hover:bg-[rgba(255,255,255,0.08)]">
                <span className="truncate">{field.label}</span>
                <span className="text-[12px] text-[#767683]">{field.count}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-4">
          <section className="rounded-[6px] border border-[#232328] bg-[#17171a] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[14px] leading-4 text-[#f6f6f7]">12,842 个事件</div>
                <div className="mt-1 text-[12px] leading-4 text-[#767683]">2026-05-30 10:00:00 - 2026-05-31 10:42:18</div>
              </div>
              <SegmentedTabs tabs={["事件", "统计", "可视化"]} activeIndex={activeResultTab} onChange={setActiveResultTab} />
            </div>
            <div className="mt-4 flex h-[120px] items-end gap-1.5 border-b border-[#303038] px-2">
              {[28, 44, 36, 52, 48, 68, 42, 76, 58, 88, 72, 94, 62, 82, 54, 70, 46, 60, 38, 52, 34, 48, 30, 42].map((height, index) => (
                <div key={index} className="min-w-0 flex-1 rounded-t-[2px] bg-[#3566ec] opacity-75" style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[11px] leading-4 text-[#767683]">
              <span>昨天 10:00</span>
              <span>昨天 18:00</span>
              <span>今天 02:00</span>
              <span>现在</span>
            </div>
          </section>

          <section className="min-w-0 overflow-hidden rounded-[6px] border border-[#232328] bg-[#17171a]">
            <div className="grid h-10 grid-cols-[118px_138px_140px_78px_1fr] items-center border-b border-[#232328] bg-[#30333c] px-3 text-[13px] leading-4 text-[#adadb6]">
              <span>时间</span>
              <span>主机</span>
              <span>来源</span>
              <span>级别</span>
              <span>原始事件</span>
            </div>
            {logEvents.map((event, index) => (
              <button
                key={`${event.time}-${event.host}`}
                type="button"
                className={cn(
                  "grid min-h-[52px] w-full grid-cols-[118px_138px_140px_78px_1fr] items-center border-b border-[#232328] px-3 text-left transition-colors",
                  selectedLogIndex === index ? "bg-[rgba(53,102,236,0.18)]" : "hover:bg-[rgba(255,255,255,0.04)]"
                )}
                onClick={() => setSelectedLogIndex(index)}
              >
                <span className="font-mono text-[12px] leading-4 text-[#adadb6]">{event.time}</span>
                <span className="truncate text-[13px] leading-4 text-[#f6f6f7]">{event.host}</span>
                <span className="truncate text-[13px] leading-4 text-[#adadb6]">{event.source}</span>
                <span><Tag tone={event.tone}>{event.level}</Tag></span>
                <span className="truncate font-mono text-[12px] leading-4 text-[#adadb6]">{event.message}</span>
              </button>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

const monitoringMetrics = [
  { label: "监控规则总数", value: "48", note: "本周新增 6 条", icon: ChartNoAxesCombined, tone: "text-[#789af9]" },
  { label: "运行中", value: "36", note: "75% 规则已启用", icon: Activity, tone: "text-[#68f1c1]" },
  { label: "近 24 小时触发", value: "128", note: "较昨日下降 8.3%", icon: AlertTriangle, tone: "text-[#f1e860]" },
  { label: "异常规则", value: "3", note: "需要立即处理", icon: ShieldCheck, tone: "text-[#f68888]" },
] as const;

const monitoringRules = [
  { name: "API 网关 5xx 错误率", query: 'index=production service="api-gateway" status>=500', frequency: "每 5 分钟", window: "最近 15 分钟", status: "running", lastRun: "2 分钟前", trigger: "12 次" },
  { name: "支付服务响应延迟", query: 'index=production service="payment-service" latency>1500', frequency: "每 10 分钟", window: "最近 30 分钟", status: "running", lastRun: "6 分钟前", trigger: "4 次" },
  { name: "登录失败次数异常", query: 'index=production source="identity-service" action=login_failed', frequency: "每 15 分钟", window: "最近 1 小时", status: "paused", lastRun: "3 小时前", trigger: "0 次" },
  { name: "索引器磁盘使用率", query: 'index=_internal component=indexer disk_used_percent>85', frequency: "每 30 分钟", window: "当前状态", status: "error", lastRun: "18 分钟前", trigger: "3 次" },
  { name: "华东集群日志接收延迟", query: 'index=_internal region=cn-east ingestion_delay>300', frequency: "每 5 分钟", window: "最近 15 分钟", status: "running", lastRun: "1 分钟前", trigger: "8 次" },
] as const;

function MonitoringStatusTag({ status }: { status: (typeof monitoringRules)[number]["status"] }) {
  if (status === "running") return <Tag tone="green">运行中</Tag>;
  if (status === "paused") return <Tag tone="neutral">已暂停</Tag>;
  return <Tag tone="red">异常</Tag>;
}

function MonitoringFormInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const phase: InputPhase = isFocused ? "typing" : value ? "complete" : isHovered ? "hover" : "default";

  return (
    <label
      className="flex h-8 w-full items-center rounded-[6px] border px-2 text-[14px] leading-4 transition-colors"
      style={visual[phase]}
      data-state={phase}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        className="h-4 min-w-0 flex-1 bg-transparent p-0 text-[14px] leading-4 text-[#f6f6f7] outline-none placeholder:text-[#4A4A50]"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </label>
  );
}

function MonitoringSelectButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-8 w-full items-center justify-between gap-2 rounded-[6px] border border-[#52525c] bg-[rgba(33,33,38,0.6)] px-2 text-left text-[14px] leading-4 text-[#f6f6f7] shadow-[0_0_2px_rgba(0,0,0,0.8)] transition-colors hover:border-[#71717c] hover:bg-[rgba(33,33,38,0.2)]"
      style={buttonTypography}
    >
      <span className="truncate">{children}</span>
      <ChevronDown className="size-4 shrink-0 text-[#adadb6]" strokeWidth={1.6} />
    </button>
  );
}

function MonitoringThresholdInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const phase: InputPhase = isFocused ? "typing" : value ? "complete" : isHovered ? "hover" : "default";
  const suffixDivider = phase === "typing" ? "border-transparent" : phase === "hover" ? "border-[#71717c]" : "border-[#52525c]";

  return (
    <label
      className="flex h-8 w-full items-center overflow-hidden rounded-[6px] border pl-2 text-[14px] leading-4 transition-colors"
      style={visual[phase]}
      data-state={phase}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        ref={inputRef}
        className="h-4 min-w-0 flex-[1_0_0] bg-transparent p-0 text-[14px] leading-4 text-[#f6f6f7] outline-none placeholder:text-[#4A4A50]"
        inputMode="numeric"
        placeholder="请输入阈值"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <span
        className={cn(
          "flex h-8 min-h-6 min-w-16 shrink-0 items-center justify-center whitespace-nowrap border-l bg-[rgba(47,47,56,0.6)] px-3 text-center text-[14px] leading-4 text-[#f6f6f7]",
          suffixDivider
        )}
        onPointerDown={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        条
      </span>
    </label>
  );
}

function CreateMonitoringModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [threshold, setThreshold] = useState("");
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.56)] p-6" onMouseDown={(event) => event.stopPropagation()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-monitoring-title"
        className="flex w-full max-w-[640px] flex-col rounded-[12px] border border-[rgba(255,255,255,0.04)] bg-[#212126] shadow-[0_0_4px_rgba(0,0,0,0.56)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex h-12 shrink-0 items-center justify-between rounded-t-[12px] border-b border-[rgba(255,255,255,0.04)] px-4">
          <h2 id="create-monitoring-title" className="text-[16px] font-semibold leading-[18px] text-[#f6f6f7]">新建监控</h2>
          <button type="button" aria-label="关闭新建监控" className="grid size-4 place-items-center text-[#adadb6] transition-colors hover:text-[#f6f6f7]" onClick={onClose}>
            <X className="size-4" strokeWidth={1.6} />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-4">
          <div>
            <label className="mb-2 block text-[14px] leading-4 text-[#adadb6]">监控名称</label>
            <MonitoringFormInput placeholder="请输入监控名称" value={name} onChange={setName} />
          </div>
          <div>
            <label className="mb-2 block text-[14px] leading-4 text-[#adadb6]">搜索语句</label>
            <MonitoringFormInput placeholder="请输入 SPL 搜索语句" value={query} onChange={setQuery} />
            <p className="mt-2 text-[12px] leading-4 text-[#767683]">使用 SPL 定义需要定时执行的日志检索条件。</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[14px] leading-4 text-[#adadb6]">执行频率</label>
              <MonitoringSelectButton>每 5 分钟</MonitoringSelectButton>
            </div>
            <div>
              <label className="mb-2 block text-[14px] leading-4 text-[#adadb6]">搜索窗口</label>
              <MonitoringSelectButton>最近 15 分钟</MonitoringSelectButton>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[14px] leading-4 text-[#adadb6]">触发条件</label>
            <div className="grid grid-cols-[148px_1fr] gap-2">
              <MonitoringSelectButton>事件数量大于</MonitoringSelectButton>
              <MonitoringThresholdInput value={threshold} onChange={setThreshold} />
            </div>
          </div>
          <button type="button" className="flex items-center justify-between rounded-[6px] border border-[#232328] bg-[rgba(255,255,255,0.04)] px-3 py-3 text-left" onClick={() => setEnabled((value) => !value)}>
            <span>
              <span className="block text-[14px] leading-4 text-[#f6f6f7]">创建后立即启用</span>
              <span className="mt-1 block text-[12px] leading-4 text-[#767683]">启用后将按照设置的频率执行搜索。</span>
            </span>
            <span className="relative block h-4 w-6 shrink-0">
              <SwitchMark checked={enabled} />
            </span>
          </button>
        </div>

        <div className="flex h-12 shrink-0 items-center justify-end gap-2 rounded-b-[12px] border-t border-[rgba(255,255,255,0.04)] px-4">
          <DesignButton onClick={onClose}>取消</DesignButton>
          <DesignButton variant="primary" onClick={onClose}>创建监控</DesignButton>
        </div>
      </div>
    </div>
  );
}

function ScheduledMonitoringPage({ onCreateMonitoring }: { onCreateMonitoring: () => void }) {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[13px] leading-4 text-[#767683]">数据分析 / 定时监控</div>
          <h1 className="mt-2 text-[24px] font-semibold leading-7 text-[#f6f6f7]">定时监控</h1>
          <p className="mt-2 text-[14px] leading-5 text-[#767683]">通过定时搜索持续发现异常，并在触发条件满足时生成告警。</p>
        </div>
        <DesignButton variant="primary" onClick={onCreateMonitoring}>新建监控</DesignButton>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {monitoringMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <section key={metric.label} className="rounded-[6px] border border-[#232328] bg-[#17171a] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[14px] leading-4 text-[#adadb6]">{metric.label}</span>
                <Icon className={cn("size-[18px]", metric.tone)} strokeWidth={1.5} />
              </div>
              <div className="mt-5 text-[26px] font-semibold leading-7 text-[#f6f6f7]">{metric.value}</div>
              <div className="mt-3 text-[12px] leading-4 text-[#767683]">{metric.note}</div>
            </section>
          );
        })}
      </div>

      <section className="rounded-[6px] border border-[#232328] bg-[#17171a] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold leading-[18px] text-[#f6f6f7]">监控规则</h2>
            <p className="mt-2 text-[13px] leading-4 text-[#767683]">管理定时搜索、触发条件与运行状态。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput className="w-[240px]" />
            <button type="button" className="flex h-8 min-w-[112px] items-center justify-between gap-2 rounded-[6px] border border-[#52525c] bg-[rgba(33,33,38,0.6)] px-2 text-[14px] leading-4 text-[#f6f6f7]">
              全部状态
              <ChevronDown className="size-4 shrink-0 text-[#adadb6]" strokeWidth={1.6} />
            </button>
            <FilterIconButton />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-[6px]">
          <div className="min-w-[1050px]">
            <div className="grid h-10 grid-cols-[1.35fr_1.7fr_110px_118px_92px_96px_104px] items-center border border-[#232328] bg-[#30333c] px-3 text-[13px] leading-4 text-[#adadb6]">
              <span>规则名称</span>
              <span>搜索语句</span>
              <span>执行频率</span>
              <span>搜索窗口</span>
              <span>状态</span>
              <span>最近运行</span>
              <span>操作</span>
            </div>
            {monitoringRules.map((rule) => (
              <div
                key={rule.name}
                className={cn(
                  "grid min-h-[58px] grid-cols-[1.35fr_1.7fr_110px_118px_92px_96px_104px] items-center border border-t-0 border-[#232328] px-3 transition-colors",
                  selectedRule === rule.name ? "bg-[rgba(53,102,236,0.18)]" : "hover:bg-[rgba(255,255,255,0.04)]"
                )}
              >
                <button type="button" className="min-w-0 text-left" onClick={() => setSelectedRule(rule.name)}>
                  <div className="truncate text-[14px] leading-4 text-[#f6f6f7]">{rule.name}</div>
                  <div className="mt-1 text-[12px] leading-4 text-[#767683]">近 24 小时触发 {rule.trigger}</div>
                </button>
                <span className="truncate pr-4 font-mono text-[12px] leading-4 text-[#adadb6]">{rule.query}</span>
                <span className="text-[13px] leading-4 text-[#adadb6]">{rule.frequency}</span>
                <span className="text-[13px] leading-4 text-[#adadb6]">{rule.window}</span>
                <span><MonitoringStatusTag status={rule.status} /></span>
                <span className="text-[12px] leading-4 text-[#767683]">{rule.lastRun}</span>
                <div className="flex items-center gap-3 text-[13px] leading-4">
                  <button type="button" className="text-[#6e93f8]">编辑</button>
                  <button type="button" className="text-[#adadb6]">更多</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-[6px] border border-[#232328] bg-[#17171a] p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-semibold leading-[18px] text-[#f6f6f7]">触发趋势</h2>
              <p className="mt-2 text-[13px] leading-4 text-[#767683]">最近 24 小时监控触发次数</p>
            </div>
            <Activity className="size-[18px] text-[#789af9]" strokeWidth={1.5} />
          </div>
          <div className="mt-5 flex h-28 items-end gap-2 border-b border-[#303038] px-2">
            {[32, 46, 38, 64, 52, 78, 44, 68, 88, 58, 74, 48].map((height, index) => (
              <div key={index} className="min-w-0 flex-1 rounded-t-[2px] bg-[#3566ec] opacity-80" style={{ height: `${height}%` }} />
            ))}
          </div>
        </section>

        <section className="rounded-[6px] border border-[#232328] bg-[#17171a] p-4">
          <h2 className="text-[16px] font-semibold leading-[18px] text-[#f6f6f7]">运行提示</h2>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex gap-3 rounded-[6px] bg-[rgba(236,224,53,0.08)] p-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#f1e860]" strokeWidth={1.5} />
              <div>
                <div className="text-[13px] leading-4 text-[#f6f6f7]">3 条规则需要处理</div>
                <div className="mt-1 text-[12px] leading-4 text-[#767683]">索引器磁盘监控连续执行失败，请检查数据源权限。</div>
              </div>
            </div>
            <div className="flex gap-3 rounded-[6px] bg-[rgba(53,102,236,0.08)] p-3">
              <Clock3 className="mt-0.5 size-4 shrink-0 text-[#789af9]" strokeWidth={1.5} />
              <div>
                <div className="text-[13px] leading-4 text-[#f6f6f7]">建议错峰执行高成本搜索</div>
                <div className="mt-1 text-[12px] leading-4 text-[#767683]">当前有 8 条规则集中在整点执行，可调整执行时间降低资源压力。</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const notificationCategories = [
  { label: "全部消息", count: 0 },
  { label: "权限", count: 0 },
  { label: "监控告警", count: 0 },
  { label: "离线任务", count: 0 },
  { label: "下载任务", count: 0 },
  { label: "未解析日志", count: 0 },
  { label: "许可证", count: 0 },
] as const;

const notificationTabs = ["全部", "权限变更"] as const;

function NotificationsPage({ isDayMode = false }: { isDayMode?: boolean }) {
  const [activeCategory, setActiveCategory] = useState("权限");
  const [activeTab, setActiveTab] = useState<(typeof notificationTabs)[number]>("全部");
  const pageBg = isDayMode ? "#F8F8F8" : "#131316";
  const panelBg = isDayMode ? "#FFFFFF" : "#17171A";
  const borderColor = isDayMode ? "#EBEBEB" : "#232328";
  const mutedColor = isDayMode ? "#67686C" : "#ADADB6";
  const subtleColor = isDayMode ? "#A5A5B2" : "#767683";

  return (
    <section className="min-h-[calc(100vh-124px)] w-full" style={{ backgroundColor: pageBg }}>
      <div className="mx-auto grid min-h-[640px] w-[1100px] grid-cols-[284px_800px] gap-4">
        <aside className="flex min-w-0 flex-col rounded-[8px]" style={{ backgroundColor: panelBg }}>
          <div className="flex-1 px-4 py-3">
            {notificationCategories.map((item, index) => {
              const selected = activeCategory === item.label;
              const separated = index === 1 || index === notificationCategories.length - 1;
              return (
                <Fragment key={item.label}>
                  {separated ? <div className="my-2 h-px w-full" style={{ backgroundColor: borderColor }} /> : null}
                  <button
                    type="button"
                    className={cn(
                      "flex h-10 w-full items-center justify-between rounded-[6px] px-3 text-left text-[14px] leading-4 transition-colors",
                      selected ? "bg-[#3566EC] text-[#F6F6F7]" : isDayMode ? "hover:bg-[rgba(0,0,0,0.04)]" : "hover:bg-[rgba(255,255,255,0.08)]"
                    )}
                    style={{ color: selected ? "#F6F6F7" : mutedColor }}
                    onClick={() => setActiveCategory(item.label)}
                  >
                    <span className="font-semibold">{item.label}</span>
                    <span
                      style={{
                        color: selected ? "#F6F6F7" : subtleColor,
                        fontFamily: '"LogEaseNumber", "Avenir Next", sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      {item.count}
                    </span>
                  </button>
                </Fragment>
              );
            })}
          </div>
          <div className="mx-4 h-px" style={{ backgroundColor: borderColor }} />
          <button
            type="button"
            className={cn(
              "mx-4 mb-4 mt-3 flex h-9 items-center gap-2 rounded-[6px] px-2 text-[14px] leading-4 transition-colors",
              isDayMode ? "hover:bg-[rgba(0,0,0,0.04)]" : "hover:bg-[rgba(255,255,255,0.08)]"
            )}
            style={{ color: subtleColor }}
          >
            <span className="relative grid size-4 place-items-center rounded-[3px] border border-current">
              <Check className="size-3" strokeWidth={2} />
            </span>
            全部标记为已读
          </button>
        </aside>

        <section className="min-w-0 overflow-hidden rounded-[8px]" style={{ backgroundColor: panelBg }}>
          <div className="flex h-10 items-end border-b px-4" style={{ borderColor }}>
            <UnderlineTabs
              tabs={notificationTabs.map((tab) => ({ label: tab }))}
              activeIndex={notificationTabs.indexOf(activeTab)}
              onChange={(index) => setActiveTab(notificationTabs[index])}
              gapClassName="gap-6"
              heightClassName="h-10"
              buttonHeightClassName="h-10"
              activeColor={isDayMode ? "#323336" : "#F6F6F7"}
              inactiveColor={mutedColor}
              showBaseLine={false}
            />
          </div>
          <div className="grid h-[calc(100%-40px)] place-items-center px-6 py-12">
            <div className="text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-[12px] bg-[rgba(255,255,255,0.04)] text-[#767683]">
                <RawSvgIcon svg={messageNotificationSvg} className="size-8" />
              </div>
              <div className="mt-4 text-[14px] font-semibold leading-4" style={{ color: mutedColor }}>
                暂无{activeTab === "全部" ? activeCategory : activeTab}消息
              </div>
              <div className="mt-2 text-[12px] leading-4" style={{ color: subtleColor }}>
                这里会显示最新的系统通知和权限变更记录。
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

const dashboardBreadcrumbs: Record<DashboardPage, string[]> = {
  dashboard: ["仪表盘"],
  threatAlerts: ["仪表盘", "威胁告警"],
  notifications: ["消息通知"],
  library: ["功能中心", "组件库"],
  form: ["功能中心", "表单"],
  codeLog: ["功能中心", "代码/日志容器"],
  trafficSearch: ["日志搜索"],
  blank: ["导航名称"],
};

const dashboardHeaderStats = [
  { label: "监控", value: "12", widthClassName: "w-fit" },
  { label: "报表", value: "231", widthClassName: "w-fit" },
  { label: "定时任务", value: "7", widthClassName: "w-fit" },
] as const;

const truncateBreadcrumbLabel = (value: string, maxLength = 24) =>
  value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;

function DashboardPageToolbar({
  activePage,
  isDayMode,
  trafficSearchQuery,
  isTrafficLoading = false,
  onTrafficNewSearch,
  onThreatAlertsBack,
}: {
  activePage: DashboardPage;
  isDayMode: boolean;
  trafficSearchQuery?: string;
  isTrafficLoading?: boolean;
  onTrafficNewSearch?: () => void;
  onThreatAlertsBack?: () => void;
}) {
  const breadcrumb = activePage === "trafficSearch" && trafficSearchQuery
    ? [...dashboardBreadcrumbs[activePage], trafficSearchQuery]
    : dashboardBreadcrumbs[activePage];
  const mutedColor = isDayMode ? "#A5A5B2" : "#767683";
  const activeColor = isDayMode ? "#323336" : "#f6f6f7";

  return (
    <div
      className="flex h-12 items-center justify-between border-b pl-4"
      style={{
        paddingRight: activePage === "dashboard" ? "16px" : "24px",
        backgroundColor: isDayMode ? "#FFFFFF" : "#17171A",
        borderColor: isDayMode ? "#EBEBEB" : "#232328",
      }}
    >
      <div className="flex items-center gap-1 text-[14px] leading-4" style={buttonTypography}>
        {breadcrumb.map((item, index) => {
          const isLast = index === breadcrumb.length - 1;
          return (
            <Fragment key={`${item}-${index}`}>
              {index > 0 && <span style={{ color: mutedColor }}>/</span>}
              <span className={isLast ? "font-semibold" : undefined} style={{ color: isLast ? activeColor : mutedColor }}>
                {isLast && activePage === "trafficSearch" ? truncateBreadcrumbLabel(item) : item}
              </span>
            </Fragment>
          );
        })}
        {activePage === "trafficSearch" && trafficSearchQuery && isTrafficLoading ? (
          <span
            aria-label="搜索加载中"
            className="ml-2 inline-block size-3 rounded-full border border-[#767683] border-r-transparent animate-spin"
          />
        ) : null}
      </div>
      {activePage === "dashboard" ? (
        <div className="ml-auto flex items-center gap-2">
	          {dashboardHeaderStats.map((item) => (
	            <button
	              key={item.label}
	              type="button"
	              className="group relative flex h-7 items-center gap-1 overflow-hidden rounded-[6px] px-2"
	              style={{ fontSize: "14px", lineHeight: "14px", color: isDayMode ? "#323336" : "#f6f6f7" }}
	            >
	              <span
	                className={cn(
	                  "absolute inset-0 rounded-[6px] transition-colors group-hover:bg-[#3566EC]",
	                  isDayMode ? "bg-[rgba(53,102,236,0.10)]" : "bg-[rgba(53,102,236,0.12)]"
	                )}
	              />
	              <span
	                className="absolute inset-0 rounded-[inherit] opacity-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] transition-opacity group-hover:opacity-100"
	              />
	              <span className="relative whitespace-nowrap transition-colors group-hover:text-[#f6f6f7]">{item.label}</span>
	              <span
	                className="relative whitespace-nowrap text-[14px] leading-[14px] transition-colors group-hover:text-[#f6f6f7]"
	                style={{ fontFamily: '"LogEaseNumber", "Avenir Next", sans-serif', fontWeight: 600 }}
	              >
	                {item.value}
              </span>
            </button>
          ))}
        </div>
      ) : null}
      {activePage === "trafficSearch" && trafficSearchQuery && !isTrafficLoading && onTrafficNewSearch ? (
        <DesignButton size="28" variant="primary" onClick={onTrafficNewSearch}>新搜索</DesignButton>
      ) : null}
      {activePage === "threatAlerts" && onThreatAlertsBack ? (
        <DesignButton size="28" onClick={onThreatAlertsBack}>返回</DesignButton>
      ) : null}
    </div>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  const [isSidebarPreviewed, setIsSidebarPreviewed] = useState(false);
  const [isDayMode, setIsDayMode] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [activePage, setActivePage] = useState<DashboardPage>("dashboard");
  const [trafficSearchQuery, setTrafficSearchQuery] = useState("");
  const [trafficTimeRange, setTrafficTimeRange] = useState<TimeRangeSelection>(defaultTimeRangeSelection);
  const [isTrafficLoading, setIsTrafficLoading] = useState(false);
  const trafficLoadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expandedWidth = 240;
  const collapsedWidth = 0;
  const sidebarVisible = expanded || isSidebarPreviewed;
  const contentPaddingTop = 64;

  useEffect(() => {
    if (expanded && isSidebarPreviewed) {
      setIsSidebarPreviewed(false);
    }
  }, [expanded, isSidebarPreviewed]);

  useEffect(() => {
    return () => {
      if (trafficLoadingTimer.current) {
        clearTimeout(trafficLoadingTimer.current);
      }
    };
  }, []);

  const startTrafficLoading = () => {
    if (trafficLoadingTimer.current) {
      clearTimeout(trafficLoadingTimer.current);
    }
    setIsTrafficLoading(true);
    trafficLoadingTimer.current = setTimeout(() => {
      setIsTrafficLoading(false);
      trafficLoadingTimer.current = null;
    }, 2000);
  };

  const handleTrafficSearchComplete = (query: string) => {
    setTrafficSearchQuery(query);
    startTrafficLoading();
  };

  const handleTrafficTimeRangeCommit = (value: TimeRangeSelection) => {
    setTrafficTimeRange(value);
    if (activePage === "trafficSearch" && trafficSearchQuery) {
      startTrafficLoading();
    }
  };

  const handleTrafficNewSearch = () => {
    if (trafficLoadingTimer.current) {
      clearTimeout(trafficLoadingTimer.current);
      trafficLoadingTimer.current = null;
    }
    setIsTrafficLoading(false);
    setTrafficSearchQuery("");
  };

  const handlePageSelection = (page: DashboardPage) => {
    if (trafficLoadingTimer.current) {
      clearTimeout(trafficLoadingTimer.current);
      trafficLoadingTimer.current = null;
    }
    setIsTrafficLoading(false);
    setActivePage(page);
    if (page === "trafficSearch") {
      setTrafficSearchQuery("");
      return;
    }
    setTrafficSearchQuery("");
  };

	  return (
	    <section
	      className={cn("relative min-h-screen w-full overflow-hidden", isDayMode && "day-mode")}
	      style={{ backgroundColor: isDayMode ? "#F8F8F8" : "#131316" }}
	    >
      <DashboardHeader
        isDayMode={isDayMode}
        sidebarOffset={sidebarVisible ? expandedWidth : collapsedWidth}
        onToggleDayMode={() => setIsDayMode((value) => !value)}
        onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
        onOpenNotifications={() => handlePageSelection("notifications")}
      />
      <DashboardSidebar
        expanded={sidebarVisible}
        isDayMode={isDayMode}
        activePage={activePage}
        onSelectionChange={(page) => {
          handlePageSelection(page);
        }}
        onPreviewEnd={() => {
          if (!expanded) {
            setIsSidebarPreviewed(false);
          }
        }}
      />
      <DashboardBrandControls
        expanded={expanded}
        isDayMode={isDayMode}
        onPreviewStart={() => {
          if (!expanded) {
            setIsSidebarPreviewed(true);
          }
        }}
        onToggle={() => setExpanded((value) => !value)}
      />
      <div
        className="absolute top-[60px] z-30 h-12 transition-[left] duration-[300ms] ease-in-out"
        style={{
          left: expanded ? expandedWidth : collapsedWidth,
          right: 0,
        }}
      >
        <DashboardPageToolbar
          activePage={activePage}
          isDayMode={isDayMode}
          trafficSearchQuery={trafficSearchQuery}
          isTrafficLoading={isTrafficLoading}
          onTrafficNewSearch={handleTrafficNewSearch}
          onThreatAlertsBack={() => setActivePage("dashboard")}
        />
      </div>
      <div
        className="absolute bottom-0 top-[60px] z-10 transition-[left] duration-[300ms] ease-in-out"
        style={{ left: expanded ? expandedWidth : collapsedWidth, right: 0, backgroundColor: isDayMode ? "#F8F8F8" : "#131316" }}
      >
        <div
          className="app-scrollbar h-full w-full overflow-auto pb-12 transition-[padding-top] duration-[300ms] ease-in-out"
          style={{ paddingTop: contentPaddingTop }}
        >
          <DashboardContentGrid>
            {activePage === "dashboard" ? (
              <DashboardContentGridItem span={24}>
                <DashboardOverviewPage isDayMode={isDayMode} onViewThreatAlerts={() => setActivePage("threatAlerts")} />
              </DashboardContentGridItem>
            ) : null}
            {activePage === "threatAlerts" ? (
              <DashboardContentGridItem span={24}>
                <ThreatAlertsPage isDayMode={isDayMode} />
              </DashboardContentGridItem>
            ) : null}
            {activePage === "notifications" ? (
              <DashboardContentGridItem span={24}>
                <NotificationsPage isDayMode={isDayMode} />
              </DashboardContentGridItem>
            ) : null}
            {activePage === "library" ? <DashboardContentGridItem span={24}>{children}</DashboardContentGridItem> : null}
            {activePage === "form" ? <DashboardContentGridItem span={24}><FormPage /></DashboardContentGridItem> : null}
            {activePage === "codeLog" ? <DashboardContentGridItem span={24}><CodeLogPage /></DashboardContentGridItem> : null}
            {activePage === "trafficSearch" ? (
              <DashboardContentGridItem span={24}>
                <TrafficSearchPage
                  searchQuery={trafficSearchQuery}
                  onSearchComplete={handleTrafficSearchComplete}
                  isLoading={isTrafficLoading}
                  timeRange={trafficTimeRange}
                  onTimeRangeCommit={handleTrafficTimeRangeCommit}
                />
              </DashboardContentGridItem>
            ) : null}
          </DashboardContentGrid>
        </div>
      </div>
      <GlobalSearchDialog
        open={isGlobalSearchOpen}
        isDayMode={isDayMode}
        onClose={() => setIsGlobalSearchOpen(false)}
        onSelect={handlePageSelection}
      />
    </section>
  );
}

function App() {
  return (
    <main className="min-h-screen bg-[#131316] p-0 text-[#f6f6f7]">
      <DashboardShell>
        <div className="flex flex-col gap-[50px]">
          <div className="flex flex-wrap gap-[50px]">
            <ComponentFrame>
              <EmailInput />
            </ComponentFrame>
            <ComponentFrame>
              <SearchInput />
            </ComponentFrame>
            <ComponentFrame>
              <SuffixInput />
            </ComponentFrame>
            <ComponentFrame>
              <PasswordInput />
            </ComponentFrame>
          </div>
          <div className="flex flex-wrap items-start gap-[50px]">
            <ButtonFrame />
            <OtherButtonFrame />
            <SelectionSwitchFrame />
          </div>
          <div className="relative z-20 flex flex-wrap items-start gap-[50px]">
            <DropdownControlsFrame />
            <SearchableDropdownFrame />
            <MultiLevelDropdownFrame />
            <TabsFrame />
          </div>
          <div className="relative z-10 flex flex-wrap items-start gap-[50px]">
            <ModalFrame />
            <AlertDialogFrame />
            <GlobalToastFrame />
          </div>
          <div className="flex flex-wrap items-start gap-[50px]">
            <TableFrame />
            <TagFrame />
          </div>
          <div className="flex flex-wrap items-start gap-[50px]">
            <FormStepsFrame />
            <UploadComponentsFrame />
          </div>
          <div className="flex flex-wrap items-start gap-[50px]">
            <TimeRangePickerFrame />
            <PaginationFrame />
          </div>
        </div>
      </DashboardShell>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
