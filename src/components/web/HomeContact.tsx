'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle2, User, Mail, MessageSquare, Phone, Briefcase, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import SplitText from '@/components/web/SplitText';

interface ContentProps {
  initialType?: 'contact' | 'quote';
  content?: {
    subtitle?: string;
    heading?: string;
    description?: string;
    email?: string;
    phone?: string;
    locations?: string;
    labelName?: string;
    labelEmail?: string;
    labelPhone?: string;
    labelCategory?: string;
    labelDetails?: string;
    submitText?: string;
  };
}

const countries = [
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' }
];

export default function HomeContact({ initialType = 'contact', content }: ContentProps) {
  const subtitle = content?.subtitle || "GET IN TOUCH";
  const heading = content?.heading || "Let’s architect a new digital dimension.";
  const description = content?.description || "Have an enterprise project or design concept in mind? Fill out the inquiry sheet or request a quote and our creative directors will respond within 24 hours to schedule a consultation.";
  const emailVal = content?.email || "hello@logicforge.co";
  const phoneVal = content?.phone || "+1 (800) 555-LOGIC";
  const locationsVal = content?.locations || "San Francisco Head Office: 800 Space Park Ave, San Francisco, CA 94103\nTokyo Studio: 2-Chrome-11 Roppongi, Minato City, Tokyo 106-6108";
  
  const labelName = content?.labelName || "Your Name *";
  const labelEmail = content?.labelEmail || "Email Address *";
  const labelPhone = content?.labelPhone || "Phone Number";
  const labelCategory = content?.labelCategory || "Interest Category";
  const labelDetails = content?.labelDetails || "Project Details *";
  const submitText = content?.submitText || "SEND MESSAGE";

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: initialType,
    serviceCategory: 'art-animation',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [error, setError] = useState('');

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; message?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (formData.phone.trim()) {
      const cleanPhone = formData.phone.replace(/[\s()+\-]/g, '');
      if (!/^\d+$/.test(cleanPhone)) {
        newErrors.phone = 'Phone number can only contain digits, spaces, and punctuation.';
      } else if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        newErrors.phone = 'Phone number must be between 7 and 15 digits.';
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Project details are required.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a bit more detail (at least 10 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setError('Please resolve all validation errors.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone ? `${selectedCountry.dialCode} ${formData.phone}` : ''
        })
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setSubmittedName(formData.name);
        setFormData({
          name: '',
          email: '',
          phone: '',
          type: initialType,
          serviceCategory: 'art-animation',
          message: ''
        });
        setErrors({});
        setSubmitted(true);
        // Trigger premium Awwwards-style confetti burst
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#3b82f6', '#06b6d4', '#ffffff']
        });
      } else {
        setError(data.error || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError('Unable to send message due to a connection issue.');
    }
  };

  return (
    <section className="py-24 bg-bg-dark border-t border-white/5 relative overflow-hidden font-sans">
      <div className="gradient-mesh opacity-10">
        <div className="mesh-orb-1 top-10 left-10"></div>
      </div>

      <div className="max-w-[105rem] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Info Side */}
          <div className="space-y-8">
            <div>
              <span className="inline-block mb-8 text-xs text-neon-purple uppercase font-space font-bold tracking-widest bg-neon-purple/10 px-3 py-1.5 rounded-full border border-neon-purple/20">
                {subtitle}
              </span>
              <SplitText
                text={heading}
                className="text-3xl md:text-5xl font-space font-extrabold mt-0 tracking-tight text-white leading-tight"
                as="h2"
              />
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
              {description}
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-neon-purple">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold hover:text-neon-cyan transition-colors">{emailVal}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-neon-cyan">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-500 font-medium">HOTLINE SUPPORT</p>
                  <p className="text-white font-bold hover:text-neon-purple transition-colors">{phoneVal}</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-panel border-neon-cyan/20">
              <h4 className="font-space font-bold text-white text-sm tracking-wider uppercase mb-2">Our Locations</h4>
              <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                {locationsVal}
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="rounded-3xl glass-panel p-8 md:p-10 border border-white/5 shadow-2xl relative">
            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-5">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="font-space font-bold text-2xl text-white">Transmission Successful!</h3>
                <p className="text-xs text-gray-400 max-w-sm">
                  Thank you, **{submittedName}**. Your digital proposal query has been registered. Our production team will contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  suppressHydrationWarning
                  className="text-xs text-neon-purple hover:underline font-bold cursor-pointer pt-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-4 border-b border-white/5 pb-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'contact' })}
                    suppressHydrationWarning
                    className={`flex-1 py-2 text-xs font-space font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                      formData.type === 'contact'
                        ? 'bg-white/5 text-white border-neon-purple'
                        : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                  >
                    Contact Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'quote' })}
                    suppressHydrationWarning
                    className={`flex-1 py-2 text-xs font-space font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                      formData.type === 'quote'
                        ? 'bg-white/5 text-white border-neon-blue'
                        : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                  >
                    Request Quote
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">{labelName}</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="John Doe"
                        suppressHydrationWarning
                        className={`w-full text-xs bg-white/5 border rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none transition-all ${
                          errors.name
                            ? 'border-red-500/50 focus:border-red-500'
                            : 'border-white/10 focus:border-neon-purple'
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-[10px] text-red-400 font-semibold mt-1 animate-premium-fade">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">{labelEmail}</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="john@example.com"
                        suppressHydrationWarning
                        className={`w-full text-xs bg-white/5 border rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none transition-all ${
                          errors.email
                            ? 'border-red-500/50 focus:border-red-500'
                            : 'border-white/10 focus:border-neon-purple'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[10px] text-red-400 font-semibold mt-1 animate-premium-fade">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="space-y-2" ref={dropdownRef}>
                    <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">{labelPhone}</label>
                    <div className={`relative flex items-center bg-white/5 border rounded-xl transition-all ${
                      errors.phone
                        ? 'border-red-500/50 focus-within:border-red-500'
                        : 'border-white/10 focus-within:border-neon-purple'
                    }`}>
                      {/* Country code selector */}
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-3.5 py-3.5 text-xs text-white hover:bg-white/5 rounded-l-xl transition-all cursor-pointer select-none"
                      >
                        <img
                          src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
                          alt={selectedCountry.name}
                          className="w-5 h-3.5 object-cover rounded-xs border border-white/10"
                        />
                        <span className="font-semibold text-white/90">{selectedCountry.dialCode}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                      </button>

                      {/* Divider */}
                      <div className="w-[1px] h-6 bg-white/10" />

                      {/* Phone input */}
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: undefined });
                        }}
                        placeholder="300 1234567"
                        suppressHydrationWarning
                        className="flex-1 text-xs bg-transparent pl-3 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none"
                      />

                      {isDropdownOpen && (
                        <div
                          data-lenis-prevent
                          className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-card-dark border border-white/10 rounded-xl shadow-2xl z-50 py-1 dropdown-scrollbar"
                        >
                          {countries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(c);
                                setIsDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-left text-gray-300 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
                            >
                              <img
                                src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                                alt={c.name}
                                className="w-5 h-3.5 object-cover rounded-xs border border-white/10"
                              />
                              <span className="font-semibold text-white w-10">{c.dialCode}</span>
                              <span className="truncate text-gray-400">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.phone && (
                      <p className="text-[10px] text-red-400 font-semibold mt-1 animate-premium-fade">{errors.phone}</p>
                    )}
                  </div>

                  {/* Service Category */}
                  <div className="space-y-2">
                    <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">{labelCategory}</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                      <select
                        value={formData.serviceCategory}
                        onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                        suppressHydrationWarning
                        className="w-full text-xs bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white focus:outline-none focus:border-neon-purple transition-all appearance-none cursor-pointer"
                      >
                        <option className="bg-[#120626] text-white py-2" value="art-animation">Art & Animation</option>
                        <option className="bg-[#120626] text-white py-2" value="game-development">Game Development</option>
                        <option className="bg-[#120626] text-white py-2" value="web-development">Web Development</option>
                        <option className="bg-[#120626] text-white py-2" value="ar-vr">AR / VR Solutions</option>
                        <option className="bg-[#120626] text-white py-2" value="arch-viz">Architectural Viz</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">{labelDetails}</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      placeholder="Tell us about your project requirements..."
                      suppressHydrationWarning
                      className={`w-full text-xs bg-white/5 border rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none transition-all resize-none ${
                        errors.message
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-white/10 focus:border-neon-purple'
                      }`}
                    />
                  </div>
                  {errors.message && (
                    <p className="text-[10px] text-red-400 font-semibold mt-1 animate-premium-fade">{errors.message}</p>
                  )}
                </div>

                {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  suppressHydrationWarning
                  className="w-full rounded-xl py-4 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-blue hover:to-neon-purple text-white font-space font-bold tracking-widest uppercase text-xs transition-all shadow-lg hover:shadow-neon-purple/50 duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'Transmitting...' : submitText}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
