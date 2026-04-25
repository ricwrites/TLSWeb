import React, { useState, useEffect } from "react";

export const Calendar = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [events, setEvents] = useState([]);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);

  useEffect(() => {
    fetch("https://admin.thelearningsanctuary.quest/api/calendar/years")
      .then(res => res.json())
      .then(data => setYears(data));
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    fetch(`https://admin.thelearningsanctuary.quest/api/calendar/${selectedYear}`)
      .then(res => res.json())
      .then(data => setEvents(data));
  }, [selectedYear]);

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const daysInMonth = selectedYear
    ? new Date(selectedYear, selectedMonth + 1, 0).getDate()
    : 0;

  const firstDay = selectedYear
    ? new Date(selectedYear, selectedMonth, 1).getDay()
    : 0;

  const monthEvents = events.filter(
    e => new Date(e.date).getMonth() === selectedMonth
  );

  const getEventsForDay = (day) => {
    return monthEvents.filter(
      e => new Date(e.date).getDate() === day
    );
  };

  const handleDayClick = (day) => {
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length) setSelectedDayEvents(dayEvents);
  };

  const categoryColors = {
    holiday: "#4CAF50",  // green
    exam: "#2196F3",     // blue
    event: "#FF9800"     // orange
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>School Calendar</h1>

      <select
        value={selectedYear}
        onChange={e => setSelectedYear(e.target.value)}
      >
        <option value="">Select Year</option>
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      {selectedYear && (
        <>
          <div style={{ marginTop: 20 }}>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          </div>

          <div className="calendar-grid">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} style={{ fontWeight: "bold" }}>{d}</div>
            ))}

            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={"empty" + i}></div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
  const day = i + 1;
  const dayEvents = getEventsForDay(day);
  const hasEvent = dayEvents.length > 0;

  const calendarEntry = dayEvents.find(
    e => e.type === "calendar-entry"
  );

  const category =
    calendarEntry?.category?.trim().toLowerCase() ||
    dayEvents[0]?.category?.trim().toLowerCase() ||
    null;
    console.log("DAY EVENTS:", dayEvents);

  const categoryColors = {
    holiday: "#4CAF50",
    exam: "#2196F3",
    event: "#FF9800"
  };

  const dayType = dayEvents[0]?.type?.trim().toLowerCase() || null;
const bgColor = hasEvent ? "#FF9800" : "#F5F5DC";

  return (
    <div
      key={day}
      onClick={() => handleDayClick(day)}
      style={{
        padding: 10,
        border: "1px solid #ccc",
        backgroundColor: bgColor,
        color: hasEvent ? "#c00" : "#000",
        cursor: hasEvent ? "pointer" : "default",
        textAlign: "center",
        fontWeight: hasEvent ? "bold" : "normal"
      }}
    >
      {day}
    </div>
  );
})}
          </div>
        </>
      )}

      {/* Modal */}
      {selectedDayEvents.length > 0 && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 200,
          width: "calc(100vw - 200px)",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            padding: 30,
            borderRadius: 8,
            maxWidth: 400
          }}>
            <h3>Events</h3>

            {selectedDayEvents.map(ev => (
              <div key={ev.id} style={{ marginBottom: 15 }}>
                <strong>{ev.title}</strong>
                <p>{ev.description}</p>
                <small>
                  {new Date(ev.date).toLocaleDateString()}
                </small>
              </div>
            ))}

            <button onClick={() => setSelectedDayEvents([])}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
