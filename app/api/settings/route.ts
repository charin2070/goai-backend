import { NextResponse } from 'next/server';
import { settingsService } from '@/src/services/settings.service';

export async function GET() {
  try {
    const allSettings = await settingsService.getAllSettings();
    return NextResponse.json(allSettings);
  } catch (error) {
    console.error('Failed to get settings:', error);
    return NextResponse.json({ message: 'Failed to get settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ message: 'Missing key or value' }, { status: 400 });
    }

    await settingsService.setSetting(key, value);
    return NextResponse.json({ message: 'Setting saved successfully' });
  } catch (error) {
    console.error('Failed to save setting:', error);
    return NextResponse.json({ message: 'Failed to save setting' }, { status: 500 });
  }
} 