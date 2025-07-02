import { Link } from "react-router-dom";
import {
  FaGlobe,
  FaPassport,
  FaGraduationCap,
  FaUsers,
  FaSearch,
  FaUserCheck,
  FaHandshake,
  FaHeadset,
} from "react-icons/fa";
import {
  MdOutlineWorkOutline,
  MdOutlineSecurity,
  MdOutlinePayments,
} from "react-icons/md";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/images/hero/home.avif"
            alt="Global workforce"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/75"></div>
        </div>
        <div className="relative container mx-auto px-6">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Trusted Partner for Global Talent Solutions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connecting exceptional talent with leading organizations
              worldwide. Empowering careers, building futures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/jobs"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 text-center"
              >
                Find Jobs
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200 text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Employers</h3>
              <p className="text-gray-600">
                Connect with trusted companies and verified job opportunities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security measures.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Apply</h3>
              <p className="text-gray-600">
                Apply to multiple jobs with just a few clicks using your
                profile.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Career Journey?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of professionals who found their dream jobs through
            our platform.
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

      {/* Who We Are Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Who We Are
            </h2>
            <p className="text-xl text-gray-600">
              Skyways Global is your premier partner in international
              recruitment, dedicated to connecting exceptional talent with
              leading organizations worldwide.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <FaGlobe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                International Recruitment
              </h3>
              <p className="text-gray-600">
                Global talent sourcing and placement across multiple industries
                and regions.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <FaPassport className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visa & Immigration</h3>
              <p className="text-gray-600">
                Comprehensive visa processing and immigration support services.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <FaGraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Pre-departure Training
              </h3>
              <p className="text-gray-600">
                Cultural orientation and professional development programs.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <FaUsers className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Industry Solutions</h3>
              <p className="text-gray-600">
                Specialized recruitment for various sectors and industries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Our Approach
          </h2>
          <div className="grid md:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Talent Sourcing</h3>
              <p className="text-gray-600 text-sm">Global talent pool access</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserCheck className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Screening</h3>
              <p className="text-gray-600 text-sm">Rigorous assessment</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Matching</h3>
              <p className="text-gray-600 text-sm">Perfect fit alignment</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdOutlineWorkOutline className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Onboarding</h3>
              <p className="text-gray-600 text-sm">Smooth transition</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeadset className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Support</h3>
              <p className="text-gray-600 text-sm">Continuous assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Case Study 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60"
                alt="Tech Company Success Story"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Tech Talent Expansion in Singapore
                </h3>
                <p className="text-gray-600 mb-4">
                  Helped a leading tech company scale their engineering team
                  from 50 to 200+ professionals within 12 months, focusing on
                  specialized roles in AI and cloud computing.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-blue-600">Client:</span>
                  <span className="ml-2">TechInnovate Solutions</span>
                </div>
                <div className="mt-4">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Technology
                  </span>
                </div>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1516841273335-e39b37888115?q=80&w=1694&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Healthcare Recruitment Success"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Healthcare Staffing in UAE
                </h3>
                <p className="text-gray-600 mb-4">
                  Successfully recruited 150+ healthcare professionals for a
                  major hospital network, including specialized doctors, nurses,
                  and medical technicians across various departments.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-blue-600">Client:</span>
                  <span className="ml-2">MediCare Group</span>
                </div>
                <div className="mt-4">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Healthcare
                  </span>
                </div>
              </div>
            </div>

            {/* Case Study 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Construction Project Success"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Construction Workforce in Qatar
                </h3>
                <p className="text-gray-600 mb-4">
                  Managed the recruitment of 500+ skilled construction workers
                  for a major infrastructure project, ensuring compliance with
                  local regulations and maintaining high safety standards.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-blue-600">Client:</span>
                  <span className="ml-2">BuildRight Construction</span>
                </div>
                <div className="mt-4">
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    Construction
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Updates Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Latest Updates
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <FaGlobe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">New Office Opening</h3>
                  <p className="text-gray-500">March 15, 2024</p>
                </div>
              </div>
              <p className="text-gray-600">
                Expanding our presence in Southeast Asia with a new office in
                Singapore.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <FaUsers className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    Industry Partnership
                  </h3>
                  <p className="text-gray-500">March 10, 2024</p>
                </div>
              </div>
              <p className="text-gray-600">
                Strategic partnership with leading tech companies for
                specialized recruitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <img
              src="https://img.freepik.com/free-vector/bicycle-shop-logo-design-vector_53876-40626.jpg?semt=ais_hybrid&w=740"
              alt="Partner 1"
              className="h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="https://img.freepik.com/free-vector/indonesian-halal-logo-new-branding-2022_17005-1495.jpg?semt=ais_hybrid&w=740"
              alt="Partner 2"
              className="h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="https://img.freepik.com/free-vector/bicycle-shop-logo-design-vector_53876-40626.jpg?semt=ais_hybrid&w=740"
              alt="Partner 3"
              className="h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_hybrid&w=740"
              alt="Partner 4"
              className="h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="https://img.freepik.com/premium-vector/maika-modern-ai-powered-customer-service-digital-marketing-solution_944011-4723.jpg?semt=ais_hybrid&w=740"
              alt="Partner 5"
              className="h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="https://img.freepik.com/free-vector/creative-barbecue-logo-template_23-2149017951.jpg?semt=ais_hybrid&w=740"
              alt="Partner 6"
              className="h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="https://img.freepik.com/free-vector/gradient-quill-pen-design-template_23-2149837194.jpg?semt=ais_hybrid&w=740"
              alt="Partner 7"
              className="h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="https://img.freepik.com/premium-photo/logo-design-tshirt_834604-2901.jpg?semt=ais_hybrid&w=740"
              alt="Partner 8"
              className="h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Specialties Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <MdOutlineSecurity className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Best in Market</h3>
              <p className="text-gray-600 mb-4">
                Our commitment to excellence in global talent acquisition is
                unmatched. We maintain the highest standards in candidate
                quality and client satisfaction.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Global sourcing network
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Quality assurance
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Client satisfaction guarantee
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <MdOutlinePayments className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                Innovative Solutions
              </h3>
              <p className="text-gray-600 mb-4">
                Leveraging cutting-edge technology and global networks to
                provide customized workforce solutions for every client.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Advanced matching algorithms
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Digital onboarding
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Real-time tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Client Testimonials
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((testimonial) => (
              <div
                key={testimonial}
                className="bg-white p-8 rounded-xl shadow-sm"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h3 className="font-semibold">John Smith</h3>
                    <p className="text-gray-500">HR Director, Tech Corp</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Skyways Global has transformed our recruitment process. Their
                  international expertise and professional approach have been
                  invaluable."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
