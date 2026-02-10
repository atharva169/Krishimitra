export default function Footer() {
  return (
    <footer className="bg-green-900 text-white py-10 mt-20">
      <div className="container mx-auto text-center px-6">
        <h3 className="text-2xl font-bold">🌾 KrishiMitra</h3>
        <p className="text-gray-300 mt-2">Empowering Farmers with AI</p>
        <div className="flex justify-center gap-8 mt-6">
          <a href="#about" className="hover:text-yellow-400">About</a>
          <a href="#contact" className="hover:text-yellow-400">Contact</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-yellow-400">GitHub</a>
        </div>
        <p className="text-gray-400 text-sm mt-6">© {new Date().getFullYear()} KrishiMitra. All rights reserved.</p>
      </div>
    </footer>
  );
}
