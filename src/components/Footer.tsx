import React from "react";
import { ExternalLink, ShieldCheck, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  const brandLinks = [
    { name: "Dell Warranty Checker", url: "https://www.dell.com/support/home/en-pk?app=warranty" },
    { name: "HP Warranty Lookup", url: "https://support.hp.com/check-warranty" },
    { name: "Lenovo Warranty Check", url: "https://pcsupport.lenovo.com/warrantylookup" },
    { name: "Apple Coverage Checker", url: "https://checkcoverage.apple.com" },
  ];

  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/90 text-slate-400 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>LaptopWise Commitment</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            Built on strict honesty and transparency principles. LaptopWise inspects direct SMBIOS/WMI hardware parameters &amp; SMART battery/SSD attributes to protect buyers from scams, fake SSDs, worn-out parts, and overpriced deals.
          </p>
        </div>

        {/* Col 2 */}
        <div className="space-y-3">
          <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider">
            Official Brand Warranty Deep-Links
          </h4>
          <ul className="space-y-2">
            {brandLinks.map((b, idx) => (
              <li key={idx}>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-indigo-400 transition-colors"
                >
                  <span>{b.name}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-3">
          <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider">
            Pakistan &amp; Global Market Context
          </h4>
          <p className="text-slate-400 leading-relaxed text-xs">
            Optimized for Hafeez Centre (Lahore), Techno City (Karachi), Blue Area (Islamabad), and worldwide laptop marketplace buyers. Cross-references live market valuations and flags fake parts.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-500 text-[11px]">
        <div>
          © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">LaptopWise</span>. Smart Laptop Checker &amp; Clean Buying Companion.
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-1.5 text-slate-400">
          <span>Developed with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>by</span>
          <a
            href="https://github.com/anzamuneebkhanofficial"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline decoration-indigo-500/40 hover:decoration-indigo-400 transition-colors"
          >
            Muhammad Anza Muneeb Khan
          </a>
        </div>
      </div>
    </footer>
  );
};
