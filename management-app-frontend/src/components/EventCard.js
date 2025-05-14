// EventCard.js
// Component for displaying an event in the Events Overview section
// Props: event details like name, client, date, progress, tasks, color
function EventCard({ name, client, date, progress, tasks, color }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
      {/* Event Info */}
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">CLIENT: {client}</p>
        <p className="text-sm text-gray-600">Event Date: {date}</p>
        <p className="text-sm text-gray-600">Tasks Completed: {tasks}</p>
      </div>
      {/* Progress and View Button */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm">In Progress</span>
          <div className="w-32 bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${color}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span>{progress}%</span>
        </div>
        <button className="btn btn-outline btn-sm">View</button>
      </div>
    </div>
  );
}

export default EventCard;