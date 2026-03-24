import React, { use, useEffect, useRef, useState } from "react";
import imagepic from "../img/aboutuspic.png";

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

export const aboutUs = () => {
  const [heroContentRef, heroContentVisible] = useScrollAnimation();
  const [cardRef1, card1Visible] = useScrollAnimation();
  const [cardRef2, card2Visible] = useScrollAnimation();
  const [cardRef3, card3Visible] = useScrollAnimation();
  const [missionRef, missionVisible] = useScrollAnimation();
  const [visionRef, visionVisible] = useScrollAnimation();
  const [storyRef, storyVisible] = useScrollAnimation();
  const [coreValuesRef, coreValuesVisible] = useScrollAnimation();
  const [whyChooseRef, whyChooseVisible] = useScrollAnimation();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Generic animation helper - creates transform and opacity styles
  const createAnimationStyle = (isVisible, fromTransform, delay = 0) => ({
    opacity: isVisible ? 1 : 0,
    transform: fromTransform(isVisible),
    transition: `all 0.6s ease-out${delay > 0 ? ` ${delay}s` : ""}`,
  });

  // Animation style helpers using generic function
  const fadeInDown = createAnimationStyle(
    heroContentVisible,
    (visible) => (visible ? "translateY(0)" : "translateY(-20px)")
  );

  const fadeInUp = createAnimationStyle(
    card1Visible,
    (visible) => (visible ? "translateY(0)" : "translateY(30px)")
  );

  const fadeInScale = createAnimationStyle(
    missionVisible,
    (visible) => (visible ? "scale(1)" : "scale(0.9)")
  );

  const storyScale = createAnimationStyle(
    storyVisible,
    (visible) => (visible ? "scale(1)" : "scale(0.9)")
  );

  const visionScale = createAnimationStyle(
    visionVisible,
    (visible) => (visible ? "scale(1)" : "scale(0.9)"),
    0.2
  );

  const slideInLeft = createAnimationStyle(
    whyChooseVisible,
    (visible) => (visible ? "translateX(0)" : "translateX(-30px)")
  );

  // Function to create delayed animation styles
  const createDelayedAnimation = (isVisible, fromTransform, delay) =>
    createAnimationStyle(isVisible, fromTransform, delay);

  // Data for hero cards
  const heroCards = [
    {
      title: "Who We Are",
      description: "We are a customer-first ecommerce team focused on making everyday shopping simple, trusted, and enjoyable.",
      number: "01",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
      alt: "Team planning and collaboration",
    },
    {
      title: "What We Offer",
      description: "From groceries to electronics, we provide quality products, fair prices, and a smooth shopping experience in one place.",
      number: "02",
      image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=900&q=80",
      alt: "Affordable offers and pricing",
    },
    {
      title: "Why People Trust Us",
      description: "We combine reliable delivery, secure checkout, and responsive support to help every customer shop with confidence.",
      number: "03",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      alt: "Business growth promotion",
    },
  ];

  // Data for core values
  const coreValues = [
    {
      title: "Quality",
      description: "We are committed to delivering the highest quality products and services that exceed our customers' expectations.",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      title: "Innovation",
      description: "We continuously innovate and embrace new technologies to stay ahead in the industry and serve you better.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
    },
    {
      title: "Integrity",
      description: "We operate with honesty and transparency, building trust with our customers through ethical business practices.",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      title: "Customer Focus",
      description: "Your satisfaction and success are at the heart of everything we do. Your needs drive our decisions.",
      icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
    },
  ];

  // Data for why choose us
  const whyChooseData = [
    {
      title: "Fast & Reliable",
      description: "Quick delivery and reliable service you can depend on every time.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
    },
    {
      title: "Competitive Pricing",
      description: "Best value for money without compromising on quality.",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      title: "Expert Support",
      description: "Knowledgeable team ready to assist you with any questions or concerns.",
      icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
    },
    {
      title: "Customer Satisfaction",
      description: "Your satisfaction is our guarantee with our easy return policy.",
      icon: "M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Hero Section - Team Design */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto p-10">
            <div
              className="text-center gap-5"
              ref={heroContentRef}
            >
              <p
                className="text-sm text-gray-600 uppercase tracking-wide"
                style={fadeInDown}
              >
                ABOUT
              </p>
              <h1
                className="text-5xl font-bold text-gray-900 mb-6"
                style={createDelayedAnimation(
                  heroContentVisible,
                  (visible) =>
                    visible ? "translateY(0)" : "translateY(-20px)",
                  0.1
                )}
              >
                The dream team of
                <br />
                Shopping Ecommerce.
              </h1>
              <p
                className="text-gray-600 text-lg"
                style={createDelayedAnimation(
                  heroContentVisible,
                  (visible) =>
                    visible ? "translateY(0)" : "translateY(-20px)",
                  0.2
                )}
              >
                Our SEO Marketing Online Expert
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-15 items-center justify-items-center p-12">
              {[cardRef1, cardRef2, cardRef3].map((ref, idx) => (
                <div
                  key={idx}
                  ref={ref}
                  style={createDelayedAnimation(
                    card1Visible,
                    (visible) => (visible ? "translateY(0)" : "translateY(30px)"),
                    idx * 0.2
                  )}
                  className="bg-white rounded-lg p-8 shadow-lg max-w-sm"
                >
                  <div className="mb-6 h-64 rounded-lg overflow-hidden">
                    <img
                      src={heroCards[idx].image}
                      alt={heroCards[idx].alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{heroCards[idx].number}</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {heroCards[idx].title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {heroCards[idx].description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
              Our Mission & Vision
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Mission */}
              <div
                ref={missionRef}
                style={fadeInScale}
                className="bg-white p-8 rounded-lg shadow-md border-l-4 border-emerald-500"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  To provide high-quality, affordable products and exceptional
                  customer service that exceed expectations. We strive to be a
                  reliable partner in our customers' success and growth.
                </p>
              </div>

              {/* Vision */}
              <div
                ref={visionRef}
                style={visionScale}
                className="bg-white border-l-4 border-[#007E5D] p-8 rounded-lg shadow-md"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Vision
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  To become the leading brand in our industry by fostering
                  innovation, sustainability, and customer-centric solutions
                  that create lasting value for all stakeholders.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-white" ref={storyRef}>
          <div className="max-w-7xl mx-auto px-6" style={storyScale}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div
                style={{
                  opacity: storyVisible ? 1 : 0,
                  transform: storyVisible
                    ? "translateX(0)"
                    : "translateX(-30px)",
                  transition: "all 0.6s ease-out",
                }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                  Founded with a passion for quality and customer satisfaction,
                  our company has grown to become a trusted name in the
                  industry. We started with a simple mission: to deliver
                  exceptional products that make a real difference in people's
                  lives.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Today, we're proud to serve thousands of satisfied customers
                  worldwide, and we continue to innovate and improve our
                  offerings every single day.
                </p>
              </div>
              <div
                className="rounded-lg h-96 flex items-center justify-center"
                style={{
                  opacity: storyVisible ? 1 : 0,
                  transform: storyVisible ? "scale(1)" : "scale(0.85)",
                  transition: "all 0.6s ease-out 0.1s",
                }}
              >
                <img
                  src={imagepic}
                  alt="Our company image"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section ref={coreValuesRef} className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 mb-12"
           >
            <h2 className="text-4xl font-bold text-gray-900 text-center">
              Our Core Values
            </h2>
          </div>
          <div className="flex justify-center w-full gap-15 flex-wrap px-6">
            {coreValues.map((value, idx) => (
              <div key={idx} className="hover-3d">
                <figure
                  style={createDelayedAnimation(
                    coreValuesVisible,
                    (visible) =>
                      visible
                        ? "translateY(0) scale(1)"
                        : "translateY(20px) scale(0.95)",
                    idx * 0.1
                  )}
                  className="w-70 rounded-2xl bg-white p-8 shadow-lg border-t-4 border-emerald-500"
                >
                  <div className="flex items-center justify-center h-16 w-16 rounded-full mb-4 bg-emerald-500/10">
                    <svg
                      className="h-8 w-8 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={value.icon}
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-700">{value.description}</p>
                </figure>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section ref={whyChooseRef} className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6"
           >
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {whyChooseData.map((reason, idx) => (
                <div
                  key={idx}
                  style={createDelayedAnimation(
                    whyChooseVisible,
                    (visible) =>
                      visible ? "translateX(0)" : "translateX(-30px)",
                    idx * 0.1
                  )}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md text-white bg-emerald-500">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={reason.icon}
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {reason.title}
                    </h3>
                    <p className="mt-2 text-gray-700">{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-white bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p
              className="text-xl mb-8"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              Join thousands of satisfied customers who trust us with their
              needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/product"
                className="bg-white border-2 border-white font-semibold py-3 px-8 rounded-lg transition duration-200 text-emerald-600 hover:bg-transparent hover:text-white"
              >
                Shop Now
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg transition duration-200 hover:bg-white hover:text-emerald-600"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default aboutUs;
