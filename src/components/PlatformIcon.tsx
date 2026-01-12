import Image from 'next/image';
import { cn } from '@/lib/utils';

const platformLogos: Record<string, string> = {
    google: '/assets/img/icons/google-icon.png',
    trustpilot: '/assets/img/icons/trustpilot-icon.webp',
    tripadvisor: '/assets/img/icons/tripadvisor-icon.png',
    klook: '/assets/img/icons/klook-icon.png',
};

export const PlatformIcon = ({ platform, className }: { platform: string; className?: string }) => {
    const lowerPlatform = platform.toLowerCase();
    const logoUrl = platformLogos[lowerPlatform] || (lowerPlatform.includes('google') ? platformLogos.google : null);

    if (logoUrl) {
        return <Image src={logoUrl} alt={`${platform} logo`} width={16} height={16} className={cn("h-4 w-4 object-contain", className)} unoptimized />;
    }

    // Fallback for platforms without a specific logo
    switch (lowerPlatform) {
         case 'google':
        case 'google maps':
            return <Image src={platformLogos.google} alt="Google logo" width={16} height={16} className={cn("h-4 w-4 object-contain", className)} unoptimized />;
        default:
            return null;
    }
};
