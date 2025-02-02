// site config
export const utm_source = process.env.NEXT_PUBLIC_UTM_SOURCE


// navigation config
type NavItemType = {
  name: string
  href: string
}

export const footerItems: Array<NavItemType> = [
  {
    name: 'Home',
    href: '/'
  },
  {
    name: 'About',
    href: '#education'
  },
  {
    name: 'Publications',
    href: '#publications'
  },
]

export const navItems: Array<NavItemType> = [
  {
    name: 'Home',
    href: '/'
  },
  {
    name: 'About',
    href: '#education'
  },
  {
    name: 'Publications',
    href: '#publications'
  }
]
