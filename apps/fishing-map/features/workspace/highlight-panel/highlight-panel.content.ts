import {
  IS_PRODUCTION_BUILD,
  IS_PRODUCTION_WORKSPACE_ENV,
  PATH_BASENAME,
} from '../../../data/config'
import type { Locale } from '../../../types'

type HighlighPanelConfigLocale = {
  [locale in Locale]?: {
    title: string
    description: string
    learnMoreUrl?: string
  }
}

export type HighlightPanelConfig = {
  dataviewInstanceId: string
  localStorageKey: string
  imageUrl: string
  learnMoreUrl?: string
  delayed?: number
  workspaceUrl?: string
  releaseDateTimestamp: number
} & HighlighPanelConfigLocale

const HIGHLIGHT_POPUP_KEY = 'HighlightPopup'

/**
 * To use as releaseDateTimestamp while the release date is not yet defined.
 *
 * Eg:
 * {
 *   dataviewInstanceId: 'vms-with-some-country',
 *   releaseDateTimestamp: NEXT_YEAR,
 *   localStorageKey: HIGHLIGHT_POPUP_KEY,
 *   delayed: 1000,
 *   ...
 * }
 *
 */
// const NEXT_YEAR = Date.now() + 1000 * 60 * 60 * 24 * 365
const BASE_HIGHLIGHT_CONFIG = {
  localStorageKey: HIGHLIGHT_POPUP_KEY,
  delayed: 1000,
}
// To display a new highlight popup, just add a HighlightPanelConfig element to this array.
// It's important to define a unique dataviewInstanceId and the releaseDateTimestamp
// so that the popup is shown in production only after that date
const HIGHLIGHT_CONFIGS: HighlightPanelConfig[] = [
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'vessel-groups',
    releaseDateTimestamp: Date.parse('2024-10-24T00:00:00Z'),
    imageUrl: '',
    learnMoreUrl: 'https://globalfishingwatch.org/platform-updates/',
    zh: {
      title: "新的船舶组功能",
      description: "创建您的船舶组以在地图上可视化组活动。点击船舶组名称以启动分析并查看组报告。"
    },
    en: {
      title: 'New vessel groups feature',
      description:
        'Create your vessel group to visualize group activity on the map. Click on the vessel group name to launch an analysis and view group report.',
    },
    es: {
      title: 'Nueva funcionalidad de grupos de embarcaciones',
      description:
        'Cree su grupo de embarcaciones para visualizar la actividad del grupo en el mapa. Haga clic en el nombre del grupo de embarcaciones para iniciar un análisis y ver el informe del grupo.',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'fishing-ais-pipe-3',
    releaseDateTimestamp: Date.parse('2024-08-01T00:00:00Z'),
    imageUrl: `${PATH_BASENAME}/images/before-after@2x.gif`,
    learnMoreUrl: 'https://globalfishingwatch.org/platform-updates/',
    zh: {
      "title": "更新的AIS数据和新功能",
      "description": "全球渔业观察组织已改进底层AIS数据的准确性,现在支持高分辨率地图图层。数据改进可能会影响捕捞努力和活动计算。工作区应更新以反映这些变化"
    },
    en: {
      title: 'Updated AIS data and new features',
      description:
        'Global Fishing Watch has improved underlying AIS data accuracy and now supports high resolution map layers. Data improvements may affect fishing effort and activity calculations. Workspaces should be updated to reflect changes',
    },
    es: {
      title: 'Datos de AIS actualizados y nuevas funcionalidades',
      description:
        'Global Fishing Watch ha mejorado la precisión de los datos AIS subyacentes y ahora admite visualizar las capas con mayor resolución. Las mejoras en los datos pueden afectar los cálculos de la actividad y el esfuerzo pesquero. Los espacios de trabajo deben actualizarse para reflejar los cambios',
      learnMoreUrl: 'https://globalfishingwatch.org/es/faqs/marine-traffic-nueva-fuente-ais/',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'fishing-ais',
    releaseDateTimestamp: Date.parse('2024-05-07T00:00:00Z'),
    imageUrl: `${PATH_BASENAME}/images/marine-traffic-ais.jpg`,
    learnMoreUrl: 'https://globalfishingwatch.org/faqs/marine-traffic-new-ais-source/',
    zh:{
      "title": "新功能 - Marine Traffic作为陆地AIS数据源以改善覆盖范围",
      "description": "从2024年1月3日起,全球渔业观察组织已将Marine Traffic添加为陆地自动识别系统(AIS)数据源,以改善三个区域的覆盖范围 - 地中海、南海和北海。这些数据现在已自动包含在表观捕捞努力和船舶存在地图图层中。"
    },
    en: {
      title: 'New - Marine Traffic as a terrestrial AIS data source to improve coverage',
      description:
        'From 3 January 2024, Global Fishing Watch has added Marine Traffic as a terrestrial automatic identification system (AIS) data source to improve coverage in three areas - Mediterranean Sea, South China Sea, and the North Sea. This data is now automatically included in the apparent fishing effort and vessel presence map layers.',
    },
    es: {
      title: 'Marine Traffic - nueva fuente de datos terrestre de AIS para mejorar la cobertura',
      description:
        'Desde el 3 de enero de 2024, Global Fishing Watch ha incorporado Marine Traffic como fuente de datos del sistema de identificación automática (AIS) terrestre para mejorar la cobertura en tres áreas: el Mar Mediterráneo, el Mar de China Meridional y el Mar del Norte. Estos datos ahora se incluyen automáticamente en las capas de esfuerzo de pesca aparente y presencia.',
      learnMoreUrl: 'https://globalfishingwatch.org/es/faqs/marine-traffic-nueva-fuente-ais/',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'fishing-ais',
    releaseDateTimestamp: Date.parse('2024-04-08T00:00:00Z'),
    imageUrl: ``,
    learnMoreUrl: 'https://globalfishingwatch.org/faqs/2024-april-data-error/',
    zh:{
      title: "已解决 - 全球渔业观察组织已解决平台中的底层AIS数据错误",
      description: "如果您在2024年1月26日至4月10日期间访问了全球渔业观察组织的AIS或VMS数据,捕捞努力和捕捞事件数据可能存在错误。所有错误已经解决,数据已被纠正。我们建议您使用正确的数据重新进行任何分析。对造成的任何不便,我们深表歉意。"
    },
    en: {
      title:
        'Resolved - Global Fishing Watch has resolved an underlying AIS data error in the platform.',
      description:
        'If you accessed Global Fishing Watch AIS or VMS data between 26 January - 10 April 2024, there may be errors in the fishing effort and fishing event data. All errors have been resolved and the data has been corrected. Our advice is to repeat any analysis completed with the correct data. We’re sorry for any inconvenience caused.',
    },
    es: {
      title:
        'Resuelto - Global Fishing Watch ha resuelto un error en los datos AIS en la plataforma.',
      description:
        'Si accedió a los datos AIS o VMS de Global Fishing Watch entre el 26 de enero y el 10 de abril de 2024, es posible que haya errores en los datos de esfuerzo pesquero y eventos de pesca. Todos los errores han sido resueltos y los datos han sido corregidos. Nuestra recomendación es repetir cualquier análisis que se haya completado en ese periodo utilizando los datos correctos que ya están disponibles. Sentimos las molestias ocasionadas.',
      learnMoreUrl: 'https://globalfishingwatch.org/es/faqs/abril-2024-error-de-datos/',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'bathymetry-workspace',
    releaseDateTimestamp: Date.parse('2024-01-08T00:00:00Z'),
    imageUrl: `${PATH_BASENAME}/images/chlorophyl@2x.jpg`,
    learnMoreUrl: 'https://globalfishingwatch.org/platform-updates/',
    zh:{
      title: "新增环境数据源",
      description: "根据您的反馈,全球渔业观察组织已添加新的数据集,包括动态海洋学和生态系统数据。通过动态报告,探索这些与人类活动并列的新数据集,并在空间和时间维度上分析它们,以更多地了解您感兴趣的区域。"
    },
    en: {
      title: 'New environmental data sources added',
      description:
        'Global Fishing Watch has added new datasets, including dynamic oceanographic and ecosystem data following your feedback. Explore the new datasets alongside human activity, and analyze them through space and time using dynamic reports to learn more about your area of interest.',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'sar',
    releaseDateTimestamp: Date.parse('2024-01-04T00:00:00Z'),
    imageUrl: `${PATH_BASENAME}/images/sar.webp`,
    learnMoreUrl:
      'https://globalfishingwatch.org/press-release/new-research-harnesses-ai-and-satellite-imagery-to-reveal-the-expanding-footprint-of-human-activity-at-sea',
    zh: {
      title: "新增卫星雷达数据揭示隐藏于公众视野之外的工业船舶",
      description: "全球渔业观察组织已添加一个开放的全球雷达探测图层,该图层来自合成孔径雷达(SAR),可在任何天气条件下显示海上船舶。SAR可以显示其他合作跟踪系统无法探测到的船舶,以及海上基础设施,如石油平台和风力发电场。"
    },
    en: {
      title: 'Data added from satellite radar reveals industrial vessels hidden from public view',
      description:
        'Global Fishing Watch has added an open global radar detections layer, derived from synthetic aperture radar or SAR, to display vessels at sea in any weather conditions. SAR can show vessels that can not be picked up by other cooperative tracking systems and infrastructure at sea like oil platforms and wind farms.',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'vms-with-png',
    releaseDateTimestamp: Date.parse('2023-06-01T00:00:00Z'),
    imageUrl: `${PATH_BASENAME}/images/papua_new_guinea-vms.webp`,
    learnMoreUrl: 'https://globalfishingwatch.org/papua-new-guinea',
    zh:{
      title: "巴布亚新几内亚的VMS数据现已可用",
      description: "船舶监控系统(VMS)数据由巴布亚新几内亚国家渔业局提供。现在可以追踪在巴布亚新几内亚国家水域作业的巴布亚新几内亚渔业协会渔船队所有船舶的位置和活动。"
    },
    en: {
      title: 'Papua New Guinea’s VMS data is now available',
      description:
        'Vessel monitoring system (VMS) data is provided by the National Fisheries Authority of Papua New Guinea. It is now possible to track the position and activity of all vessels comprising the Fishing Industry Association of Papua New Guinea’s fishing fleet operating in Papua New Guinea’s national waters.',
    },
    es: {
      title: 'Los datos VMS de Papúa Nueva Guinea ya están disponibles',
      description:
        'Los datos del sistema de monitoreo de embarcaciones (VMS) son proporcionados por la Autoridad Nacional de Pesca de Papúa Nueva Guinea. Ahora es posible rastrear la posición y la actividad de todos los barcos que componen la flota pesquera de la Asociación de la Industria Pesquera de Papúa Nueva Guinea que opera en las aguas nacionales de Papúa Nueva Guinea.',
    },
    fr: {
      title: 'Les données VMS de la Papouasie-Nouvelle-Guinée sont désormais disponibles',
      description:
        "Les données du système de surveillance des navires (VMS) sont fournies par l'Autorité nationale des pêches de Papouasie-Nouvelle-Guinée. Il est désormais possible de suivre la position et l'activité de tous les navires de la flotte de pêche de l'Association de l'industrie de la pêche de Papouasie-Nouvelle-Guinée opérant dans les eaux nationales de Papouasie-Nouvelle-Guinée.",
    },
    pt: {
      title: 'Os dados VMS da Papua Nova Guiné estão disponíveis',
      description:
        'Os dados do sistema de monitoramento de embarcações (VMS) são fornecidos pela Autoridade Pesqueira Nacional de Papua Nova Guiné. Agora é possível rastrear a posição e a atividade de todas as embarcações que compõem a frota de pesca da Associação da Indústria Pesqueira da Papua Nova Guiné que opera nas águas nacionais da Papua Nova Guiné.',
    },
  },
]

const AVAILABLE_HIGHLIGHT_CONFIGS = HIGHLIGHT_CONFIGS
  // sort them by release date descending
  .sort((a, b) => (a.releaseDateTimestamp > b.releaseDateTimestamp ? -1 : 1))
const HIGHLIGHT_CONFIG_LATEST = AVAILABLE_HIGHLIGHT_CONFIGS.at(0) as HighlightPanelConfig
const HIGHLIGHT_CONFIG_PREVIOUS = AVAILABLE_HIGHLIGHT_CONFIGS.at(1) as HighlightPanelConfig

const IS_PRODUCTION_ENV = IS_PRODUCTION_BUILD && IS_PRODUCTION_WORKSPACE_ENV

const DISPLAY_LATEST_POPUP =
  // Non production environments always show the latest popup
  !IS_PRODUCTION_ENV ||
  // Production displays the latest only after its release date
  Date.now() >= (HIGHLIGHT_CONFIG_LATEST?.releaseDateTimestamp as number)

const HIGHLIGHT_CONFIG = DISPLAY_LATEST_POPUP ? HIGHLIGHT_CONFIG_LATEST : HIGHLIGHT_CONFIG_PREVIOUS

export const HIGHLIGHT_DATAVIEW_INSTANCE_ID = HIGHLIGHT_CONFIG?.dataviewInstanceId

export default HIGHLIGHT_CONFIG
