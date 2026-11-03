import { createFileRoute } from "@tanstack/react-router";
import { DirectionPage, directionHead } from "@/components/site/DirectionPage";

export const Route = createFileRoute("/doma/")({
  head: () => directionHead("doma"),
  component: () => <DirectionPage direction="doma" />,
});
