import { NextResponse } from 'next/server';
import { getSession, assertSameOrigin } from '@/lib/auth';
import { savePost } from '@/lib/store';
import { slugify } from '@/lib/slug';
import type { Post } from '@/types/content';
export const runtime='nodejs';
export async function POST(request:Request){if(!await getSession())return NextResponse.json({error:'Unauthorized'},{status:401});try{assertSameOrigin(request);const body=await request.json() as Post;const now=new Date().toISOString();const post:Post={...body,id:crypto.randomUUID(),slug:slugify(body.slug||body.title),title:String(body.title||'').trim(),createdAt:now,updatedAt:now,author:body.author||'Muyeed Sifat',status:body.status==='published'?'published':'draft'};if(!post.title||!post.slug)return NextResponse.json({error:'Title and slug are required.'},{status:400});await savePost(post);return NextResponse.json({post});}catch{return NextResponse.json({error:'Could not save post.'},{status:400});}}
