import { useEffect, useState } from "react";

const DateTimeDisplay = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12; // 12시간제

    return (
      <div className="flex items-baseline gap-3 text-white">
        {/* 날짜 */}
        <span className="text-2xl font-semibold text-white">
          {year}년 {month}월 {day}일
        </span>

        {/* 오전/오후 */}
        <span className="text-lg font-light">{ampm}</span>

        {/* 시:분:초 */}
        <span className="text-5xl font-bold ">
          {String(hours).padStart(2, "0")}:{minutes}:{seconds}
        </span>
      </div>
    );
  };

  return (
    <div className="absolute top-5 left-6">
      {formatDateTime(dateTime)}
    </div>
  );
};

export default DateTimeDisplay;
