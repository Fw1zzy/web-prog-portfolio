import { useEffect, useState } from "react";

function Notification({ type = "info", message }) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible || !message) return null;

  return (
    <div className={`notification notification-${type}`}>
      <p>{message}</p>
    </div>
  );
}

export default Notification;
