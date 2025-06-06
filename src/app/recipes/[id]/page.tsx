import { RecipeDetailClient } from '@/components/recipes/RecipeDetailClient'

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  return <RecipeDetailClient recipeId={id} />;
}
