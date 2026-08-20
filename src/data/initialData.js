const initialData = {
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
  phases: [
    {
      id: 'fase-01',
      number: 1,
      name: 'O Sonho',
      icon: 'heart',
      tasks: [],
    },
    {
      id: 'fase-02',
      number: 2,
      name: 'Financeiro',
      icon: 'wallet',
      tasks: [],
    },
    {
      id: 'fase-03',
      number: 3,
      name: 'Definindo o casamento',
      icon: 'settings',
      tasks: [],
    },
    {
      id: 'fase-04',
      number: 4,
      name: 'Data, local e convidados',
      icon: 'calendar',
      tasks: [],
    },
    {
      id: 'fase-05',
      number: 5,
      name: 'Fornecedores',
      icon: 'users',
      tasks: [],
    },
    {
      id: 'fase-06',
      number: 6,
      name: 'Trajes e detalhes',
      icon: 'shirt',
      tasks: [],
    },
    {
      id: 'fase-07',
      number: 7,
      name: 'Convites',
      icon: 'mail',
      tasks: [],
    },
    {
      id: 'fase-08',
      number: 8,
      name: 'Casa e Lua de Mel',
      icon: 'home',
      tasks: [],
    },
    {
      id: 'fase-09',
      number: 9,
      name: 'Reta Final',
      icon: 'flag',
      tasks: [],
    },
    {
      id: 'fase-10',
      number: 10,
      name: 'Casados',
      icon: 'heart-handshake',
      tasks: [],
    },
  ],
  finances: {
    totalBudget: 0,
    expenses: [],
    categories: ['Local', 'Fotografia', 'Filmagem', 'Buffet', 'Decoração', 'Trajes', 'Convites', 'Música', 'Doces', 'Outros'],
  },
  guests: [],
  suppliers: [],
  timeline: [],
  home: {
    items: [],
    categories: ['Quarto', 'Sala', 'Cozinha', 'Banheiro', 'Lavanderia', 'Outros'],
  },
  honeymoon: {
    destination: null,
    destinationDescription: 'Foto do destino da nossa lua de mel',
    budget: 0,
    items: [],
  },
  postWedding: {
    tasks: [],
  },
};

export default initialData;