import { useState, KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X, Plus } from "lucide-react";

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    suggestions?: string[];
    placeholder?: string;
    maxTags?: number;
    className?: string;
}

const DEFAULT_SUGGESTIONS = [
    "T-Shirt",
    "Hoodie",
    "Stickers",
    "Backpack",
    "Certification",
    "Software",
    "Credits",
    "Global",
    "Seasonal",
    "Community",
    "Leadership",
    "API",
    "Database",
    "Cloud",
    "DevOps",
    "AI/ML",
    "Frontend",
    "Backend",
    "Mobile",
    "Design",
];

export function TagInput({
    value = [],
    onChange,
    suggestions = DEFAULT_SUGGESTIONS,
    placeholder = "Add tags...",
    maxTags = 10,
    className,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (!trimmed || value.includes(trimmed) || value.length >= maxTags) return;
        onChange([...value, trimmed]);
        setInputValue("");
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            removeTag(value[value.length - 1]);
        }
    };

    const filteredSuggestions = suggestions.filter(
        (s) =>
            !value.includes(s) &&
            s.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div className={cn("space-y-3", className)}>
            {/* Input with tags */}
            <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg bg-background min-h-[52px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                {value.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1 px-2.5 py-1 text-sm font-medium"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}

                {value.length < maxTags && (
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder={value.length === 0 ? placeholder : "Add more..."}
                        className="flex-1 min-w-[120px] border-0 p-0 h-7 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                )}
            </div>

            {/* Tag count */}
            <p className="text-xs text-muted-foreground">
                {value.length}/{maxTags} tags
            </p>

            {/* Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Suggested tags:</p>
                    <div className="flex flex-wrap gap-2">
                        {filteredSuggestions.slice(0, 12).map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => addTag(suggestion)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                            >
                                <Plus className="h-3 w-3" />
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
