import { getSessionWithChefStatus } from '@/lib/auth-helpers';
import { SignInButton } from '@/components/auth/SignInButton';
import { IconChefHat, IconUsers, IconSearch, IconHeart } from '@tabler/icons-react';
import Link from 'next/link';

export default async function Welcome() {
  const { session } = await getSessionWithChefStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-green-100 rounded-full">
              <IconChefHat className="w-16 h-16 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenido a <span className="text-green-600">ChefHub</span>
          </h1>
          <h2
            className="text-2xl md:text-4xl font-semibold text-gray-800 mb-4"
          >
            {session ? `Hola, ${session.user.name}!` : 'Descubre el mundo de la cocina'}
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubre, comparte y disfruta de las mejores recetas de cocina. 
            Únete a una comunidad apasionada por la gastronomía.
          </p>

          {!session && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <SignInButton />
              <Link 
                href="/recipes"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Explorar Recetas
              </Link>
            </div>
          )}

          {session && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/recipes"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Explorar Recetas
              </Link>
              <Link 
                href="/favorites"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Mis Favoritos
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <IconSearch className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Explora Recetas
            </h3>
            <p className="text-gray-600">
              Descubre miles de recetas deliciosas de chefs profesionales y aficionados de todo el mundo.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <IconHeart className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Guarda Favoritos
            </h3>
            <p className="text-gray-600">
              Marca tus recetas favoritas y tenlas siempre a mano para cocinar cuando quieras.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <IconUsers className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Únete a la Comunidad
            </h3>
            <p className="text-gray-600">
              Comparte tus propias recetas y conecta con otros amantes de la cocina.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Listo para comenzar tu aventura culinaria?
            </h2>
            <p className="text-gray-600 mb-6">
              Únete a ChefHub hoy y descubre un mundo de sabores esperándote.
            </p>
            {!session ? (
              <SignInButton />
            ) : (
              <Link 
                href="/recipes"
                className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Comenzar a Cocinar
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
