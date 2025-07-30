import React from 'react';

const Landing = () => {
  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Notion
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Mail</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Calendar</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">AI</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Enterprise</a>
            <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Pricing</a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/login" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Log in</a>
            <a href="#" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all">
              Get Notion free
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Floating Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full animate-pulse"></div>
          <div className="absolute top-2/3 right-1/3 w-16 h-16 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full animate-ping"></div>
        </div>

        <div className="text-center px-8 relative z-10 max-w-5xl mx-auto pt-20">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            The AI workspace<br />that works for you.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            One place where teams find every answer, automate the busywork, and get projects done.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              Get Notion free
            </button>
            <button className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 hover:border-purple-300 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              Request a demo
            </button>
          </div>

          {/* Character Illustrations */}
          <div className="flex justify-center items-center mt-16 space-x-8">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
              <div className="text-3xl">🤓</div>
            </div>
            <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <div className="text-4xl">💼</div>
            </div>
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
              <div className="text-3xl">✨</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="text-gray-500 text-sm font-medium mb-8 uppercase tracking-wide">
            Trusted by top teams
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-gray-800">OpenAI</div>
            <div className="text-2xl font-bold text-gray-800">Figma</div>
            <div className="text-2xl font-bold text-gray-800">Volvo</div>
            <div className="text-2xl font-bold text-gray-800">Ramp</div>
            <div className="text-2xl font-bold text-gray-800">Cursor</div>
            <div className="text-2xl font-bold text-gray-800">NVIDIA</div>
            <div className="text-2xl font-bold text-gray-800">Perplexity</div>
            <div className="text-2xl font-bold text-gray-800">Vercel</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm">🎤</span>
                </div>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  AI Meeting Notes • New
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Perfect notes every time.
              </h3>
              <p className="text-gray-600">
                Never miss important details with AI-powered meeting transcription and summarization.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm">🔍</span>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  Enterprise Search • New
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                One search for everything.
              </h3>
              <p className="text-gray-600">
                Find any document, conversation, or insight across your entire workspace instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join millions of users who organize their work and life in Notion.
          </p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            Get Notion free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Notion
          </div>
          <p className="text-gray-400">
            © 2025 Notion Labs, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;