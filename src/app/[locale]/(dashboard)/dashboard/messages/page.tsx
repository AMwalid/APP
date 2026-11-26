import { setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/features/auth";
import { MessagingView, getConversation, getConversations } from "@/features/messaging";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type SearchParams = Promise<{
  peer?: string | string[];
  name?: string | string[];
}>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

/** Thin route: resolve the deep-linked peer, then hand off to the inbox view. */
export default async function MessagesDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { peer, name } = await searchParams;
  const requestedPeer = first(peer);
  const peerId = UUID_PATTERN.test(requestedPeer) ? requestedPeer : null;
  const peerName = peerId ? first(name) || null : null;

  const [user, conversations, messages] = await Promise.all([
    getCurrentUser(),
    getConversations(),
    peerId ? getConversation(peerId) : Promise.resolve([]),
  ]);

  return (
    <MessagingView
      key={peerId ?? "no-peer"}
      locale={locale}
      currentUserId={user?.id ?? ""}
      conversations={conversations}
      messages={messages}
      activePeerId={peerId}
      activePeerName={peerName}
    />
  );
}
