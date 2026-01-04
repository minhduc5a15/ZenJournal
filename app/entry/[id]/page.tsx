"use client";
import { EntryEditor } from "@/components/EntryEditor";
import { useParams } from "next/navigation";

export default function EditEntryPage() {
  const params = useParams();
  const id = params.id as string;

  return <EntryEditor entryId={id} />;
}
