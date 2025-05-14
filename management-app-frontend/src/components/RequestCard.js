// RequestCard.js
// Component for displaying a new event request
// Props: request details like name, budget, client, date, tasks
function RequestCard({ name, budget, client, date, tasks }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
      {/* Request Info */}
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">BUDGET: {budget}</p>
        <p className="text-sm text-gray-600">CLIENT: {client}</p>
        <p className="text-sm text-gray-600">Event Date: {date}</p>
        <p className="text-sm text-gray-600">Tasks: {tasks}</p>
      </div>
      {/* Accept/Deny Buttons */}
      <div className="flex space-x-2">
        <button className="btn btn-success btn-sm">Accept</button>
        <button className="btn btn-error btn-sm">Deny</button>
      </div>
    </div>
  );
}

export default RequestCard;