import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApprovalBadgeProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

export function ApprovalBadge({ className, size = "md" }: ApprovalBadgeProps) {
    const sizeClasses = {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-3 py-1",
        lg: "text-base px-4 py-1.5",
    };

    const iconSizes = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
    };

    return (
        <Badge
            className={cn(
                "inline-flex items-center gap-1.5 font-semibold",
                "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
                "border-0 shadow-lg shadow-emerald-500/25",
                "hover:shadow-emerald-500/40 transition-shadow",
                sizeClasses[size],
                className
            )}
        >
            <CheckCircle2 className={cn(iconSizes[size], "fill-white/20")} />
            Approved by GoodiesHub
        </Badge>
    );
}
