import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const HeaderUser = () => {
  const [selectedDate, setSelectedDate] = useState('14 Feb 2019');

  const openDatePicker = () => {
    document.getElementById("datePicker").showPicker();
  };

  const updateDate = (event) => {
    const selected = new Date(event.target.value);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    setSelectedDate(selected.toLocaleDateString("en-GB", options));
  };

  return (
    <div className="header">
      <div className="data-can">
        <h1>Hello User Name 👋</h1>
      </div>
      <div className="date-container" onClick={openDatePicker}>
        <Calendar className="calendar-icon" />
        <div className="date-content">
          <span className="date-label">Invested Month</span>
          <span className="selected-date" id="selectedDate">{selectedDate}</span>
        </div>
        <input type="date" id="datePicker" onChange={updateDate} style={{display: 'none'}} />
      </div>
    </div>
  );
};

export default HeaderUser;