import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaUploaderProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  label?: string;
}

export function MediaUploader({
  onUpload,
  accept = 'image/*,video/*',
  maxFiles = 10,
  label = 'Upload Media',
}: MediaUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length + files.length > maxFiles) {
        return;
      }

      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
      
      const updatedFiles = [...files, ...selectedFiles];
      setFiles(updatedFiles);
      onUpload(updatedFiles);
    },
    [files, previews, maxFiles, onUpload]
  );

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    const newPreviews = previews.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    setFiles(newFiles);
    onUpload(newFiles);
  };

  return (
    <div className="space-y-4">
      <label
        htmlFor="media-upload"
        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-2xl hover-elevate active-elevate-2 cursor-pointer bg-card/50"
        data-testid="media-uploader"
      >
        <div className="flex flex-col items-center justify-center py-6">
          <Upload className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">{label}</p>
          <p className="text-xs text-muted-foreground">
            Click to browse or drag and drop
          </p>
        </div>
        <input
          id="media-upload"
          type="file"
          className="hidden"
          accept={accept}
          multiple
          onChange={handleFileChange}
          data-testid="input-file-upload"
        />
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden bg-muted"
              data-testid={`media-preview-${index}`}
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                onClick={() => removeFile(index)}
                data-testid={`button-remove-media-${index}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {files.length < maxFiles && (
            <label
              htmlFor="media-upload-more"
              className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover-elevate active-elevate-2"
            >
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <input
                id="media-upload-more"
                type="file"
                className="hidden"
                accept={accept}
                multiple
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
}
