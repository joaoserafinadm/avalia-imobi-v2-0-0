/* ─────────────────────────────────────────────
   Roteiros dos guias interativos (driver.js)

   Cada chave corresponde a uma página. Para adicionar
   o guia a uma nova página, crie uma chave aqui e use
   <GuideTour tour="chaveDaPagina" /> na página.

   element  – seletor CSS do elemento destacado
   side     – lado preferido do balão em relação ao elemento

   Telas com abas usam um roteiro por aba, com o seu próprio
   botão dentro da aba: assim nenhum passo precisa trocar de
   aba no meio do caminho, o que atrapalha o posicionamento
   do balão. Veja clientInfo e clientValuation.

   Passos cujo elemento não existir ou estiver oculto são
   descartados automaticamente pelo componente GuideTour.
   É o caso do menu lateral (oculto no mobile) e da barra
   de menu inferior (oculta no desktop): cada um aparece
   apenas onde faz sentido.

   Quando não há espaço livre ao redor do elemento — cartões
   mais altos que a janela, por exemplo — o driver.js exibe
   o balão centralizado na parte inferior da tela, sem seta.
───────────────────────────────────────────── */

export const tours = {

    /* ── Página inicial ── */
    index: {
        title: 'Guia da página inicial',
        steps: [
            {
                element: '#tourNavbar',
                popover: {
                    title: 'Menu de navegação',
                    description: 'Utilize o menu lateral para acessar as áreas do sistema: imóveis, usuários, sua imobiliária e as configurações da conta.',
                    side: 'right',
                    align: 'start',
                },
            },
            {
                element: '#tourMenuBar',
                popover: {
                    title: 'Barra de navegação',
                    description: 'A barra inferior dá acesso rápido às principais áreas do sistema. Em "Opções" você encontra as demais páginas e as configurações da conta.',
                    side: 'top',
                    align: 'center',
                },
            },
            {
                element: '#tourNotifications',
                popover: {
                    title: 'Notificações',
                    description: 'Aqui são exibidos os avisos do sistema, como novos cadastros de imóveis e avaliações concluídas. O número indica quantas notificações ainda não foram lidas.',
                    side: 'bottom',
                    align: 'end',
                },
            },
            {
                element: '#tourClientsCard',
                popover: {
                    title: 'Imóveis e resultados',
                    description: 'Este painel reúne os seus números: total de clientes, avaliações realizadas, nota de atendimento e ticket médio. Clique em "Acessar" para ver a lista completa de imóveis.',
                    side: 'right',
                    align: 'start',
                },
            },
            {
                element: '#tourLastClients',
                popover: {
                    title: 'Últimos imóveis cadastrados',
                    description: 'Exibe os imóveis cadastrados mais recentemente. Utilize este atalho para retomar rapidamente um trabalho em andamento.',
                    side: 'right',
                    align: 'start',
                },
            },
            {
                element: '#tourUsersCard',
                popover: {
                    title: 'Usuários da imobiliária',
                    description: 'Acompanhe o desempenho da equipe e identifique os destaques em captações e avaliações no período.',
                    side: 'left',
                    align: 'start',
                },
            },
            {
                element: '#tourGeralButtons',
                popover: {
                    title: 'Atalhos gerais',
                    description: 'Acesso rápido ao seu perfil, aos dados da imobiliária, às configurações da conta e aos tutoriais da plataforma.',
                    side: 'top',
                    align: 'center',
                },
            },
            {
                element: '#tourGuideButton',
                popover: {
                    title: 'Guia sempre disponível',
                    description: 'Este botão reabre o guia a qualquer momento. Para ocultá-lo em todas as páginas, desative a opção "Guias interativos" em Configurações.',
                    side: 'bottom',
                    align: 'end',
                },
            },
        ],
    },

    /* ── Gestão de Imóveis ── */
    clientsManagement: {
        title: 'Guia da gestão de imóveis',
        steps: [
            // {
            //     element: '#tourNavbar',
            //     popover: {
            //         title: 'Menu de navegação',
            //         description: 'Utilize o menu lateral para alternar entre as áreas do sistema sem sair desta página.',
            //         side: 'right',
            //         align: 'start',
            //     },
            // },
            {
                element: '#tourClientsAdd',
                popover: {
                    title: 'Adicionar imóvel',
                    description: 'Inicie aqui o cadastro de um novo imóvel. Após o cadastro, o imóvel fica disponível nesta lista para avaliação.',
                    side: 'bottom',
                    align: 'end',
                },
            },
            {
                element: '#tourClientsFilters',
                popover: {
                    title: 'Filtros de busca',
                    description: 'Abre o painel de filtros, onde é possível pesquisar por nome, ordenar a lista e filtrar por tipo de imóvel e por situação da avaliação.',
                    side: 'bottom',
                    align: 'end',
                },
            },
            {
                element: '#tourClientsSections',
                popover: {
                    title: 'Meus clientes e todos os clientes',
                    description: 'Alterne entre os imóveis cadastrados por você e os imóveis de toda a imobiliária.',
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#tourClientsList',
                popover: {
                    title: 'Lista de imóveis',
                    description: 'Os imóveis são exibidos em cartões, oito por página. Utilize a paginação ao final da lista para acessar os demais registros.',
                    side: 'top',
                    align: 'center',
                },
            },
            {
                element: '#tourClientCard',
                popover: {
                    title: 'Cartão do imóvel',
                    description: 'Cada cartão representa um imóvel cadastrado. Na parte superior ficam as fotos enviadas, o tipo do imóvel e o corretor responsável pelo cadastro. Abaixo são exibidos o nome do cliente, as características do imóvel, o valor estimado — quando a avaliação já foi concluída — e a data do cadastro.',
                    side: 'right',
                    align: 'start',
                },
            },
            {
                element: '#tourClientStatus',
                popover: {
                    title: 'Situação da avaliação',
                    description: 'Esta etiqueta indica a etapa em que o imóvel se encontra: "Aguardando cadastro do imóvel", quando o cliente ainda não preencheu o formulário; "Aguardando avaliação", quando os dados estão completos e o imóvel pode ser avaliado; "Avaliado", quando a avaliação foi concluída; e "Respondido", quando o cliente já respondeu à avaliação enviada.',
                    side: 'right',
                    align: 'start',
                },
            },
            {
                element: '#tourClientActions',
                popover: {
                    title: 'Ações do imóvel',
                    description: 'Os botões variam conforme a situação. Enquanto o cadastro não é concluído, é possível reenviar o formulário ao cliente, editar os dados e excluir o registro. Após o cadastro, ficam disponíveis a visualização completa, o compartilhamento da avaliação, o download do PDF e a exclusão. Passe o cursor sobre cada botão para ver a sua função.',
                    side: 'right',
                    align: 'start',
                },
            },
            {
                element: '#tourGuideButton',
                popover: {
                    title: 'Guia sempre disponível',
                    description: 'Este botão reabre o guia a qualquer momento. Para ocultá-lo em todas as páginas, desative a opção "Guias interativos" em Configurações.',
                    side: 'bottom',
                    align: 'end',
                },
            },
        ],
    },

    /* ── Modal do imóvel — aba Informações ── */
    clientInfo: {
        title: 'Guia das informações do imóvel',
        steps: [
            {
                element: '#tourClientModalTabs',
                popover: {
                    title: 'Informações e avaliação',
                    description: 'Esta janela reúne tudo sobre o imóvel, dividido em duas abas. Em "Informações" ficam os dados do cadastro; em "Avaliação", o resultado da avaliação e as opções de envio ao cliente. Cada aba tem o seu próprio guia.',
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#tourClientModalNoValuation',
                popover: {
                    title: 'Imóvel ainda sem avaliação',
                    description: 'Este aviso aparece enquanto o imóvel não foi avaliado. O botão "Avaliar imóvel" abre a tela de avaliação, onde o valor de mercado é calculado a partir de imóveis semelhantes.',
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#tourClientModalGallery',
                popover: {
                    title: 'Fotos do imóvel',
                    description: 'Imagens enviadas no cadastro. Utilize as setas para percorrer a galeria. As fotos também aparecem na avaliação enviada ao cliente, portanto vale conferir se estão adequadas.',
                    side: 'bottom',
                    align: 'center',
                },
            },
            {
                element: '#tourClientModalHeader',
                popover: {
                    title: 'Cliente e contato',
                    description: 'Nome do cliente e formas de contato. O botão do telefone abre a conversa no WhatsApp e o do e-mail abre o seu aplicativo de e-mail com o endereço preenchido. Em "Editar" é possível corrigir qualquer dado do cadastro.',
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#tourClientModalFeatures',
                popover: {
                    title: 'Características do imóvel',
                    description: 'Áreas, quartos, banheiros, suítes e vagas informados no cadastro. Os campos variam conforme o tipo do imóvel: um terreno exibe apenas a área total, enquanto um apartamento exibe também os cômodos. Havendo avaliação concluída, o valor estimado aparece em destaque.',
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#tourClientModalGeneral',
                popover: {
                    title: 'Características gerais',
                    description: 'Itens adicionais informados pelo cliente no formulário, como piscina, churrasqueira ou móveis planejados. Esses diferenciais ajudam a justificar o valor apurado na avaliação.',
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#tourClientModalComments',
                popover: {
                    title: 'Observações',
                    description: 'Campo livre preenchido durante o cadastro, com informações que não se encaixam nos demais campos. Para alterá-lo, utilize o botão "Editar" no topo da janela.',
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#tourClientModalLocation',
                popover: {
                    title: 'Localização',
                    description: 'Endereço completo e posição do imóvel no mapa. A localização é determinante no cálculo: a avaliação compara o imóvel com anúncios da mesma região.',
                    side: 'top',
                    align: 'start',
                },
            },
            {
                element: '#tourGuideButton',
                popover: {
                    title: 'Guia desta aba',
                    description: 'Este botão reabre o guia da aba a qualquer momento. Cada aba tem o seu próprio guia. Para ocultá-los em todo o sistema, desative a opção "Guias interativos" em Configurações.',
                    side: 'bottom',
                    align: 'end',
                },
            },
        ],
    },

    /* ── Modal do imóvel — aba Avaliação ── */
    clientValuation: {
        title: 'Guia da avaliação do imóvel',
        steps: [
            {
                element: '#tourValuationEmpty',
                popover: {
                    title: 'Avaliação do imóvel',
                    description: 'Enquanto nenhuma avaliação for realizada, esta aba exibe apenas o atalho para iniciar o processo. Depois de concluída, passa a mostrar o valor apurado, os imóveis comparados e as opções de envio ao cliente.',
                    side: 'bottom',
                    align: 'center',
                },
            },
            {
                element: '#tourValuationActions',
                popover: {
                    title: 'Ações da avaliação',
                    description: 'Em "Compartilhar" você obtém o link para enviar ao cliente; "Baixar PDF" gera o documento da avaliação; e "Editar avaliação" reabre o cálculo para ajustar os imóveis comparados ou o valor final.',
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#tourValuationStatus',
                popover: {
                    title: 'Status da avaliação',
                    description: 'Indica em que ponto do processo a avaliação está: concluída e pronta para envio, enviada ao cliente ou já respondida. Quando o cliente responde, o valor escolhido por ele e a avaliação do atendimento aparecem logo abaixo.',
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#tourValuationSelectedValue',
                popover: {
                    title: 'Valor escolhido pelo cliente',
                    description: 'Aparece somente depois que o cliente responde. Mostra qual das opções ele escolheu — venda a curto prazo, valor ideal, venda a longo prazo ou um valor próprio — e a justificativa que ele registrou. Em "Alterar valor" você pode gravar um valor negociado, que passa a ser o valor de referência do imóvel.',
                    side: 'top',
                    align: 'start',
                },
            },
            {
                element: '#tourValuationService',
                popover: {
                    title: 'Avaliação do atendimento',
                    description: 'Nota de uma a cinco estrelas e comentário deixados pelo cliente sobre o seu atendimento. Essa nota compõe a média exibida no painel da página inicial.',
                    side: 'top',
                    align: 'start',
                },
            },
            {
                element: '#tourValuationEvaluator',
                popover: {
                    title: 'Responsável pela avaliação',
                    description: 'Corretor que realizou a avaliação. Em imobiliárias com mais de um usuário, este campo identifica quem conduziu o trabalho.',
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#tourValuationCalc',
                popover: {
                    title: 'Cálculo do valor',
                    description: 'Resumo do cálculo pelo método comparativo direto: o valor do metro quadrado dos imóveis semelhantes é aplicado à área deste imóvel, com os ajustes definidos durante a avaliação, chegando ao valor de mercado sugerido.',
                    side: 'top',
                    align: 'start',
                },
            },
            {
                element: '#tourValuationProperties',
                popover: {
                    title: 'Imóveis comparados',
                    description: 'Relação dos imóveis semelhantes utilizados como referência. Cada cartão traz o valor, a área e o link do anúncio de origem, permitindo conferir a base do cálculo a qualquer momento.',
                    side: 'top',
                    align: 'start',
                },
            },
            {
                element: '#tourGuideButton',
                popover: {
                    title: 'Guia desta aba',
                    description: 'Este botão reabre o guia da aba a qualquer momento. Cada aba tem o seu próprio guia. Para ocultá-los em todo o sistema, desative a opção "Guias interativos" em Configurações.',
                    side: 'bottom',
                    align: 'end',
                },
            },
        ],
    },

    /* ── Cadastro de imóvel ── */
    clientAdd: {
        title: 'Guia do cadastro de imóvel',
        steps: [
            {
                element: '#tourClientAddClient',
                popover: {
                    title: 'Dados do cliente',
                    description: 'Comece identificando o proprietário do imóvel. Nome e celular são obrigatórios; o celular é utilizado para enviar o formulário de cadastro e, depois, a avaliação pronta. Sobrenome e e-mail são opcionais.',
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#tourClientAddType',
                popover: {
                    title: 'Tipo de imóvel',
                    description: 'Escolha entre Apartamento, Casa, Comercial e Terreno. Esta escolha define quais campos serão pedidos a seguir: um terreno pede apenas as medidas, enquanto um apartamento pede também quartos, suítes e andar. O formulário completo só aparece depois desta seleção.',
                    side: 'bottom',
                    align: 'start',
                },
            },
            {
                element: '#tourClientAddDetails',
                popover: {
                    title: 'Características do imóvel',
                    description: 'Medidas e cômodos do imóvel. A área total é obrigatória por ser a base do cálculo: a avaliação parte do valor do metro quadrado de imóveis semelhantes e o aplica a esta área. Quanto mais campos preenchidos, mais precisa fica a comparação.',
                    side: 'top',
                    align: 'start',
                },
            },
            {
                element: '#tourClientAddFeatures',
                popover: {
                    title: 'Informações gerais',
                    description: 'Marque os diferenciais do imóvel, como piscina, churrasqueira ou vaga de garagem. A lista muda conforme o tipo escolhido. No campo de observações, registre o que não se encaixa nos demais campos — esses itens ajudam a justificar o valor apurado.',
                    side: 'top',
                    align: 'start',
                },
            },
            {
                element: '#tourClientAddLocation',
                popover: {
                    title: 'Localização',
                    description: 'Digite o endereço e selecione uma das sugestões apresentadas: é a seleção que preenche o endereço completo e marca o imóvel no mapa. Sem escolher uma sugestão, o endereço não é confirmado. A localização determina quais imóveis entram na comparação.',
                    side: 'top',
                    align: 'start',
                },
            },
            {
                element: '#tourClientAddFiles',
                popover: {
                    title: 'Fotos do imóvel',
                    description: 'Arraste as imagens ou clique para selecioná-las. É possível reordenar as fotos arrastando: a primeira delas é a capa exibida no cartão do imóvel e na avaliação enviada ao cliente.',
                    side: 'top',
                    align: 'start',
                },
            },
            {
                element: '#tourClientAddFooter',
                popover: {
                    title: 'Salvar o cadastro',
                    description: 'O botão "Salvar" é liberado assim que o nome do cliente e o tipo do imóvel estiverem preenchidos. Ao salvar, você é levado direto à tela de avaliação deste imóvel. "Cancelar" descarta o cadastro e retorna à gestão de imóveis.',
                    side: 'top',
                    align: 'end',
                },
            },
            {
                element: '#tourGuideButton',
                popover: {
                    title: 'Guia sempre disponível',
                    description: 'Este botão reabre o guia a qualquer momento. Para ocultá-lo em todo o sistema, desative a opção "Guias interativos" em Configurações.',
                    side: 'bottom',
                    align: 'end',
                },
            },
        ],
    },

}

export default tours
