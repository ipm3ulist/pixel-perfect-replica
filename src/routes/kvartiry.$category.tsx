import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CategoryPage, categoryHead } from "@/components/site/CategoryPage";
import { getCategory, type CategoryId } from "@/content";

export const Route = createFileRoute("/kvartiry/$category")({
  loader: ({ params }) => {
    const c = getCategory(`kvartiry.${params.category}` as CategoryId);
    if (!c || c.status !== "published") throw notFound();
    return { id: c.id };
  },
  head: ({ loaderData }) => categoryHead(loaderData ? getCategory(loaderData.id) : undefined),
  component: Page,
  notFoundComponent: () => (
    <div className="container-page py-24">
      <h1 className="text-4xl">Категория не найдена</h1>
      <Link
        to="/kvartiry"
        className="mt-6 inline-block font-semibold text-accent-foreground underline"
      >
        Все категории
      </Link>
    </div>
  ),
});

function Page() {
  const { id } = Route.useLoaderData();
  return <CategoryPage category={getCategory(id)!} />;
}
