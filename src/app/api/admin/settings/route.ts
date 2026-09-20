import { NextResponse } from 'next/server';
import { assertSameOrigin, getSession } from '@/lib/auth';
import { saveSettings } from '@/lib/store';
export async function PUT(request:Request){if(!await getSession())return NextResponse.json({error:'Unauthorized'},{status:401});try{assertSameOrigin(request);const body=await request.json();const settings={siteName:String(body.siteName||'Muyeed').slice(0,100),authorName:String(body.authorName||'Muyeed Sifat').slice(0,120),email:String(body.email||'').slice(0,180),defaultSchema:['Article','BlogPosting'].includes(body.defaultSchema)?body.defaultSchema:'BlogPosting'};await saveSettings(settings);return NextResponse.json({settings})}catch{return NextResponse.json({error:'Could not save settings.'},{status:400})}}
