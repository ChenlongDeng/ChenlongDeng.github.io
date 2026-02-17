'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

export interface EducationItem {
    degree: string;
    institution: string;
    period: string;
    description?: string;
    location?: string;
    logo?: string;
    logoAlt?: string;
}

export interface ExperienceItem {
    title: string;
    organization: string;
    period: string;
    description?: string;
    location?: string;
    logo?: string;
    logoAlt?: string;
}

interface EducationExperienceProps {
    education?: EducationItem[];
    experience?: ExperienceItem[];
    title?: string;
}

function OrganizationLogoBadge({ logo, alt }: { logo?: string; alt?: string }) {
    if (!logo) {
        return null;
    }

    return (
        <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg overflow-hidden bg-white ring-1 ring-neutral-200 dark:ring-neutral-700 dark:bg-neutral-800 transition-transform duration-300 group-hover:scale-[1.04]">
            <Image
                src={logo}
                alt={alt || 'Organization logo'}
                width={44}
                height={44}
                className="h-full w-full object-contain p-1.5"
            />
        </div>
    );
}

export default function EducationExperience({ 
    education, 
    experience, 
    title = 'Education & Experience' 
}: EducationExperienceProps) {
    const educationCardClassName =
        'motion-card surface-card group rounded-xl border border-neutral-200/80 dark:border-neutral-700/70 bg-white/90 dark:bg-neutral-800/70 p-4 sm:px-4 sm:py-3 shadow-sm';

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-5"
        >
            <h2 className="text-[1.42rem] sm:text-[1.35rem] font-serif font-bold text-primary">{title}</h2>
            
            {/* Education Section */}
            {education && education.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-[0.92rem] sm:text-[0.88rem] font-semibold text-primary flex items-center gap-2">
                        <AcademicCapIcon className="h-[1.1rem] w-[1.1rem] text-accent" />
                        Education
                    </h3>
                    <div className="space-y-3">
                        {education.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 * index }}
                                whileHover={{ y: -3, scale: 1.004 }}
                                className={educationCardClassName}
                            >
                                <div className="flex items-start lg:items-center gap-3">
                                    <div className="self-start lg:self-center">
                                        <OrganizationLogoBadge logo={item.logo} alt={item.logoAlt} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="space-y-1.5 lg:hidden">
                                            <h4 className="text-[0.98rem] sm:text-[0.88rem] font-semibold text-primary leading-snug break-words">
                                                {item.institution}
                                            </h4>
                                            <p className="text-[0.9rem] sm:text-[0.78rem] text-neutral-900 dark:text-neutral-200 font-medium leading-snug break-words">
                                                {item.degree}
                                            </p>
                                            {item.location && (
                                                <p className="text-[0.86rem] sm:text-[0.76rem] text-neutral-900 dark:text-neutral-400 leading-snug break-words">
                                                    {item.location}
                                                </p>
                                            )}
                                            <span className="inline-flex w-fit text-[0.82rem] sm:text-[0.72rem] text-accent font-medium whitespace-nowrap px-2.5 py-0.5 rounded-full bg-accent/10 mt-0.5">
                                                {item.period}
                                            </span>
                                        </div>
                                        <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-4 min-w-0">
                                            <div className="min-w-0 flex-1 grid grid-cols-[minmax(220px,2fr)_minmax(220px,1.85fr)_minmax(170px,1.25fr)] items-center gap-x-3">
                                                <h4 className="min-w-0 truncate pr-3 border-r border-neutral-300 dark:border-neutral-600 text-[0.88rem] font-semibold text-primary">
                                                    {item.institution}
                                                </h4>
                                                <p className="min-w-0 truncate pr-3 border-r border-neutral-300 dark:border-neutral-600 text-[0.88rem] text-neutral-900 dark:text-neutral-200 font-medium">
                                                    {item.degree}
                                                </p>
                                                <p className="min-w-0 truncate text-[0.88rem] text-neutral-800 dark:text-neutral-400">
                                                    {item.location || ''}
                                                </p>
                                            </div>
                                            <span className="inline-flex text-[0.72rem] text-accent font-medium whitespace-nowrap px-2.5 py-0.5 rounded-full bg-accent/10">
                                                {item.period}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience Section */}
            {experience && experience.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-[0.92rem] sm:text-[0.88rem] font-semibold text-primary flex items-center gap-2">
                        <BriefcaseIcon className="h-[1.1rem] w-[1.1rem] text-accent" />
                        Experience
                    </h3>
                    <div className="space-y-3">
                        {experience.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 * index }}
                                whileHover={{ y: -3, scale: 1.004 }}
                                className={educationCardClassName}
                            >
                                <div className="flex items-start lg:items-center gap-3">
                                    <div className="self-start lg:self-center">
                                        <OrganizationLogoBadge logo={item.logo} alt={item.logoAlt} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="space-y-1.5 lg:hidden">
                                            <h4 className="text-[0.98rem] sm:text-[0.88rem] font-semibold text-primary leading-snug break-words">
                                                {item.organization}
                                            </h4>
                                            <p className="text-[0.9rem] sm:text-[0.78rem] text-neutral-900 dark:text-neutral-200 font-medium leading-snug break-words">
                                                {item.title}
                                            </p>
                                            {item.location && (
                                                <p className="text-[0.86rem] sm:text-[0.76rem] text-neutral-900 dark:text-neutral-400 leading-snug break-words">
                                                    {item.location}
                                                </p>
                                            )}
                                            <span className="inline-flex w-fit text-[0.82rem] sm:text-[0.72rem] text-accent font-medium whitespace-nowrap px-2.5 py-0.5 rounded-full bg-accent/10 mt-0.5">
                                                {item.period}
                                            </span>
                                        </div>
                                        <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-4 min-w-0">
                                            <div className="min-w-0 flex-1 grid grid-cols-[minmax(220px,2fr)_minmax(220px,1.85fr)_minmax(170px,1.25fr)] items-center gap-x-3">
                                                <h4 className="min-w-0 truncate pr-3 border-r border-neutral-300 dark:border-neutral-600 text-[0.88rem] font-semibold text-primary">
                                                    {item.organization}
                                                </h4>
                                                <p className="min-w-0 truncate pr-3 border-r border-neutral-300 dark:border-neutral-600 text-[0.88rem] text-neutral-900 dark:text-neutral-200 font-medium">
                                                    {item.title}
                                                </p>
                                                <p className="min-w-0 truncate text-[0.88rem] text-neutral-800 dark:text-neutral-400">
                                                    {item.location || ''}
                                                </p>
                                            </div>
                                            <span className="inline-flex text-[0.72rem] text-accent font-medium whitespace-nowrap px-2.5 py-0.5 rounded-full bg-accent/10">
                                                {item.period}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </motion.section>
    );
}
