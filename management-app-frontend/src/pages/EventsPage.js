// EventsPage.js
// Main page for Events, with styles moved to EventsPage.css
// Uses class names to apply Figma-matched styling
import EventCard from '../components/EventCard';
import RequestCard from '../components/RequestCard';
import '../css/EventsPage.css'; // Fixed import path

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
    <div className="events-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <h2>Armand</h2>
          <p>armand@eventify.com</p>
        </div>
        <input type="text" placeholder="Search..." />
        <nav>
          <ul>
            <li><a className="text-sm">Dashboard</a></li>
            <li><a className="active text-sm">Events</a></li>
            <li><a className="text-sm">Tasks</a></li>
            <li><a className="text-sm">Budget</a></li>
            <li><a className="text-sm">Archive</a></li>
          </ul>
        </nav>
        <button className="text-sm">Logout</button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <h1>Events Overview</h1>
          <button>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
        </header>

        {/* Events Overview */}
        <section className="events-overview">
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
        </section>

        {/* New Events Requests */}
        <section className="new-events-requests">
          <h2>New Events Requests</h2>
          <div className="grid">
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
        </section>
      </main>
    </div>
  );
}

export default EventsPage;