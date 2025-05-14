
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import AppLogo from '@/components/AppLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Home, FilePlus, ListFilter, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import { useAnonymousId } from '@/hooks/useAnonymousId';
import CustomLogoIcon from '@/components/CustomLogoIcon';

interface NavItem {
  href: string;
  labelKey: keyof import('@/types').Translations;
  icon: React.ElementType;
}

// Inner component to access sidebar context
function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { sidebarState } = useSidebar(); // Get sidebar state

  const navItems: NavItem[] = [
    { href: '/', labelKey: 'navDashboard', icon: Home },
    { href: '/submit-report', labelKey: 'navSubmitReport', icon: FilePlus },
    { href: '/reports', labelKey: 'navViewReports', icon: ListFilter },
    { href: '/achievements', labelKey: 'navAchievements', icon: Award },
  ];

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          {/* Pass collapsed state to AppLogo */}
          <AppLogo collapsed={sidebarState === 'collapsed'} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={t(item.labelKey)}
                  >
                    <a>
                      <item.icon />
                      <span>{t(item.labelKey)}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-2">
           <div className="flex items-center justify-between">
             <p className="text-xs text-sidebar-foreground/70">© Labour Lens</p>
             {sidebarState === 'expanded' && <LanguageSwitcher />}
           </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2 md:hidden">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-2"> {/* Group logo and app name */}
            <CustomLogoIcon className="h-6 w-6 text-primary" />
            <div className="font-semibold text-lg">{t('appName')}</div>
          </div>
          <LanguageSwitcher />
        </header>
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </>
  );
}


export default function MainLayout({ children }: { children: ReactNode }) {
  useAnonymousId(); // Ensures anonymous ID is generated/retrieved on client mount

  return (
    <SidebarProvider defaultOpen={false}> {/* Default to collapsed */}
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}

