const initialData = {
  auth: {
    isAuthenticated: false,
    user: null,
  },
  couple: {
    names: 'Davi & Nicolly',
    subtitle: 'Wedding Planning',
    photoUrl: '/img/imgcasal.svg', 
    photoDescription: 'Foto de Davi & Nicolly',
  },
  wedding: {
    date: '',
    dateFormatted: '',
    dressPhotoUrl: null,
    tagline: 'Estamos construindo o nosso grande dia, passo a passo, com muito amor.',
  },
  ourStory: [
    {
      id: 'story-1',
      title: 'Nossa História',
      text: 'Davi e Nicolly estão construindo juntos o casamento dos sonhos. Cada detalhe é pensado com muito amor e carinho para tornar esse dia inesquecível.',
      imageUrl: null,
    },
    {
      id: 'story-2',
      title: 'O Grande Dia',
      text: 'Será o dia em que diremos "sim" um para o outro, cercados pelas pessoas que mais amamos.',
      imageUrl: null,
    },
    {
      id: 'story-3',
      title: 'Nossos Sonhos',
      text: 'Uma cerimônia emocionante, uma festa alegre e uma vida inteira de felicidade juntos. Esse é o nosso sonho.',
      imageUrl: null,
    }
  ],
  phases: [
    { id: 'fase-01', number: 1, name: 'O Sonho', icon: 'heart', tasks: [] },
    { id: 'fase-02', number: 2, name: 'Financeiro', icon: 'wallet', tasks: [] },
    { id: 'fase-03', number: 3, name: 'Definindo o casamento', icon: 'settings', tasks: [] },
    { id: 'fase-04', number: 4, name: 'Data, local e convidados', icon: 'calendar', tasks: [] },
    { id: 'fase-05', number: 5, name: 'Fornecedores', icon: 'users', tasks: [] },
    { id: 'fase-06', number: 6, name: 'Trajes e detalhes', icon: 'shirt', tasks: [] },
    { id: 'fase-07', number: 7, name: 'Convites', icon: 'mail', tasks: [] },
    { id: 'fase-08', number: 8, name: 'Casa e Lua de Mel', icon: 'home', tasks: [] },
    { id: 'fase-09', number: 9, name: 'Reta Final', icon: 'flag', tasks: [] },
    { id: 'fase-10', number: 10, name: 'Casados', icon: 'heart-handshake', tasks: [] },
  ],
  finances: { 
    totalBudget: 0, 
    expenses: [], 
    categories: ['Local', 'Fotografia', 'Filmagem', 'Buffet', 'Decoração', 'Trajes', 'Convites', 'Música', 'Doces', 'Outros'] 
  },
  guests: [],
  godparents: [], 
  participants: [], 
  suppliers: [],
  timeline: [],
  home: { 
    items: [], 
    categories: ['Quarto', 'Sala', 'Cozinha', 'Banheiro', 'Lavanderia', 'Outros'] 
  },
  honeymoon: {
    destination: '',
    description: '',
    date: '',
    budget: 0,
    imageUrl: null,
    items: []
  },
  postWedding: { 
    tasks: [] 
  },
};

export default initialData;