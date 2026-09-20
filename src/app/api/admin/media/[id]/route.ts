import { NextResponse } from 'next/server';
import { assertSameOrigin, getSession } from '@/lib/auth';
import { getMedia, saveMedia } from '@/lib/store';
import type { MediaItem } from '@/types/content';
export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}){if(!await getSession())return NextResponse.json({error:'Unauthorized'},{status:401});try{assertSameOrigin(request);const {id}=await params;const current=(await getMedia()).find(x=>x.id===id);if(!current)return NextResponse.json({error:'Media not found.'},{status:404});const body=await request.json() as Partial<MediaItem>;const item:MediaItem={...current,alt:String(body.alt??current.alt).slice(0,240),title:String(body.title??current.title).slice(0,240),caption:String(body.caption??current.caption).slice(0,600)};await saveMedia(item);return NextResponse.json({item});}catch{return NextResponse.json({error:'Could not update media.'},{status:400});}}
