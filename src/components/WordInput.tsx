import React, { useRef, useEffect } from 'react';

interface WordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  disabled: boolean;
  currentLetter: string;
}

export const WordInput: React.FC<WordInputProps> = ({
  value,
  onChange,
  onKeyPress,
  disabled,
  currentLetter,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="text" // Explicitly set input mode
      autoCapitalize="none" // Prevent auto capitalization
      autoComplete="off" // Disable autocomplete
      autoCorrect="off" // Disable autocorrect
      spellCheck="false" // Disable spellcheck
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      className="w-full text-xl p-3 bg-white/80 backdrop-blur-sm border-2 border-blue-300 rounded-lg 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none shadow-lg"
      placeholder={`Type a word starting with ${currentLetter}...`}
      disabled={disabled}
    />
  );
};