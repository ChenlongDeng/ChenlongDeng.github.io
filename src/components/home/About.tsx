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
            className="space-y-2.5"
        >
            <h2 className="text-[1.35rem] font-serif font-bold text-primary mb-1">{title}</h2>
            <div className="motion-card surface-card rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80 bg-white/85 dark:bg-neutral-800/65 backdrop-blur-sm p-3.5 sm:p-4 text-neutral-900 dark:text-neutral-300 leading-[1.62] text-[0.84rem] shadow-sm">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="text-lg font-serif font-bold text-primary mt-4 mb-2.5">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-[0.9rem] font-serif font-bold text-primary mt-4 mb-2 border-b border-neutral-200 dark:border-neutral-700 pb-1.5">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-[0.84rem] font-semibold text-primary mt-3.5 mb-1.5">{children}</h3>,
                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5 ml-3">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5 ml-3">{children}</ol>,
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
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-3 text-neutral-800 dark:text-neutral-300/90">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-800 dark:text-neutral-300/90">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.section>
    );
}
