import { SettingsForm } from '@/components/SettingsForm';
import { getSettings } from '@/lib/store';
export default async function SettingsPage(){return <SettingsForm initial={await getSettings()}/>}
