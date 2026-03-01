'use client';

import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { Fragment, ReactNode } from 'react';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title = 'News' }: NewsProps) {
    const renderContent = (content: string) => {
        const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
        const nodes: ReactNode[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = linkRegex.exec(content)) !== null) {
            const [fullMatch, label, href] = match;
            const startIndex = match.index;

            if (startIndex > lastIndex) {
                nodes.push(content.slice(lastIndex, startIndex));
            }

            nodes.push(
                <a
                    key={`${href}-${startIndex}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline underline-offset-2"
                >
                    {label}
                </a>
            );

            lastIndex = startIndex + fullMatch.length;
        }

        if (lastIndex < content.length) {
            nodes.push(content.slice(lastIndex));
        }

        return nodes.length > 0 ? nodes : [content];
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <h2 className="text-[1.5rem] sm:text-[1.35rem] font-serif font-bold text-primary mb-3 flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-accent" />
                {title}
            </h2>
            <div className="motion-card surface-card space-y-2 rounded-xl p-3.5 shadow-sm border border-neutral-200/70 dark:border-neutral-700/60">
                {items.slice(0, 5).map((item, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                        whileHover={{ x: 3 }}
                        className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-2 pb-2 last:pb-0 border-b border-neutral-200 dark:border-neutral-700/70 last:border-0"
                    >
                        <span className="inline-flex w-fit text-[0.74rem] sm:text-[0.64rem] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-md whitespace-nowrap sm:mt-0.5 transition-colors duration-200">
                            {item.date}
                        </span>
                        <p className="text-[0.9rem] sm:text-[0.8rem] text-neutral-900 dark:text-neutral-200 leading-relaxed flex-1">
                            {renderContent(item.content).map((node, idx) => (
                                <Fragment key={idx}>{node}</Fragment>
                            ))}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
