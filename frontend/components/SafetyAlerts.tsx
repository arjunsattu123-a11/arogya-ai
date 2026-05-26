"use client";

// SafetyAlerts.tsx
// Shows safety warnings at the top of the page
// Red = danger, Yellow = warning, Blue = info

type Alert = {
  type: "danger" | "warning" | "info";
  title: string;
  message: string;
};

type Props = {
  alerts: Alert[];
};

// Style map for each alert type
const alertStyles = {
  danger: {
    wrapper: "bg-red-50 border-red-300 border",
    icon: "🚨",
    title: "text-red-800",
    message: "text-red-700",
  },
  warning: {
    wrapper: "bg-yellow-50 border-yellow-300 border",
    icon: "⚠️",
    title: "text-yellow-800",
    message: "text-yellow-700",
  },
  info: {
    wrapper: "bg-blue-50 border-blue-200 border",
    icon: "ℹ️",
    title: "text-blue-800",
    message: "text-blue-700",
  },
};

export default function SafetyAlerts({ alerts }: Props) {
  if (!alerts || alerts.length === 0) return null;

  // Sort: danger first, then warning, then info
  const sorted = [...alerts].sort((a, b) => {
    const order = { danger: 0, warning: 1, info: 2 };
    return order[a.type] - order[b.type];
  });

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
        Safety Alerts ({alerts.length})
      </h3>

      {sorted.map((alert, index) => {
        const style = alertStyles[alert.type] || alertStyles.info;

        return (
          <div key={index} className={`rounded-lg px-4 py-3 ${style.wrapper}`}>
            <div className="flex items-start gap-2">
              <span className="text-base mt-0.5">{style.icon}</span>
              <div>
                <p className={`font-semibold text-sm ${style.title}`}>
                  {alert.title}
                </p>
                <p className={`text-sm mt-0.5 ${style.message}`}>
                  {alert.message}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
