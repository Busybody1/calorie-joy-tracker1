import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-gradient-to-b from-white to-[#e8fbfd]">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-gray-600 mb-6 font-medium">CaloFree Tracker by BusyBody Fit LTD.</p>
          <div className="flex justify-center space-x-6 mb-6">
            {[
              { Icon: Instagram, href: "#" },
              { Icon: Facebook, href: "#" },
              { Icon: Twitter, href: "#" },
              { Icon: Youtube, href: "#" },
            ].map(({ Icon, href }, index) => (
              <a
                key={index}
                href={href}
                className="text-gray-400 hover:text-primary transition-colors duration-300 hover:-translate-y-0.5 transform"
              >
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-400">
            © 2024 BusyBody Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;