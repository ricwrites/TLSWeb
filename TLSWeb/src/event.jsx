import React, { useState, useEffect } from "react";

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null); // null until selected
  const [yearFilter, setYearFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("");

  // Fetch events from server
  useEffect(() => {
    fetch("https://thelearningsanctuary.quest/api/events")
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setFilteredEvents(data);
      })
      .catch(err => console.error("Error fetching events:", err));
  }, []);

  // Filter events when year or event changes
  useEffect(() => {
    let filtered = [...events];
    if (yearFilter) {
      filtered = filtered.filter(e => new Date(e.date).getFullYear().toString() === yearFilter);
    }
    if (eventFilter) {
      filtered = filtered.filter(e => e.title === eventFilter);
    }
    setFilteredEvents(filtered);
    setCurrentIndex(null); // Reset selection until user clicks an event
  }, [yearFilter, eventFilter, events]);

  const prevEvent = () => {
    if (currentIndex !== null) {
      setCurrentIndex((prev) => (prev === 0 ? filteredEvents.length - 1 : prev - 1));
    }
  };

  const nextEvent = () => {
    if (currentIndex !== null) {
      setCurrentIndex((prev) => (prev === filteredEvents.length - 1 ? 0 : prev + 1));
    }
  };

  const selectEvent = () => {
    if (filteredEvents.length > 0) {
      setCurrentIndex(0); // Select first filtered event
    }
  };

  const currentEvent = currentIndex !== null ? filteredEvents[currentIndex] : null;

  // Unique years and titles for dropdowns
  const years = Array.from(new Set(events.map(e => new Date(e.date).getFullYear())));
  const titles = Array.from(new Set(events.map(e => e.title)));

  return (
    <div>
      <h1>School Events</h1>

      {/* Filters */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "20px" }}>
        <div>
          <label>Year: </label>
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
            <option value="">All</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Event: </label>
          <select value={eventFilter} onChange={e => setEventFilter(e.target.value)}>
            <option value="">All</option>
            {titles.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <button onClick={selectEvent} disabled={filteredEvents.length === 0}>
            View Event
          </button>
        </div>
      </div>

      {/* Event carousel only shows if user has selected an event */}
      {currentEvent && (
        <div className="event-card">
          <h2>{currentEvent.title}</h2>
          <p><strong>Date:</strong> {new Date(currentEvent.date).toLocaleDateString()}</p>
          <p>{currentEvent.description}</p>

          {/* Images carousel */}
        {currentEvent.images?.length > 0 && (
  <div
    style={{
      display: "flex",
      gap: "10px",
      overflowX: "auto",
      marginTop: "10px"
    }}
  >
    {currentEvent.images.map((img, idx) => {
      // Normalize all possible backend formats into a usable URL
      let url = "";

      if (typeof img === "string") {
        try {
          // handles cases where backend sends JSON stringified arrays
          url = JSON.parse(img);
        } catch {
          url = img;
        }
      }

      if (typeof img === "object" && img !== null) {
        url = img.url || img.secure_url || img.path || "";
      }

      // If JSON.parse returned array accidentally
      if (Array.isArray(url)) {
        url = url[0];
      }

      return url ? (
        <img
          key={idx}
          src={url}
          alt={`Event ${idx}`}
          style={{ height: 200, borderRadius: "10px", objectFit: "cover" }}
        />
      ) : null;
    })}
  </div>
)}

          {/* Navigation buttons */}
          <div style={{ marginTop: "20px" }}>
            <button onClick={prevEvent} style={{ marginRight: "20px" }}>Previous</button>
            <button onClick={nextEvent}>Next</button>
          </div>
        </div>
      )}

      {/* Message if no events match filters */}
      {currentEvent === null && filteredEvents.length === 0 && <p>No events found.</p>}
    </div>
  );
};
