'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function CurrentDateTime() {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    setDate(new Date());
    const timer = setInterval(() => {
      setDate(new Date());
    }, 60 * 1000); // Update every minute

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (!date) {
    return null;
  }

  return (
    <span>
      {format(date, 'MMM d, yyyy, h:mm a')}
    </span>
  );
}
