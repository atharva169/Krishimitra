// components/icons.tsx
export function IconAI({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="#16a34a" strokeWidth="1.5" fill="#ecfdf5"/>
      <path d="M8 12h8M8 8h8M8 16h8" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconWeather({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M17 18a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10 1A3.5 3.5 0 0 0 7.5 18H17z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2"/>
    </svg>
  );
}

export function IconAdvice({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="#059669" strokeWidth="1.5" fill="#ecfdf5"/>
      <path d="M12 7v6l3 3" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
