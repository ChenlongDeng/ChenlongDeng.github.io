'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { TextPageConfig } from '@/types/page';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    embedded?: boolean;
}

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={embedded ? "" : "max-w-3xl mx-auto"}
        >
            <h1 className={`${embedded ? "text-[1.45rem]" : "text-[2rem]"} font-serif font-bold text-primary mb-3`}>{config.title}</h1>
            {config.description && (
                <p className={`${embedded ? "text-[0.86rem]" : "text-[0.96rem]"} text-neutral-900 dark:text-neutral-400 mb-6 max-w-2xl`}>
                    {config.description}
                </p>
            )}
            <div className="text-neutral-900 dark:text-neutral-300 leading-relaxed text-[0.86rem]">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="text-[1.52rem] font-serif font-bold text-primary mt-7 mb-3">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-[1.2rem] font-serif font-bold text-primary mt-7 mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-[0.98rem] font-semibold text-primary mt-5 mb-2.5">{children}</h3>,
                        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        a: ({ ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent font-medium hover:underline transition-colors"
                            />
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-800 dark:text-neutral-400">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-800 dark:text-neutral-400">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
}
