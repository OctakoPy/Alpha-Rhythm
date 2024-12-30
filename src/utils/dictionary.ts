let dictionaryWords: Set<string> | null = null;

export async function loadDictionary(): Promise<Set<string>> {
  if (dictionaryWords) return dictionaryWords;
  
  try {
    const response = await fetch('/dictionary.txt');
    const text = await response.text();    
    // Debug: Check for different line endings
    const words = text.split(/\r?\n/).map(word => {
      const trimmed = word.toLowerCase().trim();
      // Debug: Log any significant transformations
      if (word !== trimmed) {
        console.log('Word transformed:', {
          original: word,
          trimmed: trimmed,
          originalLength: word.length,
          trimmedLength: trimmed.length,
          originalChars: [...word].map(c => c.charCodeAt(0))
        });
      }
      return trimmed;
    });

    dictionaryWords = new Set(words);
    return dictionaryWords;
  } catch (error) {
    console.error('Failed to load dictionary:', error);
    return new Set();
  }
}

export const validateDictionaryWord = async (word: string): Promise<boolean> => {
  const dictionary = await loadDictionary();
  const normalizedWord = word.toLowerCase().trim();
  
  // Debug: Log validation attempts
  console.log('Validating word:', {
    original: word,
    normalized: normalizedWord,
    exists: dictionary.has(normalizedWord),
    dictionarySize: dictionary.size
  });
  
  return dictionary.has(normalizedWord);
};