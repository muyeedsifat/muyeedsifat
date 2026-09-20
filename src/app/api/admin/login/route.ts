import { NextResponse } from 'next/server';
import { assertSameOrigin, createSessionToken, SESSION_COOKIE, validCredentials } from '@/lib/auth';
export const runtime='nodejs';
export async function POST(request: Request){try{assertSameOrigin(request);const {username,password}=await request.json();if(!validCredentials(String(username||''),String(password||'')))return NextResponse.json({error:'Invalid username or password.'},{status:401});const response=NextResponse.json({ok:true});response.cookies.set(SESSION_COOKIE,createSessionToken(String(username)),{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*12});return response;}catch{return NextResponse.json({error:'Login failed.'},{status:400});}}
