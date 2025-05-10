// src/components/ReservationTimer.tsx

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

interface TimerProps {
  endTime: string;
}

export const ReservationTimer = ({ endTime }: TimerProps) => {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      const end = dayjs(endTime);
      const diff = end.diff(now);

      if (diff <= 0) {
        clearInterval(interval);
        setRemaining("사용시간 종료");
        return;
      }

      const dur = dayjs.duration(diff);
      const format = `${String(dur.hours()).padStart(2, "0")}:${String(
        dur.minutes()
      ).padStart(2, "0")}:${String(dur.seconds()).padStart(2, "0")}`;

      setRemaining(format);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return <span>{remaining}</span>;
};
