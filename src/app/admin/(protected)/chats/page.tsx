import { getChatLogs } from '@/lib/store';
import { ChatLogsViewer } from '@/components/ChatLogsViewer';

export const dynamic = 'force-dynamic';

export default async function AdminChatsPage() {
  const chats = await getChatLogs();

  return (
    <>
      <div className="adminActions" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <span className="eyebrow">Customer Interactions</span>
          <h1 style={{ fontSize: '2.2rem', margin: '4px 0 0' }}>AI Chatbot Records</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.92rem' }}>
            All inquiries and conversations handled by Gemini AI on your website are recorded here.
          </p>
        </div>
      </div>

      <ChatLogsViewer initialChats={chats} />
    </>
  );
}
