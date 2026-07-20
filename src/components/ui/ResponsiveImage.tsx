import Image, { type ImageProps } from 'next/image';
import responsiveImages from '@/generated/responsive-images.json';

type ResponsiveImageProps = Omit<ImageProps, 'src'> & {
    src: string;
    variant?: string;
    desktopVariant?: string;
    desktopMedia?: string;
};

type ManifestSource = {
    src: string;
    width: number;
};

type ManifestEntry = {
    sources?: ManifestSource[];
    variants?: Record<string, ManifestSource[]>;
};

const manifest = responsiveImages as Record<string, ManifestEntry>;

function createSrcSet(sources?: ManifestSource[]) {
    return sources
        ?.map((source) => `${source.src} ${source.width}w`)
        .join(', ');
}

export default function ResponsiveImage({
    src,
    alt,
    sizes,
    variant,
    desktopVariant,
    desktopMedia = '(min-width: 768px)',
    ...props
}: ResponsiveImageProps) {
    const entry = manifest[src];
    const sources = variant ? entry?.variants?.[variant] : entry?.sources;
    const desktopSources = desktopVariant ? entry?.variants?.[desktopVariant] : undefined;
    const srcSet = createSrcSet(sources);
    const desktopSrcSet = createSrcSet(desktopSources);

    if (!srcSet && !desktopSrcSet) {
        return <Image src={src} alt={alt} sizes={sizes} {...props} />;
    }

    return (
        <picture className="contents">
            {desktopSrcSet && (
                <source
                    type="image/webp"
                    media={desktopMedia}
                    srcSet={desktopSrcSet}
                    sizes={sizes}
                />
            )}
            {srcSet && <source type="image/webp" srcSet={srcSet} sizes={sizes} />}
            <Image src={src} alt={alt} sizes={sizes} {...props} />
        </picture>
    );
}
