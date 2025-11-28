"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface AutoResizingTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  maxRows?: number;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCompositionStart?: () => void;
  onCompositionEnd?: () => void;
}

export const AutoResizingTextarea = forwardRef<
  HTMLTextAreaElement,
  AutoResizingTextareaProps
>(
  (
    {
      maxRows = 6,
      value,
      onChange,
      onKeyDown,
      onCompositionStart,
      onCompositionEnd,
      className,
      ...props
    },
    ref
  ) => {
    const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
    const [maxHeight, setMaxHeight] = useState<number>(0);

    useImperativeHandle(
      ref,
      () => internalTextareaRef.current as HTMLTextAreaElement
    );

    useEffect(() => {
      const calculateMaxHeight = () => {
        const textarea = internalTextareaRef.current;
        if (textarea) {
          textarea.style.height = "auto";
          const singleRowHeight = textarea.scrollHeight;
          setMaxHeight(singleRowHeight * maxRows);
        }
      };

      calculateMaxHeight();
    }, [maxRows]);

    useEffect(() => {
      const textarea = internalTextareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        const newHeight = Math.min(textarea.scrollHeight, maxHeight);
        textarea.style.height = `${newHeight}px`;
      }
    }, [value, maxHeight]);

    return (
      <textarea
        ref={internalTextareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        className={className}
        style={{
          overflow: "auto",
          resize: "none",
          maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        }}
        rows={1}
        {...props}
      />
    );
  }
);

AutoResizingTextarea.displayName = "AutoResizingTextarea";


