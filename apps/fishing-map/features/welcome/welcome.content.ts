import type { Locale } from 'types'

import { WorkspaceCategory } from 'data/workspaces'

type WelcomeContentLang = {
  [locale in Locale]?: {
    title: string
    description: string
  }
}
type WelcomeContent = {
  version?: number
  partnerLogo?: string
  partnerLink?: string
} & WelcomeContentLang

export type WelcomeContentKey = WorkspaceCategory | 'vessel-profile'

const WELCOME_POPUP_CONTENT: {
  [category in WorkspaceCategory | 'vessel-profile']?: WelcomeContent
} = {
  'vessel-profile': {
    partnerLogo: 'https://globalfishingwatch.org/wp-content/uploads/TMT_logo_primary_RGB@2x.png',
    partnerLink: '',
    // partnerLink: 'https://www.tm-tracking.org/',
    zh: {
      title: '欢迎来到船舶查看器',
      description: `
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-vessel-orange.png">船舶历史工具</h2>
<p>船舶查看器（Vessel Viewer）提供有关船舶身份、捕捞活动、港口访问、授权以及转运等方面的信息。</p>
<h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-inspector-orange.png">船舶档案</h2>
<p>详细的船舶档案会展示身份信息以及航迹，还有可按时间线、位置或船舶间关系来解读的事件概要。</p>
<h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">船舶搜索</h2>
<p>任何人都可以在自行报告的信息以及40多个公共船舶登记处中搜索特定船舶，创建自定义船舶群组，分享船舶档案链接，并将它们离线保存为PDF文件。</p>
<h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-teamwork-orange.png">合作关系</h2>
<p>我们已经与全球范围内的众多合作伙伴开展合作——他们全都在利用船舶查看器工具的各种应用功能——包括港口检查员、渔业执法人员、保险行业以及海产品供应链相关人员。这种协作使我们能够了解如何助力利益相关方实现其目标，并随着时间推移不断改进这一工具。</p>
<h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">反馈</h2>
<p>请通过发送反馈至 <a href="mailto:zhanyunfei@roodata.com">zhanyunfei@roodata.com</a> 来帮助我们改进船舶查看器。</p>
<!--<h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">注册以免费获取额外功能</h2>-->
<!--<p>注册一个免费的全球渔业观察（Global Fishing Watch）<a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/marine-manager">账号</a>，即可访问高级搜索选项、分析功能以及数据下载服务。注册只需两分钟。</p>-->`,
    },
    en: {
      title: 'Welcome to Vessel Viewer',
      description: `
      <p>Vessel Viewer is an innovative vessel history tool that arms authorities with the information needed to make a rapid assessment of a fishing vessel’s recent operations and compliance.</p>
      <p>Developed in partnership by Global Fishing Watch and TMT, the tool provides information on a vessel’s identity, fishing activity, port visits and transshipments. This allows users to identify and cross-check relevant, absent or false information about a given vessel and its fishing operations to inform decision-making and operational planning.</p>
      <p>By helping individuals better understand vessel behavior and providing them with broader analysis of vessel operations, Vessel Viewer supports a range of applications that can help bolster ocean governance.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-vessel-orange.png">Vessel history tool</h2>
      <p>Vessel Viewer provides information on a vessel’s identity, fishing activity, port visits, authorizations and transshipments.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-inspector-orange.png">Vessel profiles</h2>
      <p>Detailed vessel profiles show identity information alongside tracks and summaries of events that can be interpreted by timeline, location or relationships between vessels.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Searching for vessels</h2>
      <p>Anyone can search for specific vessels across self reported information and over 40 public vessel registries, build custom vessel groups, share links to vessel profiles and save them offline as PDF files.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-teamwork-orange.png">Partnerships</h2>
      <p>We have engaged with a range of partners from across the globe—all utilizing the vessel viewer tool for its various applications —including port inspectors, fisheries enforcement, insurance and seafood supply chains. This collaboration allows us to understand how we can empower stakeholders to achieve their goals and improve the tool over time.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Feedback</h2>
      <p>Help us to improve Vessel Viewer by sending feedback to: <a href="mailto:zhanyunfei@roodata.com">zhanyunfei@roodata.com</a> </p>
      // <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Register for free access to additional features</h2>
      // <p>Register for a free Global Fishing Watch <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/marine-manager">account</a> to access advanced search options, analysis features, and data downloads. Registration takes two minutes.</p>
      `,
    },
    fr: {
      title: 'Bienvenue dans Vessel Viewer',
      description: `
      <p>Vessel Viewer est un outil innovant d’historique de navires fournissant aux autorités les informations nécessaires pour évaluer rapidement les opérations récentes et la conformité d’un navire de pêche.</p>
      <p>Développé en partenariat par Global Fishing Watch et TMT, l’outil fournit des informations sur l’identité d’un navire, ses activités de pêche, ses visites de ports et ses transbordements. Vessel Viewer permet aux utilisateurs d'identifier et de recouper les informations pertinentes, manquantes ou fausses sur un navire donné et ses opérations de pêche, afin de renseigner les prises de décisions et la planification opérationnelle.</p>
      <p>En aidant les individus à mieux comprendre le comportement des navires et en leur fournissant une analyse plus générale des opérations des navires, Vessel Viewer offre de vastes possibilités d'applications pouvant contribuer à renforcer la gouvernance des océans.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-vessel-orange.png">Outil d’historique de navires</h2>
      <p>Vessel Viewer fournit des informations sur l’identité d’un navire, son activité de pêche, ses visites de ports, ses autorisations et ses transbordements.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-inspector-orange.png">Profils de navires</h2>
      <p>Les profils détaillés des navires incluent des informations d’identité, des tracés de déplacement et des synthèses d'événements qui peuvent être interprétés sous différents angles selon la chronologie, la localité ou les relations entre les navires.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Rechercher des navires</h2>
      <p>N'importe qui peut rechercher des navires spécifiques dans les informations autodéclarées et dans plus de 40 registres publics de navires, créer des groupes de navires personnalisés, partager des liens vers des profils de navires et les enregistrer hors ligne sous forme de fichiers PDF.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-teamwork-orange.png">Partenariats</h2>
      <p>Nous avons collaboré avec un large éventail de partenaires du monde entier — utilisant tous l'outil Vessel Viewer pour ses diverses applications — notamment des inspecteurs au port, des autorités de contrôle des pêches, des sociétés d’assurance et de sociétés de chaînes d'approvisionnement en produits de la mer. Cette collaboration nous permet de comprendre comment nous pouvons aider les parties prenantes d'atteindre leurs objectifs tout en améliorant l'outil au fil du temps.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Commentaires</h2>
      <p>Aidez-nous à améliorer Vessel Viewer en envoyant vos commentaires à: <a href="mailto:zhanyunfei@roodata.com">zhanyunfei@roodata.com</a> </p>
      // <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Enregistrez-vous pour accéder gratuitement à toutes les fonctions</h2>
      // <p>Créez un <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/marine-manager">compte</a> Global Fishing Watch gratuit pour accéder aux fonctionnalités d'analyse avancées, aux téléchargements de données et aux options de recherche avancées. L’enregistrement prend deux minutes.
      // </p>
      `,
    },
    pt: {
      title: 'Bem Vindo ao Vessel Viewer',
      description: `
      <p>O Vessel Viewer é uma ferramenta inovadora de histórico de embarcações que fornece às autoridades as informações necessárias para fazer uma avaliação rápida das operações recentes e da conformidade de uma embarcação de pesca.</p>
      <p>Desenvolvido em parceria entre Global Fishing Watch e TMT, a ferramenta fornece informações sobre a identidade de uma embarcação, atividade pesqueira, visitas a porto e transbordo. Isto permite aos usuários identificar e cruzar informações relevantes, ausentes ou falsas sobre uma determinada embarcação e as suas operações de pesca para informar a tomada de decisões e o planeamento operacional.</p>
      <p>Ao ajudar os indivíduos a compreender melhor o comportamento das embarcações e fornecer-lhes uma análise mais ampla das operações das embarcações, o Vessel Viewer suporta uma série de aplicações que podem ajudar a reforçar a governança dos oceanos.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-vessel-orange.png">Histórico de embarcações</h2>
      <p>O Vessel Viewer fornece informações sobre a identidade de uma embarcação, atividade de pesca, visitas portuárias, autorizações e transbordos.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-inspector-orange.png">Perfil de embarcações</h2>
      <p>Perfis detalhados de embarcações mostram informações de identidade juntamente com rastros e resumos de eventos que podem ser interpretados por linha do tempo, localização ou relacionamento entre embarcações.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Buscar por embarcação</h2>
      <p>Qualquer pessoa pode pesquisar embarcações específicas em informações auto-reportadas e em mais de 40 registros públicos de embarcações, criar grupos de embarcações personalizados, compartilhar links para perfis de embarcações e salvá-los off-line como arquivos PDF.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-teamwork-orange.png">Parcerias</h2>
      <p>Entramos em contato com uma série de parceiros de todo o mundo – todos utilizando a ferramenta de visualização de embarcações para suas diversas aplicações – incluindo inspetores portuários, fiscalização de pesca, seguros e cadeias de abastecimento de frutos do mar. Esta colaboração permite-nos compreender como podemos capacitar as partes interessadas para atingir os seus objetivos e melhorar a ferramenta ao longo do tempo.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Feedback</h2>
      <p>Ajude-nos a melhorar o Vessel Viewer enviando feedback para: <a href="mailto:zhanyunfei@roodata.com">zhanyunfei@roodata.com</a> </p>
      // <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Registre-se para ter acesso gratuito a todos os recursos</h2>
      // <p>Registre-se para obter uma <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/marine-manager">conta</a> gratuita do Global Fishing Watch para acessar recursos avançados de análise, downloads de dados e opções de pesquisa avançada. O registro leva dois minutos.
      // </p>
      `,
    },
    es: {
      title: 'Bienvenido a Vessel Viewer',
      description: `
      <p>Vessel Viewer es una innovadora herramienta de historial de embarcaciones que brinda a las autoridades la información necesaria para realizar una evaluación rápida de las operaciones recientes y el cumplimiento de un buque pesquero.</p>
      <p>Desarrollada por Global Fishing Watch y TMT, la herramienta ofrece información sobre la identidad de un barco, la actividad pesquera, las visitas a puerto y los transbordos. Esto permite a los usuarios identificar y verificar información relevante, ausente o falsa sobre una determinada embarcación y sus operaciones pesqueras para informar la toma de decisiones y la planificación operativa.</p>
      <p>Al ayudar a las personas a comprender mejor el comportamiento de los buques y brindarles un análisis más amplio de las operaciones de los mismos, Vessel Viewer apoya una variedad de aplicaciones que pueden ayudar a reforzar la gobernanza de los océanos.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-vessel-orange.png">Herramienta de historial de embarcaciones</h2>
      <p>Vessel Viewer proporciona información sobre la identidad de un buque, su actividad pesquera, visitas a puertos, autorizaciones y transbordos.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-inspector-orange.png">Perfiles de embarcaciones</h2>
      <p>Los perfiles detallados de las embarcaciones muestran información de identidad junto con trayectorias y resúmenes de eventos que pueden interpretarse por línea de tiempo, ubicación o relaciones entre los buques.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Búsqueda de embarcaciones</h2>
      <p>Cualquiera puede buscar embarcaciones específicas a través de información autoreportada y más de 40 registros públicos de embarcaciones, crear grupos de embarcaciones personalizados, compartir enlaces a perfiles de embarcaciones y guardarlos sin conexión como archivos PDF.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-teamwork-orange.png">Asociaciones</h2>
      <p>Trabajamos con una variedad de socios de todo el mundo, todos utilizando la herramienta de visualización de embarcaciones para sus diversas aplicaciones, incluidos inspectores portuarios, de control de la pesca, seguros y cadenas de suministro de productos del mar. Esta colaboración nos permite comprender cómo podemos empoderar a las partes interesadas para que logren sus objetivos y mejoren la herramienta con el tiempo.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Comentarios</h2>
      <p>Ayúdenos a mejorar Vessel Viewer enviando sus comentarios a: <a href="mailto:zhanyunfei@roodata.com">zhanyunfei@roodata.com</a> </p>
      // <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Regístrese para tener acceso gratuito a todas las funciones</h2>
      // <p>Regístrese para obtener una <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/marine-manager">cuenta gratuíta</a> de Global Fishing Watch para acceder a funciones de análisis avanzadas, descargas de datos y opciones de búsqueda avanzada. El registro tarda dos minutos</p>
      `,
    },
  },
  [WorkspaceCategory.MarineManager]: {
    partnerLogo: 'https://globalfishingwatch.org/wp-content/uploads/Logo_DonaBertarelliPH@2x.png',
    partnerLink: 'https://donabertarelli.com/',
    zh: {
      title: '欢迎使用全球渔业观察海洋管理器',
      description: `
      <p>全球渔业观察海洋管理器是由Dona Bertarelli创立的一个免费可用的创新技术门户。它提供近实时、动态和交互式的海洋状况、生物和人类使用活动数据,以支持海洋空间规划、海洋保护区设计和管理以及科学研究。</p>

      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png">表观捕捞努力</h2>
      <p>我们使用通过自动识别系统(AIS)广播并通过卫星和陆地接收器收集的数据。然后,我们将这些信息与合作国提供的船舶监控系统数据相结合。我们应用捕捞检测算法,根据船舶速度和方向的变化来确定"表观捕捞努力"。</p>

      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-vessel-orange.png">船舶活动</h2>
      <p>我们已将船舶存在数据整合到门户中,该数据显示所有通过AIS传输的船舶位置。船舶存在数据目前可以按渔船和运输船进行过滤,以及归类为"其他船舶"的船只,包括与航运、旅游和油气勘探相关的船只。</p>

      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-coral-orange.png">环境数据</h2>
      <p>全球渔业观察组织提供公开可用的海洋学和生物数据集,如海表温度、初级生产力和盐度,使任何人都可以研究与人类活动相关的环境模式。</p>
      <p>在私人工作区中,管理者和研究人员可以上传他们自己的数据集(如动物遥测轨迹),以为易危物种的管理和保护提供信息。</p>

      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png">参考图层</h2>
      <p>参考图层有助于理解海洋保护区和其他区域周围的船舶活动。可以添加这些图层以支持详细分析或空间管理。</p>

      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-teamwork-orange.png">合作伙伴关系</h2>
      <p>我们已与全球各地的一系列合作伙伴站点建立联系—他们都在利用该门户进行各种应用。这种协作使我们能够了解如何赋能利益相关者实现其目标并随时间改进门户。</p>

      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">反馈</h2>
      <p>通过左侧边栏中的内置反馈表单或发送反馈至<a href="mailto:marinemanager@globalfishingwatch.org">marinemanager@globalfishingwatch.org</a>帮助我们改进全球渔业平台</p>

      // <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">注册免费访问附加功能</h2>
      // <p>注册免费的全球渔业观察<a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/marine-manager">账户</a>以访问高级搜索选项、分析功能和数据下载。注册仅需两分钟。</p>
      `,
    },
    en: {
      title: 'Welcome to Global Fishing Watch Marine Manager',
      description: `<p>Global Fishing Watch Marine Manager is a freely available, innovative technology portal that was founded by Dona Bertarelli. It provides near real-time, dynamic and interactive data on ocean conditions, biology and human-use activity to support marine spatial planning, marine protected area design and management, and scientific research.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png">Apparent fishing effort</h2>
      <p>We use data that is broadcast using the automatic identification system (AIS) and collected via satellites and terrestrial receivers. We then combine this information with vessel monitoring system data provided by our partner countries. We apply our fishing detection algorithm to determine “apparent fishing effort” based on changes in vessel speed and direction.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-vessel-orange.png">Vessel activity</h2>
      <p>We have integrated vessel presence data into the portal, which indicates the locations of all vessels transmitting on AIS. Vessel presence data can currently be filtered by fishing and carrier vessels, as well as ships categorized as “other vessels”, which include those associated with shipping, tourism and oil and gas exploration.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-coral-orange.png">Environmental data</h2>
      <p>Global Fishing Watch is providing publicly available oceanographic and biological datasets, like sea surface temperature and primary productivity and salinity, to allow anyone to examine environmental patterns as they relate to human activity.</p>
      <p>In private workspaces, managers and researchers can upload their own datasets—like animal telemetry tracks—to inform management and protection of vulnerable species.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png">Reference layers</h2>
      <p>Reference layers support understanding of vessel activity around marine protected areas and other areas. They can be added to support detailed analysis or spatial management.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-teamwork-orange.png">Partnerships</h2>
      <p>We have engaged with a range of partner sites from across the globe—all utilizing the portal for its various applications. This collaboration allows us to understand how we can empower stakeholders to achieve their goals and improve the portal over time.</p>
      <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Feedback</h2>
      <p>Help us improve the Global Fishing platform through the built-in feedback form in the left sidebar or by sending feedback to <a href="mailto:marinemanager@globalfishingwatch.org">marinemanager@globalfishingwatch.org</a> </p>
      // <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Register for free access to additional features</h2>
      // <p>Register for a free Global Fishing Watch <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/marine-manager">account</a> to access advanced search options, analysis features, and data downloads. Registration takes two minutes.</p>
      `,
    },
    es: {
      title: 'Bienvenido a Global Fishing Watch Marine Manager',
      description: `<p> Global Fishing Watch Marine Manager es un portal de tecnología innovadora de acceso gratuito que fue fundado por Dona Bertarelli. Proporciona datos casi en tiempo real, dinámicos e interactivos sobre las condiciones del océano, la biología y la actividad de uso humano para respaldar la planificación espacial marina, el diseño y la gestión de áreas marinas protegidas y la investigación científica. </p>
      <h2> <img src = "https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png"> Esfuerzo de pesca aparente </h2>
      <p> Usamos datos que se transmiten mediante el sistema de identificación automática (AIS) y se recopilan a través de satélites y receptores terrestres. Luego, combinamos esta información con los datos del sistema de seguimiento de embarcaciones proporcionados por nuestros países socios. Aplicamos nuestro algoritmo de detección de pesca para determinar el "esfuerzo de pesca aparente" en función de los cambios en la velocidad y dirección del barco. </p>
      <h2> <img src = "https://globalfishingwatch.org/wp-content/uploads/icon-vessel-orange.png"> Actividad de la embarcación </h2>
      <p> Hemos integrado datos de presencia de embarcaciones en el portal, que indica las ubicaciones de todas las embarcaciones que transmiten por AIS. Los datos de presencia de embarcaciones actualmente pueden ser filtrados por embarcaciones pesqueras y de transporte, así como por embarcaciones categorizadas como "otras embarcaciones", que incluyen aquellas asociadas con el transporte marítimo, el turismo y la exploración de petróleo y gas. </p>
      <h2> <img src = "https://globalfishingwatch.org/wp-content/uploads/icon-coral-orange.png"> Datos ambientales </h2>
      <p> Global Fishing Watch proporciona conjuntos de datos oceanográficos y biológicos disponibles públicamente, como la temperatura de la superficie del mar y la productividad y salinidad primarias, para permitir que cualquiera pueda examinar los patrones ambientales en relación con la actividad humana. </p>
      <p> En espacios de trabajo privados, los administradores e investigadores pueden cargar sus propios conjuntos de datos (como pistas de telemetría animal) para informar la gestión y protección de especies vulnerables. </p>
      <h2> <img src = "https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png"> Capas de referencia </h2>
      <p> Las capas de referencia apoyan la comprensión de la actividad de los barcos alrededor de áreas marinas protegidas y otras áreas. Se pueden agregar para respaldar el análisis detallado o la gestión espacial. </p>
      <h2> <img src = "https://globalfishingwatch.org/wp-content/uploads/icon-teamwork-orange.png"> Asociaciones </h2>
      <p> Nos hemos comprometido con una variedad de sitios asociados de todo el mundo, todos utilizando el portal para sus diversas aplicaciones. Esta colaboración nos permite comprender cómo podemos empoderar a las partes interesadas para que logren sus objetivos y mejoren el portal con el tiempo. </p>
      <h2> <img src = "https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png"> Comentarios </h2>
      <p> Ayúdenos a mejorar Global Fishing Watch Marine Manager enviando sus comentarios a: <a href="mailto:marinemanager@globalfishingwatch.org"> marinemanager@globalfishingwatch.org </a> </p>
      // <h2> <img src = "https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png"> Regístrese para obtener acceso gratuito a todas las funciones </h2>
      // <p> Regístrese para obtener una cuenta gratuita de Global Fishing Watch <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/marine-manager"> </ a > para acceder a funciones de análisis avanzado, descargas de datos y opciones de búsqueda avanzada. El registro demora dos minutos. </p>
      `,
    },
  },
  [WorkspaceCategory.FishingActivity]: {
    zh: {
      title: '欢迎使用全球渔业观察地图',
      description: `
    <p>全球渔业观察地图是首个用于可视化和分析海上基于船舶的人类活动的开放访问在线工具。任何有互联网连接的人都可以访问该地图,监测从2012年至今超过65,000艘负责全球海产品捕捞重要部分的商业渔船的全球捕捞活动。</p>

    <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png">表观捕捞努力</h2>
    <p>我们使用通过自动识别系统(AIS)广播并通过卫星和陆地接收器收集的数据。然后,我们将这些信息与合作国提供的船舶监控系统数据相结合。我们应用捕捞检测算法,根据船舶速度和方向的变化来确定"表观捕捞努力"。热图网格单元颜色显示该区域发生了多少捕捞活动,允许进行精确比较。</p>

    <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_VESSEL-TRACKS_Orange.png">船舶轨迹和事件</h2>
    <p>在地图上查看精确的高分辨率船舶轨迹和沿每条轨迹发生的"事件"。事件突出显示捕捞发生的地点、港口访问、船舶相遇和徘徊事件—当单个船舶表现出与另一艘船舶相遇的行为但未收到其他传输时。当地图缩小时,事件会被分组。放大特定区域以获取更详细的信息。</p>

    <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">搜索船舶</h2>
    <p>通过船名、海事移动服务识别号码、国际海事组织编号、呼号或船舶监控系统标识符在地图上的任何位置搜索船舶。高级搜索允许您通过来源、船旗和活动日期更有效地过滤和细化搜索。点击搜索结果中的任何船舶,将该船舶轨迹添加到地图中。</p>

    <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png">上传参考图层</h2>
    <p>参考图层有助于更好地理解专属经济区、区域渔业管理组织和其他区域周围的船舶活动。添加您自己的参考图层以支持详细分析或空间管理。</p>

    <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">反馈</h2>
    <p>通过左侧边栏中的内置反馈表单或发送反馈至<a href="mailto:zhanyunfei@roodata.com">zhanyunfei@roodata.com</a>帮助我们改进全球渔业平台</p>

    // <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">注册免费访问附加功能</h2>
    // <p>注册免费的全球渔业观察<a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/map">账户</a>以访问高级搜索选项、分析功能和数据下载。注册仅需两分钟。</p>
  `,
    },
    en: {
      title: 'Welcome to the Global Fishing Watch Map',
      description: `
        <p>The Global Fishing Watch map is the first open-access online tool for visualization and analysis of vessel-based human activity at sea. Anyone with an internet connection can access the map to monitor global fishing activity from 2012 to the present for more than 65,000 commercial fishing vessels that are responsible for a significant part of global seafood catch.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png">Apparent fishing effort</h2>
        <p>We use data that is broadcast using the automatic identification system (AIS) and collected via satellites and terrestrial receivers. We then combine this information with vessel monitoring system data provided by our partner countries. We apply our fishing detection algorithm to determine “apparent fishing effort” based on changes in vessel speed and direction. The heat map grid cell colors show how much fishing happened in that area, allowing for precise comparison.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_VESSEL-TRACKS_Orange.png">Vessel tracks and events</h2>
        <p>View precise, high-resolution vessel tracks in the map and “events'' that occurred along each track. Events highlight where fishing took place, port visits, vessel encounters and loitering events—when a single vessel exhibits behavior indicative of an encounter with another vessel but no other transmissions were received. Events are grouped together when the map is zoomed out. Zoom in on a specific area for more detailed information.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Search for a vessel</h2>
        <p>Search for a vessel anywhere on the map by vessel name, maritime mobile service identity number, International Maritime Organization number, call sign or vessel monitoring system identifier. Advanced search allows you to filter and refine your search more effectively by source, flags and dates active. Click on any vessel in the search results to add that vessel track to the map.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png">Upload reference layers</h2>
        <p>Reference layers facilitate a better understanding of vessel activity around exclusive economic zones, regional fisheries management organizations and other areas. Add your own reference layers to support detailed analysis or spatial management.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Feedback</h2>
        <p>Help us improve the Global Fishing platform through the built-in feedback form in the left sidebar or by sending feedback to <a href="mailto:zhanyunfei@roodata.com">zhanyunfei@roodata.com</a> </p>
        // <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Register for free access to additional features</h2>
        // <p>Register for a free Global Fishing Watch <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/map">account</a> to access advanced search options, analysis features, and data downloads. Registration takes two minutes.</p>
      `,
    },
    es: {
      title: 'Bienvenido al mapa Global Fishing Watch',
      description: `
        <p>El mapa Global Fishing Watch es la primera herramienta en línea de acceso abierto para la visualización y el análisis de la actividad humana en el mar basada en embarcaciones. Cualquiera con una conexión a Internet puede acceder al mapa para monitorear la actividad pesquera mundial, desde 2012 hasta el presente, de más de 65.000 embarcaciones pesqueras comerciales que son responsables de una parte significativa de la captura mundial de pescado y mariscos.
        </p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png">Esfuerzo de pesca aparente</h2>
        <p>Usamos datos que se transmiten mediante el sistema de identificación automática (AIS) y se recopilan a través de satélites y receptores terrestres. Luego, combinamos esta información con los datos del sistema de seguimiento de embarcaciones proporcionados por nuestros países socios. Aplicamos nuestro algoritmo de detección de pesca para determinar el "esfuerzo de pesca aparente" en función de los cambios en la velocidad y dirección del buque. Los colores de las celdas de la cuadrícula del mapa de calor muestran cuánta pesca ocurrió en esa área, lo que permite una comparación precisa.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_VESSEL-TRACKS_Orange.png">Rutas de embarcaciones y eventos</h2>
        <p>Vea la ruta precisa de embarcaciones en alta resolución en el mapa y los "eventos" que ocurrieron a lo largo de cada ruta. Los eventos destacan dónde tuvo lugar la pesca, las visitas a puertos, los encuentros con embarcaciones y eventos de merodeo -cuando una sola embarcación muestra un comportamiento indicativo de un encuentro con otra embarcación, pero no se recibieron otras transmisiones. Los eventos se agrupan cuando se aleja la vista del mapa. Amplíe un área específica para obtener información más detallada.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Búsqueda de una embarcación</h2>
        <p>Busque una embarcación en cualquier lugar del mapa por nombre, número de identidad del servicio móvil marítimo, número de la Organización Marítima Internacional, distintivo de llamada o identificador del sistema de seguimiento de embarcaciones. La búsqueda avanzada le permite filtrar y refinar su búsqueda de manera más efectiva por fuente, banderas y fechas activas. Haga clic en cualquier embarcación en los resultados de la búsqueda para agregar la ruta de esa embarcación al mapa.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png">Cargar capas de referencia</h2>
        <p>Las capas de referencia facilitan una mejor comprensión de la actividad de los barcos alrededor de las zonas económicas exclusivas, las organizaciones regionales de ordenación pesquera y otras áreas. Agregue sus propias capas de referencia para respaldar el análisis detallado o la gestión espacial.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Comentarios</h2>
        <p>Ayúdenos a mejorar la plataforma Global Fishing a través del formulario de comentarios integrado en la barra lateral izquierda o enviando comentarios a <a href="mailto:zhanyunfei@roodata.com">zhanyunfei@roodata.com</a></p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Regístrese para tener acceso gratuito a todas las funciones</h2>
        <p><a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/map">Regístrese para obtener una cuenta gratuita de Global Fishing Watch</ a > para acceder a funciones de análisis avanzado, descargas de datos y opciones de búsqueda avanzada. El registro demora dos minutos. </p>
        // <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBE_Orange-1.png">Mapa anterior de Global Fishing Watch</h2>
        // <p><a href="https://gfw.roodata.com/legacy-map/?utm_source=map3_welcome_page&utm_medium=map_2_link&utm_campaign=sunsetting_map2">Acceda aquí a la versión anterior del mapa de Global Fishing Watch</a> para migrar los espacios de trabajo hasta el 18 de octubre de 2021.</p>
      `,
    },
    fr: {
      title: 'Bienvenue sur la carte de Global Fishing Watch',
      description: `
        <p>La carte de Global Fishing Watch est le premier outil en ligne d’accès ouvert permettant la visualisation et l’analyse de l’activité humaine en bateau en mer. Tout utilisateur disposant d’une connexion internet peut accéder à la carte pour surveiller l’activité de pêche globale de 2012 à aujourd’hui, pour plus de 65 000 navires de pêche commerciale, responsable d’une part significative de la prise globale de produits de la mer.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png">Effort de pêche apparent</h2>
        <p>Nous utilisons des données émises via le système AIS et collectées par des satellites et récepteurs terrestres. Nous combinons ensuite cette information avec des données des systèmes de surveillance fournis par nos pays partenaires. Nous appliquons notre algorithme de détection de pêche pour déterminer “l’effort de pêche apparent” basé sur les changements de vitesse et de direction des navires. Les couleurs de la carte de chaleur permettent des comparaisons précises en montrant l’effort de pêche d’une zone donnée. </p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_VESSEL-TRACKS_Orange.png">Trajectoires et événements des navires</h2>
        <p>Visualisez les trajectoires précises en haute résolution des navires et les “événements” ayant eu lieu durant ces trajectoires. Les événements montrent lorsqu’un navire à pêché, visité un port, rencontré un autre navire en mer. Les “évènements de dérive” montrent quand un seul navire montre un comportement caractéristique d’une rencontre avec un autre navire, mais qu’aucune autre transmission n’a été reçue. Les évènements sont regroupés lorsque la carte est dézoomée. Zoomez sur une zone spécifique pour accéder à plus de détails.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Recherche de navire</h2>
        <p>Recherchez un navire n’importe où sur la carte, par nom de navire, numéro MMSI, numéro OMI, indicatif ou identifiant VMS. La recherche avancée vous permet de filtrer et affiner votre recherche plus efficacement par source, pavillon, et dates d’activité. Cliquez sur un navire dans les résultats de recherche pour ajouter sa trajectoire sur la carte. </p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png">Ajouter des calques de référence</h2>
        <p>Les calques de référence aident à comprendre l’activité des navires autour des ZEE, RFMO et autres zones. Ajoutez vos propres calques de référence pour aider à les analyses détaillées.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Retour d’expérience</h2>
        <p>Aidez-nous à améliorer la carte de Global Fishing Watch en envoyant votre retour d’expérience à <a href="mailto:zhanyunfei@roodata.com">zhanyunfei@roodata.com</a> ou via le formulaire de retour d’expérience disponible en bas à gauche de l’écran.</p>
        // <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Enregistrez-vous pour l’accès à toutes les fonctionnalités</h2>
        // <p>Vous pouvez vous <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/map">créer un compte Global Fishing Watch</a> gratuitement pour accéder aux fonctionnalités avancées d’analyse, téléchargement de données et enregistrement d’espaces de travail. </p>
      `,
    },
    id: {
      title: 'Selamat datang di peta Global Fishing Watch',
      description: `
        <p>Peta Global Fishing Watch adalah alat daring dengan akses terbuka yang pertama untuk visualisasi dan analisis kapal berdasarkan aktivitas manusia di laut. Siapa saja dengan koneksi internet dapat mengakses peta untuk memantau aktivitas penangkapan ikan global dari tahun 2012 hingga sekarang untuk lebih dari 65.000 kapal penangkap ikan komersial yang bertanggung jawab atas sebagian besar tangkapan makanan laut secara global.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png">Upaya penangkapan ikan yang terlihat</h2>
        <p>Kami menggunakan data yang disiarkan menggunakan automatic identification system (AIS) dan dikumpulkan melalui satelit dan penerima terestrial. Kemudian kami menggabungkan informasi ini dengan data sistem pemantauan kapal yang disediakan oleh negara mitra kami. Kami menerapkan algoritma deteksi penangkapan ikan untuk menentukan “upaya penangkapan yang terlihat” berdasarkan perubahan kecepatan dan arah kapal. Warna sel grid pada peta panas menunjukkan berapa banyak penangkapan ikan yang terjadi di area itu, memungkinkan untuk perbandingan yang tepat.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_VESSEL-TRACKS_Orange.png">Lintasan kapal dan peristiwa</h2>
        <p>Melihat lintasan kapal beresolusi tinggi yang tepat di peta dan "peristiwa" yang terjadi di sepanjang setiap lintasan. Peristiwa menyoroti tempat penangkapan ikan, kunjungan pelabuhan, pertemuan kapal, dan peristiwa berkeliaran—ketika satu kapal menunjukkan perilaku yang menunjukkan pertemuan dengan kapal lain tetapi tidak ada transmisi lain yang diterima. Peristiwa dikelompokkan bersama saat peta diperkecil. Perbesar area tertentu untuk informasi lebih detail.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Pencarian kapal</h2>
        <p>Pencarian kapal di mana saja di peta dengan nama kapal, nomor maritime mobile service identity (MMSI), nomor Organisasi Maritim Internasional, tanda panggil atau pengenal sistem pemantauan kapal. Pencarian lanjutan memungkinkan Anda untuk menyaring dan memperhalus pencarian Anda secara lebih efektif berdasarkan sumber, bendera, dan tanggal aktif. Klik kapal mana saja di hasil pencarian untuk menambahkan jalur kapal itu ke peta.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png">Unggah layer referensi</h2>
        <p>Layer referensi memfasilitasi pemahaman yang lebih baik tentang aktivitas kapal di sekitar zona ekonomi eksklusif, organisasi pengelolaan perikanan regional, dan area lainnya. Tambahkan lapisan referensi Anda sendiri untuk mendukung analisis terperinci atau manajemen spasial.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Umpan balik</h2>
        <p>Bantu kami meningkatkan perbaikan peta Global Fishing Watch dengan mengirimkan umpan balik ke <a href="mailto:zhanyunfei@roodata.com">zhanyunfei@roodata.com</a> atau melalui formulir umpan balik di sebelah sisi kiri pada peta.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Daftar untuk akses gratis ke semua fitur</h2>
        <p>Daftarkan <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/map">akun</a> Global Fishing Watch gratis untuk mengakses fitur analisis lanjutan, unduhan data, dan menyimpan ruang kerja Anda. Pendaftaran memakan waktu dua menit.</p>
        // <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBE_Orange-1.png">Peta Global Fishing Watch sebelumnya</h2>
        // <p><a href="https://gfw.roodata.com/legacy-map/?utm_source=map3_welcome_page&utm_medium=map_2_link&utm_campaign=sunsetting_map2">Akses peta Global Fishing Watch sebelumnya di sini untuk memigrasikan ruang kerja hingga 18 Oktober 2021.</a></p>
      `,
    },
    pt: {
      title: 'Bem vindo ao mapa do Global fishing Watch',
      description: `
        <p>O mapa do Global Fishing Watch é a primeira ferramenta de acesso livre para visualização e análise da atividade humana no mar. qualquer pessoa com conexão à internet pode acessar o mapa para monitorar a atividade pesqueira desde 2012 a até a data atual, de mais de 65.000 embarcações comerciais de pesca que são responsáveis por uma parcela significativa da captura mundial de pescados.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/icon-line-caught-fish-orange.png">Esforço de pesca aparente</h2>
        <p>Nós usamos dados que são transmitidos usando o Sistema de Identificação Automática (AIS) coletados via satélite e receptores terrestres. Nós então combinamos estas informações com dados dos sistemas de rastreamento de embarcações fornecidos pelos nossos países parceiros. Nós aplicamos nossos algoritmos de detecção para determinar o “esforço de pesca aparente”, baseado em mudanças na velocidade e direção da embarcação. O mapa de calor com células coloridas mostra quanta atividade de pesca ocorreu naquela área, permitindo comparações precisas.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_VESSEL-TRACKS_Orange.png">Rotas de embarcações e eventos</h2>
        <p>Visualize rastros precisos e de alta resolução da embarcação no mapa e “eventos” que ocorreram ao longo de cada rota. Os eventos destacam onde a pesca ocorreu, visitas a portos, encontros de embarcações e eventos de deriva. Os eventos são agrupados quando o zoom do mapa é reduzido. Amplie uma área específica para obter informações mais detalhadas.</p>
        <h2><img src = "https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBAL-SEARCH_Orange-1.png">Pesquise por uma embarcação</h2>
        <p>Pesquise por uma embarcação em qualquer lugar do mapa pelo nome da embarcação, número de identificação de serviço móvel marítimo (MMSI), número da Organização Marítima Internacional (IMO), código de chamada (Callsign), ou identificador do sistema de rastreamento de embarcações. A pesquisa avançada permite filtrar e refinar sua busca por fonte de informação, bandeira e datas. Clique em qualquer embarcação nos resultados da busca para adicionar a sua rota no mapa.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-location-map-orange.png">Carregar camadas de referência</h2>
        <p>Camadas de referência facilitam uma melhor compreensão da atividade nas zonas econômicas exclusivas, Organizações Regionais de Pesca e outras áreas. Adicione suas próprias camadas de referência para realizar análises detalhadas ou gestão espacial.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-email-orange.png">Retorno</h2>
        <p>Ajude-nos a melhorar o mapa do Global Fishing Watch enviando seus comentários e sugestões para zhanyunfei@roodata.com ou através do formulário de comentários no painel lateral esquerdo do mapa.</p>
        <h2><img src="https://globalfishingwatch.org/wp-content/uploads/icon-graph-orange-1.png">Registre-se para ter acesso a todas as funcionalidades</h2>
        <p>Registre-se para obter uma <a href="https://gateway.api.globalfishingwatch.org/auth?client=gfw&callback=https://globalfishingwatch.org/map">conta</a> gratuita do Global Fishing Watch para acessar recursos de análise avançada, downloads de dados e opções de pesquisa avançada. O registro leva dois minutos.</p>
        // <h2><img src="https://globalfishingwatch.org/wp-content/uploads/GFW_GLOBE_Orange-1.png">Mapa anterior do Global Fishing Watch</h2>
        // <p><a href="https://gfw.roodata.com/legacy-map/?utm_source=map3_welcome_page&utm_medium=map_2_link&utm_campaign=sunsetting_map2">Acesse o mapa anterior</a> do Global Fishing Watch para migrar os espaços de trabalho até 18 de outubro de 2021.</p>
      `,
    },
  },
}

export default WELCOME_POPUP_CONTENT
