"use client"

import { clientAuth } from "@/utils/supabase/auth-client"
import { LogOut, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { success, session } = await clientAuth.getSession()
        if (success && session) {
          setUser(session.user)
        }
      } catch (error) {
        console.error("Error fetching session:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  const handleLogout = async () => {
    try {
      await clientAuth.signOut()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const navItems = [
    { href: "/", label: "Home" },
    {
      href: user ? (user.user_metadata?.role === "vendor" ? "/vendor-dashboard" : "/user-dashboard") : "/auth/signup",
      label: user ? "Dashboard" : "Sign Up",
    },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ]

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition duration-300">
            ExpiryEaze
          </Link>
          <div className="hidden md:flex space-x-4 items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-bold text-gray-700 hover:text-primary-600 transition duration-300 px-3 py-2 rounded-full hover:bg-primary-50 ${
                  pathname === item.href ? "text-primary-600 bg-primary-50" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                {user.user_metadata?.role !== "vendor" && (
                  <Link
                    href="/cart"
                    className="font-bold text-gray-700 hover:text-primary-600 transition duration-300 px-3 py-2 rounded-full hover:bg-primary-50"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-1 font-bold text-gray-700 hover:text-primary-600 transition duration-300 px-3 py-2 rounded-full hover:bg-primary-50"
                  >
                    <User className="h-5 w-5" />
                    <span>{user.user_metadata?.name || user.email?.split("@")[0]}</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              !loading && (
                <Link
                  href="/auth/login"
                  className="font-bold text-white bg-primary-600 hover:bg-primary-700 transition duration-300 px-4 py-2 rounded-full"
                >
                  Sign In
                </Link>
              )
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2 px-4 font-bold text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-full ${
                  pathname === item.href ? "text-primary-600 bg-primary-50" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                {user.user_metadata?.role !== "vendor" && (
                  <Link
                    href="/cart"
                    className="flex items-center py-2 px-4 font-bold text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-full"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full py-2 px-4 font-bold text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-full"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign out
                </button>
              </>
            ) : (
              !loading && (
                <Link
                  href="/auth/login"
                  className="block py-2 px-4 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-full text-center"
                >
                  Sign In
                </Link>
              )
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header

