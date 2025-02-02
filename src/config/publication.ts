export type PublicationType = {
    title: string
    description?: string
    conference: string
    image: string
    links?: Array<{
      text: string
      url: string
    }>
  }
  
  export const publicationList: Array<PublicationType> = [
    {
      title: "A Silver Bullet or a Compromise for Full Attention? A Comprehensive Study of Gist Token-based Context Compression",
    //   description: "Description: Brief description of your paper and its contributions.",
      conference: "Preprint",
      image: "/images/publications/GistStudy.png",
      links: [
        {
          text: "ArXiv Preprint",
          url: "https://arxiv.org/abs/2412.17483"
        },
      ]
    },
    {
      title: "Attention Entropy is a Key Factor: An Analysis of Parallel Context Encoding with Full-attention-based Pre-trained Language Models",
    //   description: "Description: Brief description of your paper and its contributions.",
      conference: "Preprint",
      image: "/images/publications/AttentionEntropy.png",
      links: [
        {
          text: "ArXiv Preprint",
          url: "https://arxiv.org/abs/2412.16545"
        },
      ]
    },
    {
      title: "Learning Interpretable Legal Case Retrieval via Knowledge-Guided Case Reformulation",
      conference: "EMNLP 2024 (Main)",
      image: "/images/publications/KELLER.png",
      links: [
        {
          text: "Conference Version",
          url: "https://aclanthology.org/2024.emnlp-main.73/"
        },
        {
            text: "ArXiv Preprint",
            url: "https://arxiv.org/abs/2406.19760"
        },
      ]
    },
    {
        title: "ChatRetriever: Adapting Large Language Models for Generalized and Robust Conversational Dense Retrieval",
        conference: "EMNLP 2024 (Main)",
        image: "/images/publications/ChatRetriever.png",
        links: [
            {
                text: "Conference Version",
                url: "https://aclanthology.org/2024.emnlp-main.100/"
            },
        ]
    }
  ] 