"use client";

import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export default function ContactSection() {
  return (
    <div className="w-full py-24 flex flex-col items-center justify-center bg-black text-white px-4">
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12">
          Interested in Working With Us?
        </h2>
        
        <div className="flex flex-wrap justify-center gap-6">
          <Link 
            href="https://github.com/kasarlabs" 
            target="_blank"
            className="p-4 rounded-2xl border border-white border-2 hover:bg-white hover:text-black transition-all duration-300"
            aria-label="GitHub"
          >
            <Github size={28} />
          </Link>
          
          <Link 
            href="https://twitter.com/kasarlabs" 
            target="_blank"
            className="p-4 rounded-2xl border border-white border-2 hover:bg-white hover:text-black transition-all duration-300"
            aria-label="Twitter"
          >
            <Twitter size={28} />
          </Link>
          
          <Link 
            href="https://linkedin.com/company/kasarlabs" 
            target="_blank"
            className="p-4 rounded-2xl border border-white border-2 hover:bg-white hover:text-black transition-all duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin size={28} />
          </Link>
          
          <Link 
            href="mailto:contact@kasar.io" 
            className="p-4 rounded-2xl border border-white border-2 hover:bg-white hover:text-black transition-all duration-300"
            aria-label="Email"
          >
            <Mail size={28} />
          </Link>
        </div>
      </div>
    </div>
  );
} 