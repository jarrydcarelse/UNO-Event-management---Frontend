// EventsPage.js
// Main page for Events, matching Figma design layout
// Contains Events Overview and New Events Requests sections
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
      color: 'bg-yellow-500',
    },
    {
      name: 'Wedding Reception',
      client: 'Emily & Daniel',
      date: '5 June 2025',
      progress: 17,
      tasks: '2/12',
      color: 'bg-red-500',
    },
    {
      name: 'Tech Product Launch',
      client: 'InnovateX',
      date: '22 August 2025',
      progress: 85,
      tasks: '6/7',
      color: 'bg-green-500',
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
      <div className="w-64 bg-white shadow p-4">
        <div className="flex items-center mb-6">
          <h2 className="text-xl font-bold text-pink-500">Armand</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">armand@eventify.com</p>
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered w-full mb-6"
        />
        <ul className="menu bg-base-100 w-full">
          <li><a>Dashboard</a></li>
          <li><a className="bg-pink-500 text-white">Events</a></li>
          <li><a>Tasks</a></li>
          <li><a>Budget</a></li>
          <li><a>Archive</a></li>
        </ul>
        <button className="btn btn-ghost w-full mt-4">Logout</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Events Overview</h1>
          <button className="btn btn-circle btn-outline">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
        </div>

        {/* Events Overview */}
        <div className="mb-8">
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
        <h2 className="text-xl font-bold mb-4">New Events Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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