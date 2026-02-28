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
        <div className="shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-lg overflow-hidden bg-white ring-1 ring-neutral-200 dark:ring-neutral-700 dark:bg-neutral-800 transition-transform duration-300 group-hover:scale-[1.04]">
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

function ItemCard({
    logo, logoAlt, primaryText, secondaryText, location, period
}: {
    logo?: string;
    logoAlt?: string;
    primaryText: string;
    secondaryText: string;
    location?: string;
    period: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2, scale: 1.003 }}
            className="motion-card surface-card group relative rounded-xl border border-neutral-200/70 dark:border-neutral-700/60 bg-white/85 dark:bg-neutral-800/65 p-3.5 sm:p-4 shadow-sm cursor-default z-0 hover:z-10"
        >
            <div className="flex items-center gap-3">
                <OrganizationLogoBadge logo={logo} alt={logoAlt} />
                {/* Mobile layout */}
                <div className="min-w-0 flex-1 lg:hidden">
                    <div className="space-y-0.5">
                        <h4 className="text-[0.88rem] font-semibold text-primary leading-snug truncate">
                            {primaryText}
                        </h4>
                        <p className="text-[0.82rem] text-neutral-600 dark:text-neutral-300 font-medium leading-snug truncate">
                            {secondaryText}
                        </p>
                        <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                            {location && (
                                <p className="text-[0.76rem] text-neutral-500 dark:text-neutral-400">
                                    {location}
                                </p>
                            )}
                            <span className="inline-flex text-[0.7rem] text-accent font-medium whitespace-nowrap px-2 py-0.5 rounded-full bg-accent/10">
                                {period}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Desktop layout */}
                <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-3 min-w-0 flex-1">
                    <div className="min-w-0 flex-1 grid grid-cols-[2fr_1.85fr_1.25fr] items-center gap-x-3">
                        <h4 className="min-w-0 truncate pr-3 border-r border-neutral-200/80 dark:border-neutral-600/50 text-[0.86rem] font-semibold text-primary">
                            {primaryText}
                        </h4>
                        <p className="min-w-0 truncate pr-3 border-r border-neutral-200/80 dark:border-neutral-600/50 text-[0.85rem] text-neutral-600 dark:text-neutral-300 font-medium">
                            {secondaryText}
                        </p>
                        <p className="min-w-0 truncate text-[0.83rem] text-neutral-500 dark:text-neutral-400">
                            {location || ''}
                        </p>
                    </div>
                    <span className="shrink-0 inline-flex text-[0.72rem] text-accent font-medium whitespace-nowrap px-2.5 py-0.5 rounded-full bg-accent/10">
                        {period}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export default function EducationExperience({
    education,
    experience,
    title = 'Education & Experience'
}: EducationExperienceProps) {
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
                    <h3 className="text-[0.9rem] sm:text-[0.86rem] font-semibold text-primary flex items-center gap-1.5">
                        <AcademicCapIcon className="h-4 w-4 text-accent shrink-0" />
                        <span>Education</span>
                    </h3>
                    <div className="space-y-2.5">
                        {education.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 * index }}
                            >
                                <ItemCard
                                    logo={item.logo}
                                    logoAlt={item.logoAlt}
                                    primaryText={item.institution}
                                    secondaryText={item.degree}
                                    location={item.location}
                                    period={item.period}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience Section */}
            {experience && experience.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-[0.9rem] sm:text-[0.86rem] font-semibold text-primary flex items-center gap-1.5">
                        <BriefcaseIcon className="h-4 w-4 text-accent shrink-0" />
                        <span>Experience</span>
                    </h3>
                    <div className="space-y-2.5">
                        {experience.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 * index }}
                            >
                                <ItemCard
                                    logo={item.logo}
                                    logoAlt={item.logoAlt}
                                    primaryText={item.organization}
                                    secondaryText={item.title}
                                    location={item.location}
                                    period={item.period}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </motion.section>
    );
}
