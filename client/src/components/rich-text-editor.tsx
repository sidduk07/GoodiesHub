import { forwardRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bold, Italic, List, ListOrdered, Quote, Heading2 } from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

// Simple rich text editor using textarea with markdown-like syntax
// Can be upgraded to TipTap or similar in the future
export const RichTextEditor = forwardRef<HTMLTextAreaElement, RichTextEditorProps>(
    ({ value, onChange, placeholder, className }, ref) => {
        const [localValue, setLocalValue] = useState(value);

        const handleChange = (newValue: string) => {
            setLocalValue(newValue);
            onChange(newValue);
        };

        // Simple formatting helpers
        const insertFormat = (before: string, after: string = before) => {
            const textarea = document.querySelector('textarea[data-rich-editor="true"]') as HTMLTextAreaElement;
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = localValue.substring(start, end);
            const newText = localValue.substring(0, start) + before + selectedText + after + localValue.substring(end);

            handleChange(newText);

            // Restore focus and selection
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + before.length, end + before.length);
            }, 0);
        };

        return (
            <div className={cn("space-y-2", className)}>
                {/* Toolbar */}
                <div className="flex flex-wrap gap-1 p-2 border border-border rounded-lg bg-muted/30">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => insertFormat("## ", "\n")}
                        title="Heading"
                    >
                        <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => insertFormat("**")}
                        title="Bold"
                    >
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => insertFormat("*")}
                        title="Italic"
                    >
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => insertFormat("\n- ")}
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => insertFormat("\n1. ")}
                        title="Numbered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => insertFormat("\n> ", "\n")}
                        title="Quote"
                    >
                        <Quote className="h-4 w-4" />
                    </Button>
                </div>

                {/* Editor */}
                <Textarea
                    ref={ref}
                    value={localValue}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={placeholder || "Write your content here... Use markdown-style formatting."}
                    className="min-h-[300px] font-mono text-sm resize-y"
                    data-rich-editor="true"
                />

                {/* Help text */}
                <p className="text-xs text-muted-foreground">
                    Supports basic markdown: **bold**, *italic*, ## headings, - bullet lists, {">"} quotes
                </p>
            </div>
        );
    }
);

RichTextEditor.displayName = "RichTextEditor";
