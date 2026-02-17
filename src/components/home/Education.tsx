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
        'motion-card surface-card group rounded-xl border border-neutral-200/80 dark:border-neutral-700/70 bg-white/90 dark:bg-neutral-800/70 px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm';

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-7"
        >
            <h2 className="text-[1.65rem] font-serif font-bold text-primary">{title}</h2>
            
            {/* Education Section */}
            {education && education.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-base font-semibold text-primary flex items-center gap-2">
                        <AcademicCapIcon className="h-[1.1rem] w-[1.1rem] text-accent" />
                        Education
                    </h3>
                    <div className="space-y-4">
                        {education.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 * index }}
                                whileHover={{ y: -3, scale: 1.004 }}
                                className={educationCardClassName}
                            >
                                <div className="flex items-center gap-3.5">
                                    <OrganizationLogoBadge logo={item.logo} alt={item.logoAlt} />
                                    <div className="min-w-0 flex-1 flex flex-wrap items-center justify-between gap-2">
                                        <div className="min-w-0 flex flex-wrap items-center gap-x-2 gap-y-1">
                                            <h4 className="text-[0.96rem] sm:text-[1rem] font-semibold text-primary leading-tight">
                                                {item.institution}
                                            </h4>
                                            <span className="text-neutral-400 dark:text-neutral-500">|</span>
                                            <p className="text-[0.82rem] sm:text-[0.86rem] text-neutral-700 dark:text-neutral-200 font-medium">
                                                {item.degree}
                                            </p>
                                            {item.location && (
                                                <>
                                                    <span className="text-neutral-400 dark:text-neutral-500">|</span>
                                                    <p className="text-[0.8rem] sm:text-[0.84rem] text-neutral-500 dark:text-neutral-400">
                                                        {item.location}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        <span className="text-[0.75rem] sm:text-[0.8rem] text-accent font-medium whitespace-nowrap px-2.5 py-1 rounded-full bg-accent/10">
                                            {item.period}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience Section */}
            {experience && experience.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-base font-semibold text-primary flex items-center gap-2">
                        <BriefcaseIcon className="h-[1.1rem] w-[1.1rem] text-accent" />
                        Experience
                    </h3>
                    <div className="space-y-4">
                        {experience.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 * index }}
                                whileHover={{ y: -3, scale: 1.004 }}
                                className={educationCardClassName}
                            >
                                <div className="flex items-center gap-3.5">
                                    <OrganizationLogoBadge logo={item.logo} alt={item.logoAlt} />
                                    <div className="min-w-0 flex-1 flex flex-wrap items-center justify-between gap-2">
                                        <div className="min-w-0 flex flex-wrap items-center gap-x-2 gap-y-1">
                                            <h4 className="text-[0.96rem] sm:text-[1rem] font-semibold text-primary leading-tight">
                                                {item.organization}
                                            </h4>
                                            <span className="text-neutral-400 dark:text-neutral-500">|</span>
                                            <p className="text-[0.82rem] sm:text-[0.86rem] text-neutral-700 dark:text-neutral-200 font-medium">
                                                {item.title}
                                            </p>
                                            {item.location && (
                                                <>
                                                    <span className="text-neutral-400 dark:text-neutral-500">|</span>
                                                    <p className="text-[0.8rem] sm:text-[0.84rem] text-neutral-500 dark:text-neutral-400">
                                                        {item.location}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        <span className="text-[0.75rem] sm:text-[0.8rem] text-accent font-medium whitespace-nowrap px-2.5 py-1 rounded-full bg-accent/10">
                                            {item.period}
                                        </span>
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
