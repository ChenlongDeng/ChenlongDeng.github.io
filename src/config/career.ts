
// career
export type CareerItemType = {
    company: string
    title: string
    image?: string
    logo: string
    start: string
    end: string
  }
  
  
  
  export const careerList: Array<CareerItemType> = [
    {
      company: 'Somewhere Financial Inc.',
      title: 'Software Engineer',
      logo: 'bank',
      start: '2020',
      end: 'Present'
    },
  ]