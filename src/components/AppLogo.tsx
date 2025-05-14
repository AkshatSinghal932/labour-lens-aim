import CustomLogoIcon from '@/components/CustomLogoIcon';
import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  collapsed?: boolean;
}

const AppLogo: FC<AppLogoProps> = ({ collapsed }) => {
  return (
    <div
      className={cn(
        "flex items-center text-sidebar-foreground",
        collapsed
          ? "justify-center h-8 w-8" // Fixed size for collapsed state, centers icon
          : "gap-2 p-2"             // Padding and gap for expanded state
      )}
    >
      <CustomLogoIcon className="h-6 w-6 text-sidebar-primary" />
      {!collapsed && (
        <h1 className="text-xl font-semibold">
          Labour Lens
        </h1>
      )}
    </div>
  );
};

export default AppLogo;
