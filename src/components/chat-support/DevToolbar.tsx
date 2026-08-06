import { useWhatsAppRepo } from '@/hooks/useWhatsAppRepository';
import { Button } from '@/components/ui/button';

export function DevToolbar() {
  const { repo, refresh, resetData } = useWhatsAppRepo();

  const simulateIncoming = (type: 'text' | 'image' | 'voice' | 'location' = 'text') => {
    const chat = repo.getConversations()[0];
    if (!chat) return;

    let msg: any = {
      id: `sim-${Date.now()}`,
      chatId: chat.id,
      senderId: chat.contactId,
      timestamp: new Date().toISOString(),
      status: 'delivered',
    };

    if (type === 'text') {
      msg.type = 'text';
      msg.body = 'Dev simulation: incoming text.';
    } else if (type === 'image') {
      msg.type = 'media';
      msg.attachments = [
        { type: 'image', url: 'https://picsum.photos/400/300?random=' + Date.now(), caption: 'Simulated image' },
      ];
    } else if (type === 'voice') {
      msg.type = 'media';
      msg.attachments = [
        { type: 'voice', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: 30, waveform: Array.from({ length: 40 }, () => Math.random() * 0.8 + 0.2) },
      ];
    } else if (type === 'location') {
      msg.type = 'media';
      msg.attachments = [
        { type: 'location', latitude: 6.5244, longitude: 3.3792, label: 'Lagos', mapImageUrl: 'https://staticmap.openstreetmap.de/staticmap.php?center=6.5244,3.3792&zoom=12&size=400x200&maptype=mapnik' },
      ];
    }

    repo.sendMessage(msg);
    refresh();
  };

  const simulateStatusUpdate = (status: 'delivered' | 'read') => {
    const chat = repo.getConversations()[0];
    if (!chat) return;
    const msgs = repo.getMessages(chat.id);
    // Update last outgoing message status
    const lastOutgoing = [...msgs].reverse().find(m => m.senderId === 'agent-alice'); // mock agent
    if (lastOutgoing) {
      lastOutgoing.status = status;
      repo.sendMessage(lastOutgoing);
      refresh();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 bg-card p-3 rounded-lg shadow-lg border border-border">
      <p className="text-xs font-semibold">Dev Tools</p>
      <div className="flex flex-wrap gap-1">
        <Button variant="outline" size="sm" onClick={() => simulateIncoming('text')}>In Text</Button>
        <Button variant="outline" size="sm" onClick={() => simulateIncoming('image')}>In Image</Button>
        <Button variant="outline" size="sm" onClick={() => simulateIncoming('voice')}>In Voice</Button>
        <Button variant="outline" size="sm" onClick={() => simulateIncoming('location')}>In Location</Button>
      </div>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" onClick={() => simulateStatusUpdate('delivered')}>Mark Delivered</Button>
        <Button variant="outline" size="sm" onClick={() => simulateStatusUpdate('read')}>Mark Read</Button>
      </div>
      <Button variant="destructive" size="sm" onClick={resetData}>Reset DB</Button>
    </div>
  );
}