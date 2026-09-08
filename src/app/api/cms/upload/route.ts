import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save under public/uploads/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
