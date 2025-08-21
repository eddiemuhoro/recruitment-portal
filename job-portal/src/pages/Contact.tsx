import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  createContactInquiry,
  type ContactInquiryCreate,
} from "../api/contactInquiries";
import { validatePhoneInput, normalizeKenyanPhone } from "../utils/phoneUtils";

// Fix for default marker icon
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Booking Section Component
function BookingSection() {
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    purpose: "",
    company: "",
  });

  const [phoneValidation, setPhoneValidation] = useState<{
    isValid: boolean;
    message?: string;
  }>({ isValid: true });

  const handleBookingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate phone number on change
    if (name === "phone") {
      if (value.trim()) {
        const validation = validatePhoneInput(value);
        setPhoneValidation(validation);
      } else {
        setPhoneValidation({ isValid: true });
      }
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number
    if (bookingData.phone.trim()) {
      const phoneValidation = validatePhoneInput(bookingData.phone);
      setPhoneValidation(phoneValidation);
      if (!phoneValidation.isValid) {
        return;
      }
    }

    // Create WhatsApp message
    const normalizedPhone = bookingData.phone.trim()
      ? normalizeKenyanPhone(bookingData.phone)
      : "";

    const message = `Hello! I would like to book an appointment to visit your office.

*Booking Details:*
• Name: ${bookingData.name}
• Phone: ${normalizedPhone}
• Date: ${bookingData.date}
• Time: ${bookingData.time}
• Purpose: ${bookingData.purpose}
• Company: ${bookingData.company || "N/A"}

I'm looking forward to meeting with your team. Please confirm if this time works for you.`;

    const whatsappNumber = "254723464058"; // Your WhatsApp number
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
  };

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
  ];

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Book a Visit</h2>
      <p className="text-gray-600 mb-6">
        Schedule a meeting at our office. We'll confirm your appointment via
        WhatsApp.
      </p>

      <form onSubmit={handleBookingSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="booking-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="booking-name"
              name="name"
              value={bookingData.name}
              onChange={handleBookingChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="booking-phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="booking-phone"
              name="phone"
              value={bookingData.phone}
              onChange={handleBookingChange}
              placeholder="0705982249 or +254705982249"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                !phoneValidation.isValid
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            {!phoneValidation.isValid && phoneValidation.message && (
              <p className="text-red-600 text-xs mt-1">
                {phoneValidation.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="booking-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Preferred Date
            </label>
            <input
              type="date"
              id="booking-date"
              name="date"
              value={bookingData.date}
              onChange={handleBookingChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="booking-time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Preferred Time
            </label>
            <select
              id="booking-time"
              name="time"
              value={bookingData.time}
              onChange={handleBookingChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="booking-purpose"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Purpose of Visit
            </label>
            <select
              id="booking-purpose"
              name="purpose"
              value={bookingData.purpose}
              onChange={handleBookingChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select purpose</option>
              <option value="Job Consultation">Job Consultation</option>
              <option value="Partnership Discussion">
                Partnership Discussion
              </option>
              <option value="Service Inquiry">Service Inquiry</option>
              <option value="Interview">Interview</option>
              <option value="Business Meeting">Business Meeting</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="booking-company"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company/Organization{" "}
              <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              id="booking-company"
              name="company"
              value={bookingData.company}
              onChange={handleBookingChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your company name"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong>What happens next?</strong> After you submit this form,
                you'll be redirected to WhatsApp where we'll confirm your
                appointment details and provide any additional information you
                may need.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 rounded-lg font-semibold transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
          <span>Book Appointment via WhatsApp</span>
        </button>
      </form>
    </div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [phoneValidation, setPhoneValidation] = useState<{
    isValid: boolean;
    message?: string;
  }>({ isValid: true });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Nairobi office location coordinates
  // 1.282106,36.8196406,165m
  const officeLocation = {
    lat: -1.282106, // Latitude for Westlands, Nairobi
    lng: 36.8196409, // Longitude for Westlands, Nairobi
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    // Validate phone number if provided
    if (formData.phone.trim()) {
      const phoneValidation = validatePhoneInput(formData.phone);
      setPhoneValidation(phoneValidation);
      if (!phoneValidation.isValid) {
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const normalizedPhone = formData.phone.trim()
        ? normalizeKenyanPhone(formData.phone)
        : undefined;

      const inquiryData: ContactInquiryCreate = {
        name: formData.name,
        email: formData.email,
        phone: normalizedPhone || undefined,
        subject: formData.subject,
        message: formData.message,
      };

      await createContactInquiry(inquiryData);

      setSubmitStatus({
        type: "success",
        message:
          "Thank you for your message! We'll get back to you soon. Redirecting to WhatsApp...",
      });

      // Create WhatsApp message for contact inquiry
      const whatsappMessage = `Hello! I have submitted a contact inquiry through your website.

*Contact Details:*
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${normalizedPhone || "Not provided"}
• Subject: ${formData.subject}

*Message:*
${formData.message}

Please respond when convenient. Thank you!`;

      const whatsappNumber = "254723464058"; // Your WhatsApp number
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setPhoneValidation({ isValid: true });

      // Redirect to WhatsApp after a short delay to show success message
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 2000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus({
        type: "error",
        message:
          "Sorry, there was an error sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate phone number on change
    if (name === "phone") {
      if (value.trim()) {
        const validation = validatePhoneInput(value);
        setPhoneValidation(validation);
      } else {
        setPhoneValidation({ isValid: true });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 py-20">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-3xl">
            Get in touch with our team. We're here to help you with any
            questions.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>

              {/* Status Message */}
              {submitStatus.type && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    submitStatus.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number{" "}
                    <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0705982249 or +254705982249"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      !phoneValidation.isValid
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {!phoneValidation.isValid && phoneValidation.message && (
                    <p className="text-red-600 text-xs mt-1">
                      {phoneValidation.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    We may contact you via WhatsApp or SMS for faster responses
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                    isSubmitting
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Phone
                      </h3>
                      <p className="text-gray-600">+254 723 464 058</p>
                      <p className="text-gray-600">+254 722 839 848</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Email
                      </h3>
                      <p className="text-gray-600">skywaysglobalhr@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Address
                      </h3>
                      <p className="text-gray-600">
                        Moktar Daddah Street
                        <br />
                        Ruprani Building, 2nd Floor, Room 207
                        <br />
                        Nairobi CBD, Kenya
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Business Hours
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="text-gray-900 font-medium">
                      9:00 AM - 6:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="text-gray-900 font-medium">
                      10:00 AM - 4:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="text-gray-900 font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section - Full Width */}
          <div className="mb-12">
            <BookingSection />
          </div>

          {/* Map Section - Full Width */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Our Location
            </h2>
            <div style={{ height: "100%", width: "100%" }}>
              <iframe
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  minHeight: "300px",
                  borderRadius: "0.5rem",
                }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${officeLocation.lat},${officeLocation.lng}&hl=es;z=20&output=embed`}
                title="Our Office Location"
              />
            </div>
            <p className="mt-4 text-gray-600 text-center">
              Ruprani House, Nairobi, Kenya
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
