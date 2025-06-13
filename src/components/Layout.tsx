import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;