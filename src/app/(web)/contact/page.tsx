'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, Clock, X, CheckCircle2, Sparkles, Send } from 'lucide-react';
import HomeContact from '@/components/web/HomeContact';
import confetti from 'canvas-confetti';
import SplitText from '@/components/web/SplitText';

const HOURS = [
  { days: 'Monday - Friday', hours: '09:00 AM - 06:00 PM (PST)' },
  { days: 'Saturday', hours: '10:00 AM - 04:00 PM (PST)' },
  { days: 'Sunday', hours: 'Closed' }
];

export default function ContactHubPage() {
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    name: '',
    email: '',
    date: '2026-08-10',
    time: '10:00 AM',
    brief: ''
  });
  const [schedulerLoading, setSchedulerLoading] = useState(false);
  const [schedulerSubmitted, setSchedulerSubmitted] = useState(false);
  const [components, setComponents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/cms?table=pages')
      .then((res) => res.json())
      .then((data) => {
        const page = data.find((p: any) => p.id === 'contact');
        if (page) {
          setComponents(page.components);
        }
      });
  }, []);

  const heroComp = components.find((c) => c.type === 'ContactHero');
  const heroTagline = heroComp?.content?.tagline || "CONTACT HUB";
  const heroHeading = heroComp?.content?.heading || "Co-create with us";
  const heroDesc = heroComp?.content?.description || "Submit design queries, request project quote estimates, or book an interactive 3D pipeline consultation with our systems architects.";
  const isHeroEnabled = heroComp ? heroComp.enabled : true;

  const officeTitle1 = heroComp?.content?.officeTitle1 || "Studio Offices";
  const officeAddr1 = heroComp?.content?.officeAddr1 || "**San Francisco Office**\n800 Space Park Ave, San Francisco, CA 94103\n\n**Tokyo Studio**\n2-Chrome-11 Roppongi, Minato City, Tokyo 106-6108";
  
  const officeTitle2 = heroComp?.content?.officeTitle2 || "Inquiry Channels";
  const officeAddr2 = heroComp?.content?.officeAddr2 || "**Support Email**\nhello@logicforge.co\n\n**Hotline Phone**\n+1 (800) 555-LOGIC (Mon-Fri)";
  
  const officeTitle3 = heroComp?.content?.officeTitle3 || "Business Hours";
  const hoursList = heroComp?.content?.hours || HOURS;

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = line.split(boldRegex);
      return (
        <span key={i}>
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : part)}
          <br />
        </span>
      );
    });
  };

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleData.name || !scheduleData.email) return;

    setSchedulerLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: scheduleData.name,
          email: scheduleData.email,
          type: 'contact',
          serviceCategory: 'Consultation Booking',
          message: `Consultation Booked for ${scheduleData.date} at ${scheduleData.time}.\nBrief: ${scheduleData.brief}`
        })
      });

      setSchedulerLoading(false);
      if (response.ok) {
        setSchedulerSubmitted(true);
        confetti({
          particleCount: 80,
          spread: 50,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setSchedulerLoading(false);
    }
  };

  return (
    <div className="max-w-[105rem] mx-auto px-6 md:px-12 py-16 font-sans space-y-24">
      
      {/* Hero */}
      {isHeroEnabled && (
        <section className="text-center max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-purple/20 bg-neon-purple/10 text-xs font-semibold text-white uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
            <span>{heroTagline}</span>
          </div>
          
          <SplitText
            text={heroHeading}
            className="text-4xl sm:text-6xl font-space font-black tracking-tight text-white uppercase"
            as="h1"
          />
          
          <p className="text-gray-400 text-sm leading-relaxed">
            {heroDesc}
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                setSchedulerOpen(true);
                setSchedulerSubmitted(false);
                setScheduleData({ name: '', email: '', date: '2026-08-10', time: '10:00 AM', brief: '' });
              }}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-neon-purple/20 text-white font-space font-bold uppercase text-xs tracking-wider transition-all cursor-pointer inline-flex items-center gap-2 shadow-lg"
            >
              <Calendar className="w-4 h-4 text-neon-cyan" />
              <span>Book Consultation Calendar</span>
            </button>
          </div>
        </section>
      )}

      {/* Grid of contact details & hours */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Address card */}
        <div className="p-8 rounded-3xl glass-panel border border-white/5 space-y-6">
          <div className="w-12 h-12 rounded-xl bg-neon-purple/20 text-neon-purple flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-space text-white font-bold text-sm uppercase tracking-wider">{officeTitle1}</h4>
            <p className="text-gray-500 text-xs mt-3 leading-relaxed">
              {formatText(officeAddr1)}
            </p>
          </div>
        </div>

        {/* Channels */}
        <div className="p-8 rounded-3xl glass-panel border border-white/5 space-y-6">
          <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 text-neon-cyan flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-space text-white font-bold text-sm uppercase tracking-wider">{officeTitle2}</h4>
            <p className="text-gray-500 text-xs mt-3 leading-relaxed">
              {formatText(officeAddr2)}
            </p>
          </div>
        </div>

        {/* Office Hours */}
        <div className="p-8 rounded-3xl glass-panel border border-white/5 space-y-6">
          <div className="w-12 h-12 rounded-xl bg-neon-purple/20 text-neon-purple flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-space text-white font-bold text-sm uppercase tracking-wider">{officeTitle3}</h4>
            <ul className="space-y-3.5 text-xs text-gray-500 mt-3 font-semibold uppercase">
              {hoursList.map((hr: any, idx: number) => (
                <li key={idx} className="flex justify-between border-b border-white/5 pb-2">
                  <span>{hr.days}</span>
                  <span className="text-white text-[11px]">{hr.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Inquiry Tabbed form block */}
      <HomeContact />

      {/* Booking Consultation Calendar pop-up modal */}
      {schedulerOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-md rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl relative animate-scale-up">
            
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-[#0f0f0f]/90 to-[#222]/50 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-space font-extrabold text-lg text-white">Book Consultation Slot</h3>
                <p className="text-[10px] text-neon-cyan mt-1 uppercase font-bold tracking-wider">30-MINUTES DISCOVERY STREAM</p>
              </div>
              <button
                onClick={() => setSchedulerOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              {schedulerSubmitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-5">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/35 rounded-full text-emerald-400">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="font-space font-bold text-2xl text-white">Consultation Slotted!</h3>
                  <p className="text-xs text-gray-400 max-w-sm">
                    Thank you, **{scheduleData.name}**. Your calendar sync for **{scheduleData.date}** at **{scheduleData.time}** is confirmed.
                  </p>
                  <button
                    onClick={() => setSchedulerOpen(false)}
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white text-xs font-bold cursor-pointer transition-all"
                  >
                    Close Calendar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookConsultation} className="space-y-4">
                  
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={scheduleData.name}
                      onChange={(e) => setScheduleData({ ...scheduleData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={scheduleData.email}
                      onChange={(e) => setScheduleData({ ...scheduleData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple transition-all"
                    />
                  </div>

                  {/* Date & Time Selector */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Date *</label>
                      <input
                        type="date"
                        required
                        value={scheduleData.date}
                        onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                        className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Time Slot *</label>
                      <select
                        value={scheduleData.time}
                        onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                        className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white focus:outline-none focus:border-neon-purple transition-all cursor-pointer"
                      >
                        <option className="bg-[#120626] text-white py-2" value="10:00 AM">10:00 AM EST</option>
                        <option className="bg-[#120626] text-white py-2" value="11:30 AM">11:30 AM EST</option>
                        <option className="bg-[#120626] text-white py-2" value="02:00 PM">02:00 PM EST</option>
                        <option className="bg-[#120626] text-white py-2" value="03:30 PM">03:30 PM EST</option>
                      </select>
                    </div>
                  </div>

                  {/* Project brief */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Brief Details</label>
                    <textarea
                      rows={3}
                      value={scheduleData.brief}
                      onChange={(e) => setScheduleData({ ...scheduleData, brief: e.target.value })}
                      placeholder="Brief details about your pipeline query..."
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={schedulerLoading}
                    className="w-full rounded-xl py-3 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-blue hover:to-neon-purple text-white font-space font-bold tracking-widest uppercase text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {schedulerLoading ? 'Slotted Syncing...' : 'Book consultation'}
                    <Send className="w-4 h-4" />
                  </button>

                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
