import { createFileRoute } from "@tanstack/react-router";
import { DirectionPage, directionHead } from "@/components/site/DirectionPage";

export const Route = createFileRoute("/kvartiry/")({
  head: () => directionHead("kvartiry"),
  component: () => <DirectionPage direction="kvartiry" />,
});
