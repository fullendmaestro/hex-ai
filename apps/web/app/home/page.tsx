import dynamic from "next/dynamic";

const ChatSidebar = dynamic(
  () => import("@/components/chat").then((m) => m.ChatSidebar),
  { ssr: false }
);

export default function Page() {
  return (
    <main className="">
      <ChatSidebar />
    </main>
  );
}
