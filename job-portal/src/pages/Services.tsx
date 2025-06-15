import { Link } from 'react-router-dom';
import { FaUserTie, FaGraduationCap, FaPassport, FaHandshake, FaHeadset, FaIndustry, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { MdOutlineWorkOutline, MdOutlineSecurity, MdOutlinePayments } from 'react-icons/md';

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3"
            alt="Global workforce"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90"></div>
        </div>
        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              Connecting Kenyan Talent with Gulf Opportunities
            </h1>
            <p className="text-xl mb-8">
              Your trusted partner in international recruitment, providing end-to-end solutions for both employers and job seekers across the Gulf region.
            </p>
            <div className="space-x-4">
              <Link
                to="/contact"
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
              >
                Partner with Us
              </Link>
              <Link
                to="/jobs"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Find Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* International Recruitment Solutions */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">International Recruitment Solutions</h2>
              <p className="text-gray-600 mb-6">
                We provide comprehensive recruitment services connecting skilled Kenyan professionals with leading employers across the Gulf region. Our end-to-end solutions ensure a seamless hiring process for both employers and candidates.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheckCircle className="text-blue-600 mt-1 mr-3" />
                  <span>Skilled, semi-skilled, and unskilled labor supply</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-blue-600 mt-1 mr-3" />
                  <span>Industry-specific recruitment expertise</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-blue-600 mt-1 mr-3" />
                  <span>Comprehensive candidate screening</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-blue-600 mt-1 mr-3" />
                  <span>Cultural compatibility assessment</span>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Departure Training & Orientation */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-xl overflow-hidden order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3"
                alt="Training session"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">Pre-Departure Training & Orientation</h2>
              <p className="text-gray-600 mb-6">
                We prepare our candidates for success through comprehensive pre-departure training programs designed to ensure a smooth transition to their new roles and environment.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Cultural Training</h3>
                  <p className="text-sm text-gray-600">Understanding local customs and workplace culture</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Legal Rights</h3>
                  <p className="text-sm text-gray-600">Knowledge of employment laws and worker rights</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Financial Literacy</h3>
                  <p className="text-sm text-gray-600">Money management and banking basics</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Health & Safety</h3>
                  <p className="text-sm text-gray-600">Workplace safety protocols and healthcare access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visa & Immigration Assistance */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Visa & Immigration Assistance</h2>
              <p className="text-gray-600 mb-6">
                We handle all aspects of the visa and immigration process, ensuring a smooth transition for our candidates while maintaining compliance with all regulatory requirements.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaPassport className="text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">Visa Processing</h3>
                    <p className="text-gray-600">Complete documentation and application support</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaUserTie className="text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">Medical Tests</h3>
                    <p className="text-gray-600">Coordination of required health examinations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MdOutlineSecurity className="text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">Background Checks</h3>
                    <p className="text-gray-600">Thorough verification of credentials and history</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaHeadset className="text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">Travel Coordination</h3>
                    <p className="text-gray-600">Flight booking and arrival assistance</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3"
                alt="Travel and immigration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employer Partnership Programs */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Employer Partnership Programs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FaHandshake className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Workforce Planning</h3>
              <p className="text-gray-600">
                Strategic workforce planning and talent acquisition solutions tailored to your business needs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MdOutlineWorkOutline className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bulk Recruitment</h3>
              <p className="text-gray-600">
                Efficient handling of large-scale recruitment projects with dedicated support teams.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FaHeadset className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Account Management</h3>
              <p className="text-gray-600">
                Dedicated account managers for personalized service and continuous support.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Industries We Serve */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Industries We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: 'Oil & Gas', icon: '🛢️' },
              { name: 'Construction', icon: '🏗️' },
              { name: 'Hospitality', icon: '🏨' },
              { name: 'Healthcare', icon: '🏥' },
              { name: 'Domestic Work', icon: '🏠' },
              { name: 'Security', icon: '🛡️' },
              { name: 'Transportation', icon: '🚗' },
              { name: 'IT', icon: '💻' },
              { name: 'Retail', icon: '🛍️' },
              { name: 'Agriculture', icon: '🌾' },
            ].map((industry) => (
              <div key={industry.name} className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="text-3xl mb-2">{industry.icon}</div>
                <h3 className="font-semibold">{industry.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ethical Recruitment & Compliance */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3"
                alt="Ethical recruitment"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Ethical Recruitment & Compliance</h2>
              <p className="text-gray-600 mb-6">
                We are committed to maintaining the highest standards of ethical recruitment practices and full compliance with all relevant regulations.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaShieldAlt className="text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">Regulatory Compliance</h3>
                    <p className="text-gray-600">Adherence to Kenyan and international labor laws</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MdOutlinePayments className="text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">Transparent Fees</h3>
                    <p className="text-gray-600">Zero hidden charges to candidates</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaCheckCircle className="text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">National Employment Authority</h3>
                    <p className="text-gray-600">Full compliance with NEA regulations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Skyways Global */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Skyways Global</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FaUserTie className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expertise</h3>
              <p className="text-gray-600">
                Deep understanding of both Kenyan and Gulf region employment markets.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FaHandshake className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Strong Network</h3>
              <p className="text-gray-600">
                Established relationships with leading employers across the Gulf.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FaHeadset className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Support</h3>
              <p className="text-gray-600">
                Dedicated support for both employers and candidates throughout the process.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of professionals and employers who trust Skyways Global for their recruitment needs.
          </p>
          <div className="space-x-4">
            <Link
              to="/jobs"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              Find Jobs
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 