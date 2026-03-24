import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ChevronDown, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import img from '../img/gridlayout.png';

// Helper function to check if element is in viewport
const checkElementInViewport = (ref, hasAnimated) => {
  if (!ref.current || hasAnimated) return false;
  
  const rect = ref.current.getBoundingClientRect();
  const elementTop = rect.top;
  const elementBottom = rect.bottom;
  const viewportHeight = window.innerHeight;
  
  return (
    elementBottom > viewportHeight * 0.15 &&
    elementTop < viewportHeight * 0.85
  );
};

// Custom hook for scroll animations (trigger once on scroll down)
const useScrollAnimation = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (!hasAnimated && isScrollingDown && checkElementInViewport(ref, hasAnimated)) {
        setIsVisible(true);
        setHasAnimated(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasAnimated]);

  // Initial check on mount
  useEffect(() => {
    if (checkElementInViewport(ref, hasAnimated)) {
      setIsVisible(true);
      setHasAnimated(true);
    }
  }, [hasAnimated]);

  return [ref, isVisible];
};

const Contact = () => {
  const [heroRef, heroVisible] = useScrollAnimation();
  const [formRef, formVisible] = useScrollAnimation();
  const [infoRef, infoVisible] = useScrollAnimation();
  const [faqRef, faqVisible] = useScrollAnimation();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Generic animation helper
  const createAnimationStyle = (isVisible, fromTransform, delay = 0) => ({
    opacity: isVisible ? 1 : 0,
    transform: fromTransform(isVisible),
    transition: `all 0.8s ease-out${delay > 0 ? ` ${delay}s` : ""}`,
  });

  const fadeInDown = createAnimationStyle(
    heroVisible,
    (visible) => (visible ? "translateY(0)" : "translateY(-20px)")
  );

  const fadeInDownSubtitle = createAnimationStyle(
    heroVisible,
    (visible) => (visible ? "translateY(0)" : "translateY(-20px)"),
    0.1
  );

  const fadeInLeft = createAnimationStyle(
    formVisible,
    (visible) => (visible ? "translateX(0)" : "translateX(-30px)")
  );

  const fadeInRight = createAnimationStyle(
    infoVisible,
    (visible) => (visible ? "translateX(0)" : "translateX(30px)")
  );

  const fadeInUp = createAnimationStyle(
    faqVisible,
    (visible) => (visible ? "translateY(0)" : "translateY(30px)")
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      setTimeout(() => {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setLoading(false);
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  const toggleFAQ = (idx) => {
    setExpandedFAQ(expandedFAQ === idx ? null : idx);
  };

  const contactMethods = [
    {
      icon: <Mail size={32} />,
      title: 'Email Us',
      description: 'We usually respond within 24 hours',
      value: 'support@quickkart.com',
      link: 'mailto:support@quickkart.com',
    },
    {
      icon: <Phone size={32} />,
      title: 'Call Us',
      description: 'Mon-Fri, 9:00 AM - 6:00 PM IST',
      value: '+91 98765 43210',
      link: 'tel:+919876543210',
    },
    {
      icon: <MapPin size={32} />,
      title: 'Visit Us',
      description: 'Our office location',
      value: 'Itahari, sunsari, Nepal',
      link: '#',
    },
    {
      icon: <Clock size={32} />,
      title: 'Live Chat',
      description: 'Available on our website',
      value: 'Chat with us now',
      link: '#',
    },
  ];

  const faqs = [
    {
      question: 'How long does delivery take?',
      answer: 'Delivery typically takes 3-5 business days depending on your location.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 15-day return policy on most items in original condition.',
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we ship only within Nepal. International shipping will be available soon!',
    },
    {
      question: 'How can I track my order?',
      answer: 'You can track your order using the tracking link sent to your email.',
    },
  ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/quickkart', icon: Facebook},
    { name: 'Twitter', href: 'https://twitter.com/', icon: Twitter },
    { name: 'Instagram', href: 'https://instagram.com/quickkart', icon: Instagram },
    { name: 'LinkedIn', href: 'https://linkedin.com/', icon: Linkedin },
  ];

  return (
    <div className="bg-[#f8f9fa] flex flex-col pt-16">
      {/* Hero Section */}
      {/* add the imported image as the bg-image in the below div */}
      <div ref={heroRef} className="bg-white shadow-md shadow-[#abadad] rounded-4xl text-gray-900 py-8 md:py-10 border-gray-200">
        <div className='w-full h-155 absolute hidden lg:block' style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundPositionY: '-120px' }}></div>
        <div className="max-w-7xl mx-auto px-4 gap-y-2 sm:px-6 lg:px-8 text-center h-145 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={fadeInDown}>Contact our team</h1>
          <p className="text-xl md:text-lg text-gray-600 max-w-3xl mx-auto" style={fadeInDownSubtitle}>
            We're here to help and answer any question you might have. Reach out to us and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Form and Info Section */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2" ref={formRef} style={fadeInLeft}>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>

              {submitted && (
                <div className="mb-6 bg-green-50 border-2 border-green-500 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3">
                  <Send size={20} />
                  <span>Thank you! We've received your message and will get back to you soon.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007E5D] transition-colors text-gray-800"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007E5D] transition-colors text-gray-800"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007E5D] transition-colors text-gray-700"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007E5D] transition-colors text-gray-700 appearance-none bg-white cursor-pointer"
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="order-issue">Order Issue</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"  
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#007E5D] transition-colors text-gray-800 resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#007E5D] text-white py-3 rounded-lg font-bold hover:bg-gray-900 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Company Info Sidebar */}
          <div ref={infoRef} style={fadeInRight}>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Get in touch</h3>

              <div className="space-y-6">
                {/* Business Hours */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Clock size={20} className="text-[#007E5D]" />
                    Business Hours
                  </h4>
                  <p className="text-gray-600 text-sm">
                    24/7 Service
                  </p>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Location */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <MapPin size={20} className="text-[#007E5D]" />
                    Location
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Quickkart Headquarters<br />
                    Itahari, Sunsari<br />
                  </p>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Social Links */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Follow Us</h4>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                      <a
                        key={social.name}
                        href={social.href}
                        aria-label={social.name}
                        className="w-10 h-10 bg-green-100 text-[#007E5D] rounded-full flex items-center justify-center hover:bg-[#007E5D] hover:text-white transition-all duration-200"
                      >
                        <Icon size={18} />
                      </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
        <div className='flex justify-center py-10 mb-5'>
        <div ref={faqRef} style={fadeInUp} className="bg-white rounded-2xl shadow-lg p-8 md:p-12 w-305">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <MessageSquare size={32} className="text-[#007E5D]" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-[#007E5D] transition-colors duration-200">
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 text-left">{faq.question}</h3>
                  <ChevronDown
                    size={24}
                    className={`text-[#007E5D] shrink-0 transition-transform duration-300 ${
                      expandedFAQ === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {expandedFAQ === idx && (
                  <div className="px-6 py-4 bg-white border-t-2 border-gray-200 animate-fade-in">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
  );
};

export default Contact;