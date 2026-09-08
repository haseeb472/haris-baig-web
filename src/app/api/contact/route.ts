import { NextRequest, NextResponse } from 'next/server';
import { createItem, addNewsletterEmail } from '@/lib/cms';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'newsletter') {
      if (!data.email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }
      const success = addNewsletterEmail(data.email);
      if (!success) {
        return NextResponse.json({ message: 'Already subscribed!' }, { status: 200 });
      }
      return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 200 });
    }

    // Default: contact lead or quote request or career application
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const type = data.type || 'contact'; // 'contact' | 'quote' | 'career'
    const newLead = createItem('leads', {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      type,
      serviceCategory: data.serviceCategory || '',
      message: data.message,
      resumeUrl: data.resumeUrl || '',
      date: new Date().toISOString(),
      status: 'new'
    });

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
