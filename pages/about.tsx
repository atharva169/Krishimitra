// pages/about.tsx
import Link from "next/link";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-green-50 border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-green-800">KrishiMitra</Link>
          <Link href="/dashboard" className="text-green-700">Dashboard</Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-800">About KrishiMitra</motion.h1>

        <div className="mt-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gray-700">KrishiMitra is an AI-driven platform focused on increasing smallholder productivity via data-driven recommendations. We combine open agricultural datasets, local weather, and soil metrics to provide:</p>
            <ul className="list-disc list-inside mt-4 text-gray-700">
              <li>Accurate yield predictions</li>
              <li>Actionable irrigation & fertilizer plans</li>
              <li>Early pest-warning & integrated pest management advice</li>
            </ul>
            <p className="mt-4 text-gray-700">Pilots are focused within Odisha, working closely with extension officers and small farmer groups to ensure recommendations are practical and low-cost.</p>
          </div>

          <div>
            <img src="/images/about-farm.jpg" alt="about" className="rounded-lg shadow-lg w-full object-cover h-72"/>
          </div>
        </div>

        <section className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800">Our Approach</h3>
          <p className="text-gray-700 mt-2">We follow a farmer-centred approach: field validation, simplified recommendations, and multi-language support for accessibility.</p>
        </section>
      </main>

      <footer className="bg-green-900 text-white py-8 text-center">
        <div className="container mx-auto px-6">© {new Date().getFullYear()} KrishiMitra</div>
      </footer>
    </div>
  );
}
