import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-700 text-center md:text-left">© 2025 ExpiryEaze. All rights reserved.</div>
          <div className="flex space-x-4">
            <Link href="/terms" className="text-sm text-gray-700 hover:text-primary-600">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-sm text-gray-700 hover:text-primary-600">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

