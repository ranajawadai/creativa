"use client";

import { Writer } from "@/components/writer/Writer";
import { useParams } from "next/navigation";

export default function WritePage() {
  const params = useParams();
  const documentId = params.id as string;
  return <Writer documentId={documentId} />;
}
