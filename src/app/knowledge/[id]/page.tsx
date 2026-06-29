"use client";

import { KnowledgeEditor } from "@/components/knowledge/KnowledgeEditor";
import { useParams } from "next/navigation";

export default function KnowledgePage() {
  const params = useParams();
  const pageId = params.id as string;

  return <KnowledgeEditor pageId={pageId} />;
}
