// Create a Set for O(1) lookup performance
const wordList = new Set([
  // Common English words (both UK and US spellings)
  // This is just the start - you should add more words
  'about', 'above', 'across', 'act', 'active', 'activity', 'add', 'afraid',
  'after', 'again', 'age', 'ago', 'agree', 'air', 'all', 'alone',
  'along', 'already', 'always', 'am', 'amount', 'an', 'and', 'angry',
  'another', 'answer', 'any', 'anyone', 'anything', 'anytime', 'appear', 'apple',
  'are', 'area', 'arm', 'army', 'around', 'arrive', 'art', 'article',
  // ... add thousands more words here
  // Include both spellings for common variations
  'color', 'colour',
  'realize', 'realise',
  'organize', 'organise',
  // ... etc
]);

export default wordList;