// File: src/app/api/hello/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Hello world from the server!');
  return NextResponse.json({ message: 'Hello world' });
}
