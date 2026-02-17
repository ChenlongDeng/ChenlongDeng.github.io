'use client';

import { motion } from 'framer-motion';
import { CardPageConfig } from '@/types/page';

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-3" : "mb-6"}>
                <h1 className={`${embedded ? "text-[1.45rem]" : "text-[2rem]"} font-serif font-bold text-primary mb-3`}>{config.title}</h1>
                {config.description && (
                    <p className={`${embedded ? "text-[0.86rem]" : "text-[0.96rem]"} text-neutral-900 dark:text-neutral-400 max-w-2xl`}>
                        {config.description}
                    </p>
                )}
            </div>

            <div className={`grid ${embedded ? "gap-3" : "gap-4"}`}>
                {config.items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className={`surface-card bg-white dark:bg-neutral-900 ${embedded ? "p-3.5" : "p-4"} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
                    >
                        <div className="flex justify-between items-start mb-1.5">
                            <h3 className={`${embedded ? "text-[0.92rem]" : "text-[1.04rem]"} font-semibold text-primary`}>{item.title}</h3>
                            {item.date && (
                                <span className="text-[0.74rem] text-neutral-800 dark:text-neutral-400 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                                    {item.date}
                                </span>
                            )}
                        </div>
                        {item.subtitle && (
                            <p className={`${embedded ? "text-[0.76rem]" : "text-[0.84rem]"} text-accent font-medium mb-2.5`}>{item.subtitle}</p>
                        )}
                        {item.content && (
                            <p className={`${embedded ? "text-[0.76rem]" : "text-[0.84rem]"} text-neutral-900 dark:text-neutral-400 leading-relaxed`}>
                                {item.content}
                            </p>
                        )}
                        {item.tags && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
