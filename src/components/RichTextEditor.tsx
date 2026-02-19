import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Code,
  Minus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  minHeight = "400px",
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = useCallback(
    (before: string, after: string = "", placeholder: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end) || placeholder;
      const newText =
        value.substring(0, start) +
        before +
        selectedText +
        after +
        value.substring(end);

      onChange(newText);

      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + before.length + selectedText.length;
        textarea.setSelectionRange(
          start + before.length,
          newCursorPos
        );
      }, 0);
    },
    [value, onChange]
  );

  const insertNewLine = useCallback(
    (prefix: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const beforeLine = value.substring(0, lineStart);
      const afterLine = value.substring(lineStart);

      onChange(beforeLine + prefix + afterLine);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          lineStart + prefix.length,
          lineStart + prefix.length
        );
      }, 0);
    },
    [value, onChange]
  );

  const tools = [
    {
      icon: Bold,
      label: "Bold",
      action: () => insertAtCursor("**", "**", "bold text"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertAtCursor("*", "*", "italic text"),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      action: () => insertNewLine("## "),
    },
    {
      icon: Heading3,
      label: "Heading 3",
      action: () => insertNewLine("### "),
    },
    { type: "separator" },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertNewLine("- "),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertNewLine("1. "),
    },
    {
      icon: Quote,
      label: "Blockquote",
      action: () => insertNewLine("> "),
    },
    { type: "separator" },
    {
      icon: Link,
      label: "Link",
      action: () => insertAtCursor("[", "](url)", "link text"),
    },
    {
      icon: Image,
      label: "Image",
      action: () => insertAtCursor("![", "](image-url)", "alt text"),
    },
    {
      icon: Code,
      label: "Code",
      action: () => insertAtCursor("`", "`", "code"),
    },
    {
      icon: Minus,
      label: "Horizontal Rule",
      action: () => insertNewLine("\n---\n\n"),
    },
  ];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-muted/50 border-b border-border px-2 py-1.5 flex flex-wrap gap-0.5">
        {tools.map((tool, index) =>
          tool.type === "separator" ? (
            <div
              key={index}
              className="w-px h-6 bg-border mx-1 self-center"
            />
          ) : (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={tool.action}
                >
                  <tool.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          )
        )}
      </div>

      {/* Editor */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-0 rounded-none focus-visible:ring-0 font-mono text-sm resize-none"
        style={{ minHeight }}
      />

      {/* Footer */}
      <div className="bg-muted/30 border-t border-border px-3 py-2 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Markdown supported: **bold**, *italic*, ## Heading, [link](url)
        </p>
        <p className="text-xs text-muted-foreground">
          {value.length} characters
        </p>
      </div>
    </div>
  );
}
