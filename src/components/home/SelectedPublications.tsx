'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Publication } from '@/types/publication';
import { DocumentTextIcon, DocumentIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { formatVenueDisplay } from '@/lib/utils';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title = 'Selected Publications', enableOnePageMode = false }: SelectedPublicationsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-[1.45rem] sm:text-[1.3rem] font-serif font-bold text-primary flex items-center gap-2">
                    <DocumentTextIcon className="h-5 w-5 text-accent" />
                    {title}
                </h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-[0.8rem] sm:text-[0.7rem] font-semibold transition-all duration-200 hover:underline flex items-center gap-1"
                >
                    View All
                    <span className="text-[0.82rem] sm:text-[0.74rem]">→</span>
                </Link>
            </div>
            <div className="space-y-3">
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.08 * index }}
                        className="surface-card p-3.5 sm:p-4 rounded-xl shadow-sm border border-neutral-200/70 dark:border-neutral-700/50 hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex flex-col md:flex-row gap-3.5 sm:gap-5">
                            {pub.preview && (
                                <div className="w-full md:w-48 flex-shrink-0">
                                    <div className="aspect-video md:aspect-[4/3] relative rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                        <Image
                                            src={`/papers/${pub.preview}`}
                                            alt={pub.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 192px"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex-grow min-w-0">
                                <h3 className="text-[0.98rem] sm:text-[0.84rem] font-semibold text-primary mb-1.5 leading-snug">
                                    {pub.title}
                                </h3>
                                <p className="text-[0.86rem] sm:text-[0.74rem] text-neutral-900 dark:text-neutral-300 mb-1.5 leading-relaxed">
                                    {pub.authors.map((author, idx) => (
                                        <span key={idx}>
                                            <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-2 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                                {author.name}
                                            </span>
                                            {author.isCorresponding && (
                                                <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-900 dark:text-neutral-300'}`}>†</sup>
                                            )}
                                            {idx < pub.authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </p>
                                {(pub.url || pub.pdfUrl || pub.code) && (
                                    <div className="mb-2 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                        <span className="inline-flex items-center rounded-full bg-accent/10 text-accent px-2 py-0.5 text-[0.76rem] sm:text-[0.7rem] font-semibold">
                                            {formatVenueDisplay(pub.journal || pub.conference, pub.year)}
                                        </span>
                                        {(pub.url || pub.pdfUrl) && (
                                            <a
                                                href={pub.url || pub.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.76rem] sm:text-[0.7rem] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                            >
                                                <DocumentIcon className="h-3.5 w-3.5 mr-1.5" />
                                                Paper
                                            </a>
                                        )}
                                        {pub.code && (
                                            <a
                                                href={pub.code}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.76rem] sm:text-[0.7rem] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                            >
                                                <CodeBracketIcon className="h-3.5 w-3.5 mr-1.5" />
                                                GitHub
                                            </a>
                                        )}
                                    </div>
                                )}
                                {!(pub.url || pub.pdfUrl || pub.code) && (
                                    <div className="mb-2">
                                        <span className="inline-flex items-center rounded-full bg-accent/10 text-accent px-2 py-0.5 text-[0.76rem] sm:text-[0.7rem] font-semibold">
                                            {formatVenueDisplay(pub.journal || pub.conference, pub.year)}
                                        </span>
                                    </div>
                                )}
                                {pub.description && (
                                    <p className="text-[0.84rem] sm:text-[0.74rem] text-neutral-900 dark:text-neutral-300 line-clamp-3 leading-relaxed">
                                        {pub.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
