import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const roadmapPath = path.join(process.cwd(), 'project-roadmap.json');
    
    if (!fs.existsSync(roadmapPath)) {
      return NextResponse.json(
        { error: 'Roadmap file not found' },
        { status: 404 }
      );
    }

    const roadmapData = fs.readFileSync(roadmapPath, 'utf-8');
    const data = JSON.parse(roadmapData);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to load roadmap data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const roadmapPath = path.join(process.cwd(), 'project-roadmap.json');
    
    fs.writeFileSync(roadmapPath, JSON.stringify(body, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to update roadmap data' },
      { status: 500 }
    );
  }
} 