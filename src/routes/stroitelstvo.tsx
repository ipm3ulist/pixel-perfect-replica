import { createFileRoute } from "@tanstack/react-router";
import { SectionPage, sectionHead } from "@/components/site/SectionPage";

export const Route = createFileRoute("/stroitelstvo")({
  head: () => sectionHead("stroitelstvo"),
  component: () => <SectionPage slug="stroitelstvo" />,
});
