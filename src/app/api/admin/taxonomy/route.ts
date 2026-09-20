import { NextResponse } from 'next/server';
import { assertSameOrigin, getSession } from '@/lib/auth';
import { saveTaxonomy } from '@/lib/store';
export async function PUT(request:Request){if(!await getSession())return NextResponse.json({error:'Unauthorized'},{status:401});try{assertSameOrigin(request);const body=await request.json();const clean=(value:unknown)=>Array.isArray(value)?Array.from(new Set(value.map(v=>String(v).trim()).filter(Boolean))).slice(0,100):[];const result=await saveTaxonomy(clean(body.categories),clean(body.tags));return NextResponse.json(result)}catch{return NextResponse.json({error:'Could not save taxonomy.'},{status:400})}}
