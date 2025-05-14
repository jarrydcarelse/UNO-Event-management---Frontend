// EventCard.js
// Component for displaying an event in the Events Overview section
// Uses class names from EventsPage.css to match Figma design
import '../css/EventsPage.css'; // Fixed import path

function EventCard({ name, client, date, progress, tasks, color }) {
  return (
    <div className="event-card">
      {/* Event Info */}
      <div>
        <h3>{name}</h3>
        <p>Client: {client}</p>
        <p>Event Date: {date}</p>
        <p>Tasks Completed: {tasks}</p>
      </div>
      {/* Progress and View Button */}
      <div className="progress-bar-container">
        <span>In Progress</span>
        <div className="progress-bar">
          <div className={color} style={{ width: `${progress}%` }}></div>
        </div>
        <span>{progress}%</span>
      </div>
      <button className="button button-outline">View</button>
    </div>
  );
}

export default EventCard;