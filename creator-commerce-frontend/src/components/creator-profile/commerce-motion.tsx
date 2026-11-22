import { BarChart3, Clapperboard, ShoppingBag, TrendingUp } from "lucide-react";

// A decorative, lightweight commerce motif. Never depicts real performance
// claims, account integrations or verified marketplace affiliations.
export function CommerceMotion() {
  return (
    <div aria-hidden="true" className="cf-motion pointer-events-none absolute inset-0 overflow-hidden">
      <div className="cf-motion-orb cf-motion-orb-a" />
      <div className="cf-motion-orb cf-motion-orb-b" />

      <svg
        className="cf-motion-chart"
        viewBox="0 0 580 320"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
      >
        <defs>
          <linearGradient id="cf-growth-line" x1="0" y1="0" x2="580" y2="320" gradientUnits="userSpaceOnUse">
            <stop stopColor="#14B8A6" stopOpacity=".08" />
            <stop offset=".65" stopColor="#5EEAD4" stopOpacity=".62" />
            <stop offset="1" stopColor="#5EEAD4" stopOpacity=".9" />
          </linearGradient>
          <linearGradient id="cf-growth-area" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#5EEAD4" stopOpacity=".14" />
            <stop offset="1" stopColor="#5EEAD4" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[60, 120, 180, 240].map((y) => (
          <path key={y} d={`M0 ${y} H580`} stroke="#5EEAD4" strokeOpacity=".08" strokeDasharray="3 8" />
        ))}
        <path d="M0 262 L85 237 L145 245 L222 183 L285 191 L359 121 L420 138 L506 59 L580 30 V320 H0Z" fill="url(#cf-growth-area)" />
        <path
          className="cf-motion-line"
          d="M0 262 L85 237 L145 245 L222 183 L285 191 L359 121 L420 138 L506 59 L580 30"
          stroke="url(#cf-growth-line)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="506" cy="59" r="6" fill="#5EEAD4" className="cf-motion-pulse" />
      </svg>

      <div className="cf-motion-pill cf-motion-pill-one"><ShoppingBag size={14} /> E-commerce</div>
      <div className="cf-motion-pill cf-motion-pill-two"><Clapperboard size={14} /> UGC Video Ads</div>
      <div className="cf-motion-pill cf-motion-pill-three"><TrendingUp size={14} /> Performance</div>
      <div className="cf-motion-pill cf-motion-pill-four"><BarChart3 size={14} /> Growth</div>
      <div className="cf-motion-grain" />
    </div>
  );
}
