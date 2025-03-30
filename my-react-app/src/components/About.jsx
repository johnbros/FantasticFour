import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container min-h-screen bg-gradient-to-b from-blue-600 via-indigo-700 to-purple-800 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 animated-title">Welcome to Duck Finance</h1>
          <p className="text-xl font-light mb-8">Your ultimate personal financial advisor app that helps you navigate investments with ease.</p>
        </header>

        <section className="mb-20">
          <h2 className="text-4xl font-semibold mb-6">What is Duck Finance?</h2>
          <p className="text-lg mb-6">
            Duck Finance is designed to help you plan your investments and monitor your financial health. Our platform is user-friendly, intuitive, and secure.
            Whether you're a seasoned investor or just getting started, Duck Finance helps you make smart, informed decisions every step of the way.
          </p>
          <p className="text-lg mb-6">
            We prioritize user experience and aim to provide a fun yet professional space to track your financial progress, with detailed tools and insightful analytics to guide your journey.
          </p>
        </section>

        <section className="mb-24 bg-white text-gray-800 py-16 px-12 rounded-lg shadow-lg">
  <h2 className="text-4xl font-bold mb-12 drop-shadow-md text-center">Key Features:</h2>
  
  {/* Change from grid to flex layout */}
  <div className="flex flex-wrap justify-center gap-y-16">
    <FeatureCard 
      title="Investment Planner" 
      description="Plan and strategize your investments with our intuitive tools that help you stay on track." 
      gradient="bg-gradient-to-b from-yellow-400 to-orange-500"
    />
    <br/> <br/> <br/> <br/>
    <FeatureCard 
      title="Risk Analysis" 
      description="Assess and analyze your financial risks with our detailed risk analysis reports." 
      gradient="bg-gradient-to-b from-green-400 to-teal-500" 
    />
     <br/> <br/> <br/> <br/>
    <FeatureCard 
      title="Profile Strength Assessment" 
      description="Track your financial profile strength represented by a fun, dynamic duck!" 
      gradient="bg-gradient-to-b from-pink-400 to-red-500" 
    />
     <br/> <br/> <br/> <br/>
  </div>
</section>


        <section className="mb-20">
          <h2 className="text-4xl font-semibold mb-6">How We Help You</h2>
          <p className="text-lg mb-6">
            Duck Finance simplifies the complex world of personal finance. From detailed investment reports to personalized risk assessments, we provide a comprehensive overview of your financial health in one easy-to-navigate app.
          </p>
          <p className="text-lg mb-6">
            Whether you're looking to diversify your portfolio, assess risk, or simply track your financial goals, we have tools designed to help you at every stage of your investment journey.
          </p>
        </section>

        <section className="text-center mb-12">
          <p className="text-xl font-light">Thank you for choosing Duck Finance! Together, we'll help you navigate your financial future with confidence and ease.</p>
        </section>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, gradient }) => (
  <div className={`feature-item ${gradient} rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300 p-10 w-full md:w-1/2 lg:w-1/3`}>
    <h3 className="text-3xl font-bold text-white mb-6">{title}</h3>
    <p className="text-lg text-white">{description}</p>
  </div>
);




export default About;