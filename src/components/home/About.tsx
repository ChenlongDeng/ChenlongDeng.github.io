'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface AboutProps {
    content: string;
    title?: string;
}

export default function About({ content, title = 'About' }: AboutProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3"
        >
            <h2 className="text-[1.65rem] font-serif font-bold text-primary mb-1">{title}</h2>
            <div className="motion-card surface-card rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80 bg-white/85 dark:bg-neutral-800/65 backdrop-blur-sm p-4 sm:p-5 text-neutral-700 dark:text-neutral-300 leading-[1.7] text-[0.95rem] shadow-sm">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="text-2xl font-serif font-bold text-primary mt-5 mb-3">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-lg font-serif font-bold text-primary mt-5 mb-2.5 border-b border-neutral-200 dark:border-neutral-700 pb-1.5">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-base font-semibold text-primary mt-4 mb-2">{children}</h3>,
                        p: ({ children }) => <p className="mb-2.5 last:mb-0 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2.5 space-y-1 ml-3">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2.5 space-y-1 ml-3">{children}</ol>,
                        li: ({ children }) => <li className="mb-0.5">{children}</li>,
                        a: ({ ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent font-medium transition-all duration-200 hover:underline hover:text-accent-dark"
                            />
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-3 text-neutral-600 dark:text-neutral-300/90">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-300/90">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.section>
    );
}
