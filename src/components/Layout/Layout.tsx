import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background ambient light mesh */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/3 rounded-full blur-[130px] animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[-15%] w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-[40%] right-[10%] w-[450px] h-[450px] bg-accent/2 rounded-full blur-[110px] animate-pulse" style={{ animationDuration: '12s' }}></div>
      </div>

      <Navbar />
      <main className="flex-grow w-full pt-[70px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
