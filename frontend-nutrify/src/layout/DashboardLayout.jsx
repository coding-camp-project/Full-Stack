import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  MessageSquare,
  Scan,
  History,
  Menu,
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Chatbot',
    icon: MessageSquare,
    href: '/chatbot',
  },
  {
    title: 'Scan Nutrifiy',
    icon: Scan,
    href: '/scan',
  },
  {
    title: 'History',
    icon: History,
    href: '/history',
  },
];

const DashboardLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <h1 className="text-xl font-bold">Nutrifiy</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-1 flex-col">
          {/* Top Navbar */}
          <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h2 className="text-lg font-semibold">Dashboard</h2>
            </div>
            <div className="flex items-center gap-4">
              {/* Add user menu or other header items here */}
              <Button variant="ghost" size="sm">
                Profile
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;