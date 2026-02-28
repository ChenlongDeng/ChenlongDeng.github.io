import { getConfig } from '@/lib/config';
import { getMarkdownContent, getBibtexContent, getTomlContent, getPageConfig } from '@/lib/content';
import { parseBibTeX } from '@/lib/bibtexParser';
import Profile from '@/components/home/Profile';
import About from '@/components/home/About';
import SelectedPublications from '@/components/home/SelectedPublications';
import News, { NewsItem } from '@/components/home/News';
import EducationExperience, { EducationItem, ExperienceItem } from '@/components/home/Education';
import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';

import { Publication } from '@/types/publication';
import { BasePageConfig, PublicationPageConfig, TextPageConfig, CardPageConfig } from '@/types/page';

// Define types for section config
interface SectionConfig {
  id: string;
  type: 'markdown' | 'publications' | 'list' | 'education';
  title?: string;
  source?: string;
  filter?: string;
  limit?: number;
  content?: string;
  publications?: Publication[];
  items?: NewsItem[];
  education?: EducationItem[];
  experience?: ExperienceItem[];
}

type PageData =
  | { type: 'about', id: string, sections: SectionConfig[] }
  | { type: 'publication', id: string, config: PublicationPageConfig, publications: Publication[] }
  | { type: 'text', id: string, config: TextPageConfig, content: string }
  | { type: 'card', id: string, config: CardPageConfig };

export default function Home() {
  const config = getConfig();
  const enableOnePageMode = config.features.enable_one_page_mode;

  // Always load about page config for profile info
  const aboutConfig = getPageConfig('about');

  // Helper function to process sections (for about page)
  const processSections = (sections: SectionConfig[]) => {
    return sections.map((section: SectionConfig) => {
      switch (section.type) {
        case 'markdown':
          return {
            ...section,
            content: section.source ? getMarkdownContent(section.source) : ''
          };
        case 'publications': {
          const bibtex = getBibtexContent('publications.bib');
          const allPubs = parseBibTeX(bibtex);
          const filteredPubs = section.filter === 'selected'
            ? allPubs.filter(p => p.selected)
            : allPubs;
          return {
            ...section,
            publications: filteredPubs.slice(0, section.limit || 5)
          };
        }
        case 'list': {
          const newsData = section.source ? getTomlContent<{ news: NewsItem[] }>(section.source) : null;
          return {
            ...section,
            items: newsData?.news || []
          };
        }
        case 'education': {
          // Education and experience data is already in the section from TOML
          return {
            ...section,
            education: (section as { education?: EducationItem[] }).education || [],
            experience: (section as { experience?: ExperienceItem[] }).experience || []
          };
        }
        default:
          return section;
      }
    });
  };

  // Determine which pages to show
  let pagesToShow: PageData[] = [];

  if (enableOnePageMode) {
    pagesToShow = config.navigation
      .filter(item => item.type === 'page')
      .map(item => {
        const rawConfig = getPageConfig(item.target);
        if (!rawConfig) return null;

        const pageConfig = rawConfig as BasePageConfig;

        if (pageConfig.type === 'about' || 'sections' in (rawConfig as object)) {
          return {
            type: 'about',
            id: item.target,
            sections: processSections((rawConfig as { sections: SectionConfig[] }).sections || [])
          } as PageData;
        } else if (pageConfig.type === 'publication') {
          const pubConfig = pageConfig as PublicationPageConfig;
          const bibtex = getBibtexContent(pubConfig.source);
          return {
            type: 'publication',
            id: item.target,
            config: pubConfig,
            publications: parseBibTeX(bibtex)
          } as PageData;
        } else if (pageConfig.type === 'text') {
          const textConfig = pageConfig as TextPageConfig;
          return {
            type: 'text',
            id: item.target,
            config: textConfig,
            content: getMarkdownContent(textConfig.source)
          } as PageData;
        } else if (pageConfig.type === 'card') {
          return {
            type: 'card',
            id: item.target,
            config: pageConfig as CardPageConfig
          } as PageData;
        }
        return null;
      })
      .filter((item): item is PageData => item !== null);
  } else {
    if (aboutConfig) {
      pagesToShow = [{
        type: 'about',
        id: 'about',
        sections: processSections((aboutConfig as { sections: SectionConfig[] }).sections || [])
      }];
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 min-h-screen">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        {/* Left Column - Profile */}
        <div className="lg:col-span-1">
          <Profile
            author={config.author}
            social={config.social}
            features={config.features}
          />
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6 relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-accent/10 blur-3xl animate-float-slow"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-64 -left-10 h-44 w-44 rounded-full bg-sky-400/10 dark:bg-sky-300/10 blur-3xl animate-float-slower"
          />
          {pagesToShow.map((page) => (
            <section key={page.id} id={page.id} className="scroll-mt-24 space-y-5 sm:space-y-6 relative z-10">
              {page.type === 'about' && page.sections.map((section: SectionConfig) => {
                switch (section.type) {
                  case 'markdown':
                    return (
                      <About
                        key={section.id}
                        content={section.content || ''}
                        title={section.title}
                      />
                    );
                  case 'education':
                    return (
                      <EducationExperience
                        key={section.id}
                        education={section.education}
                        experience={section.experience}
                        title={section.title}
                      />
                    );
                  case 'list':
                    return (
                      <News
                        key={section.id}
                        items={section.items || []}
                        title={section.title}
                      />
                    );
                  case 'publications':
                    return (
                      <SelectedPublications
                        key={section.id}
                        publications={section.publications || []}
                        title={section.title}
                        enableOnePageMode={enableOnePageMode}
                      />
                    );
                  default:
                    return null;
                }
              })}
              {page.type === 'publication' && (
                <PublicationsList
                  config={page.config}
                  publications={page.publications}
                  embedded={true}
                />
              )}
              {page.type === 'text' && (
                <TextPage
                  config={page.config}
                  content={page.content}
                  embedded={true}
                />
              )}
              {page.type === 'card' && (
                <CardPage
                  config={page.config}
                  embedded={true}
                />
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
