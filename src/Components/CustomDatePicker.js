import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ selectedDate, setSelectedDate }) => {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={date => setSelectedDate(date)}
      className="date-picker-custom"
      maxDate={new Date()}
      minDate={new Date(new Date().setDate(new Date().getDate() - 90))}
    />
  );
};

export default CustomDatePicker;
