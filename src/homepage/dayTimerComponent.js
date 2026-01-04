import { useEffect, useState } from "react";

function nextDay(){
  const now = new Date();
  return Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1
  );
}

function formatTime(time) {
    const totalSeconds = Math.max(0, Math.floor(time / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}


function DayTimerComponent(params) {
    const [target, setTarget] = useState(nextDay());
    const [timeLeft, setTimeLeft] = useState(target - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            // New day reached → reset timer
            const next = nextDay();
            setTarget(next);
            setTimeLeft(next - now);
        } else {
            setTimeLeft(diff);
        }
        }, 1000);

    return () => clearInterval(interval);
  }, [target]);



    return (
    <div>
      <b>{formatTime(timeLeft)}</b>
    </div>
  );
}

export default DayTimerComponent;