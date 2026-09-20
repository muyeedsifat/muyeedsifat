import { PostEditor } from '@/components/PostEditor';
import { getMedia, getTaxonomy } from '@/lib/store';
import type { Post } from '@/types/content';

export default async function NewPostPage(){const [media,tax]=await Promise.all([getMedia(),getTaxonomy()]);const now=new Date().toISOString();const post:Post={id:'',title:'',slug:'',excerpt:'',status:'draft',author:'Muyeed Sifat',featuredImage:'',featuredAlt:'',categories:[],tags:[],focusKeyword:'',metaTitle:'',metaDescription:'',canonicalUrl:'',schemaType:'BlogPosting',customSchema:'',faqs:[],blocks:[{id:crypto.randomUUID(),type:'paragraph',text:''}],createdAt:now,updatedAt:now};return <PostEditor initialPost={post} media={media} categories={tax.categories} tags={tax.tags}/>}
