import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container min-h-screen bg-gradient-to-br from-red-600 to-pink-500 text-white flex flex-col items-center justify-center">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-extrabold mb-4 animated-title">Welcome to Duck Finance</h1>
          <p className="text-2xl font-semibold mb-8 shadow-lg">Your ultimate personal financial advisor app that helps you navigate investments with flair.</p>
        </header>

        <section className="mb-16 scroll-section">
          <h2 className="text-5xl font-black mb-6 animated-title drop-shadow-lg">What is Duck Finance?</h2>
          <p className="text-xl mb-6">
            Duck Finance is designed to help you navigate your investments and monitor your financial well-being. Our platform is lively, user-friendly, and incredibly secure.
            Regardless of your experience as an investor, Duck Finance empowers you to make sharp, informed decisions with style!
          </p>
          <p className="text-xl mb-6">
            We are committed to delivering a thrilling user experience while providing a professional space to track your financial journey, complete with detailed tools and enlightening analytics.
          </p>
        </section>

        <section className="mb-16 bg-white text-gray-800 p-10 rounded-lg shadow-lg border-4 border-gradient-rainbow animated-card">
          <h2 className="text-5xl font-black mb-6 drop-shadow-lg">Key Features:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Investment Planner" 
              description="Plan and strategize your investments with our engaging tools that keep you in control." 
              gradient="bg-gradient-to-br from-yellow-400 to-orange-600"
            />
            <FeatureCard 
              title="Risk Analysis" 
              description="Evaluate and dissect your financial risks with our intuitive analysis tools." 
              gradient="bg-gradient-to-br from-green-400 to-teal-600"
            />
            <FeatureCard 
              title="Profile Strength Assessment" 
              description="Track your financial profile strength represented in a fun, dynamic duck animation!" 
              gradient="bg-gradient-to-br from-pink-500 to-red-700"
            />
          </div>
        </section>

        <section className="mb-16 scroll-section">
          <h2 className="text-5xl font-black mb-6 animated-title drop-shadow-lg">How We Help You</h2>
          <p className="text-xl mb-6">
            Duck Finance demystifies personal finances, blending fun with functionality. From detailed investment reports to tailored risk assessments, we offer a panoramic view of your financial health, all through an engaging app.
          </p>
          <p className="text-xl mb-6">
            Seeking to diversify your portfolio or explore your financial goals? Our tools are designed for every investment stage, focusing on user-driven excellence!
          </p>
        </section>

        <section className="text-center mb-12">
          <p className="text-2xl font-semibold animated-fade shadow-lg">
            Thank you for choosing Duck Finance! Together, let’s confidently steward your financial future.
          </p>
        </section>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, gradient }) => (
  <div className={`feature-item text-center p-8 rounded-lg shadow-xl hover:scale-110 transition-transform duration-300 ${gradient}`}>
    <h3 className="text-3xl font-bold text-white mb-4 animate-bounce">{title}</h3>
    <p className="text-lg text-white">{description}</p>
  </div>
);

export default About;