'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ProjectRowActions({ projectId, title }: { projectId: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete the case study "${title}"?`)) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete project.');
      }
    } catch {
      alert('Network error while deleting project.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="buttonSmall buttonDanger"
    >
      {loading ? '…' : 'Delete'}
    </button>
  );
}
