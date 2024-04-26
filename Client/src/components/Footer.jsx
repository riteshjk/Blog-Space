import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row gap-4">
          <span className="text-lg font-semibold">Connect with me:</span>
          <a
            href="https://github.com/riteshjk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <FaGithub />
            GitHub
          </a>
         
          <a
            href="https://www.linkedin.com/in/ritesh-kamthe-91562416b/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <FaLinkedin />
            LinkedIn
          </a>
        </div>
        <div className="text-sm mt-4 md:mt-0">
          <p>&copy; {new Date().getFullYear()} Ritesh's Blog. All rights reserved.</p>
          <p>
            Made with ❤️ by{" "}
            <a
              href="https://riteshjk.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500"
            >
              Your Name
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
