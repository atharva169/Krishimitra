// pages/index.tsx
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Add images to /public/images/:
 * hero-farmer.jpg, tractor.png, ai-prediction.jpg, mobile-interface.jpg,
 * multilanguage.jpg, sustainability.jpg, farmer-benefit.jpg, government-policy.jpg,
 * consumer-supply.jpg
 */

const FadeIn = ({
  children,
  delay = 0,
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay }}
    className={className}
    {...rest}
  >
    {children}
  </motion.div>
);

export default function IndexPage() {
  return (
    <div className="min-h-screen antialiased text-gray-900">
      {/* NAV */}
      <header className="fixed w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white md:text-green-900">KrishiMitra 🌾</Link>

          <nav className="flex items-center gap-4">
            <Link href="/about" className="hidden md:inline text-white md:text-gray-700 hover:text-green-600">About</Link>
            <Link href="/contact" className="hidden md:inline text-white md:text-gray-700 hover:text-green-600">Contact</Link>

            {/* Link to dashboard as a styled element */}
            <Link href="/dashboard" className="ml-2 inline-block">
              <button className="px-4 py-2 rounded-full bg-yellow-400 text-green-800 font-semibold shadow">Dashboard</button>
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-farmer.jpg"
            alt="Farmer in field"
            className="w-full h-full object-cover object-center brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent" />
        </div>

        <motion.img
          src="/images/tractor.png"
          alt="Tractor"
          className="absolute right-6 bottom-6 w-44 hidden md:block drop-shadow-2xl"
          initial={{ y: 40, opacity: 0.85, scale: 0.95 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        <div className="relative z-20 container mx-auto h-full flex items-center px-6">
          <div className="max-w-2xl text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold text-white leading-tight"
            >
              KrishiMitra — AI for better yields
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="mt-4 text-lg text-gray-100 max-w-xl"
            >
              AI + local weather + soil inputs to predict crop yields and give actionable irrigation, fertilizer and pest-control advice.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8 flex gap-4"
            >
              <Link href="/dashboard" className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold shadow-lg hover:bg-green-700 transform hover:-translate-y-1 transition">Start Prediction</Link>

              <Link href="#features" className="px-4 py-3 rounded-full bg-white/20 text-white border border-white/10 hover:bg-white/30 transition">Learn more</Link>
            </motion.div>
          </div>
        </div>

        {/* No SVG wave here — clean transition */}
      </section>

      {/* WHAT WE DO / FEATURES (existing three feature cards) */}
      <section id="features" className="relative bg-white py-16">
        <div className="container mx-auto px-6">
          <FadeIn delay={0}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">What we do</h2>
            <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">Accurate, localized predictions and practical recommendations that small-scale farmers can use right away.</p>
          </FadeIn>

          <div className="mt-10 grid md:grid-cols-3 gap-8">
            <FadeIn className="rounded-2xl p-8 shadow-lg border bg-white" delay={0.12}>
              <div className="w-20 mx-auto mb-4 text-center text-3xl">🤖</div>
              <h3 className="text-center text-lg font-semibold text-green-700">AI Predictions</h3>
              <p className="text-gray-600 mt-2 text-center">Trained on historical yields, soil & weather for local accuracy.</p>
            </FadeIn>

            <FadeIn className="rounded-2xl p-8 shadow-lg border bg-white" delay={0.2}>
              <div className="w-20 mx-auto mb-4 text-center text-3xl">☁️</div>
              <h3 className="text-center text-lg font-semibold text-green-700">Live Weather Inputs</h3>
              <p className="text-gray-600 mt-2 text-center">Integrates realtime weather to adapt recommendations instantly.</p>
            </FadeIn>

            <FadeIn className="rounded-2xl p-8 shadow-lg border bg-white" delay={0.28}>
              <div className="w-20 mx-auto mb-4 text-center text-3xl">📝</div>
              <h3 className="text-center text-lg font-semibold text-green-700">Practical Advice</h3>
              <p className="text-gray-600 mt-2 text-center">Irrigation, fertilization and pest-control steps tailored by crop.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* NEW: Features of the Platform (replaces Field Gallery) */}
      <section className="py-16 bg-gradient-to-tr from-green-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-3xl font-bold text-gray-800 text-center">🌟 Features of the Platform</h3>
            <p className="text-gray-600 text-center mt-2">Powerful, accessible tools designed for small-scale farmers.</p>
          </motion.div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.18 }} className="p-6 bg-white rounded-xl shadow">
              <img src="/images/ai-prediction.jpg" alt="AI Predictions" className="h-40 w-full object-cover rounded-lg" />
              <h4 className="mt-4 font-semibold text-green-700">Smart AI Predictions</h4>
              <p className="text-gray-600 mt-2">Trained on soil, weather & crop data for accurate yield forecasts tailored to regions like Odisha.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.18 }} className="p-6 bg-white rounded-xl shadow">
              <img src="/images/mobile-interface.jpg" alt="Mobile Interface" className="h-40 w-full object-cover rounded-lg" />
              <h4 className="mt-4 font-semibold text-green-700">User-friendly Interface</h4>
              <p className="text-gray-600 mt-2">Mobile-ready and simple for farmers to use directly from the field.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.18 }} className="p-6 bg-white rounded-xl shadow">
              <img src="/images/multilanguage.jpg" alt="Language Support" className="h-40 w-full object-cover rounded-lg" />
              <h4 className="mt-4 font-semibold text-green-700">Multi-language Support</h4>
              <p className="text-gray-600 mt-2">Supports Odia, Hindi and other regional languages to reach more farmers.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.18 }} className="p-6 bg-white rounded-xl shadow">
              <img src="/images/sustainability.jpg" alt="Sustainability" className="h-40 w-full object-cover rounded-lg" />
              <h4 className="mt-4 font-semibold text-green-700">Sustainability Focus</h4>
              <p className="text-gray-600 mt-2">Promotes water-efficient practices and soil-friendly fertilizer advice.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEW: Impact & Benefits */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-3xl font-bold text-gray-800 text-center">🌍 Impact & Benefits</h3>
            <p className="text-gray-600 text-center mt-2">Real value across the ecosystem — farmers, government and consumers.</p>
          </motion.div>

          <div className="mt-10 grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ scale: 1.03 }} className="p-6 bg-white rounded-xl shadow text-center">
              <img src="/images/farmer-benefit.jpg" alt="Farmers" className="h-32 w-full object-cover rounded-lg" />
              <h4 className="mt-4 font-semibold text-green-700">Farmers</h4>
              <p className="text-gray-600 mt-2">Better income, reduced risks through data-driven decisions.</p>
              <p className="mt-3 font-bold text-green-800">Can increase productivity by 10–15%</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} className="p-6 bg-white rounded-xl shadow text-center">
              <img src="/images/government-policy.jpg" alt="Government" className="h-32 w-full object-cover rounded-lg" />
              <h4 className="mt-4 font-semibold text-green-700">Government</h4>
              <p className="text-gray-600 mt-2">Data-driven policy support and targeted subsidy/relief planning.</p>
              <p className="mt-3 font-bold text-green-800">Policy-ready analytics & dashboards</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} className="p-6 bg-white rounded-xl shadow text-center">
              <img src="/images/consumer-supply.jpg" alt="Consumers" className="h-32 w-full object-cover rounded-lg" />
              <h4 className="mt-4 font-semibold text-green-700">Consumers</h4>
              <p className="text-gray-600 mt-2">More stable supply chains and eco-friendly produce.</p>
              <p className="mt-3 font-bold text-green-800">Helps save ~20% irrigation water</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to boost your yield?</h3>
          <p className="mb-8 text-lg">Join farmers using KrishiMitra to improve productivity and reduce input waste.</p>
          <Link href="/dashboard" className="px-8 py-4 bg-white text-green-700 font-bold rounded-lg shadow hover:bg-gray-100 transition">Start Prediction Now</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-green-900 text-white py-10">
        <div className="container mx-auto px-6 text-center">
          <h4 className="font-semibold">KrishiMitra</h4>
          <div className="mt-4 flex justify-center gap-6">
            <Link href="/about" className="text-white/90 hover:text-yellow-300">About</Link>
            <Link href="/contact" className="text-white/90 hover:text-yellow-300">Contact</Link>
          </div>
          <p className="text-sm text-white/60 mt-4">© {new Date().getFullYear()} KrishiMitra. Built for Odisha</p>
        </div>
      </footer>
    </div>
  );
}
