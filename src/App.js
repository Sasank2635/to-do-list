import React, { useState } from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel, Checkbox, FormControlLabel, Button } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [repeat, setRepeat] = useState('');
  const [notificationTime, setNotificationTime] = useState('15 minutes before');
  const [allDay, setAllDay] = useState(false);
  const [view, setView] = useState('day');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState([]);
  const [showTodayEvents, setShowTodayEvents] = useState(false);
  const [visibleDetails, setVisibleDetails] = useState({});

  const handleSave = () => {
    const newEvent = {
      title,
      details,
      startDate,
      endDate,
      repeat,
      notificationTime,
      allDay
    };
    setEvents([...events, newEvent]);
    setTitle('');
    setDetails('');
    setStartDate(new Date());
    setEndDate(new Date());
    setRepeat('');
    setNotificationTime('15 minutes before');
    setAllDay(false);
  };

  const handleDelete = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
  };

  const toggleDetails = (index) => {
    setVisibleDetails((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isToday = (someDate) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
           someDate.getMonth() === today.getMonth() &&
           someDate.getFullYear() === today.getFullYear();
  };

  const todayEvents = events.filter(event => isToday(new Date(event.startDate)));

  const eventsByMonth = events.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate.getMonth() === selectedMonth && eventDate.getFullYear() === selectedYear;
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="container">
        <header className="header">
          <h4>Today, {format(new Date(), 'dd/MM/yyyy')}</h4>
          <div className="day-month-toggle">
            <button className={view === 'day' ? 'active' : ''} onClick={() => setView('day')}>
              Day
            </button>
            <button className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>
              Month
            </button>
            <button className={view === 'year' ? 'active' : ''} onClick={() => setView('year')}>
              Year
            </button>
          </div>
          <div className="today-events-toggle">
            <button onClick={() => setShowTodayEvents(!showTodayEvents)}>
              {showTodayEvents ? 'Hide Today\'s Events' : 'Show Today\'s Events'}
            </button>
          </div>
        </header>
        <div className="main">
          <div className="calendar">
            {/* Insert calendar JSX components here */}
            {view === 'day' && events.map((event, index) => (
              <div key={index} className="event">
                <div>
                  <h6>{event.title}</h6>
                  <p>{format(new Date(event.startDate), 'dd/MM/yyyy HH:mm')} - {format(new Date(event.endDate), 'dd/MM/yyyy HH:mm')}</p>
                  <button className="view-details-button" onClick={() => toggleDetails(index)}>
                    {visibleDetails[index] ? 'Hide Details' : 'View Details'}
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(index)}>Delete</button>
                  {visibleDetails[index] && (
                    <div className="event-details">
                      <p>{event.details}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {view === 'month' && (
              <div>
                {/* Insert month view JSX components here */}
                <FormControl fullWidth margin="normal">
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <MenuItem key={i} value={i}>{format(new Date(0, i), 'MMMM')}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() - 5 + i;
                      return <MenuItem key={year} value={year}>{year}</MenuItem>
                    })}
                  </Select>
                </FormControl>
                {eventsByMonth.map((event, index) => (
                  <div key={index} className="event">
                    <div>
                      <h6>{event.title}</h6>
                      <p>{format(new Date(event.startDate), 'dd/MM/yyyy HH:mm')} - {format(new Date(event.endDate), 'dd/MM/yyyy HH:mm')}</p>
                      <button className="view-details-button" onClick={() => toggleDetails(index)}>
                        {visibleDetails[index] ? 'Hide Details' : 'View Details'}
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(index)}>Delete</button>
                      {visibleDetails[index] && (
                        <div className="event-details">
                          <p>{event.details}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {view === 'year' && (
              <div>
                {/* Insert year view JSX components here */}
                <FormControl fullWidth margin="normal">
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() - 5 + i;
                      return <MenuItem key={year} value={year}>{year}</MenuItem>
                    })}
                  </Select>
                </FormControl>
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i}>
                    <h5>{format(new Date(0, i), 'MMMM')}</h5>
                    {events.filter(event => {
                      const eventDate = new Date(event.startDate);
                      return eventDate.getMonth() === i && eventDate.getFullYear() === selectedYear;
                    }).map((event, index) => (
                      <div key={index} className="event">
                        <div>
                          <h6>{event.title}</h6>
                          <p>{format(new Date(event.startDate), 'dd/MM/yyyy HH:mm')} - {format(new Date(event.endDate), 'dd/MM/yyyy HH:mm')}</p>
                          <button className="view-details-button" onClick={() => toggleDetails(index)}>
                            {visibleDetails[index] ? 'Hide Details' : 'View Details'}
                          </button>
                          <button className="delete-button" onClick={() => handleDelete(index)}>Delete</button>
                          {visibleDetails[index] && (
                            <div className="event-details">
                              <p>{event.details}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="todo-form">
            <form>
              {/* Insert form JSX components here */}
              <TextField
                label="Add a title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Event details"
                fullWidth
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                margin="normal"
                multiline
                rows={4}
              />
              <DateTimePicker
                label="Start Date"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
              <DateTimePicker
                label="End Date"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Repeat</InputLabel>
                <Select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value)}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Notification</InputLabel>
                <Select
                  value={notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                >
                  <MenuItem value="5 minutes before">5 minutes before</MenuItem>
                  <MenuItem value="10 minutes before">10 minutes before</MenuItem>
                  <MenuItem value="15 minutes before">15 minutes before</MenuItem>
                  <MenuItem value="30 minutes before">30 minutes before</MenuItem>
                  <MenuItem value="1 hour before">1 hour before</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Checkbox checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />}
                label="All day"
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '20px' }}>Save</Button>
            </form>
          </div>
        </div>
        <div className={`todo-list-container ${showTodayEvents ? '' : 'hidden'}`}>
          <div className="todo-list">
            <h4>Today's Events</h4>
            {todayEvents.map((event, index) => (
              <div key={index} className="event">
                <h6>{event.title}</h6>
                <p>{format(new Date(event.startDate), 'dd/MM/yyyy HH:mm')} - {format(new Date(event.endDate), 'dd/MM/yyyy HH:mm')}</p>
                <button className="view-details-button" onClick={() => toggleDetails(index)}>
                  {visibleDetails[index] ? 'Hide Details' : 'View Details'}
                </button>
                <button className="delete-button" onClick={() => handleDelete(index)}>Delete</button>
                {visibleDetails[index] && (
                  <div className="event-details">
                    <p>{event.details}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default App;
