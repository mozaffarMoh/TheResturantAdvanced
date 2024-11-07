import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const splittedURL = url?.pathname?.split('/')
  const inputPassword = splittedURL?.[splittedURL?.length - 1]

  const acceptLanguage = req.headers.get('accept-language') || 'en';
  const language = acceptLanguage?.split(',')?.[0]?.split('-')?.[0];

  const messages = await import(`../../../../../../messages/${language}.json`).catch(() => import('../../../../../../messages/en.json'));


  try {
    const client = await clientPromise;
    const db = client.db('menu');

    // Fetch password from the database
    const passwordData = await db.collection('password').find({}).toArray();
    const storedPassword = passwordData[0]?.password;

    if (inputPassword == storedPassword) {
      return NextResponse.json({ success: true, message: 'Password is correct' });
    } else {
      return NextResponse.json({ success: false, message: messages.apiMessages.incorrectPasswrod }, { status: 401 });
    }

  } catch (error) {
    return NextResponse.json({ success: false, message: messages.apiMessages.error }, { status: 500 });
  }
}

