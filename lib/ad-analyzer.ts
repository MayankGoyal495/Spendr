// Mock NLTK implementation for browser environment
class MockSentimentIntensityAnalyzer {
  polarity_scores(text: string) {
    // Simple sentiment analysis based on common positive/negative words
    const positiveWords = ['new', 'best', 'exclusive', 'free', 'save', 'limited', 'premium', 'instant', 'guaranteed', 'proven', 'winning', 'smart', 'fresh', 'trending'];
    const negativeWords = ['bad', 'worst', 'expensive', 'slow', 'difficult', 'hard', 'problem', 'issue', 'error', 'fail'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positive = 0;
    let negative = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positive++;
      if (negativeWords.includes(word)) negative++;
    });
    
    const total = words.length || 1;
    const pos = positive / total;
    const neg = negative / total;
    const compound = (pos - neg) * 0.5; // Simplified compound score
    
    return {
      pos,
      neg,
      neu: Math.max(0, 1 - pos - neg),
      compound: Math.max(-1, Math.min(1, compound))
    };
  }
}

export const analyzer = new MockSentimentIntensityAnalyzer();

const WORD_RE = /[A-Za-z0-9']+/g;
const VOWELS = "aeiouy";

function tokenize(text: string): string[] {
  return text.match(WORD_RE)?.map(w => w.toLowerCase()) || [];
}

function sentenceSplit(text: string): string[] {
  return text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
}

function countSyllablesWord(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  
  let syllables = 0;
  let prevVowel = false;
  
  for (const ch of w) {
    const isVowel = VOWELS.includes(ch);
    if (isVowel && !prevVowel) {
      syllables++;
    }
    prevVowel = isVowel;
  }
  
  if (w.endsWith('e') && syllables > 1) {
    syllables--;
  }
  
  return Math.max(1, syllables);
}

function fleschReadingEase(text: string): number {
  const words = tokenize(text);
  const sentences = sentenceSplit(text);
  
  if (!words.length || !sentences.length) return 0;
  
  const syllables = words.reduce((sum, word) => sum + countSyllablesWord(word), 0);
  const W = words.length;
  const S = sentences.length;
  
  return 206.835 - 1.015 * (W / S) - 84.6 * (syllables / W);
}

const POWER_WORDS = new Set([
  "exclusive", "limited", "free", "new", "save", "best", "guaranteed", "proven", "instant",
  "now", "today", "sale", "deal", "bonus", "premium", "fast", "results", "secret", "only",
  "unlock", "winning", "official", "expert", "effortless", "smart", "fresh", "trending"
]);

const CTA_VERBS = new Set([
  "buy", "shop", "order", "get", "grab", "try", "join", "subscribe", "sign", "learn", "discover",
  "download", "book", "call", "apply", "register", "visit", "click", "add", "start", "upgrade"
]);

const GENERIC_ADS = [
  "Limited time offer. Buy now and save big on our best-selling products.",
  "Join today and unlock exclusive benefits. Sign up and get a free trial.",
  "New collection just dropped. Shop the latest trends now.",
  "Upgrade to premium for instant access. Try it risk-free.",
  "Discover more and book your slot today. Limited seats only.",
];

function ngrams(tokens: string[], n: number = 2): Set<string> {
  const result = new Set<string>();
  for (let i = 0; i <= tokens.length - n; i++) {
    result.add(tokens.slice(i, i + n).join(' '));
  }
  return result;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;

  const intersection = new Set<string>();
  a.forEach(x => {
    if (b.has(x)) intersection.add(x);
  });

  const union = new Set<string>();
  a.forEach(x => union.add(x));
  b.forEach(x => union.add(x));

  // avoid division by zero (shouldn't happen because sizes checked above)
  return union.size === 0 ? 0 : intersection.size / union.size;
}

export function scoreReadability(text: string, maxPoints: number = 20): number {
  const fre = fleschReadingEase(text);
  const freClamped = Math.max(0, Math.min(100, fre));
  return Math.round(maxPoints * (freClamped / 100) * 100) / 100;
}

export function scoreLengthConciseness(text: string, maxPoints: number = 15): number {
  const wc = tokenize(text).length;
  
  if (wc >= 10 && wc <= 25) {
    return maxPoints;
  }
  
  if (wc < 5 || wc > 50) {
    return 0;
  }
  
  if (wc < 10) {
    return Math.round(maxPoints * (wc - 5) / (10 - 5) * 100) / 100;
  } else {
    return Math.round(maxPoints * (50 - wc) / (50 - 25) * 100) / 100;
  }
}

export function scoreEmotion(text: string, maxPoints: number = 20): number {
  const comp = analyzer.polarity_scores(text).compound;
  return Math.round(maxPoints * ((comp + 1) / 2) * 100) / 100;
}

export function scorePowerWords(text: string, maxPoints: number = 15): number {
  const tokens = tokenize(text);
  if (!tokens.length) return 0;
  
  const hits = tokens.filter(token => POWER_WORDS.has(token)).length;
  const raw = Math.min(hits, 5) / 5;
  return Math.round(maxPoints * raw * 100) / 100;
}

export function scoreCta(text: string, maxPoints: number = 15): number {
  const tokens = new Set(tokenize(text));
  let hasCta = false;
  CTA_VERBS.forEach(verb => {
    if (!hasCta && tokens.has(verb)) hasCta = true;
  });
  return hasCta ? maxPoints : 0;
}

export function scoreUniqueness(text: string, maxPoints: number = 15, n: number = 2): number {
  const textGrams = ngrams(tokenize(text), n);
  if (!textGrams.size) return 0;
  
  const overlaps: number[] = [];
  for (const ref of GENERIC_ADS) {
    const refGrams = ngrams(tokenize(ref), n);
    overlaps.push(jaccard(textGrams, refGrams));
  }
  
  const maxOverlap = Math.max(...overlaps);
  const uniqueness = 1 - maxOverlap;
  return Math.round(maxPoints * uniqueness * 100) / 100;
}

export interface AdAnalysisResult {
  scores: {
    readability: number;
    length_conciseness: number;
    emotion: number;
    power_words: number;
    cta: number;
    uniqueness: number;
  };
  total: number;
  band: string;
  suggestions: string[];
}

const CRITERIA_WEIGHTS = {
  readability: 20,
  length_conciseness: 15,
  emotion: 20,
  power_words: 15,
  cta: 15,
  uniqueness: 15,
};

export function evaluateAd(adText: string): AdAnalysisResult {
  const scores = {
    readability: scoreReadability(adText, CRITERIA_WEIGHTS.readability),
    length_conciseness: scoreLengthConciseness(adText, CRITERIA_WEIGHTS.length_conciseness),
    emotion: scoreEmotion(adText, CRITERIA_WEIGHTS.emotion),
    power_words: scorePowerWords(adText, CRITERIA_WEIGHTS.power_words),
    cta: scoreCta(adText, CRITERIA_WEIGHTS.cta),
    uniqueness: scoreUniqueness(adText, CRITERIA_WEIGHTS.uniqueness),
  };

  const total = Math.round(Object.values(scores).reduce((sum, score) => sum + score, 0) * 100) / 100;

  let band: string;
  if (total >= 80) {
    band = "Excellent";
  } else if (total >= 60) {
    band = "Good";
  } else if (total >= 40) {
    band = "Average";
  } else {
    band = "Weak";
  }

  const suggestions = generateSuggestions(scores, adText);

  return {
    scores,
    total,
    band,
    suggestions,
  };
}

function generateSuggestions(scores: any, adText: string): string[] {
  const suggestions: string[] = [];
  const tokens = tokenize(adText);
  const wordCount = tokens.length;

  if (scores.readability < 10) {
    suggestions.push("Improve readability by using shorter sentences and simpler words. Aim for 8th-grade reading level.");
  }

  if (scores.length_conciseness < 8) {
    if (wordCount < 10) {
      suggestions.push("Add more details to make your ad more compelling. Aim for 10-25 words.");
    } else if (wordCount > 25) {
      suggestions.push("Make your ad more concise. Remove unnecessary words and focus on key benefits.");
    }
  }

  if (scores.emotion < 10) {
    suggestions.push("Add emotional triggers like 'exclusive', 'limited time', or 'guaranteed' to create urgency and excitement.");
  }

  if (scores.power_words < 8) {
    suggestions.push("Include power words like 'new', 'free', 'exclusive', 'limited', or 'best' to grab attention.");
  }

  if (scores.cta === 0) {
    suggestions.push("Add a clear call-to-action with action verbs like 'buy', 'shop', 'get', 'try', or 'discover'.");
  }

  if (scores.uniqueness < 8) {
    suggestions.push("Make your ad more unique and specific to your brand. Avoid generic marketing language.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Great job! Your ad is well-optimized. Consider A/B testing different versions to maximize performance.");
  }

  return suggestions;
}
