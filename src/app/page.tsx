"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useUser } from "@/lib/userContext";

export default function LandingPage() {
  const { user, logout, loading } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold tracking-tight">
                AI Social Agent 
              </h1>
            </div>
            <nav
              aria-label="Primary navigation"
              className="flex items-center space-x-4"
            >
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Pricing
              </Link>

              {loading ? (
                <span className="text-gray-500 dark:text-gray-400 px-3 py-2 text-sm font-medium">
                  Loading...
                </span>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 dark:text-gray-200 font-medium">
                    {user.username}
                  </span>
                  <button
                    onClick={logout}
                    aria-label="Sign out"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link href="/auth/register">
                    <Button className="px-4 py-2">Get Started</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            AI-Powered Social Media{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Content Management
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Automate your social media presence with AI-generated content, smart
            scheduling, and multi-platform posting. Save hours every week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" passHref>
              <Button size="lg" className="text-lg px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              className="text-lg px-8 py-3"
              onClick={() => window.open("/demo", "_blank")}
              aria-label="Watch Demo Video"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to dominate social media
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Powerful features designed for modern businesses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: "🤖",
                bgClass: "bg-blue-100 dark:bg-blue-900",
                title: "AI Content Generation",
                description:
                  "Generate engaging posts, captions, and hashtags using advanced AI models. Customize tone and style for your brand.",
              },
              {
                emoji: "📅",
                bgClass: "bg-green-100 dark:bg-green-900",
                title: "Smart Scheduling",
                description:
                  "Schedule posts across multiple platforms with optimal timing. Set up recurring content and automated posting.",
              },
              {
                emoji: "📊",
                bgClass: "bg-purple-100 dark:bg-purple-900",
                title: "Multi-Platform Management",
                description:
                  "Manage Twitter, LinkedIn, Facebook, and Instagram from one dashboard. Consistent branding across all platforms.",
              },
            ].map(({ emoji, bgClass, title, description }) => (
              <div key={title} className="text-center p-6">
                <div
                  className={`${bgClass} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}
                >
                  <span role="img" aria-label={title} className="text-2xl">
                    {emoji}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plans data for DRY */}
            {[
              {
                name: "Free",
                description: "Perfect for getting started",
                price: "$0",
                priceDesc: "/month",
                features: [
                  "30 posts per month",
                  "1 social media account",
                  "Basic AI content generation",
                  "Email support",
                ],
                buttonText: "Get Started Free",
                buttonLink: "/auth/register",
                variant: "secondary",
                cardClass: "bg-white dark:bg-gray-800",
                textClass: "text-gray-900 dark:text-white",
                checkColor: "text-green-500",
              },
              {
                name: "Pro",
                description: "For growing businesses",
                price: "$29",
                priceDesc: "/month",
                features: [
                  "500 posts per month",
                  "5 social media accounts",
                  "Advanced AI features",
                  "Priority support",
                  "Analytics dashboard",
                ],
                buttonText: "Start Pro Trial",
                buttonLink: "/auth/register",
                variant: "primary",
                cardClass:
                  "bg-blue-600 dark:bg-blue-700 border-2 border-blue-600 dark:border-blue-700 relative shadow-lg",
                textClass: "text-white",
                checkColor: "text-green-400",
                badge: "Most Popular",
              },
              {
                name: "Business",
                description: "For teams and agencies",
                price: "$99",
                priceDesc: "/month",
                features: [
                  "Unlimited posts",
                  "20 social media accounts",
                  "Team collaboration",
                  "White-label options",
                  "Dedicated support",
                ],
                buttonText: "Contact Sales",
                buttonLink: "/auth/register",
                variant: "secondary",
                cardClass: "bg-white dark:bg-gray-800",
                textClass: "text-gray-900 dark:text-white",
                checkColor: "text-green-500",
              },
            ].map(
              ({
                name,
                description,
                price,
                priceDesc,
                features,
                buttonText,
                buttonLink,
                variant,
                cardClass,
                textClass,
                checkColor,
                badge,
              }) => (
                <div
                  key={name}
                  className={`${cardClass} rounded-lg p-8 border`}
                >
                  {badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-1 rounded-full text-sm font-medium select-none">
                        {badge}
                      </span>
                    </div>
                  )}
                  <h3 className={`text-2xl font-bold mb-2 ${textClass}`}>
                    {name}
                  </h3>
                  <p
                    className={`mb-6 ${
                      textClass === "text-white"
                        ? "text-blue-100"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {description}
                  </p>
                  <div className={`text-4xl font-bold mb-6 ${textClass}`}>
                    {price}
                    <span
                      className={`text-lg font-normal ${
                        textClass === "text-white"
                          ? "text-blue-100"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {priceDesc}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <span className={`${checkColor} mr-2 select-none`}>
                          ✓
                        </span>
                        <span className={textClass}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={buttonLink}>
                    <Button
                      variant={variant === "primary" ? undefined : "secondary"}
                      className={`w-full ${
                        variant === "primary"
                          ? "bg-white text-blue-600 hover:bg-gray-100"
                          : ""
                      }`}
                    >
                      {buttonText}
                    </Button>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
            Ready to transform your social media strategy?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-lg mx-auto leading-relaxed">
            Join thousands of businesses already using AI Content Manager
          </p>
          <Link href="/auth/register">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <section aria-labelledby="footer-about">
              <h3 id="footer-about" className="text-lg font-semibold mb-4">
                AI Content Manager
              </h3>
              <p className="text-gray-400">
                The future of social media management powered by AI.
              </p>
            </section>

            <nav
              aria-labelledby="footer-product"
              className="space-y-2 text-gray-400"
            >
              <h4 id="footer-product" className="font-semibold mb-4">
                Product
              </h4>
              <ul>
                <li>
                  <a
                    href="#"
                    className="hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    API
                  </a>
                </li>
              </ul>
            </nav>

            <nav
              aria-labelledby="footer-company"
              className="space-y-2 text-gray-400"
            >
              <h4 id="footer-company" className="font-semibold mb-4">
                Company
              </h4>
              <ul>
                <li>
                  <a
                    href="#"
                    className="hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </nav>

            <nav
              aria-labelledby="footer-support"
              className="space-y-2 text-gray-400"
            >
              <h4 id="footer-support" className="font-semibold mb-4">
                Support
              </h4>
              <ul>
                <li>
                  <a
                    href="#"
                    className="hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 select-none">
            <p>&copy; 2024 AI Content Manager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
