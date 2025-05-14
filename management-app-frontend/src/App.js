// App.js
// Main app component, combines default React content with EventsPage
// Includes a toggle to switch between default view and Events page
// Updated for the management app's Events page per Figma design
import { useState } from 'react'; // Import useState for toggle functionality
import EventsPage from './pages/EventsPage'; // Import the Events page component
import logo from './logo.svg'; // Keep the original logo
import './App.css'; // Keep the original CSS
import './index.css'; // Import Tailwind CSS for EventsPage styling

function App() {
  const [showEvents, setShowEvents] = useState(false); // State to toggle views

  return (
    <div className="App">
      {/* Toggle button to switch between default and Events page */}
      <button
        className="btn mb-4"
        onClick={() => setShowEvents(!showEvents)}
      >
        {showEvents ? 'Switch to Default' : 'Switch to Events Page'}
      </button>

      {showEvents ? (
        // Render EventsPage when toggle is true
        <EventsPage />
      ) : (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      )}
    </div>
  );
}

export default App;