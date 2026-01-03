import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string | null) => void;
    className?: string;
    label?: string;
}

export function ImageUpload({ value, onChange, className, label = "Upload Image" }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleUpload = useCallback(async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast({
                variant: "destructive",
                title: "Invalid file type",
                description: "Please upload an image file (JPEG, PNG, GIF, or WebP)",
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({
                variant: "destructive",
                title: "File too large",
                description: "Image must be less than 5MB",
            });
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch("/api/upload/single", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            onChange(data.url);
            toast({
                title: "Image uploaded! 📸",
                description: "Your image has been uploaded successfully.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Upload failed",
                description: "Could not upload image. Please try again.",
            });
        } finally {
            setIsUploading(false);
        }
    }, [onChange, toast]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    }, [handleUpload]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    const handleRemove = () => {
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
            />

            {value ? (
                // Image preview
                <div className="relative group rounded-xl overflow-hidden border border-border bg-muted aspect-video">
                    <img
                        src={value}
                        alt="Upload preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => inputRef.current?.click()}
                            className="rounded-full"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Replace
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemove}
                            className="rounded-full"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                        </Button>
                    </div>
                </div>
            ) : (
                // Upload area
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => !isUploading && inputRef.current?.click()}
                    className={cn(
                        "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                        "hover:border-primary/50 hover:bg-primary/5",
                        isDragging && "border-primary bg-primary/10",
                        isUploading && "cursor-not-allowed opacity-50"
                    )}
                >
                    <div className="flex flex-col items-center gap-3">
                        {isUploading ? (
                            <>
                                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                <p className="text-sm font-medium text-muted-foreground">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                                    <ImageIcon className="h-7 w-7 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{label}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Drag & drop or click to browse
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        JPEG, PNG, GIF, WebP • Max 5MB
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Multi-image gallery upload
interface GalleryUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    maxImages?: number;
    className?: string;
}

export function GalleryUpload({ value = [], onChange, maxImages = 10, className }: GalleryUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleUpload = useCallback(async (files: FileList) => {
        const validFiles = Array.from(files).filter(file => {
            if (!file.type.startsWith("image/")) return false;
            if (file.size > 5 * 1024 * 1024) return false;
            return true;
        });

        if (validFiles.length === 0) {
            toast({
                variant: "destructive",
                title: "Invalid files",
                description: "Please upload valid image files under 5MB each.",
            });
            return;
        }

        const remaining = maxImages - value.length;
        const toUpload = validFiles.slice(0, remaining);

        if (toUpload.length < validFiles.length) {
            toast({
                title: "Some files skipped",
                description: `Only ${remaining} more images can be added.`,
            });
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            toUpload.forEach(file => formData.append("images", file));

            const response = await fetch("/api/upload/multiple", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            const newUrls = data.files.map((f: any) => f.url);
            onChange([...value, ...newUrls]);

            toast({
                title: "Images uploaded! 📸",
                description: `${newUrls.length} image(s) uploaded successfully.`,
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Upload failed",
                description: "Could not upload images. Please try again.",
            });
        } finally {
            setIsUploading(false);
        }
    }, [value, onChange, maxImages, toast]);

    const handleRemove = (index: number) => {
        const newUrls = value.filter((_, i) => i !== index);
        onChange(newUrls);
    };

    return (
        <div className={cn("space-y-4", className)}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
                className="hidden"
            />

            {/* Gallery grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {value.map((url, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                            <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add more button */}
            {value.length < maxImages && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full rounded-lg border-dashed"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4 mr-2" />
                            Add Gallery Images ({value.length}/{maxImages})
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}
