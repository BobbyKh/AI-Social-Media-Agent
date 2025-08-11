import Link from "next/link";

const navItems: Array<{ href: string; label: string; icon: string }> = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/posts", label: "Posts", icon: "📰" },
  { href: "/topics", label: "Topics", icon: "#" },
  { href: "/analytics", label: "Analytics", icon: "📊" },
  { href: "/accounts", label: "Accounts", icon: "🔗" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-white/60 dark:bg-black/20 backdrop-blur-sm">
      <div className="h-16 px-4 flex items-center border-b">
        <span className="font-semibold">AI Content Manager</span>
      </div>
      <nav className="p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-3 text-xs text-gray-500">v0.1.0</div>
    </aside>
  );
}


