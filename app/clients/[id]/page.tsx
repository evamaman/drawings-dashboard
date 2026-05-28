import { redirect } from "next/navigation";

export default async function OldClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/client/${id}`);
}
