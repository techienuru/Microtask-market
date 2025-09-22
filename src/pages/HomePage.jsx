import React from "react";
import { Link } from "react-router-dom";
import { Zap, Users, CheckCircle, Shield, ArrowRight } from "lucide-react";
import { FeatureCard } from "../components/FeatureCard.jsx";
import { useAppState } from "../hooks/useAppState.js";

/**
 * Home/Landing page component for Micro-Task Market
 * Sections:
 * - Hero: App name, subtitle, description, CTA buttons
 * - Features: 4 feature cards explaining core functionality
 * - How it works: Visual flow tiles for Simple vs Skilled tasks
 * - Footer: Contact info and demo notes
 */
export const HomePage = () => {
  const { state } = useAppState();
  const currentUser = state.users.find((u) => u.id === state.currentUserId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Signed in banner */}
      {currentUser && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-blue-700">
              You are signed in as{" "}
              <span className="font-medium">{currentUser.name}</span>
              {currentUser.trusted && (
                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  Trusted
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">MicroTask</div>
          <nav className="flex items-center space-x-4">
            {currentUser ? (
              <Link
                to="/tasks"
                className="text-blue-600 hover:text-blue-700 font-medium"
                aria-label="Go to task board"
              >
                Task Board
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="Sign in to your account"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="Create new account"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Micro-Task Market
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-6">
              Fast, trusted short jobs for Nasarawa markets
            </p>
            <div className="max-w-2xl mx-auto mb-8">
              <p className="text-gray-700 leading-relaxed">
                A simple app where shop owners post short daily jobs and local
                workers pick them up. For quick tasks use 'Reserve' (first to
                tap). For skilled jobs use 'Apply & Choose' (up to 3
                applicants).
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link
                to="/signup"
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                aria-label="Create account to get started"
              >
                <span>Get started (Sign up)</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
                aria-label="Sign in to existing account"
              >
                Login
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              Demo site: payments simulated. Use Admin → Act as to test.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-12 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              How it works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={<Zap size={32} />}
                title="Quick Reserve"
                description="First-to-tap gets the task — great for fast jobs like deliveries and cleaning."
              />
              <FeatureCard
                icon={<Users size={32} />}
                title="Apply & Choose"
                description="For skilled work: up to 3 applicants, poster picks or system auto-picks after 30 min."
              />
              <FeatureCard
                icon={<CheckCircle size={32} />}
                title="Proof & Pay"
                description="Workers upload photo or note; poster confirms and marks paid (simulation)."
              />
              <FeatureCard
                icon={<Shield size={32} />}
                title="Local Task Manager"
                description="A human who mediates disputes quickly."
              />
            </div>
          </div>
        </section>

        {/* How it Works / Flow Section */}
        <section className="px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Task Flows
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Simple Task Flow */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Simple Task (Reserve)
                </h3>
                <p className="text-gray-600 mb-4">
                  First-come-first-served for urgent tasks
                </p>

                {/* Image placeholder */}
                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 bg-gray-50">
                  <span className="text-gray-500 text-sm">
                    flowchart-simple.png
                  </span>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <strong>Example:</strong> Aunty Z posts "Clean my stall
                    after market hours - ₦800"
                  </p>
                  <p>
                    Jide sees it first, taps "Take job", completes work, uploads
                    photo, gets paid.
                  </p>
                </div>
              </div>

              {/* Skilled Task Flow */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Skilled Task (Apply & Choose)
                </h3>
                <p className="text-gray-600 mb-4">
                  Application-based for quality work
                </p>

                {/* Image placeholder */}
                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 bg-gray-50">
                  <span className="text-gray-500 text-sm">
                    flowchart-skilled.png
                  </span>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <strong>Example:</strong> Aunty Z posts "Fix my shop's
                    electrical wiring - ₦5000"
                  </p>
                  <p>
                    3 workers apply, she picks Jide (trusted), or system
                    auto-picks after 30 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-2">
            Team Grade 6ix — github:{" "}
            <a
              href="https://github.com/techienuru/Microtask-market"
              className="text-blue-400 hover:text-blue-300 underline"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit project repository on GitHub"
            >
              https://github.com/techienuru/Microtask-market
            </a>
          </p>
          <p className="text-sm text-gray-400">
            No real payments; files stored in browser for demo.
          </p>
        </div>
      </footer>
    </div>
  );
};
