export interface Quote {
  text: string;
  author: string;
}

export const quotes: Quote[] = [
  { text: "Small daily improvements are the key to staggering long-term results.", author: "ROBIN SHARMA" },
  { text: "The future depends on what you do today.", author: "MAHATMA GANDHI" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "SAM LEVENSON" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "STEVE JOBS" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "WINSTON CHURCHILL" },
  { text: "The only way to do great work is to love what you do.", author: "STEVE JOBS" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "CONFUCIUS" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "GEORGE ADDAIR" },
  { text: "Believe you can and you're halfway there.", author: "THEODORE ROOSEVELT" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "FRANKLIN D. ROOSEVELT" },
];

export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getQuoteForDay(): Quote {
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return quotes[dayOfYear % quotes.length];
}
