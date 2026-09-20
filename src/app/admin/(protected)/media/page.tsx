import { MediaManager } from '@/components/MediaManager';
import { getMedia } from '@/lib/store';
export default async function MediaPage(){return <MediaManager initialMedia={await getMedia()}/>}
