import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaUserTie,
  FaHospital,
  FaUtensils,
  FaCar,
  FaHardHat,
  FaUserNurse,
  FaTools,
  FaCertificate,
  FaAward,
  FaUsers,
  FaGlobe,
  FaExclamationCircle,
} from "react-icons/fa";
import { MdSecurity, MdCleaningServices, MdVerified } from "react-icons/md";
import { motion } from "framer-motion";
import { submitEmployerInquiry } from "../api/employerInquiries";

const timeZones = [
  { city: "Nairobi (EAT)", zone: "Africa/Nairobi" },
  { city: "Dubai (GST)", zone: "Asia/Dubai" },
  // { city: "Riyadh (AST)", zone: "Asia/Riyadh" },
  { city: "Doha (AST)", zone: "Asia/Qatar" },
];

const Partner: React.FC = () => {
  const industries = [
    {
      icon: <MdCleaningServices size={40} />,
      title: "Domestic Workers",
      description: "Housekeepers, nannies",
    },
    {
      icon: <MdSecurity size={40} />,
      title: "Security Personnel",
      description: "Guards, security officers",
    },
    {
      icon: <FaUtensils size={40} />,
      title: "Hospitality Staff",
      description: "Hotels, catering, restaurants",
    },
    {
      icon: <FaCar size={40} />,
      title: "Drivers",
      description: "Professional chauffeurs",
    },
    {
      icon: <FaHardHat size={40} />,
      title: "Construction Workers",
      description: "Skilled laborers",
    },
    {
      icon: <FaUserNurse size={40} />,
      title: "Healthcare Aides",
      description: "Medical support staff",
    },
    {
      icon: <FaTools size={40} />,
      title: "Technicians",
      description: "Skilled technical workers",
    },
  ];

  const processSteps = [
    "Employer submits request",
    "Pre-screening of candidates",
    "Internal Arrangement with the employer",
    "Contract signing and Offer letter",
    "Medical + security clearance",
    "Visa processing",
    "Travel arrangements & deployment",
    "Post-deployment support",
  ];

  const guarantees = [
    "Medical fit-to-work cleared",
    "Visa compliant processing",
    "Security vetted candidates",
    "Pre-departure orientation",
    "Full compliance with Kenya labor laws",
  ];

  const statistics = [
    {
      icon: <FaUsers size={40} />,
      number: "20+",
      label: "Partners",
    },
    { icon: <FaGlobe size={40} />, number: "4+", label: "Gulf Countries" },
    { icon: <FaAward size={40} />, number: "10+", label: "Years Experience" },
    { icon: <MdVerified size={40} />, number: "98%", label: "Success Rate" },
  ];

  const gulfCountries = [
    {
      name: "Saudi Arabia",
      code: "SA",
      flag: (
        <svg
          width="36"
          height="24"
          viewBox="0 0 36 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="36" height="24" rx="3" fill="#1A9F29" />
          <rect x="6" y="6" width="24" height="12" fill="none" />
          {/* This is a simple green rectangle for Saudi Arabia. For production, use a proper SVG flag. */}
        </svg>
      ),
    },
    {
      name: "United Arab Emirates",
      code: "AE",
      flag: (
        <svg
          width="36"
          height="24"
          viewBox="0 0 36 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="36" height="24" rx="3" fill="#fff" />
          <rect width="12" height="24" fill="#E94B35" />
          <rect x="12" width="24" height="8" fill="#009739" />
          <rect x="12" y="16" width="24" height="8" fill="#262626" />
        </svg>
      ),
    },
    {
      name: "Qatar",
      code: "QA",
      flag: (
        <svg
          width="36"
          height="24"
          viewBox="0 0 36 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="36" height="24" rx="3" fill="#fff" />
          <rect x="12" width="24" height="24" fill="#8A1538" />
          <polygon
            points="12,0 14,2 12,4 14,6 12,8 14,10 12,12 14,14 12,16 14,18 12,20 14,22 12,24"
            fill="#fff"
          />
        </svg>
      ),
    },
    {
      name: "Oman",
      code: "OM",
      flag: (
        <svg
          width="36"
          height="24"
          viewBox="0 0 36 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="36" height="24" rx="3" fill="#fff" />
          <rect width="8" height="24" fill="#D32030" />
          <rect x="8" width="28" height="8" fill="#D32030" />
          <rect x="8" y="16" width="28" height="8" fill="#009739" />
        </svg>
      ),
    },
    {
      name: "Bahrain",
      code: "BH",
      flag: (
        <svg
          width="36"
          height="24"
          viewBox="0 0 36 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="36" height="24" rx="3" fill="#fff" />
          <polygon
            points="0,0 12,0 12,24 0,24 3,20 0,16 3,12 0,8 3,4 0,0"
            fill="#D32030"
          />
        </svg>
      ),
    },
    {
      name: "Kuwait",
      code: "KW",
      flag: (
        <svg
          width="36"
          height="24"
          viewBox="0 0 36 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="36" height="24" rx="3" fill="#fff" />
          <rect y="0" width="36" height="8" fill="#009739" />
          <rect y="16" width="36" height="8" fill="#D32030" />
          <polygon points="0,0 8,6 8,18 0,24" fill="#262626" />
        </svg>
      ),
    },
  ];

  const testimonials = [
    {
      quote:
        "We've hired over 300 housekeepers through this agency and had excellent service & support. Their pre-screening process is thorough and reliable.",
      author: "Ahmed Al-Mansouri",
      position: "HR Director",
      company: "Doha Hospitality Group, Qatar",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3",
    },
    {
      quote:
        "The quality of workers and the speed of processing has been exceptional. Their post-deployment support is what sets them apart.",
      author: "Sarah Al-Rashid",
      position: "Operations Manager",
      company: "Dubai Healthcare Services, UAE",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3",
    },
    {
      quote:
        "Their compliance with both Kenyan and Gulf labor laws gives us peace of mind. A truly professional recruitment partner.",
      author: "Mohammed Al-Saud",
      position: "Managing Director",
      company: "Riyadh Construction Co., KSA",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3",
    },
  ];

  const certifications = [
    {
      title: "NEA Registration",
      description: "Fully licensed by Kenya National Employment Authority",
      icon: <FaCertificate className="text-blue-600" size={30} />,
    },
    {
      title: "ISO 9001:2015",
      description: "Certified for Quality Management Systems",
      icon: <FaCertificate className="text-blue-600" size={30} />,
    },
    {
      title: "Gulf Cooperation",
      description: "Recognized by GCC Labor Ministries",
      icon: <FaCertificate className="text-blue-600" size={30} />,
    },
  ];

  const faqs = [
    {
      question: "How long does the recruitment process take?",
      answer:
        "Our standard process takes 4-6 weeks from initial request to worker deployment. We can expedite for urgent needs.",
    },
    {
      question: "What are your fees and payment terms?",
      answer:
        "Our fees are competitive and transparent. We offer flexible payment terms and detailed cost breakdowns upfront.",
    },
    {
      question: "How do you ensure worker quality?",
      answer:
        "We conduct thorough screening, including skills assessment, medical checks, and background verification. All workers undergo pre-departure training.",
    },
    {
      question: "What happens if a worker doesn't meet expectations?",
      answer:
        "We offer a 90-day replacement guarantee. Our post-deployment support team ensures smooth integration and addresses any concerns promptly.",
    },
  ];

  const [formData, setFormData] = useState({
    employer_name: "",
    contact_email: "",
    message: "",
    phone_number: "",
    is_urgent: false,
    agency_id: 1, // Default agency ID
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [cityTimes, setCityTimes] = useState<{ [city: string]: string }>({});

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const newTimes: { [city: string]: string } = {};
      timeZones.forEach(({ city, zone }) => {
        newTimes[city] = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: zone,
        });
      });
      setCityTimes(newTimes);
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await submitEmployerInquiry({
        employer_name: formData.employer_name,
        contact_email: formData.contact_email,
        message: formData.message,
        phone_number: formData.phone_number,
        is_urgent: formData.is_urgent,
        agency_id: formData.agency_id,
      });
      setSubmitStatus("success");
      setFormData({
        employer_name: "",
        contact_email: "",
        message: "",
        phone_number: "",
        is_urgent: false,
        agency_id: 1,
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[600px]">
        <div className="absolute inset-0">
          <img
            src="images/partners/partner.jpeg"
            alt="Global workforce"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90"></div>
        </div>
        <div className="relative container mx-auto px-6 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-5xl font-bold mb-6">
              Partner with Us — For International Employers
            </h1>
            <p className="text-xl mb-8">
              Licensed by Kenya National Employement Authority - A Kenyan
              Licencing Board
            </p>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <p className="text-lg">
                Over 100,000 Kenyan workers successfully placed across Gulf
                States
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="pb-20 bg-blue-900 text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Impact in Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center bg-white/10 p-6 rounded-lg backdrop-blur-sm"
              >
                <div className="mb-4 flex justify-center">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries We Serve Section */}
      <section className="relative py-16 bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
        {/* Decorative Globe Icon */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none z-0">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="#2563eb"
              strokeWidth="8"
              fill="#e0e7ff"
            />
            <ellipse
              cx="100"
              cy="100"
              rx="80"
              ry="30"
              fill="#93c5fd"
              fillOpacity="0.2"
            />
            <ellipse
              cx="100"
              cy="100"
              rx="60"
              ry="80"
              fill="#2563eb"
              fillOpacity="0.07"
            />
          </svg>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-2xl font-bold mb-2 text-center text-blue-900 flex flex-col items-center">
            <span className="inline-flex items-center justify-center mb-2">
              <svg
                className="w-8 h-8 text-blue-600 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2zm0 2c1.657 0 3 4.03 3 8s-1.343 8-3 8-3-4.03-3-8 1.343-8 3-8zm-7.938 7C4.486 6.392 7.92 4 12 4c4.08 0 7.514 2.392 7.938 7H4.062zM4.062 13h15.876c-.424 4.608-3.858 7-7.938 7-4.08 0-7.514-2.392-7.938-7z" />
              </svg>
              Countries We Serve
            </span>
          </h2>
          <p className="text-center text-blue-700 mb-10 max-w-2xl mx-auto text-lg">
            We proudly partner with employers across the Gulf region, providing
            top Kenyan talent to these countries:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 justify-items-center">
            {gulfCountries.map((country, idx) => (
              <div
                key={country.code}
                className="flex flex-col items-center justify-center group transform transition duration-300 hover:scale-110 hover:shadow-2xl hover:bg-blue-50 rounded-xl border border-blue-100 bg-white/80 shadow-md w-32 h-40 sm:w-32 sm:h-40 md:w-36 md:h-44 p-4"
                style={{ boxShadow: "0 2px 8px 0 rgba(37,99,235,0.07)" }}
              >
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.15, rotate: [0, 5, -5, 0] }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="mb-2 drop-shadow-md flex items-center justify-center h-16"
                >
                  {country.flag}
                </motion.div>
                <span className="text-sm font-semibold text-blue-900 text-center mt-1 group-hover:text-blue-700 transition-colors">
                  {country.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Kenya Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Hire from Kenya</h2>
              <p className="text-gray-600 mb-8">
                Kenyan workers are known for their exceptional work ethic,
                adaptability, and professional skills. Our rigorous selection
                process ensures you get the best talent for your organization.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Highly motivated workers",
                  "Skilled across multiple industries",
                  "English-speaking",
                  "Culturally adaptable",
                  "NEA-vetted and medically cleared",
                  "Fast processing",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <FaCheckCircle className="text-green-500" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
                alt="Kenyan professionals"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Industries We Serve
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {industry.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">
                  {industry.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {industry.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.position}
                    </div>
                  </div>
                </div>
                <div className="text-gray-600 mb-4 italic">
                  "{testimonial.quote}"
                </div>
                <div className="text-blue-600 text-sm">
                  {testimonial.company}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Recruitment Process
          </h2>
          <div className="max-w-3xl mx-auto">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center mb-8"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mr-6 text-xl font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                  <span className="text-lg">{step}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Options Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Multiple Ways to Connect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Direct Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-blue-600 mb-4">
                <FaUserTie size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Direct Contact</h3>
              <div className="space-y-3">
                <p className="flex items-center">
                  <span className="font-medium mr-2">Phone:</span>
                  <a
                    href="tel:+254700000000"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    +254 723 464 058
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">Email:</span>
                  <a
                    href="mailto:employers@kenyanagency.com"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    skywaysglobalhr@gmail.com
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  Office Hours: Mon-Fri, 8:00 AM - 5:00 PM EAT
                </p>
              </div>
            </motion.div>

            {/* WhatsApp Business Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-green-600 mb-4">
                <svg
                  className="w-10 h-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">WhatsApp Business</h3>
              <p className="text-gray-600 mb-4">
                Get instant responses to your queries through our WhatsApp
                Business account.
              </p>
              <a
                href="https://wa.me/254723464058"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Chat on WhatsApp
              </a>
            </motion.div>

            {/* Office Locations Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-blue-600 mb-4">
                <FaHospital size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Office Locations</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Nairobi Head Office</h4>
                  <p className="text-gray-600">
                    Ruprani Building, 2nd Floor
                    <br />
                    Nairobi, Kenya
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Social Media Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-blue-600 mb-4">
                <FaGlobe size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Connect on Social Media
              </h3>
              <div className="space-y-3">
                <a
                  href="https://www.linkedin.com/in/skyways-global-service-limited-34a235199"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-blue-600"
                >
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  LinkedIn
                </a>

                <a
                  href="https://www.facebook.com/people/Skyways-Global-Services-Ltd/100064217914039/?ref=embed_page#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-600 hover:text-blue-600"
                >
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
              </div>
            </motion.div>

            {/* Live Chat Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-blue-600 mb-4">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Live Chat Support</h3>
              <p className="text-gray-600 mb-4">
                Chat with our recruitment specialists in real-time during
                business hours.
              </p>
              <button
                onClick={() =>
                  window.open("https://chat.kenyanagency.com", "_blank")
                }
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Live Chat
              </button>
            </motion.div>

            {/* Time Zones Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-blue-600 mb-4">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Global Time Zones</h3>
              <div className="space-y-2">
                {timeZones.map(({ city }) => (
                  <p className="flex justify-between items-center" key={city}>
                    <span>{city}:</span>
                    <span className="font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg shadow-sm border border-blue-100">
                      {cityTimes[city] || "--:--:-- --"}
                    </span>
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Partner with Us</h2>
                <p className="text-gray-600 mb-8">
                  Fill out this form and our team will get back to you within 24
                  hours. We're here to help you find the perfect workforce
                  solution for your organization.
                </p>
                <div className="space-y-6">
                  {guarantees.map((guarantee, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <FaCheckCircle className="text-green-500" />
                      <span>{guarantee}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="employer_name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
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
                    <label
                      htmlFor="contact_email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
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
                    <label
                      htmlFor="phone_number"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
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
                    <label
                      htmlFor="is_urgent"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      This is an urgent requirement
                    </label>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
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

                  {submitStatus === "success" && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
                      <FaCheckCircle className="mr-2" />
                      <span>
                        Thank you for your inquiry! Our team will contact you
                        within 24 hours.
                      </span>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                      <FaExclamationCircle className="mr-2" />
                      <span>
                        There was an error submitting your inquiry. Please try
                        again or contact us directly.
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-600 text-white py-4 rounded-lg transition-colors text-lg font-semibold ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Submit Inquiry"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partner;
