// export default function Footer() {
//   return (
//     <footer className="bg-[#1E293B] text-yellow-400 border-t text-center p-3 text-sm">
//       © {new Date().getFullYear()} Enrilo. All rights reserved.
//     </footer>
//   );
// }

import { useLocation } from 'react-router-dom';

export default function Footer() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <footer className="bg-[#1E293B] text-yellow-400 border-t text-center p-3 text-sm w-auto">
      {isHome ? (
        // 👇 Content for homepage
        <>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center gap-6 text-sm mb-2">
            <div className="flex flex-wrap gap-6">
              <a href="#" className="hover:text-white">Features</a>
              <a href="#" className="hover:text-white">Pricing</a>
              <a href="#" className="hover:text-white">Contact</a>
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
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