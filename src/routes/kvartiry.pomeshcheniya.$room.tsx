import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { RoomPage, roomHead } from "@/components/site/RoomPage";
import { getRoom } from "@/data/rooms";

export const Route = createFileRoute("/kvartiry/pomeshcheniya/$room")({
  loader: ({ params }) => {
    const r = getRoom(params.room);
    if (!r) throw notFound();
    return { slug: r.slug };
  },
  head: ({ loaderData }) => roomHead(loaderData ? getRoom(loaderData.slug) : undefined),
  component: Page,
  notFoundComponent: () => (
    <div className="container-page py-24">
      <h1 className="text-4xl">Помещение не найдено</h1>
      <Link to="/kvartiry/pomeshcheniya" className="mt-6 inline-block font-semibold underline">
        Все помещения
      </Link>
    </div>
  ),
});

function Page() {
  const { slug } = Route.useLoaderData();
  return <RoomPage room={getRoom(slug)!} />;
}
