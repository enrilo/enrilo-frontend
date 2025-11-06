export default function Footer() {
  return (
    <footer className="bg-[#1E293B] text-yellow-400 border-t text-center p-3 text-sm">
      © {new Date().getFullYear()} Enrilo. All rights reserved.
    </footer>
  );
}