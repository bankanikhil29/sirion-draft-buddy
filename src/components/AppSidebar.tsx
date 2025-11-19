import { useEffect, useState } from "react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, FileText, FileEdit, GitCompare, CheckCircle, Info } from "lucide-react";

const navItems = [
  { title: "Home", hash: "#start", icon: Home },
  { title: "New Contract", hash: "#new", icon: FileText },
  { title: "Draft Editor", hash: "#draft", icon: FileEdit },
  { title: "Redline Analysis", hash: "#redlines", icon: GitCompare },
  { title: "Finalize", hash: "#finalize", icon: CheckCircle },
  { title: "About", hash: "#about", icon: Info },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const [currentHash, setCurrentHash] = useState(window.location.hash || "#start");

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || "#start");
    };
    
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-brand-primary">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor" opacity="0.2"/>
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!isCollapsed && (
              <span className="font-semibold text-foreground text-sm">SmartDraft</span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = currentHash === item.hash;
                return (
                  <SidebarMenuItem key={item.hash}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <a
                        href={item.hash}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                        aria-label={item.title}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
