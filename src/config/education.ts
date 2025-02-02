// education 
export type EducationItemType = {
    school: string
    major: string
    degree: string
    image?: string
    logo: string
    start: string
    end: string
  }
  
  
  
  export const educationList: Array<EducationItemType> = [
    {
      school: 'Renmin University of China',
      major: 'Artificial Intelligence',
      degree: 'Ph.D.',
      logo: '/images/logos/RUC.png',
      start: '2022',
      end: 'Present'
    },
    {
      school: 'Renmin University of China',
      major: 'Computer Science and Technology',
      degree: 'B.Eng.',
      logo: '/images/logos/RUC.png',
      start: '2018',
      end: '2022'
    },
  ]