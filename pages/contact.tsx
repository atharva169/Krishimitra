// pages/contact.tsx
import Link from "next/link";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-green-50 border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-green-800">KrishiMitra</Link>
          <Link href="/dashboard" className="text-green-700">Dashboard</Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800">Contact Us</h1>
        <p className="mt-3 text-gray-700">For partnerships, pilot requests or technical help, contact our team.</p>

        <div className="mt-6 grid gap-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <h4 className="font-semibold">Email</h4>
            <p className="text-gray-600 mt-1">hello@krishimitra.example</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h4 className="font-semibold">Phone</h4>
            <p className="text-gray-600 mt-1">+91 70000 00000</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h4 className="font-semibold">Office (Pilot Coordination)</h4>
            <p className="text-gray-600 mt-1">Odisha — Government of Odisha collaboration</p>
          </div>
        </div>
      </main>

      <footer className="bg-green-900 text-white py-8 text-center">
        <div className="container mx-auto px-6">© {new Date().getFullYear()} KrishiMitra</div>
      </footer>
    </div>
  );
}
