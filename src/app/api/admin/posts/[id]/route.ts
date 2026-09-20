import { NextResponse } from 'next/server';
import { getSession, assertSameOrigin } from '@/lib/auth';
import { deletePost, getPostById, savePost } from '@/lib/store';
import { slugify } from '@/lib/slug';
import type { Post } from '@/types/content';
export const runtime='nodejs';
export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}){if(!await getSession())return NextResponse.json({error:'Unauthorized'},{status:401});try{assertSameOrigin(request);const {id}=await params;const current=await getPostById(id);if(!current)return NextResponse.json({error:'Post not found.'},{status:404});const body=await request.json() as Post;const post:Post={...current,...body,id,slug:slugify(body.slug||body.title),updatedAt:new Date().toISOString()};if(!post.title||!post.slug)return NextResponse.json({error:'Title and slug are required.'},{status:400});await savePost(post);return NextResponse.json({post});}catch{return NextResponse.json({error:'Could not update post.'},{status:400});}}
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){if(!await getSession())return NextResponse.json({error:'Unauthorized'},{status:401});try{assertSameOrigin(request);const {id}=await params;await deletePost(id);return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'Could not delete post.'},{status:400});}}
