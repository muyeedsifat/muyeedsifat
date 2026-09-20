import { notFound } from 'next/navigation';
import { PostEditor } from '@/components/PostEditor';
import { getMedia, getPostById, getTaxonomy } from '@/lib/store';
export default async function EditPostPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const [post,media,tax]=await Promise.all([getPostById(id),getMedia(),getTaxonomy()]);if(!post)notFound();return <PostEditor initialPost={post} media={media} categories={tax.categories} tags={tax.tags}/>}
