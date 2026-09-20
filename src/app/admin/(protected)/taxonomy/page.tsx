import { TaxonomyManager } from '@/components/TaxonomyManager';
import { getTaxonomy } from '@/lib/store';
export default async function TaxonomyPage(){const tax=await getTaxonomy();return <TaxonomyManager initialCategories={tax.categories} initialTags={tax.tags}/>}
