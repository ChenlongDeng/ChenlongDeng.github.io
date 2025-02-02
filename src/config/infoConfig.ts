export * from './projects'
export * from './friends'
export * from './changelog'
export * from './education'
export * from './career'
export * from './activity'
export * from './internship'
export * from './publication'

// personal info
export const name = 'Chenlong Deng';
export const chinese_name = '邓琛龙';
export const headline = '';
export const introduction = 
  `Chenlong Deng is a third-year PhD student at the Gaoling School of Artificial Intelligence, Renmin University of China, under the supervision of <a href="http://playbigdata.ruc.edu.cn/dou/" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 transition-colors">Prof. Zhicheng Dou</a>. His research primarily focuses on large language models and information retrieval. Currently, his work is centered on developing sparsity-based efficient long-context large language models.`;
export const email = 'dengchenlong@ruc.edu.cn'
export const githubUsername = 'ChenlongDeng'

// about page
export const aboutMeHeadline = "I'm Corey Chiu, a software engineer based in Shenzhen, China."
export const aboutParagraphs = [
  "I love coding. I learned programming when I in college. I wrote my first program in Java when I was 18.",
  "I have a lot of hobbies, such as travelling, photography, watching movies, music and so on.",
  "I'm working as a software develop engineer in Shenzhen, China now. And I'm building a lot of side projects in my spare time."
]


// blog
export const blogHeadLine = "What I've thinking about."
export const blogIntro = "I've written something about AI, programming and life."


// social links
export type SocialLinkType = {
  name: string,
  ariaLabel?: string,
  icon: string,
  href: string
}

export const socialLinks: Array<SocialLinkType> = [
  {
    name: 'Github',
    icon: 'github',
    href: 'https://github.com/ChenlongDeng'
  },
]

// https://simpleicons.org/
export const techIcons = [
  "typescript",
  "javascript",
  "supabase",
  "cloudflare",
  "java",
  "oracle",
  "mysql",
  "react",
  "nodedotjs",
  "nextdotjs",
  "prisma",
  "postgresql",
  "nginx",
  "vercel",
  "docker",
  "git",
  "github",
  "visualstudiocode",
  "androidstudio",
  "ios",
  "apple",
  "wechat"
];



