import { LogOutButton } from '@/components/auth/LogOutButton';
import { IconHome, IconSearch, IconBookmark, IconHeart, IconCreditCard } from '@tabler/icons-react';
import { MobileMenu } from '@/components/navigation/MobileMenu';
import Link from 'next/link';
import { SignInButton } from '@/components/auth/SignInButton';
import { getSessionWithChefStatus } from '@/lib/auth-helpers';

async function MenuOptions() {
  const { session, isChef } = await getSessionWithChefStatus()
  const options = [
    {
      label: 'Inicio',
      href: '/',
      icon: IconHome,
      authRequired: false,
      chefRequired: false
    },
    {
      label: 'Explorar',
      href: '/recipes',
      icon: IconSearch,
      authRequired: false,
      chefRequired: false
    },
    {
      label: 'Precios',
      href: '/pricing',
      icon: IconCreditCard,
      authRequired: false,
      chefRequired: false
    },
    {
      label: 'Mis Recetas',
      href: '/chef/recipes',
      icon: IconBookmark,
      authRequired: true,
      chefRequired: true
    },
    {
      label: 'Favoritos',
      href: '/favorites',
      icon: IconHeart,
      authRequired: true,
      chefRequired: false
    }
  ]

  const currentOptions = options.filter(option => {
    // If option requires auth and user is not authenticated, hide it
    if (option.authRequired && !session) return false;
    
    // If option requires chef status and user is not a chef, hide it
    if (option.chefRequired && !isChef) return false;
    
    return true;
  });

  return (
    <>
      {currentOptions.map((option, index) => (
        <li key={index}>
          <Link
            href={option.href}
            className="text-gray-500 hover:text-green-600 px-3 py-2 text-sm font-medium flex items-center gap-2"
          >
            <option.icon className="w-4 h-4" />
            {option.label}
          </Link>
        </li>
      ))}
    </>
  )
}

export async function Header() {
  const { session } = await getSessionWithChefStatus();

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-green-600">ChefHub</h1>
            </div>
          </div>          {/* Navigation Desktop */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-8">
              <MenuOptions />
            </ul>
          </nav>
          <MobileMenu
            menuOptions={<MenuOptions />}
          >
            {session
              ? <LogOutButton />
              : <SignInButton />
            }
          </MobileMenu>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            { session
              ? <LogOutButton />
              : <SignInButton />
            }
          </div>
        </div>
      </div>
    </header>
  );
}
