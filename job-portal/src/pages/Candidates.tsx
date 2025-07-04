import React from "react";
import { motion } from "framer-motion";
import {
  FaUserTie,
  FaSearch,
  FaBell,
  FaFileAlt,
  FaChartLine,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Candidates: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Career Journey Starts Here
            </h1>
            <p className="text-xl mb-8">
              Discover opportunities that match your skills, experience, and
              aspirations. Take control of your professional future with our
              comprehensive job search platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {/* <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors">
                Create Profile
              </button> */}
              <Link
                to="/jobs"
                className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors inline-block"
              >
                Browse Jobs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="text-blue-600 text-4xl mb-4">
                <FaUserTie />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Smart Profile Matching
              </h3>
              <p className="text-gray-600">
                Our AI-powered system matches your profile with the most
                relevant job opportunities, saving you time and increasing your
                chances of finding the perfect role.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="text-blue-600 text-4xl mb-4">
                <FaSearch />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Advanced Job Search
              </h3>
              <p className="text-gray-600">
                Filter jobs by location, salary, company size, and more. Save
                your search preferences and get notified when new matching
                positions are posted.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="text-blue-600 text-4xl mb-4">
                <FaBell />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Real-time Notifications
              </h3>
              <p className="text-gray-600">
                Stay updated with instant notifications about application
                status, interview requests, and new job opportunities that match
                your criteria.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="text-blue-600 text-4xl mb-4">
                <FaFileAlt />
              </div>
              <h3 className="text-xl font-semibold mb-3">Resume Builder</h3>
              <p className="text-gray-600">
                Create a professional resume with our easy-to-use builder. Get
                expert tips and templates to showcase your skills and experience
                effectively.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="text-blue-600 text-4xl mb-4">
                <FaChartLine />
              </div>
              <h3 className="text-xl font-semibold mb-3">Career Insights</h3>
              <p className="text-gray-600">
                Access detailed salary information, company reviews, and
                industry trends to make informed decisions about your career
                path.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="text-blue-600 text-4xl mb-4">
                <FaUsers />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Professional Network
              </h3>
              <p className="text-gray-600">
                Connect with industry professionals, join relevant groups, and
                participate in discussions to expand your professional network.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      {/* <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                  JS
                </div>
                <div>
                  <h3 className="text-xl font-semibold">John Smith</h3>
                  <p className="text-gray-600">Software Engineer at TechCorp</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The platform's smart matching system helped me find my dream
                job within weeks. The resume builder and interview preparation
                resources were invaluable."
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                  SJ
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Sarah Johnson</h3>
                  <p className="text-gray-600">
                    Marketing Director at GrowthCo
                  </p>
                </div>
              </div>
              <p className="text-gray-600">
                "I was able to connect with industry leaders and find
                opportunities that aligned perfectly with my career goals. The
                platform's resources made my job search efficient and
                successful."
              </p>
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs
            through our platform. Start your journey today!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/jobs"
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started Now
            </Link>
            <Link
              to="/services"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Candidates;
