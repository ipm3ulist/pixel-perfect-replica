import { createFileRoute } from "@tanstack/react-router";
import { RoomsIndex, roomsIndexHead } from "@/components/site/RoomPage";

export const Route = createFileRoute("/kvartiry/pomeshcheniya/")({
  head: () => roomsIndexHead(),
  component: RoomsIndex,
});
