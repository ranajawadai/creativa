"use client";

import { VideoEditor } from "@/components/video/VideoEditor";
import { useParams } from "next/navigation";

export default function VideoProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  return <VideoEditor projectId={projectId} />;
}
