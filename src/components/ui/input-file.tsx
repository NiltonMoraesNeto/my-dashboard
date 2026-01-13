import * as React from "react";
import { Upload, File as FileIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

export interface InputFileProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  onChange?: (file: File | null) => void;
  accept?: string;
  value?: File | string | null;
}

const InputFile = React.forwardRef<HTMLInputElement, InputFileProps>(
  ({ className, onChange, accept, value, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = React.useState<string>("");

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    React.useEffect(() => {
      if (value && typeof value === "object" && value instanceof globalThis.File) {
        setFileName((value as File).name);
      } else if (typeof value === "string" && value) {
        setFileName(value.split("/").pop() || "");
      } else {
        setFileName("");
      }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setFileName(file?.name || "");
      onChange?.(file);
    };

    const handleButtonClick = () => {
      inputRef.current?.click();
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
            {...props}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            className={cn("flex items-center gap-2", className)}
          >
            <Upload className="h-4 w-4" />
            Selecionar Arquivo
          </Button>
          {fileName && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <FileIcon className="h-4 w-4" />
              <span className="truncate max-w-xs">{fileName}</span>
            </div>
          )}
        </div>
        {accept && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Formatos aceitos: {accept}
          </p>
        )}
      </div>
    );
  }
);

InputFile.displayName = "InputFile";

export { InputFile };

