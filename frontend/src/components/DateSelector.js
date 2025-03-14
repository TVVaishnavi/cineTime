import React, { useState } from "react";

const DateSelector = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const getNext7Days = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + i);
      dates.push(currentDate.toISOString().split("T")[0]); 
    }
    return dates;
  };

  return (
    <div className="date-selector">
      {getNext7Days().map((date) => (
        <button 
          key={date} 
          className={`date-button ${selectedDate === date ? "selected" : ""}`} 
          onClick={() => handleDateClick(date)}
        >
          {new Date(date).toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short" })}
        </button>
      ))}
    </div>
  );
};

export default DateSelector;
