import React from "react";
import { Link } from "react-router-dom";
import { Zap, Users, CheckCircle, Shield, ArrowRight } from "lucide-react";
import { FeatureCard } from "../components/FeatureCard.jsx";
import { useAuth } from "../contexts/AuthProvider.jsx";
import { Header } from "../components/Header.jsx";
import { Footer } from "../components/Footer.jsx";

import simpleTaskPic from "../assets/images/Simple Task flow.png";
import skilledTaskPic from "../assets/images/Skilled Task flow.png";

/**
 * Home/Landing page component for JobBridge
 * Sections:
 * - Hero: App name, subtitle, description, CTA buttons
 * - Features: 4 feature cards explaining core functionality
 * - How it works: Visual flow tiles for Simple vs Skilled tasks
 * - Footer: Contact info and demo notes
 */
export const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              JobBridge
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
                <img
                  src={simpleTaskPic}
                  alt="Simple task flow diagram"
                  className="w-full h-50 object-cover rounded-lg mb-4"
                />

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
                <img
                  src={skilledTaskPic}
                  alt="Skilled task flow diagram"
                  className="w-full h-50 object-cover rounded-lg mb-4"
                />

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

      <Footer />
    </div>
  );
};
