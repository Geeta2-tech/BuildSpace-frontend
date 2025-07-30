import { FileText } from 'lucide-react';

const RecentPages = ({ recentPages }) => {
  return (
    <div className="lg:col-span-2">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-gray-400 text-sm">📋</span>
        <h2 className="text-gray-400 text-sm font-medium">Recently visited</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {recentPages.map(page => (
          <div 
            key={page.id}
            className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer transition-colors border border-gray-700"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                {page.id === 2 ? (
                  <div className="w-8 h-8 bg-yellow-600 rounded" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M3 3h18v18H3V3z" fill="%23F59E0B"/%3E%3Cpath d="M8 8h8v2H8V8zm0 4h8v2H8v-2z" fill="white"/%3E%3C/svg%3E")'
                  }} />
                ) : page.name === 'Task List' ? (
                  <span className="text-2xl">✅</span>
                ) : (
                  <FileText className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <span className="text-white text-sm font-medium">{page.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPages;