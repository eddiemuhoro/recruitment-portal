import React, { useState } from 'react';
import { FaCheckCircle, FaUserTie, FaHospital, FaUtensils, FaCar, FaHardHat, FaUserNurse, FaTools, FaCertificate, FaAward, FaUsers, FaGlobe, FaExclamationCircle } from 'react-icons/fa';
import { MdSecurity, MdCleaningServices, MdVerified } from 'react-icons/md';
import { motion } from 'framer-motion';
import { submitEmployerInquiry } from '../api/employerInquiries';

const Partner: React.FC = () => {
  const industries = [
    { icon: <MdCleaningServices size={40} />, title: 'Domestic Workers', description: 'Housekeepers, nannies' },
    { icon: <MdSecurity size={40} />, title: 'Security Personnel', description: 'Guards, security officers' },
    { icon: <FaUtensils size={40} />, title: 'Hospitality Staff', description: 'Hotels, catering, restaurants' },
    { icon: <FaCar size={40} />, title: 'Drivers', description: 'Professional chauffeurs' },
    { icon: <FaHardHat size={40} />, title: 'Construction Workers', description: 'Skilled laborers' },
    { icon: <FaUserNurse size={40} />, title: 'Healthcare Aides', description: 'Medical support staff' },
    { icon: <FaTools size={40} />, title: 'Technicians', description: 'Skilled technical workers' },
  ];

  const processSteps = [
    'Employer submits request',
    'Pre-screening of candidates',
    'Medical + security clearance',
    'Visa processing',
    'Travel arrangements & deployment',
    'Post-deployment support'
  ];

  const guarantees = [
    'Medical fit-to-work cleared',
    'Visa compliant processing',
    'Security vetted candidates',
    'Pre-departure orientation',
    'Full compliance with Kenya labor laws'
  ];

  const statistics = [
    { icon: <FaUsers size={40} />, number: '100,000+', label: 'Workers Placed' },
    { icon: <FaGlobe size={40} />, number: '4+', label: 'Gulf Countries' },
    { icon: <FaAward size={40} />, number: '15+', label: 'Years Experience' },
    { icon: <MdVerified size={40} />, number: '98%', label: 'Success Rate' },
  ];

  const testimonials = [
    {
      quote: "We've hired over 300 housekeepers through this agency and had excellent service & support. Their pre-screening process is thorough and reliable.",
      author: "Ahmed Al-Mansouri",
      position: "HR Director",
      company: "Doha Hospitality Group, Qatar"
    },
    {
      quote: "The quality of workers and the speed of processing has been exceptional. Their post-deployment support is what sets them apart.",
      author: "Sarah Al-Rashid",
      position: "Operations Manager",
      company: "Dubai Healthcare Services, UAE"
    },
    {
      quote: "Their compliance with both Kenyan and Gulf labor laws gives us peace of mind. A truly professional recruitment partner.",
      author: "Mohammed Al-Saud",
      position: "Managing Director",
      company: "Riyadh Construction Co., KSA"
    }
  ];

  const certifications = [
    {
      title: "NEA Registration",
      description: "Fully licensed by Kenya National Employment Authority",
      icon: <FaCertificate className="text-blue-600" size={30} />
    },
    {
      title: "ISO 9001:2015",
      description: "Certified for Quality Management Systems",
      icon: <FaCertificate className="text-blue-600" size={30} />
    },
    {
      title: "Gulf Cooperation",
      description: "Recognized by GCC Labor Ministries",
      icon: <FaCertificate className="text-blue-600" size={30} />
    }
  ];

  const faqs = [
    {
      question: "How long does the recruitment process take?",
      answer: "Our standard process takes 4-6 weeks from initial request to worker deployment. We can expedite for urgent needs."
    },
    {
      question: "What are your fees and payment terms?",
      answer: "Our fees are competitive and transparent. We offer flexible payment terms and detailed cost breakdowns upfront."
    },
    {
      question: "How do you ensure worker quality?",
      answer: "We conduct thorough screening, including skills assessment, medical checks, and background verification. All workers undergo pre-departure training."
    },
    {
      question: "What happens if a worker doesn't meet expectations?",
      answer: "We offer a 90-day replacement guarantee. Our post-deployment support team ensures smooth integration and addresses any concerns promptly."
    }
  ];

  const [formData, setFormData] = useState({
    employer_name: '',
    contact_email: '',
    message: '',
    phone_number: '',
    is_urgent: false,
    agency_id: 1 // Default agency ID
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await submitEmployerInquiry({
        employer_name: formData.employer_name,
        contact_email: formData.contact_email,
        message: formData.message,
        phone_number: formData.phone_number,
        is_urgent: formData.is_urgent,
        agency_id: formData.agency_id
      });
      setSubmitStatus('success');
      setFormData({
        employer_name: '',
        contact_email: '',
        message: '',
        phone_number: '',
        is_urgent: false,
        agency_id: 1
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Partner with Us — For Gulf Employers</h1>
            <p className="text-xl mb-8">Licensed by Kenya NEA — Your trusted recruitment partner</p>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="text-lg">Over 100,000 Kenyan workers successfully placed across Gulf States</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Impact in Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-4 flex justify-center">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Kenya Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Hire from Kenya</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              'Highly motivated workers',
              'Skilled across multiple industries',
              'English-speaking',
              'Culturally adaptable',
              'NEA-vetted and medically cleared',
              'Fast processing'
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
              >
                <FaCheckCircle className="text-green-500" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Certifications & Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-lg text-center"
              >
                <div className="mb-4 flex justify-center">{cert.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{cert.title}</h3>
                <p className="text-gray-600">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Industries We Serve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="text-blue-600 mb-4 flex justify-center">{industry.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{industry.title}</h3>
                <p className="text-gray-600">{industry.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="text-gray-600 mb-4 italic">"{testimonial.quote}"</div>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-gray-500">{testimonial.position}</div>
                <div className="text-blue-600">{testimonial.company}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Recruitment Process</h2>
          <div className="max-w-3xl mx-auto">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center mb-6"
              >
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
                  {index + 1}
                </div>
                <span className="text-lg">{step}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Guarantee to Employers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guarantees.map((guarantee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-green-500" />
                  <span>{guarantee}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Partner with Us</h2>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Inquiry Form</h3>
                <p className="text-blue-700">Fill out this form and our team will get back to you within 24 hours.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="employer_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="employer_name"
                    name="employer_name"
                    value={formData.employer_name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    id="contact_email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="business@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1234567890"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_urgent"
                    name="is_urgent"
                    checked={formData.is_urgent}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_urgent" className="ml-2 block text-sm text-gray-700">
                    This is an urgent requirement
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Requirements *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please tell us about:
• Number of workers needed
• Job positions
• Required skills
• Expected start date
• Any specific requirements"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  By submitting this form, you agree to our privacy policy and terms of service. 
                  We respect your privacy and will never share your information with third parties.
                </p>
              </div>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
                  <FaCheckCircle className="mr-2" />
                  <span>Thank you for your inquiry! Our team will contact you within 24 hours.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                  <FaExclamationCircle className="mr-2" />
                  <span>There was an error submitting your inquiry. Please try again or contact us directly.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 text-white py-4 rounded-lg transition-colors text-lg font-semibold ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Submit Inquiry'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partner; 