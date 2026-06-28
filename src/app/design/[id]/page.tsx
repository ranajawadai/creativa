"use client";

import { Editor } from "@/components/editor/Editor";
import { useParams } from "next/navigation";

export default function DesignPage() {
  const params = useParams();
  const designId = params.id as string;

  return <Editor designId={designId} />;
}
