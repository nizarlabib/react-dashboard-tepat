import { Avatar } from "../ui/Avatar";
import { cn } from "../../lib/utils";
import type { Activity, ActivityStatus } from "../../types";

const statusStyles: Record<ActivityStatus, string> = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
};

const statusLabels: Record<ActivityStatus, string> = {
  success: "Completed",
  warning: "Needs attention",
  info: "Update",
};

export function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <ul className="divide-y divide-border">
      {activities.map((activity) => (
        <li key={activity.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
          <Avatar name={activity.user} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-xs leading-5 text-muted-foreground">
              <span className="font-medium text-foreground">
                {activity.user}
              </span>{" "}
              {activity.action}
              {activity.target ? (
                <span className="font-medium text-foreground">
                  {" "}
                  {activity.target}
                </span>
              ) : null}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  statusStyles[activity.status],
                )}
                aria-hidden="true"
              />
              <span className="text-xs text-muted-foreground">
                {statusLabels[activity.status]} · {activity.timestamp}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
