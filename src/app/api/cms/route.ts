import { NextRequest, NextResponse } from 'next/server';
import {
  readDb,
  writeDb,
  getItems,
  createItem,
  updateItem,
  deleteItem,
  updateSettings,
  updateHeader,
  updateFooter,
  DatabaseSchema
} from '@/lib/cms';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const table = searchParams.get('table') as keyof DatabaseSchema | null;

    if (!table) {
      return NextResponse.json({ error: 'Table parameter is required' }, { status: 400 });
    }

    const data = getItems(table);
    if (data === undefined) {
      return NextResponse.json({ error: `Table '${table}' not found` }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const table = searchParams.get('table') as keyof Omit<DatabaseSchema, 'settings' | 'newsletter' | 'header' | 'footer'> | null;
    const body = await request.json();

    if (!table) {
      return NextResponse.json({ error: 'Table parameter is required' }, { status: 400 });
    }

    if (table === 'leads') {
      // Add date to leads automatically
      body.date = new Date().toISOString();
      body.status = 'new';
    }

    const newItem = createItem(table, body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const table = searchParams.get('table') as keyof DatabaseSchema | null;
    const id = searchParams.get('id');
    const body = await request.json();

    if (!table) {
      return NextResponse.json({ error: 'Table parameter is required' }, { status: 400 });
    }

    if (table === 'settings') {
      const updatedSettings = updateSettings(body);
      return NextResponse.json(updatedSettings);
    }

    if (table === 'header') {
      const updatedHeader = updateHeader(body);
      return NextResponse.json(updatedHeader);
    }

    if (table === 'footer') {
      const updatedFooter = updateFooter(body);
      return NextResponse.json(updatedFooter);
    }

    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    const updatedItem = updateItem(table as any, id, body);
    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const table = searchParams.get('table') as keyof DatabaseSchema | null;
    const id = searchParams.get('id');

    if (!table || !id) {
      return NextResponse.json({ error: 'Table and ID parameters are required' }, { status: 400 });
    }

    const success = deleteItem(table as any, id);
    if (!success) {
      return NextResponse.json({ error: 'Item not found or could not be deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
