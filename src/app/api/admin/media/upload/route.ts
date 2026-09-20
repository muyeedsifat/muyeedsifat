import { NextResponse } from 'next/server';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import sharp from 'sharp';
import { assertSameOrigin, getSession } from '@/lib/auth';
import { saveMedia } from '@/lib/store';
import { slugify, titleFromFilename } from '@/lib/slug';
import type { MediaItem } from '@/types/content';
export const runtime='nodejs';
const MAX=8*1024*1024;
export async function POST(request:Request){if(!await getSession())return NextResponse.json({error:'Unauthorized'},{status:401});try{assertSameOrigin(request);const form=await request.formData();const file=form.get('image');if(!(file instanceof File))return NextResponse.json({error:'Choose an image.'},{status:400});if(file.size>MAX)return NextResponse.json({error:'Image must be under 8 MB.'},{status:400});if(!['image/jpeg','image/png','image/webp','image/avif'].includes(file.type))return NextResponse.json({error:'Unsupported image type.'},{status:400});const originalTitle=titleFromFilename(file.name);const requestedAlt=String(form.get('alt')||'').trim();const base=slugify(originalTitle)||'image';const filename=`${base}-${Date.now()}.webp`;const uploads=path.join(process.cwd(),'public','uploads');await fs.mkdir(uploads,{recursive:true});const input=Buffer.from(await file.arrayBuffer());const pipeline=sharp(input).rotate().resize({width:1800,height:1800,fit:'inside',withoutEnlargement:true}).webp({quality:82});const info=await pipeline.toFile(path.join(uploads,filename));const item:MediaItem={id:crypto.randomUUID(),filename,url:`/uploads/${filename}`,alt:requestedAlt||originalTitle,title:originalTitle,caption:'',width:info.width,height:info.height,mime:'image/webp',createdAt:new Date().toISOString()};await saveMedia(item);return NextResponse.json({item});}catch(error){console.error(error);return NextResponse.json({error:'Could not optimize the image. Make sure Sharp is installed.'},{status:500});}}
