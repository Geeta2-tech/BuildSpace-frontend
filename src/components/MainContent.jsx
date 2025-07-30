import { Calendar } from 'lucide-react';
import RecentPages from './RecentPages';
import Button from './Button';

const MainContent = ({ recentPages, theme }) => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Team standup",
      time: "9 AM",
      location: "Office",
      date: "Today Jul 29"
    },
    {
      id: 2,
      title: "Project check-in",
      time: "10 AM",
      location: "Office",
      date: "Wed Jul 30"
    }
  ];

  return (
    <div className="flex-1 bg-[rgba(0,0,0,0.9)] overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl">🤖</span>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">How can I help you today?</h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask or find anything from your workspace..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute right-3 top-3">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs">⚡</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-6 mt-4">
              <Button variant="ghost" size="sm">Ask</Button>
              <Button variant="ghost" size="sm">Research</Button>
              <Button variant="ghost" size="sm">Build</Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RecentPages recentPages={recentPages} />

          {/* Calendar Integration */}
          <div className="lg:col-span-2 mt-12">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="text-white font-medium">Connect AI Meeting Notes with your Calendar events</h3>
                  <p className="text-gray-400 text-sm mt-1">Join calls, transcribe audio, and summarize meetings all in Notion.</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Connect Notion Calendar
              </Button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-gray-400 text-sm">📅</span>
              <h2 className="text-gray-400 text-sm font-medium">Upcoming events</h2>
            </div>
            
            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <div 
                  key={event.id}
                  className="p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-gray-400 text-xs mb-1">{event.date}</div>
                      <h4 className="text-white text-sm font-medium">{event.title}</h4>
                      <div className="text-gray-400 text-xs mt-1">{event.time} • {event.location}</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <span className="text-xs">📝 Join and take notes</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;