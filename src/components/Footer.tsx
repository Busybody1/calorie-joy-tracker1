import { Instagram, Facebook, Twitter, Youtube, Music2, Link, Newspaper } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-gradient-to-b from-white to-[#e8fbfd]">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center">
          <div className="flex justify-center space-x-6 mb-8">
            {[
              { Icon: Link, href: "https://busybody.io", label: "BusyBody Mobile App" },
              { Icon: Newspaper, href: "https://busybits-news.beehiiv.com/", label: "Newsletter" },
            ].map(({ Icon, href, label }, index) => (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors duration-300"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </a>
            ))}
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            {[
              { Icon: Instagram, href: "https://www.instagram.com/busybody.io/" },
              { Icon: Facebook, href: "https://m.facebook.com/story.php/?story_fbid=122182552952193848&id=61555815447953" },
              { Icon: Twitter, href: "https://twitter.com/1PercentBody" },
              { Icon: Youtube, href: "https://www.youtube.com/@BusyBodyFit?sub_confirmation=1" },
              { Icon: Music2, href: "https://www.tiktok.com/@busybody943?" },
            ].map(({ Icon, href }, index) => (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors duration-300 hover:-translate-y-0.5 transform"
              >
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-400">
            © 2024 BusyBody Fit LTD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;