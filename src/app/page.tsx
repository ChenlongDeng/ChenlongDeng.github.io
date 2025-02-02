import { Container } from '@/components/layout/Container'
import Newsletter from '@/components/home/Newsletter'
import Feed from '@/components/home/Feed'
import Career from '@/components/home/Career'
import Education from '@/components/home/Education'
import Internship from '@/components/home/Internship'
import SocialLinks from '@/components/home/SocialLinks'
import { headline, introduction } from '@/config/infoConfig'
import { BlogCard } from '@/components/home/BlogCard'
import { getAllBlogs, type BlogType } from '@/lib/blogs'
import { ProjectCard } from '@/components/project/ProjectCard'
import { GithubProjectCard } from '@/components/project/GithubProjectCard'
import { projectHeadLine, projectIntro, projects, githubProjects, blogHeadLine, blogIntro, techIcons, activityHeadLine, activityIntro } from '@/config/infoConfig'
import GithubContributions from '@/components/home/GithubCalendar'
import GitHubSnake from '@/components/home/GitHubSnake'
import { CustomIcon } from '@/components/shared/CustomIcon'
import IconCloud from "@/components/ui/icon-cloud";
import { TweetGrid } from "@/components/home/TweetGrid";
import Image from "next/image";
import portraitImage from '@/images/portrait.jpg'
import Publication from '@/components/home/Publications'

export default async function Home() {
  let blogList = (await getAllBlogs()).slice(0, 4)
  // console.log('blogList: ', blogList)

  return (
    <>
      <Container className="mt-9">
        {/* personal info */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2">
          <div className='md:mt-20'>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl opacity-80">
              {headline}
            </h2>
            <p 
              className="mt-6 text-base text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: introduction }}
            />
            <SocialLinks className='md:mt-24'/>
          </div>
          <div className="relative mt-8 md:mt-0">
            <div className="max-w-xs px-12 lg:max-w-none mx-auto">
              <Image
                src={portraitImage}
                alt="Portrait"
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
              />
            </div>
          </div>
        </div>
        {/* education */}
        <div id="education" className="mx-auto flex flex-col max-w-xl gap-4 lg:max-w-none mt-8">
          <Education />
        </div>
        {/* internship */}
        <div className="mx-auto flex flex-col max-w-xl gap-4 lg:max-w-none mt-2">
          <Internship />
        </div>
        {/* publications */}
        <div id="publications" className="mx-auto flex flex-col max-w-xl gap-4 lg:max-w-none mt-2">
          <Publication />
        </div>
        {/* github contributions */}
        <div className="mx-auto flex flex-col max-w-xl gap-4 lg:max-w-none mt-2">
          <GithubContributions />
        </div>
      </Container>
    </>
  )
}
