'use client';
import { useRouter } from 'next/navigation';
export function AdminLogout(){const router=useRouter();return <button className="buttonSmall" onClick={async()=>{await fetch('/api/admin/logout',{method:'POST'});router.replace('/admin/login');router.refresh();}}>Log out</button>}
