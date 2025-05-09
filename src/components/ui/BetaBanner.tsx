
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-storage';

export function BetaBanner() {
  const [isDismissed, setIsDismissed] = useLocalStorage('beta-banner-dismissed', false);
  const [isVisible, setIsVisible] = useState(false);

  // Set visibility after mount to avoid hydration mismatch
  useEffect(() => {
    setIsVisible(!isDismissed);
  }, [isDismissed]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-purple-600 text-white py-2 px-4 z-50 shadow-lg">
      <div className="container max-w-6xl mx-auto flex items-center justify-between">
        <p className="text-sm">
          <span className="font-semibold">Beta</span> - The platform is still under devlopment. We're still improving. Your feedback helps us build a better platform!
        </p>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-full hover:bg-purple-700 transition-colors"
          aria-label="Dismiss banner"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
