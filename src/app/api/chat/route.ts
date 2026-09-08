import { NextRequest, NextResponse } from 'next/server';
import { readDb } from '@/lib/cms';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const db = readDb();
    const cleanMsg = message.toLowerCase().trim();
    let reply = "";
    let suggestions: string[] = [];

    // Keyword analysis & dynamic database matching
    if (cleanMsg.includes('service') || cleanMsg.includes('what do you do') || cleanMsg.includes('offer') || cleanMsg.includes('capabilities')) {
      const serviceNames = db.services.map((s) => s.name).join(', ');
      reply = `LogicForge specializes in world-class digital production. Our core capabilities include: ${serviceNames}. Which service category are you interested in?`;
      suggestions = db.services.map((s) => `Tell me about ${s.name}`);
    } else if (cleanMsg.includes('job') || cleanMsg.includes('hiring') || cleanMsg.includes('career') || cleanMsg.includes('work for you')) {
      reply = "We don't have any active open job listings right now, but we are always looking for outstanding freelance artists and developers! Feel free to send us your details via our Contact Hub.";
      suggestions = ["Contact Team", "Our Services"];
    } else if (cleanMsg.includes('project') || cleanMsg.includes('portfolio') || cleanMsg.includes('work') || cleanMsg.includes('case study')) {
      const projectNames = db.projects.map((p) => `"${p.name}" (${p.client}, ${p.year})`).join(', ');
      reply = `We have shipped several high-fidelity award-winning projects, including: ${projectNames}. You can filter them by category on our portfolio page.`;
      suggestions = db.projects.map((p) => `Show project ${p.name}`);
    } else if (cleanMsg.includes('price') || cleanMsg.includes('cost') || cleanMsg.includes('quote') || cleanMsg.includes('how much')) {
      reply = `We build bespoke quotes for all digital production packages. To get an accurate quote, you can fill out our interactive Quote Request form or chat with our business directors directly via WhatsApp!`;
      suggestions = ["Request Quote", "WhatsApp Chat"];
    } else {
      // Look for specific service match
      const matchedService = db.services.find(
        (s) => cleanMsg.includes(s.name.toLowerCase()) || cleanMsg.includes(s.slug.replace('-', ' '))
      );
      
      // Look for specific project match
      const matchedProject = db.projects.find(
        (p) => cleanMsg.includes(p.name.toLowerCase()) || cleanMsg.includes(p.slug.replace('-', ' '))
      );

      // Look for specific FAQ match
      const matchedFaq = db.faqs.find(
        (f) => cleanMsg.includes(f.question.toLowerCase()) || cleanMsg.includes(f.category.toLowerCase())
      );

      if (matchedService) {
        reply = `**${matchedService.name}** is a core service at LogicForge. ${matchedService.description}\n\nKey features include:\n• ${matchedService.features.join('\n• ')}\n\nWould you like to request a consultation for this service?`;
        suggestions = [`Consult on ${matchedService.name}`, "How we work"];
      } else if (matchedProject) {
        reply = `**${matchedProject.name}** was developed for *${matchedProject.client}* in ${matchedProject.year}. ${matchedProject.description}\n\nProject Achievements: **${matchedProject.stats || 'AAA Visual Fidelity'}**\nTags: ${matchedProject.tags.join(', ')}`;
        suggestions = ["View Case Studies", "Interactive Demo"];
      } else if (matchedFaq) {
        reply = matchedFaq.answer;
        suggestions = ["View FAQs", "Ask another question"];
      } else {
        // Fallback default prompt
        reply = `Welcome to LogicForge AI Assistant! I can help you explore our award-winning digital production capabilities. Ask me about our:
• **Services** (Art, Game Dev, Web Dev, AR/VR)
• **Portfolio Projects** (Case studies)
• **General FAQs**

What can I help you co-create today?`;
        suggestions = ["Our Services", "Show Portfolio", "Talk to Human"];
      }
    }

    return NextResponse.json({ reply, suggestions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
