'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Footer() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const columnVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <footer className="w-full bg-dark text-white pt-20 pb-6 px-6 md:px-12 z-20 relative">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
      >
        {/* Column 1 - Brand */}
        <motion.div variants={columnVariants} className="flex flex-col gap-4">
          <div className="relative h-14 w-44 mb-2">
            <Image 
src="/logoupdated.png"
              alt="Dahiyoo Logo" 
              fill
              className="object-contain object-left"
            />
          </div>
          <p className="font-dm-sans italic text-white/80">
            "Chill Out With Our Swirls of Flavours"
          </p>
          <div className="inline-block bg-orange px-3 py-1 rounded-full text-xs font-dm-sans font-bold w-max mt-2">
            No Artificial Colors
          </div>
          <div className="mt-4 font-dm-sans text-sm text-white/80 space-y-1">
            <p>IG: <a href="https://instagram.com/dahiyoo" target="_blank" rel="noopener noreferrer" className="hover:text-orange transition-colors">@dahiyoo</a></p>
            <p>Ph: <a href="tel:+917219137928" className="hover:text-orange transition-colors">+91 7219137928</a></p>
          </div>
        </motion.div>

        {/* Column 2 - Visit Us */}
        <motion.div variants={columnVariants} className="flex flex-col gap-4">
          <h5 className="font-syne font-bold text-xl text-white">Find Us</h5>
          <div className="flex items-start gap-2 text-white/80 font-dm-sans text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p>Vasai-Virar, Maharashtra, India.</p>
              <p className="mt-1 text-white/60 text-xs">Visit our store for the freshest froyo experience.</p>
            </div>
          </div>
          <div className="mt-4 font-dm-sans text-sm text-white/80">
            Also available on <span className="text-[#E23744] font-bold">zomato</span>
          </div>
        </motion.div>

        {/* Column 3 - Our Flavours */}
        <motion.div variants={columnVariants} className="flex flex-col gap-4">
          <h5 className="font-syne font-bold text-xl text-white">Our Swirls</h5>
          <ul className="font-dm-sans text-sm space-y-2 flex flex-col items-start">
            {['Strawberry', 'Blueberry', 'Mango', 'Dragon Fruit', 'Litchi'].map((flavor) => (
              <li key={flavor}>
                <button className="text-white/80 hover:text-orange transition-colors">
                  {flavor}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-white/60 font-dm-sans italic">
            Seasonal specials available in-store.
          </p>
        </motion.div>

        {/* Column 4 - Order Now */}
        <motion.div variants={columnVariants} className="flex flex-col gap-4">
          <h5 className="font-syne font-bold text-xl text-white">Order Online</h5>
          <a
            href="https://www.zomato.com/mumbai/dahiyo-2-virar"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#E23744] text-white font-bold font-dm-sans rounded-lg py-3 text-center hover:bg-[#c9303d] transition-colors"
          >
            Order on Zomato
          </a>
          <p className="text-xs text-white/80 font-dm-sans text-center">
            Delivery available in Vasai-Virar area.
          </p>
          <p className="text-xs text-white/60 font-dm-sans text-center">
            Open daily — check Zomato for hours.
          </p>
        </motion.div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60 font-dm-sans w-full max-w-7xl mx-auto">
        <div>© 2025 Dahiyoo. All rights reserved.</div>
        <div className="flex items-center gap-1">
          Made with love in Vasai-Virar <span className="text-orange">♥</span>
        </div>
        <a href="https://instagram.com/dahiyoo" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
