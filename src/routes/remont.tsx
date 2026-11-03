import { createFileRoute } from "@tanstack/react-router";
import { SectionPage, sectionHead } from "@/components/site/SectionPage";

export const Route = createFileRoute("/remont")({
  head: () => sectionHead("remont"),
  component: () => <SectionPage slug="remont" />,
});
