// EventCard.js
// Component for displaying an event in the Events Overview section
// Styled with Tailwind to match Figma design
function EventCard({ name, client, date, progress, tasks, color }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-lg mb-5 flex justify-between items-center">
      {/* Event Info */}
      <div>
        <h3 className="text-[18px] font-semibold text-gray-800">{name}</h3>
        <p className="text-[14px] text-gray-600 mt-1 uppercase tracking-wide">Client: {client}</p>
        <p className="text-[14px] text-gray-600 mt-1 uppercase tracking-wide">Event Date: {date}</p>
        <p className="text-[14px] text-gray-600 mt-1 uppercase tracking-wide">Tasks Completed: {tasks}</p>
      </div>
      {/* Progress and View Button */}
      <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-3">
          <span className="text-[14px] text-gray-600">In Progress</span>
          <div className="w-40 bg-gray-200 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-[14px] text-gray-600">{progress}%</span>
        </div>
        <button className="btn btn-outline btn-sm rounded-full border-gray-300 hover:bg-gray-100 text-gray-700">View</button>
      </div>
    </div>
  );
}

export default EventCard;