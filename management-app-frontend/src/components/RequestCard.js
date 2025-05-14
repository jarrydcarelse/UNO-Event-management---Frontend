// RequestCard.js
// Component for displaying a new event request
// Updated styles to match Figma design
function RequestCard({ name, budget, client, date, tasks }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md flex justify-between items-center">
      {/* Request Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500 mt-1">BUDGET: {budget}</p>
        <p className="text-sm text-gray-500 mt-1">CLIENT: {client}</p>
        <p className="text-sm text-gray-500 mt-1">Event Date: {date}</p>
        <p className="text-sm text-gray-500 mt-1">Tasks: {tasks}</p>
      </div>
      {/* Accept/Deny Buttons */}
      <div className="flex space-x-3">
        <button className="btn btn-success btn-sm rounded-full bg-green-500 hover:bg-green-600 text-white">Accept</button>
        <button className="btn btn-error btn-sm rounded-full bg-red-500 hover:bg-red-600 text-white">Deny</button>
      </div>
    </div>
  );
}

export default RequestCard;