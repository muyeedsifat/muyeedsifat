'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter(); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError('');
    const data=Object.fromEntries(new FormData(e.currentTarget).entries());
    const res=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    setLoading(false);
    if(res.ok){router.replace('/admin');router.refresh();} else {const body=await res.json().catch(()=>({}));setError(body.error||'Login failed.');}
  }
  return <main className="loginPage"><div className="loginCard"><div className="brand"><span className="brandMark">M</span><span className="brandDivider">|</span><span>Muyeed CMS</span></div><h1 style={{fontSize:'2rem',marginTop:20}}>Admin Login</h1><p>Manage posts, media and SEO settings.</p><form onSubmit={submit} className="formGrid" style={{gridTemplateColumns:'1fr'}}><div className="field"><label htmlFor="username">Username</label><input id="username" name="username" required autoComplete="username"/></div><div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" required autoComplete="current-password"/></div><button className="btn btnPrimary" type="submit" disabled={loading}>{loading?'Signing in…':'Sign In'}</button>{error&&<p className="statusMessage" role="alert">{error}</p>}</form></div></main>;
}
