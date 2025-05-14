// RequestCard.js
// Component for displaying a new event request
// Styled with Tailwind to match Figma design
function RequestCard({ name, budget, client, date, tasks }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-lg flex justify-between items-center">
      {/* Request Info */}
      <div>
        <h3 className="text-[18px] font-semibold text-gray-800">{name}</h3>
        <p className="text-[14px] text-gray-600 mt-1 uppercase tracking-wide">Budget: {budget}</p>
        <p className="text-[14px] text-gray-600 mt-1 uppercase tracking-wide">Client: {client}</p>
        <p className="text-[14px] text-gray-600 mt-1 uppercase tracking-wide">Event Date: {date}</p>
        <p className="text-[14px] text-gray-600 mt-1 uppercase tracking-wide">Tasks: {tasks}</p>
      </div>
      {/* Accept/Deny Buttons */}
      <div className="flex space-x-3">
        <button className="btn btn-sm rounded-full bg-green-500 hover:bg-green-600 text-white text-[14px] px-4">Accept</button>
        <button className="btn btn-sm rounded-full bg-red-500 hover:bg-red-600 text-white text-[14px] px-4">Deny</button>
      </div>
    </div>
  );
}

export default RequestCard;