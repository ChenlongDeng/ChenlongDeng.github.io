// changelog
export const changelogHeadLine = "What's new about this site"
export const changelogIntro = "Check out the latest changes to this site."


// changelog
export type ChangelogItemType = {
  date: string
  content: [{
    title: string
    description: string
  }]
}

export const changelogList: Array<ChangelogItemType> = [
  {
    date: '2024-11-18',
    content: [
      {
        title: '💡 Idea come up',
        description: 'I want to have a portfolio websit. The website doesn\'t need to be so fancy but should have a good design. It need to show all my projects and have a blog section to share my ideas and my development experience.'
      },
    ]
  },
  {
    date: '2024-11-22',
    content: [
      {
        title: '🛫 Project deployed',
        description: 'My portfolio website\'s first version finished building and deployed'
      },
    ]
  },
  {
    date: '2024-12-10',
    content: [
      {
        title: '👭 Add friends page',
        description: 'Add friends page to list my friends'
      },
    ]
  },
  {
    date: '2024-12-23',
    content: [
      {
        title: '🐍 Add GitHub Contribution snake',
        description: 'Add GitHub Contribution snake to showcase my GitHub contribution in a funny way'
      },
    ]
  },
  {
    date: '2024-12-24',
    content: [
      {
        title: '📦 Add resources page',
        description: 'Add resources page to list my using and recommended resources'
      },
    ]
  },
  {
    date: '2024-12-25',
    content: [
      {
        title: '🐦‍⬛ Add activity section',
        description: 'Add activity section to showcase my activity snippets'
      },
    ]
  }
]