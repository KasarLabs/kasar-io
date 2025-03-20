// components/footer.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IconsRegistry } from "@/lib/react-icons-fix";

const { BsTelegram, BsTwitter, BsGithub } = IconsRegistry;

const Footer = () => {
  return (
    <footer className="w-full bg-neutral-900 border-t border-neutral-800 mt-auto relative z-40">
      {" "}
      {/* Changed from fixed to relative, added mt-auto */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Column 1 - KasarLabs Logo and Terms */}
          <div className="flex flex-col items-center sm:items-start space-y-4">
            <div className="w-[125px] sm:w-[140px]">
              <div className="relative w-full h-10">
                <a
                  href="https://kasar.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="https://github.com/KasarLabs/brand/blob/main/kasar/logo/KasarWhiteLogo.png?raw=true"
                    fill
                    alt="kasarlabs"
                    className="object-contain"
                  />
                </a>
              </div>
            </div>
            <div className="text-neutral-400 text-sm flex flex-wrap justify-center sm:justify-start gap-2">
              <a
                href="https://kasar.io/pages/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white cursor-pointer transition-colors"
              >
                Terms
              </a>
              <span className="hidden sm:inline">•</span>
              <a
                href="https://kasar.io/pages/general-conditions-of-sale"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white cursor-pointer transition-colors"
              >
                Conditions
              </a>
              <span className="hidden sm:inline">•</span>
              <a
                href="https://kasar.io/pages/legal-information"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white cursor-pointer transition-colors"
              >
                Legal
              </a>
            </div>
          </div>

          {/* Column 2 - Resources */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-3 md:mb-4 text-base md:text-lg">
              Resources
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a
                  href="https://www.starknet.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white text-sm md:text-base transition-colors"
                >
                  Starknet
                </a>
              </li>
              <li>
                <a
                  href="https://docs.starknet.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white text-sm md:text-base transition-colors"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact Us */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-3 md:mb-4 text-base md:text-lg">
              Contact us
            </h3>
            <div className="flex justify-center sm:justify-start space-x-4 md:space-x-6">
              <Link
                href="https://twitter.com/kasarlabs"
                target="_blank"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <BsTwitter className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <Link
                href="https://t.me/+jZZuOamlUM5lNWNk"
                target="_blank"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <BsTelegram className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <Link
                href="https://github.com/kasarlabs"
                target="_blank"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <BsGithub className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-800">
          <p className="text-center text-neutral-400 text-xs md:text-sm">
            © {new Date().getFullYear()} KasarLabs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
