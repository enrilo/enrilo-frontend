import { useLocation } from 'react-router-dom';

export default function Footer() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isPricing = pathname === '/pricing';
  const isFeatures = pathname === '/features';
  const isContactUs = pathname === '/contact-us';
  const isPrivacy = pathname === '/privacy-policy';
  const isTerms = pathname === '/terms';

  return (
    <footer className="bg-[#1E293B] text-yellow-400 border-t text-center p-3 text-sm w-auto">
      {isHome || isPricing || isFeatures || isContactUs || isPrivacy || isTerms ? (
        <>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center gap-6 text-sm mb-2.5">
            <div className="flex flex-wrap gap-6">
              <a href="/" className="hover:text-white">Home</a>
              <a href="/pricing" className="hover:text-white">Pricing</a>
              <a href="/contact-us" className="hover:text-white">Contact Us</a>
              <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
              <a href="/terms" className="hover:text-white">Terms & Conditions</a>
            </div>
          </div>
          <div className='flex-row text-center text-sm'>
            © {new Date().getFullYear()} Enrilo. All rights reserved
          </div>
        </>
      ) : (
        // 👇 Content for all other pages
        <div className='flex-row text-center text-sm'>
          © {new Date().getFullYear()} Enrilo. All rights reserved
        </div>
      )}
    </footer>
  );
}