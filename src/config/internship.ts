export type InternshipItemType = {
    company: string
    title: string
    logo: string
    location: string
    start: string
    end: string
  }
  
  export const internshipList: Array<InternshipItemType> = [
    {
      company: 'Tencent AI Lab',
      title: 'Research on Efficient Long Context LLMs',
      location: 'Shenzhen, China',
      logo: '/images/logos/TencentAILab.png',
      start: '2024.04',
      end: 'Present'
    }
  ] 