// RequestCard.js
// Component for displaying a new event request
// Uses class names from EventsPage.css to match Figma design
import './css/EventsPage.css';

function RequestCard({ name, budget, client, date, tasks }) {
  return (
    <div className="request-card">
      {/* Request Info */}
      <div>
        <h3>{name}</h3>
        <p>Budget: {budget}</p>
        <p>Client: {client}</p>
        <p>Event Date: {date}</p>
        <p>Tasks: {tasks}</p>
      </div>
      {/* Accept/Deny Buttons */}
      <div>
        <button className="button button-success">Accept</button>
        <button className="button button-error">Deny</button>
      </div>
    </div>
  );
}

export default RequestCard;