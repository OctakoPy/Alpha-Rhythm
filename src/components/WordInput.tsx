import React, { useRef, useEffect, useCallback } from 'react';

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

  // Debounce the onChange handler
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow letters
    const newValue = e.target.value.replace(/[^a-zA-Z]/g, '');
    e.target.value = newValue;
    onChange(e);
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="text"
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
      enterKeyHint="go"
      value={value}
      onChange={handleChange}
      onKeyPress={onKeyPress}
      className="w-full text-xl p-3 bg-white/80 backdrop-blur-sm border-2 border-blue-300 rounded-lg 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none shadow-lg
                touch-manipulation" // Add touch-action optimization
      style={{
        WebkitTapHighlightColor: 'transparent', // Remove tap highlight on iOS
      }}
      placeholder={`Type a word starting with ${currentLetter}...`}
      disabled={disabled}
    />
  );
};