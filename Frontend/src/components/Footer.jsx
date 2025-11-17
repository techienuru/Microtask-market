import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white px-4 py-8 mt-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-blue-400 mb-4">Jobbridge</h3>
            <p className="text-gray-300 mb-4">
              Connecting local workers with short-term jobs in Nasarawa markets.
              Fast, trusted, and community-focused.
            </p>
            <p className="text-sm text-gray-400">
              Team Grade 6ix —
              <a
                href="https://github.com/techienuru/Microtask-market"
                className="text-blue-400 hover:text-blue-300 underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repository
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/tasks" className="hover:text-white">
                  Browse Tasks
                </a>
              </li>
              <li>
                <a href="/post" className="hover:text-white">
                  Post a Job
                </a>
              </li>
              <li>
                <a href="/jobs/mine" className="hover:text-white">
                  My Jobs
                </a>
              </li>
              <li>
                <a href="/wallet" className="hover:text-white">
                  Wallet
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/manager" className="hover:text-white">
                  Task Manager
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2025 Jobbridge. Demo application - no real payments processed. All
            data stored locally for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};
