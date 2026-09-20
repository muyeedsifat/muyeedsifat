import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { AdminLogout } from '@/components/AdminLogout';
export const dynamic='force-dynamic';
export default async function ProtectedAdminLayout({children}:{children:React.ReactNode}){const session=await getSession();if(!session)redirect('/admin/login');return <div className="adminShell"><header className="adminTop"><div className="container"><div className="brand"><span className="brandMark">M</span><span className="brandDivider">|</span><span>Muyeed CMS</span></div><AdminLogout/></div></header><div className="container adminLayout"><aside className="adminSidebar"><Link href="/admin">Dashboard</Link><Link href="/admin/posts">Posts</Link><Link href="/admin/posts/new">Add New Post</Link><Link href="/admin/media">Media</Link><Link href="/admin/taxonomy">Categories & Tags</Link><Link href="/admin/settings">Settings</Link><Link href="/" target="_blank">View Website ↗</Link></aside><section className="adminMain">{children}</section></div></div>}
