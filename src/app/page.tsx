import { RecipeGridWrapper } from "@/components/recipes/RecipeGridWrapper";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecipeGridWrapper />
      </main>
    </div>
  );
}
