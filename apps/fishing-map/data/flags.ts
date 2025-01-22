const flags = [
  {
    id: 'ABW',
    label: '阿鲁巴',
  },
  {
    id: 'AFG',
    label: '阿富汗',
  },
  {
    id: 'AGO',
    label: '安哥拉',
  },
  {
    id: 'AIA',
    label: '安圭拉',
  },
  {
    id: 'ALA',
    label: '奥兰群岛',
  },
  {
    id: 'ALB',
    label: '阿尔巴尼亚',
  },
  {
    id: 'AND',
    label: '安道尔',
  },
  {
    id: 'ARE',
    label: '阿拉伯联合酋长国',
  },
  {
    id: 'ARG',
    label: '阿根廷',
  },
  {
    id: 'ARM',
    label: '亚美尼亚',
    alias: 'Hayastan',
  },
  {
    id: 'ASM',
    label: '美属萨摩亚',
    alias: 'Amerika Sāmoa',
  },
  {
    id: 'ATA',
    label: '南极洲',
  },
  {
    id: 'ATF',
    label: '法属南部和南极领地',
    alias: 'Terres australes et antarctiques françaises',
  },
  {
    id: 'ATG',
    label: '安提瓜和巴布达',
  },
  {
    id: 'AUS',
    label: '澳大利亚',
  },
  {
    id: 'AUT',
    label: '奥地利',
    alias: 'Österreich',
  },
  {
    id: 'AZE',
    label: '阿塞拜疆',
    alias: 'Azərbaycan',
  },
  {
    id: 'BDI',
    label: '布隆迪',
  },
  {
    id: 'BEL',
    label: '比利时',
    alias: ['België', 'Belgique', 'Belgien'],
  },
  {
    id: 'BEN',
    label: '贝宁',
  },
  {
    id: 'BFA',
    label: '布基纳法索',
  },
  {
    id: 'BGD',
    label: '孟加拉国',
  },
  {
    id: 'BGR',
    label: '保加利亚',
    alias: 'Bǎlgariya',
  },
  {
    id: 'BHR',
    label: '巴林',
    alias: 'Baḥrayn',
  },
  {
    id: 'BHS',
    label: '巴哈马',
  },
  {
    id: 'BIH',
    label: '波斯尼亚和黑塞哥维那',
    alias: 'Hercegovina',
  },
  {
    id: 'BLM',
    label: '圣巴泰勒米岛',
  },
  {
    id: 'SHN',
    label: '圣赫勒拿、阿森松和特里斯坦达库尼亚',
  },
  {
    id: 'BLR',
    label: '白俄罗斯',
  },
  {
    id: 'BLZ',
    label: '伯利兹',
  },
  {
    id: 'BMU',
    label: '百慕大',
  },
  {
    id: 'BOL',
    label: '玻利维亚',
  },
  {
    id: 'BES',
    label: '加勒比荷兰',
    alias: 'Caribisch Nederland',
  },
  {
    id: 'BRA',
    label: '巴西',
    alias: 'Brasil',
  },
  {
    id: 'BRB',
    label: '巴巴多斯',
  },
  {
    id: 'BRN',
    label: '文莱',
  },
  {
    id: 'BTN',
    label: '不丹',
    alias: 'Druk Gyal Khap',
  },
  {
    id: 'BVT',
    label: '布韦岛',
  },
  {
    id: 'BWA',
    label: '博茨瓦纳',
  },
  {
    id: 'CAF',
    label: '中非共和国',
    alias: ['Ködörösêse tî Bêafrîka', 'République centrafricaine'],
  },
  {
    id: 'CAN',
    label: '加拿大',
  },
  {
    id: 'CCK',
    label: '科科斯（基林）群岛',
  },
  {
    id: 'CHE',
    label: '瑞士',
    alias: ['Schweizerische', 'Suisse', 'Svizzera', 'Svizra', 'Helvetica'],
  },
  {
    id: 'CHL',
    label: '智利',
  },
  {
    id: 'CHN',
    label: '中国',
    alias: 'Zhōnghuá Rénmín Gònghéguó',
  },
  {
    id: 'CIV',
    label: '科特迪瓦',
    alias: "Côte d'Ivoire",
  },
  {
    id: 'CMR',
    label: '喀麦隆',
    alias: 'Cameroun',
  },
  {
    id: 'COD',
    label: '刚果（金）',
    alias: 'Kôngo',
  },
  {
    id: 'COG',
    label: '刚果（布）',
    alias: 'Kôngo',
  },
  {
    id: 'COK',
    label: '库克群岛',
    alias: "Kūki 'Āirani",
  },
  {
    id: 'COL',
    label: '哥伦比亚',
  },
  {
    id: 'COM',
    label: '科摩罗',
    alias: ['Qumurī', 'Komori'],
  },
  {
    id: 'CPV',
    label: '佛得角',
    alias: 'Kabu Verdi',
  },
  {
    id: 'CRI',
    label: '哥斯达黎加',
  },
  {
    id: 'CUB',
    label: '古巴',
  },
  {
    id: 'CUW',
    label: '库拉索',
  },
  {
    id: 'CXR',
    label: '圣诞岛',
  },
  {
    id: 'CYM',
    label: '开曼群岛',
  },
  {
    id: 'CYP',
    label: '塞浦路斯',
    alias: 'Cumhuriyeti',
  },
  {
    id: 'CZE',
    label: '捷克共和国',
    alias: 'Česká',
  },
  {
    id: 'DEU',
    label: '德国',
    alias: 'Deutschland',
  },
  {
    id: 'DJI',
    label: '吉布提',
    alias: ['Jabuuti', 'Gabuutih'],
  },
  {
    id: 'DMA',
    label: '多米尼克',
  },
  {
    id: 'DNK',
    label: '丹麦',
    alias: 'Danmark',
  },
  {
    id: 'DOM',
    label: '多米尼加共和国',
    alias: 'República Dominicana',
  },
  {
    id: 'DZA',
    label: '阿尔及利亚',
    alias: 'Algérienne',
  },
  {
    id: 'ECU',
    label: '厄瓜多尔',
    alias: ['Ikwayur', 'Ekuatur'],
  },
  {
    id: 'EGY',
    label: '埃及',
  },
  {
    id: 'ERI',
    label: '厄立特里亚',
  },
  {
    id: 'ESH',
    label: '西撒哈拉',
    alias: ['Taneẓroft Tutrimt', 'Sahara Occidental'],
  },
  {
    id: 'ESP',
    label: '西班牙',
    alias: ['España'],
  },
  {
    id: 'EST',
    label: '爱沙尼亚',
    alias: 'Eesti',
  },
  {
    id: 'ETH',
    label: '埃塞俄比亚',
  },
  {
    id: 'FIN',
    label: '芬兰',
    alias: 'Suomen',
  },
  {
    id: 'FJI',
    label: '斐济',
    alias: 'Matanitu Tugalala o Viti',
  },
  {
    id: 'FLK',
    label: '福克兰群岛',
  },
  {
    id: 'FRA',
    label: '法国',
    alias: 'française',
  },
  {
    id: 'FRO',
    label: '法罗群岛',
  },
  {
    id: 'FSM',
    label: '密克罗尼西亚联邦',
  },
  {
    id: 'GAB',
    label: '加蓬',
  },
  {
    id: 'GBR',
    label: '英国',
  },
  {
    id: 'GEO',
    label: '格鲁吉亚',
  },
  {
    id: 'GGY',
    label: '根西岛',
  },
  {
    id: 'GHA',
    label: '加纳',
  },
  {
    id: 'GIB',
    label: '直布罗陀',
  },
  {
    id: 'GIN',
    label: '几内亚',
    alias: 'Guinée',
  },
  {
    id: 'GLP',
    label: '瓜德罗普',
  },
  {
    id: 'GMB',
    label: '冈比亚',
  },
  {
    id: 'GNB',
    label: '几内亚比绍',
  },
  {
    id: 'GNQ',
    label: '赤道几内亚',
  },
  {
    id: 'GRC',
    label: '希腊',
    alias: ['Ellinikí', 'Hellas'],
  },
  {
    id: 'GRD',
    label: '格林纳达',
  },
  {
    id: 'GRL',
    label: '格陵兰',
    alias: ['Kalaallit Nunaat', 'Grønland'],
  },
  {
    id: 'GTM',
    label: '危地马拉',
  },
  {
    id: 'GUF',
    label: '法属圭亚那',
    alias: 'Guyane',
  },
  {
    id: 'GUM',
    label: '关岛',
    alias: 'Guåhån',
  },
  {
    id: 'GUY',
    label: '圭亚那',
  },
  {
    id: 'HKG',
    label: '香港',
  },
  {
    id: 'HMD',
    label: '赫德岛和麦克唐纳群岛',
  },
  {
    id: 'HND',
    label: '洪都拉斯',
  },
  {
    id: 'HRV',
    label: '克罗地亚',
    alias: 'Hrvatska',
  },
  {
    id: 'HTI',
    label: '海地',
    alias: 'Ayiti',
  },
  {
    id: 'HUN',
    label: '匈牙利',
    alias: 'Magyarország',
  },
  {
    id: 'IDN',
    label: '印度尼西亚',
  },
  {
    id: 'IMN',
    label: '曼岛',
  },
  {
    id: 'IND',
    label: '印度',
  },
  {
    id: 'IOT',
    label: '英属印度洋领地',
  },
  {
    id: 'IRL',
    label: '爱尔兰',
    alias: ['Éire', 'Airlann'],
  },
  {
    id: 'IRN',
    label: '伊朗',
  },
  {
    id: 'IRQ',
    label: '伊拉克',
  },
  {
    id: 'ISL',
    label: '冰岛',
    alias: 'Ísland',
  },
  {
    id: 'ISR',
    label: '以色列',
  },
  {
    id: 'ITA',
    label: '意大利',
    alias: 'Italia',
  },
  {
    id: 'JAM',
    label: '牙买加',
  },
  {
    id: 'JEY',
    label: '泽西岛',
  },
  {
    id: 'JOR',
    label: '约旦',
  },
  {
    id: 'JPN',
    label: '日本',
    alias: ['Nippon', 'Nihon'],
  },
  {
    id: 'KAZ',
    label: '哈萨克斯坦',
    alias: 'Qazaqstan',
  },
  {
    id: 'KEN',
    label: '肯尼亚',
  },
  {
    id: 'KGZ',
    label: '吉尔吉斯斯坦',
    alias: 'Kırğız',
  },
  {
    id: 'KHM',
    label: '柬埔寨',
    alias: ['kampuciə', 'Cambodge'],
  },
  {
    id: 'KIR',
    label: '基里巴斯',
  },
  {
    id: 'KNA',
    label: '圣基茨和尼维斯',
  },
  {
    id: 'KOR',
    label: '韩国',
    alias: 'Daehan Minguk',
  },
  {
    id: 'UNK',
    label: '科索沃',
  },
  {
    id: 'KWT',
    label: '科威特',
  },
  {
    id: 'LAO',
    label: '老挝',
  },
  {
    id: 'LBN',
    label: '黎巴嫩',
    alias: ['Liban', 'Lubnān'],
  },
  {
    id: 'LBR',
    label: '利比里亚',
  },
  {
    id: 'LBY',
    label: '利比亚',
  },
  {
    id: 'LCA',
    label: '圣卢西亚',
  },
  {
    id: 'LIE',
    label: '列支敦士登',
  },
  {
    id: 'LKA',
    label: '斯里兰卡',
  },
  {
    id: 'LSO',
    label: '莱索托',
  },
  {
    id: 'LTU',
    label: '立陶宛',
    alias: 'Lietuva',
  },
  {
    id: 'LUX',
    label: '卢森堡',
    alias: 'Lëtzebuerg',
  },
  {
    id: 'LVA',
    label: '拉脱维亚',
    alias: 'Latvijas',
  },
  {
    id: 'MAC',
    label: '澳门',
  },
  {
    id: 'MAF',
    label: '圣马丁',
  },
  {
    id: 'MAR',
    label: '摩洛哥',
  },
  {
    id: 'MCO',
    label: '摩纳哥',
  },
  {
    id: 'MDA',
    label: '摩尔多瓦',
  },
  {
    id: 'MDG',
    label: '马达加斯加',
  },
  {
    id: 'MDV',
    label: '马尔代夫',
  },
  {
    id: 'MEX',
    label: '墨西哥',
  },
  {
    id: 'MHL',
    label: '马绍尔群岛',
  },
  {
    id: 'MKD',
    label: '马其顿',
  },
  {
    id: 'MLI',
    label: '马里',
  },
  {
    id: 'MLT',
    label: '马耳他',
  },
  {
    id: 'MMR',
    label: '缅甸',
    alias: 'Burma',
  },
  {
    id: 'MNE',
    label: '黑山',
    alias: 'Crna Gora',
  },
  {
    id: 'MNG',
    label: '蒙古',
  },
  {
    id: 'MNP',
    label: '北马里亚纳群岛',
  },
  {
    id: 'MOZ',
    label: '莫桑比克',
    alias: ['Mozambiki', 'Msumbiji'],
  },
  {
    id: 'MRT',
    label: '毛里塔尼亚',
    alias: 'Mūrītānīyah',
  },
  {
    id: 'MSR',
    label: '蒙特塞拉特',
  },
  {
    id: 'MTQ',
    label: '马提尼克',
  },
  {
    id: 'MUS',
    label: '毛里求斯',
  },
  {
    id: 'MWI',
    label: '马拉维',
  },
  {
    id: 'MYS',
    label: '马来西亚',
  },
  {
    id: 'MYT',
    label: '马约特',
  },
  {
    id: 'NAM',
    label: '纳米比亚',
  },
  {
    id: 'NCL',
    label: '新喀里多尼亚',
  },
  {
    id: 'NER',
    label: '尼日尔',
  },
  {
    id: 'NFK',
    label: '诺福克岛',
  },
  {
    id: 'NGA',
    label: '尼日利亚',
    alias: ['Nijeriya', 'Naìjíríyà'],
  },
  {
    id: 'NIC',
    label: '尼加拉瓜',
  },
  {
    id: 'NIU',
    label: '纽埃',
  },
  {
    id: 'NLD',
    label: '荷兰',
    alias: 'Nederland',
  },
  {
    id: 'NOR',
    label: '挪威',
    alias: 'Norge',
  },
  {
    id: 'NPL',
    label: '尼泊尔',
  },
  {
    id: 'NRU',
    label: '瑙鲁',
  },
  {
    id: 'NZL',
    label: '新西兰',
    alias: 'Aotearoa',
  },
  {
    id: 'OMN',
    label: '阿曼',
    alias: 'ʻUmān',
  },
  {
    id: 'PAK',
    label: '巴基斯坦',
  },
  {
    id: 'PAN',
    label: '巴拿马',
  },
  {
    id: 'PCN',
    label: '皮特凯恩群岛',
  },
  {
    id: 'PER',
    label: '秘鲁',
  },
  {
    id: 'PHL',
    label: '菲律宾',
    alias: 'Pilipinas',
  },
  {
    id: 'PLW',
    label: '帕劳',
  },
  { id: 'PNG', label: '巴布亚新几内亚' },
  {
    id: 'PRY',
    label: '巴拉圭',
  },
  {
    id: 'PSE',
    label: '巴勒斯坦',
  },
  {
    id: 'PYF',
    label: '法属波利尼西亚',
  },
  {
    id: 'QAT',
    label: '卡塔尔',
  },
  {
    id: 'REU',
    label: '留尼汪',
  },
  {
    id: 'ROU',
    label: '罗马尼亚',
  },
  {
    id: 'RUS',
    label: '俄罗斯',
    alias: '俄罗斯',
  },
  {
    id: 'RWA',
    label: '卢旺达',
  },
  {
    id: 'SAU',
    label: '沙特阿拉伯',
    alias: 'Arabīyah as-Saʿūdīyah',
  },
  {
    id: 'SDN',
    label: '苏丹',
  },
  {
    id: 'SEN',
    label: '塞内加尔',
  },
  {
    id: 'SGP',
    label: '新加坡',
  },
  {
    id: 'SGS',
    label: '南乔治亚和南桑威奇群岛',
  },
  {
    id: 'SHN',
    label: '圣赫勒拿、阿森松和特里斯坦达库尼亚',
  },
  {
    id: 'SJM',
    label: '斯瓦尔巴和扬马延',
  },
  {
    id: 'SLB',
    label: '所罗门群岛',
  },
  {
    id: 'SLE',
    label: '塞拉利昂',
  },
  {
    id: 'SLV',
    label: '萨尔瓦多',
  },
  {
    id: 'SMR',
    label: '圣马力诺',
  },
  {
    id: 'SOM',
    label: '索马里',
  },
  {
    id: 'SPM',
    label: '圣皮埃尔和密克隆',
  },
  {
    id: 'SRB',
    label: '塞尔维亚',
  },
  {
    id: 'SSD',
    label: '南苏丹',
  },
  {
    id: 'STP',
    label: '圣多美和普林西比',
  },
  {
    id: 'SUR',
    label: '苏里南',
  },
  {
    id: 'SVK',
    label: '斯洛伐克',
    alias: 'Slovenská',
  },
  {
    id: 'SVN',
    label: '斯洛文尼亚',
    alias: 'Slovenija',
  },
  {
    id: 'SWE',
    label: '瑞典',
    alias: 'Sverige',
  },
  {
    id: 'SWZ',
    label: '斯威士兰',
  },
  {
    id: 'SXM',
    label: '圣马丁',
  },
  {
    id: 'SYC',
    label: '塞舌尔',
  },
  {
    id: 'SYR',
    label: '叙利亚',
  },
  {
    id: 'TCA',
    label: '特克斯和凯科斯群岛',
  },
  {
    id: 'TCD',
    label: '乍得',
  },
  {
    id: 'TGO',
    label: '多哥',
  },
  {
    id: 'THA',
    label: '泰国',
  },
  {
    id: 'TJK',
    label: '塔吉克斯坦',
  },
  {
    id: 'TKL',
    label: '托克劳',
  },
  {
    id: 'TKM',
    label: '土库曼斯坦',
  },
  {
    id: 'TLS',
    label: '东突尼斯',
  },
  {
    id: 'TON',
    label: '汤加',
  },
  {
    id: 'TTO',
    label: '特立尼达和多巴哥',
  },
  {
    id: 'TUN',
    label: '突尼斯',
    alias: 'Tūnisīyah',
  },
  {
    id: 'TUR',
    label: '土耳其',
    alias: 'Türkiye',
  },
  {
    id: 'TUV',
    label: '图瓦卢',
  },
  {
    id: 'TWN',
    label: '中国台北',
    alias: ['台湾'],
  },
  {
    id: 'TZA',
    label: '坦桑尼亚',
  },
  {
    id: 'UGA',
    label: '乌干达',
  },
  {
    id: 'UKR',
    label: '乌克兰',
    alias: 'Ukrayina',
  },
  {
    id: 'UMI',
    label: '美国本土外小岛屿',
  },
  {
    id: 'URY',
    label: '乌拉圭',
  },
  {
    id: 'USA',
    label: '美国',
  },
  {
    id: 'UZB',
    label: '乌兹别克斯坦',
  },
  {
    id: 'VAT',
    label: '梵蒂冈',
  },
  {
    id: 'VCT',
    label: '圣文森特和格林纳丁斯',
  },
  {
    id: 'VEN',
    label: '委内瑞拉',
  },
  {
    id: 'VGB',
    label: '英属维尔京群岛',
  },
  {
    id: 'VIR',
    label: '美属维尔京群岛',
  },
  {
    id: 'VNM',
    label: '越南',
  },
  {
    id: 'VUT',
    label: '瓦努阿图',
  },
  {
    id: 'WLF',
    label: '瓦利斯和富图纳',
  },
  {
    id: 'WSM',
    label: '萨摩亚',
  },
  {
    id: 'YEM',
    label: '也门',
  },
  {
    id: 'ZAF',
    label: '南非',
  },
  {
    id: 'ZMB',
    label: '赞比亚',
  },
  {
    id: 'ZWE',
    label: '津巴布韦',
  },
]

export default flags
