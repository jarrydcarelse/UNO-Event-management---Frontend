// EventsPage.js
// Main page for Events, styled with Tailwind to match Figma design
// Includes sidebar, header, Events Overview, and New Events Requests sections
import EventCard from '../components/EventCard';
import RequestCard from '../components/RequestCard';

function EventsPage() {
  // Placeholder data to match Figma design
  const events = [
    {
      name: 'Corporate Year-End Gala',
      client: 'ABC Consulting',
      date: '15 December 2025',
      progress: 50,
      tasks: '5/10',
      color: 'bg-yellow-400', // Figma yellow (#facc15)
    },
    {
      name: 'Wedding Reception',
      client: 'Emily & Daniel',
      date: '5 June 2025',
      progress: 17,
      tasks: '2/12',
      color: 'bg-red-400', // Figma red (#ef4444)
    },
    {
      name: 'Tech Product Launch',
      client: 'InnovateX',
      date: '22 August 2025',
      progress: 85,
      tasks: '6/7',
      color: 'bg-green-400', // Figma green (#22c55e)
    },
  ];

  const requests = [
    {
      name: 'Workshop on Sustainable Design',
      budget: 'R40 000',
      client: 'Green Innovations Ltd.',
      date: '15 May 2025',
      tasks: '8',
    },
    {
      name: 'Networking Gala',
      budget: 'R110 000',
      client: 'Prestige Networking Group',
      date: '20 June 2025',
      tasks: '10',
    },
    {
      name: 'Charity Fundraising Dinner',
      budget: 'R120,000',
      client: 'Hope for All Foundation',
      date: '25 July 2025',
      tasks: '12',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-pink-500">Armand</h2>
          <p className="text-sm text-gray-500 mt-2">armand@eventify.com</p>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered w-full mb-6 text-gray-600 placeholder-gray-400 border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
        />
        <ul className="menu bg-base-100 w-full rounded-none">
          <li><a className="text-gray-600 hover:bg-gray-200 py-2 text-sm">Dashboard</a></li>
          <li><a className="bg-pink-500 text-white py-2 text-sm">Events</a></li>
          <li><a className="text-gray-600 hover:bg-gray-200 py-2 text-sm">Tasks</a></li>
          <li><a className="text-gray-600 hover:bg-gray-200 py-2 text-sm">Budget</a></li>
          <li><a className="text-gray-600 hover:bg-gray-200 py-2 text-sm">Archive</a></li>
        </ul>
        <button className="btn btn-ghost w-full mt-6 text-gray-600 text-sm">Logout</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[30px] font-bold text-gray-800">Events Overview</h1>
          <button className="btn btn-circle btn-outline border-gray-300 hover:bg-gray-200">
            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
        </div>

        {/* Events Overview */}
        <div className="mb-10">
          {events.map((event, index) => (
            <EventCard
              key={index}
              name={event.name}
              client={event.client}
              date={event.date}
              progress={event.progress}
              tasks={event.tasks}
              color={event.color}
            />
          ))}
        </div>

        {/* New Events Requests */}
        <h2 className="text-[24px] font-bold text-gray-800 mb-6">New Events Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {requests.map((request, index) => (
            <RequestCard
              key={index}
              name={request.name}
              budget={request.budget}
              client={request.client}
              date={request.date}
              tasks={request.tasks}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventsPage;