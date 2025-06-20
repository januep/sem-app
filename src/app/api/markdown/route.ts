// File: app/api/markdown/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  // Point at the content.md living alongside this file
  const filePath = path.join(process.cwd(), 'app', 'api', 'markdown', 'content.md');
  try {
    const markdown = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json({ markdown });
  } catch (error) {
    console.error('Failed to read markdown file', error);
    return NextResponse.error();
  }
}
