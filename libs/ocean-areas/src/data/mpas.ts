import { FeatureCollection } from 'geojson'
import { OceanAreaProperties } from '../ocean-areas'

const mpasAreas: FeatureCollection<any, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [169.338, -52.658],
            [169.338, -52.408],
            [168.655, -52.408],
            [168.655, -52.658],
            [169.338, -52.658],
          ],
        ],
      },
      properties: { name: 'Moutere Ihupuku / Campbell Island', type: 'mpa', area: 1128 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [179.173, -49.85],
            [179.084, -49.378],
            [178.375, -49.512],
            [178.463, -49.983],
            [179.173, -49.85],
          ],
        ],
      },
      properties: { name: 'Moutere Mahue / Antipodes Island', type: 'mpa', area: 2163 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [178.904, -47.968],
            [179.36, -47.968],
            [179.36, -47.546],
            [178.903, -47.546],
            [178.904, -47.968],
          ],
        ],
      },
      properties: { name: 'Moutere Hauriri / Bounty Islands', type: 'mpa', area: 1041 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [174.083, -32.133],
            [174.5, -32.133],
            [174.5, -31.833],
            [174.083, -31.833],
            [174.083, -32.133],
          ],
        ],
      },
      properties: { name: '2B2 a', type: 'mpa', area: 1314 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [173.833, -34.333],
            [174.25, -34.333],
            [174.25, -33.917],
            [173.833, -33.917],
            [173.833, -34.333],
          ],
        ],
      },
      properties: { name: '2B2 b', type: 'mpa', area: 1780 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [170.75, -32],
            [171.167, -32],
            [171.167, -31.583],
            [170.75, -31.583],
            [170.75, -32],
          ],
        ],
      },
      properties: { name: '2B2 c', type: 'mpa', area: 1829 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [171.833, -37.75],
            [172.583, -37.75],
            [172.583, -37.333],
            [171.833, -37.333],
            [171.833, -37.75],
          ],
        ],
      },
      properties: { name: '2B2 d', type: 'mpa', area: 3073 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [178.333, -35.917],
            [178.667, -35.917],
            [178.667, -35.583],
            [178.333, -35.583],
            [178.333, -35.917],
          ],
        ],
      },
      properties: { name: '6B2 b', type: 'mpa', area: 1118 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-173.95, -44.933],
            [-173.417, -44.933],
            [-173.417, -44.55],
            [-173.95, -44.55],
            [-173.95, -44.933],
          ],
        ],
      },
      properties: { name: '4C2 e', type: 'mpa', area: 1799 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [162.167, -48],
            [162.167, -48.75],
            [162.833, -48.75],
            [162.833, -48],
            [162.167, -48],
          ],
        ],
      },
      properties: { name: '15JA a', type: 'mpa', area: 4115 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-175, -51],
            [-175, -48.5],
            [-179, -48.5],
            [-179, -51],
            [-175, -51],
          ],
        ],
      },
      properties: { name: '15JA2 b (Bollons)', type: 'mpa', area: 80062 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [163.583, -51.417],
            [165, -51.417],
            [165, -50.5],
            [163.583, -50.5],
            [163.583, -51.417],
          ],
        ],
      },
      properties: { name: '15JA2 c', type: 'mpa', area: 10136 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-70.705, 48.396],
            [-70.735, 47.68],
            [-69.316, 47.62],
            [-69.286, 48.336],
            [-70.705, 48.396],
          ],
        ],
      },
      properties: { name: 'Parc marin du Saguenay - Saint-Laurent', type: 'mpa', area: 1248 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-17.837, 21.786],
            [-17.087, 20.542],
            [-14.135, 22.321],
            [-14.884, 23.565],
            [-17.837, 21.786],
          ],
        ],
      },
      properties: { name: 'Dakhla National Park', type: 'mpa', area: 20065 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [15.6, -31],
            [16, -31],
            [16, -30.667],
            [15.6, -30.667],
            [15.6, -31],
          ],
        ],
      },
      properties: { name: 'Childs Bank Marine Protected Area', type: 'mpa', area: 1211 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [25.708, -36.398],
            [25.05, -36.476],
            [25.178, -37.547],
            [25.835, -37.468],
            [25.708, -36.398],
          ],
        ],
      },
      properties: { name: 'Agulhas Front Marine Protected Area', type: 'mpa', area: 6258 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [33.252, -28.522],
            [33.252, -26.858],
            [32.401, -26.858],
            [32.401, -28.522],
            [33.252, -28.522],
          ],
        ],
      },
      properties: { name: 'iSimangaliso Marine Protected Area', type: 'mpa', area: 10709 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [20.967, -35],
            [20.499, -35],
            [20.499, -36.033],
            [20.967, -36.033],
            [20.967, -35],
          ],
        ],
      },
      properties: { name: 'Agulhas Bank Complex Marine Protected Area', type: 'mpa', area: 4313 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [14.162, -29.667],
            [14.162, -30.167],
            [15.167, -30.167],
            [15.167, -29.667],
            [14.162, -29.667],
          ],
        ],
      },
      properties: { name: 'Orange Shelf Edge Marine Protected Area', type: 'mpa', area: 1841 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [22.624, -35.891],
            [21.667, -35.891],
            [21.666, -37.756],
            [22.623, -37.756],
            [22.624, -35.891],
          ],
        ],
      },
      properties: {
        name: 'Southwest Indian Seamount Marine Protected Area',
        type: 'mpa',
        area: 7559,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [17.833, -37.674],
            [19.333, -37.674],
            [19.333, -36.333],
            [17.833, -36.333],
            [17.833, -37.674],
          ],
        ],
      },
      properties: {
        name: 'Southeast Atlantic Seamount Marine Protected Area',
        type: 'mpa',
        area: 7725,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [30.309, -30.7],
            [30.309, -30.978],
            [30.817, -30.978],
            [30.817, -30.7],
            [30.309, -30.7],
          ],
        ],
      },
      properties: { name: 'Protea Banks Marine Protected Area', type: 'mpa', area: 1190 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [25.703, -33.619],
            [25.665, -33.853],
            [26.511, -33.99],
            [26.549, -33.757],
            [25.703, -33.619],
          ],
        ],
      },
      properties: { name: 'Addo Elephant Marine Protected Area', type: 'mpa', area: 1127 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [32.256, -28.937],
            [31.788, -28.635],
            [31.197, -29.55],
            [31.666, -29.852],
            [32.256, -28.937],
          ],
        ],
      },
      properties: { name: 'uThukela Marine Protected Area', type: 'mpa', area: 4099 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [28.9, -32.936],
            [28.669, -32.552],
            [27.048, -33.525],
            [27.279, -33.91],
            [28.9, -32.936],
          ],
        ],
      },
      properties: { name: 'Amathole Offshore Marine Protected Area', type: 'mpa', area: 4214 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [110.521, -5.917],
            [110.521, -5.678],
            [110.099, -5.678],
            [110.099, -5.917],
            [110.521, -5.917],
          ],
        ],
      },
      properties: { name: 'Karimunjawa', type: 'mpa', area: 1198 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [141.258, 38.268],
            [141.905, 38.184],
            [142.205, 40.471],
            [141.559, 40.555],
            [141.258, 38.268],
          ],
        ],
      },
      properties: { name: 'Sanriku Fukko (reconstruction)', type: 'mpa', area: 1048 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-46.942, -24.576],
            [-47.208, -24.319],
            [-48.13, -25.273],
            [-47.864, -25.53],
            [-46.942, -24.576],
          ],
        ],
      },
      properties: { name: 'Apa Marinha Do Litoral Sul', type: 'mpa', area: 3700 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-47.123, -24.356],
            [-46.862, -24.862],
            [-45.576, -24.196],
            [-45.838, -23.691],
            [-47.123, -24.356],
          ],
        ],
      },
      properties: { name: 'Apa Marinha Do Litoral Centro', type: 'mpa', area: 4553 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-45.935, -23.834],
            [-45.731, -24.254],
            [-44.539, -23.675],
            [-44.743, -23.255],
            [-45.935, -23.834],
          ],
        ],
      },
      properties: { name: 'Apa Marinha Do Litoral Norte', type: 'mpa', area: 3178 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-39.81, -20.234],
            [-39.691, -19.905],
            [-40.085, -19.763],
            [-40.204, -20.092],
            [-39.81, -20.234],
          ],
        ],
      },
      properties: { name: 'Área De Proteção Ambiental Costa Das Algas', type: 'mpa', area: 1156 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [125.242, -15.566],
            [124.809, -14.829],
            [123.31, -15.709],
            [123.742, -16.446],
            [125.242, -15.566],
          ],
        ],
      },
      properties: { name: 'Lalang-garram / Camden Sound', type: 'mpa', area: 6804 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [119.443, -19.965],
            [119.581, -20.267],
            [121.649, -19.321],
            [121.511, -19.019],
            [119.443, -19.965],
          ],
        ],
      },
      properties: { name: 'Eighty Mile Beach', type: 'mpa', area: 2007 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [115.458, -33.556],
            [114.958, -33.45],
            [114.76, -34.387],
            [115.26, -34.493],
            [115.458, -33.556],
          ],
        ],
      },
      properties: { name: 'Ngari Capes', type: 'mpa', area: 1229 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [159.15, -27.15],
            [159.65, -27.15],
            [159.65, -26.081],
            [159.15, -26.081],
            [159.15, -27.15],
          ],
        ],
      },
      properties: { name: 'Gifford', type: 'mpa', area: 5852 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [78.969, -51.917],
            [78.01, -49.027],
            [70.672, -51.463],
            [71.631, -54.353],
            [78.969, -51.917],
          ],
        ],
      },
      properties: { name: 'Heard Island and McDonald Islands', type: 'mpa', area: 70845 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [162.759, -18.67],
            [163.341, -18.682],
            [163.359, -17.807],
            [162.777, -17.795],
            [162.759, -18.67],
          ],
        ],
      },
      properties: { name: "Atolls d'Entrecasteaux", type: 'mpa', area: 3524 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [174.313, -25.594],
            [173.487, -14.093],
            [155.973, -15.351],
            [156.799, -26.852],
            [174.313, -25.594],
          ],
        ],
      },
      properties: { name: 'Natural Park of the Coral Sea', type: 'mpa', area: 1291643 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [14.988, 44.81],
            [14.5, 45.347],
            [13.966, 44.862],
            [14.455, 44.324],
            [14.988, 44.81],
          ],
        ],
      },
      properties: { name: 'Kvarnerski otoci', type: 'mpa', area: 1141 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [21.205, 57.758],
            [21.249, 57.421],
            [22.82, 57.63],
            [22.775, 57.967],
            [21.205, 57.758],
          ],
        ],
      },
      properties: { name: 'Irbes saurums', type: 'mpa', area: 1719 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [17.757, 42.707],
            [17.773, 42.914],
            [16.664, 43.001],
            [16.647, 42.794],
            [17.757, 42.707],
          ],
        ],
      },
      properties: { name: 'Lastovski i Mljetski kanal', type: 'mpa', area: 1086 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [23.516, 56.886],
            [23.687, 57.101],
            [22.704, 57.882],
            [22.533, 57.667],
            [23.516, 56.886],
          ],
        ],
      },
      properties: { name: 'Rigas lica rietumu piekraste', type: 'mpa', area: 1318 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.604, 53.559],
            [6.393, 54.018],
            [4.33, 53.069],
            [4.541, 52.611],
            [6.604, 53.559],
          ],
        ],
      },
      properties: { name: 'Noordzeekustzone', type: 'mpa', area: 1442 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.7, 58.583],
            [10.029, 58.583],
            [10.029, 58.267],
            [10.7, 58.267],
            [10.7, 58.583],
          ],
        ],
      },
      properties: { name: 'Bratten', type: 'mpa', area: 1205 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [20.577, 63.466],
            [20.583, 62.789],
            [22.131, 62.802],
            [22.125, 63.479],
            [20.577, 63.466],
          ],
        ],
      },
      properties: { name: 'Merenkurkun saaristo', type: 'mpa', area: 1274 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.833, 55.624],
            [6.778, 55.297],
            [8.042, 55.084],
            [8.097, 55.411],
            [6.833, 55.624],
          ],
        ],
      },
      properties: { name: 'Sydlige Nordsø', type: 'mpa', area: 2467 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-85.573, 16.315],
            [-85.716, 16.793],
            [-87.278, 16.328],
            [-87.136, 15.85],
            [-85.573, 16.315],
          ],
        ],
      },
      properties: { name: 'Islas de la Bahía', type: 'mpa', area: 6495 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-87.604, 17.637],
            [-87.82, 17.737],
            [-88.06, 17.212],
            [-87.844, 17.113],
            [-87.604, 17.637],
          ],
        ],
      },
      properties: { name: 'General Use Zone', type: 'mpa', area: 1122 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-8.638, 49.213],
            [-8.882, 49.604],
            [-9.601, 49.155],
            [-9.356, 48.764],
            [-8.638, 49.213],
          ],
        ],
      },
      properties: { name: 'South West Deeps (West)', type: 'mpa', area: 1825 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.018, 55.999],
            [-0.018, 55.499],
            [1.344, 55.501],
            [1.343, 56.001],
            [-0.018, 55.999],
          ],
        ],
      },
      properties: { name: 'Swallow Sand', type: 'mpa', area: 4736 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-1.205, 56.843],
            [-2.107, 56.837],
            [-2.101, 55.947],
            [-1.2, 55.953],
            [-1.205, 56.843],
          ],
        ],
      },
      properties: { name: 'Firth of Forth Banks Complex', type: 'mpa', area: 2126 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.19, 59.532],
            [-2.424, 60.113],
            [-4.144, 59.421],
            [-3.91, 58.84],
            [-2.19, 59.532],
          ],
        ],
      },
      properties: { name: 'North-west Orkney', type: 'mpa', area: 4356 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [1.6, 56.906],
            [1.761, 57.422],
            [0.944, 57.677],
            [0.783, 57.161],
            [1.6, 56.906],
          ],
        ],
      },
      properties: { name: 'East of Gannet &amp;amp; Montrose Fields', type: 'mpa', area: 1835 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-1.525, 61.259],
            [-1.641, 61.569],
            [-4.554, 60.478],
            [-4.439, 60.169],
            [-1.525, 61.259],
          ],
        ],
      },
      properties: { name: 'Faroe-Shetland Sponge Belt', type: 'mpa', area: 5255 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-8.609, 58.019],
            [-8.507, 58.343],
            [-9.696, 58.718],
            [-9.798, 58.394],
            [-8.609, 58.019],
          ],
        ],
      },
      properties: { name: 'Geikie Slide and Hebridean Slope', type: 'mpa', area: 2211 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-16.648, 57.85],
            [-16.141, 57.85],
            [-16.141, 58.25],
            [-16.648, 58.25],
            [-16.648, 57.85],
          ],
        ],
      },
      properties: { name: 'Hatton-Rockall Basin', type: 'mpa', area: 1253 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0.962, 62.546],
            [0.02, 64.181],
            [-2.79, 62.564],
            [-1.848, 60.928],
            [0.962, 62.546],
          ],
        ],
      },
      properties: { name: 'North-east Faroe-Shetland Channel', type: 'mpa', area: 23613 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-10.982, 59.755],
            [-11.084, 58.972],
            [-9.244, 58.731],
            [-9.141, 59.513],
            [-10.982, 59.755],
          ],
        ],
      },
      properties: { name: 'Rosemary Bank Seamount', type: 'mpa', area: 6915 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-8.962, 56.358],
            [-8.962, 56.845],
            [-10.638, 56.845],
            [-10.638, 56.358],
            [-8.962, 56.358],
          ],
        ],
      },
      properties: { name: 'The Barra Fan and Hebrides Terrace Seamount', type: 'mpa', area: 4376 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.954, 59.507],
            [-4.017, 59.922],
            [-6.12, 59.603],
            [-6.058, 59.188],
            [-3.954, 59.507],
          ],
        ],
      },
      properties: { name: 'West Shetland Shelf', type: 'mpa', area: 4081 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-8.586, 43.332],
            [-8.919, 43.782],
            [-9.824, 43.114],
            [-9.492, 42.664],
            [-8.586, 43.332],
          ],
        ],
      },
      properties: { name: 'Espacio marino de la Costa da Morte', type: 'mpa', area: 3162 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-12.332, 43.279],
            [-12.332, 42.25],
            [-11.167, 42.25],
            [-11.167, 43.279],
            [-12.332, 43.279],
          ],
        ],
      },
      properties: { name: 'Banco de Galicia', type: 'mpa', area: 8712 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-8.799, 42.067],
            [-8.799, 42.642],
            [-9.382, 42.642],
            [-9.382, 42.067],
            [-8.799, 42.067],
          ],
        ],
      },
      properties: { name: 'Espacio marino de las Rias Baixas de Galicia', type: 'mpa', area: 2222 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-6.529, 36.526],
            [-6.379, 36.822],
            [-7.264, 37.273],
            [-7.415, 36.977],
            [-6.529, 36.526],
          ],
        ],
      },
      properties: { name: 'Golfo de Cadiz', type: 'mpa', area: 2321 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [166.615, 11.025],
            [166.622, 11.27],
            [166.203, 11.282],
            [166.196, 11.037],
            [166.615, 11.025],
          ],
        ],
      },
      properties: { name: 'Ailinginae', type: 'mpa', area: 1029 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [166.909, 10.988],
            [167.189, 11.501],
            [166.73, 11.751],
            [166.451, 11.238],
            [166.909, 10.988],
          ],
        ],
      },
      properties: { name: 'Rongelap', type: 'mpa', area: 2800 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-123.886, 46.243],
            [-124.434, 46.285],
            [-124.76, 42.032],
            [-124.212, 41.99],
            [-123.886, 46.243],
          ],
        ],
      },
      properties: { name: 'Oregon Islands National Wildlif', type: 'mpa', area: 3257 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-156.5, 55.95],
            [-156.5, 56.25],
            [-157, 56.25],
            [-157, 55.95],
            [-156.5, 55.95],
          ],
        ],
      },
      properties: { name: 'Semidi', type: 'mpa', area: 1039 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-118.932, 33.305],
            [-118.706, 33.866],
            [-120.454, 34.57],
            [-120.68, 34.008],
            [-118.932, 33.305],
          ],
        ],
      },
      properties: { name: 'Channel Islands National Marine Sanctuary', type: 'mpa', area: 3804 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.994, 35.419],
            [-121.104, 35.555],
            [-121.277, 37.979],
            [-123.168, 37.843],
            [-122.994, 35.419],
          ],
        ],
      },
      properties: { name: 'Monterey Bay National Marine Sanctuary', type: 'mpa', area: 15795 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-124, 38.3],
            [-124, 37.767],
            [-123.082, 37.767],
            [-123.082, 38.3],
            [-124, 38.3],
          ],
        ],
      },
      properties: { name: 'Cordell Bank National Marine Sanctuary', type: 'mpa', area: 3330 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-123.041, 37.335],
            [-122.498, 37.875],
            [-123.972, 39.359],
            [-124.516, 38.819],
            [-123.041, 37.335],
          ],
        ],
      },
      properties: { name: 'Greater Farallones National Marine Sanctuary', type: 'mpa', area: 8546 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.024, 28.17],
            [-83.018, 27.642],
            [-82.54, 27.647],
            [-82.545, 28.176],
            [-83.024, 28.17],
          ],
        ],
      },
      properties: { name: 'Pinellas County Aquatic Preserve', type: 'mpa', area: 1425 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-124.686, 48.611],
            [-125.687, 48.266],
            [-125.179, 46.787],
            [-124.177, 47.131],
            [-124.686, 48.611],
          ],
        ],
      },
      properties: { name: 'Olympic Coast National Marine Sanctuary', type: 'mpa', area: 8265 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [142.222, 11.088],
            [147.574, 10.251],
            [149.597, 23.189],
            [144.245, 24.026],
            [142.222, 11.088],
          ],
        ],
      },
      properties: { name: 'Mariana Trench National Wildlife Refuge', type: 'mpa', area: 204500 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [166.782, 19.005],
            [166.939, 19.418],
            [166.478, 19.594],
            [166.32, 19.181],
            [166.782, 19.005],
          ],
        ],
      },
      properties: { name: 'Wake Atoll National Wildlife Refuge', type: 'mpa', area: 2014 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-171.093, -10.97],
            [-172.591, -13.062],
            [-167.983, -16.362],
            [-166.485, -14.27],
            [-171.093, -10.97],
          ],
        ],
      },
      properties: { name: 'National Marine Sanctuary of American Samoa', type: 'mpa', area: 35122 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-62.061, 16.36],
            [-61.927, 15.882],
            [-61.294, 16.058],
            [-61.428, 16.537],
            [-62.061, 16.36],
          ],
        ],
      },
      properties: { name: 'Guadeloupe', type: 'mpa', area: 2478 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.631, 18.234],
            [-63.387, 13.924],
            [-57.41, 14.262],
            [-57.654, 18.572],
            [-63.631, 18.234],
          ],
        ],
      },
      properties: { name: 'Agoa', type: 'mpa', area: 144081 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [91.536, 21.852],
            [91.333, 21.854],
            [91.33, 21.131],
            [91.532, 21.129],
            [91.536, 21.852],
          ],
        ],
      },
      properties: { name: 'Marine Reserve', type: 'mpa', area: 1636 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [89.68, 21.632],
            [89.337, 21.633],
            [89.336, 21.108],
            [89.679, 21.108],
            [89.68, 21.632],
          ],
        ],
      },
      properties: { name: 'Swatch of no ground Marine Protected Area', type: 'mpa', area: 1728 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-65.316, -41.999],
            [-65.32, -43.51],
            [-63.387, -43.515],
            [-63.382, -42.004],
            [-65.316, -41.999],
          ],
        ],
      },
      properties: { name: 'Valdés', type: 'mpa', area: 19493 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [124.024, -8.229],
            [123.729, -7.906],
            [123.045, -8.528],
            [123.34, -8.852],
            [124.024, -8.229],
          ],
        ],
      },
      properties: { name: 'Pulau Lembata', type: 'mpa', area: 1940 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [122.562, -8.641],
            [123.186, -8.833],
            [123.388, -8.175],
            [122.765, -7.983],
            [122.562, -8.641],
          ],
        ],
      },
      properties: { name: 'KKPD KABUPATEN FLORES TIMUR', type: 'mpa', area: 1510 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [122.486, -3],
            [122.288, -3.305],
            [123.158, -3.87],
            [123.356, -3.565],
            [122.486, -3],
          ],
        ],
      },
      properties: { name: 'KKPD KABUPATEN MOROWALI', type: 'mpa', area: 2701 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [121.321, 0.322],
            [120.639, 0.713],
            [119.857, -0.65],
            [120.54, -1.041],
            [121.321, 0.322],
          ],
        ],
      },
      properties: { name: 'KKPD TELUK TOMINI KABUPATEN PARIGI', type: 'mpa', area: 1219 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [108.927, -2.555],
            [108.749, -2.287],
            [108.238, -2.625],
            [108.416, -2.894],
            [108.927, -2.555],
          ],
        ],
      },
      properties: {
        name: 'KKPD GUGUSAN PULAU-PULAU MOMPARANG DAN PERAIRAN SEKITARNYA',
        type: 'mpa',
        area: 1260,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [132.344, -6.146],
            [132.619, -6.223],
            [132.78, -5.643],
            [132.505, -5.566],
            [132.344, -6.146],
          ],
        ],
      },
      properties: { name: 'Maluku Tenggara', type: 'mpa', area: 1498 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2.524, 56.096],
            [2.52, 56.617],
            [1.826, 56.611],
            [1.831, 56.09],
            [2.524, 56.096],
          ],
        ],
      },
      properties: { name: 'Fulmar', type: 'mpa', area: 2431 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-8.2, 50.5],
            [-8.2, 50.077],
            [-7.362, 50.077],
            [-7.362, 50.5],
            [-8.2, 50.5],
          ],
        ],
      },
      properties: { name: 'Greater Haig Fras', type: 'mpa', area: 2039 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-4.154, 49.476],
            [-4.213, 49.732],
            [-5.55, 49.427],
            [-5.491, 49.17],
            [-4.154, 49.476],
          ],
        ],
      },
      properties: { name: 'Western Channel', type: 'mpa', area: 1612 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-1.315, 46.814],
            [-2.23, 46.364],
            [-1.39, 44.655],
            [-0.475, 45.105],
            [-1.315, 46.814],
          ],
        ],
      },
      properties: { name: 'Estuaire De La Gironde Et Mer Des Pertuis', type: 'mpa', area: 6526 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.26, 55.365],
            [3.902, 55.909],
            [2.405, 54.923],
            [2.763, 54.379],
            [4.26, 55.365],
          ],
        ],
      },
      properties: { name: 'Doggersbank', type: 'mpa', area: 4763 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2.783, 54.292],
            [2.783, 53.848],
            [3.318, 53.848],
            [3.318, 54.292],
            [2.783, 54.292],
          ],
        ],
      },
      properties: { name: 'Klaverbank', type: 'mpa', area: 1536 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.08, 53.743],
            [4.219, 53.409],
            [5.372, 53.889],
            [5.233, 54.222],
            [4.08, 53.743],
          ],
        ],
      },
      properties: { name: 'Friese Front', type: 'mpa', area: 2877 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.445, 52.841],
            [6.394, 53.55],
            [4.802, 53.436],
            [4.853, 52.727],
            [6.445, 52.841],
          ],
        ],
      },
      properties: { name: 'Nnn-Fr', type: 'mpa', area: 2919 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-77.785, 23.541],
            [-77.41, 23.81],
            [-78.228, 24.948],
            [-78.603, 24.679],
            [-77.785, 23.541],
          ],
        ],
      },
      properties: { name: 'Westside National Park', type: 'mpa', area: 5143 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-76.295, 9.721],
            [-76.005, 9.721],
            [-76.005, 10.125],
            [-76.295, 10.125],
            [-76.295, 9.721],
          ],
        ],
      },
      properties: { name: 'Corales de Profundidad', type: 'mpa', area: 1427 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-15, 55.75],
            [-14.886, 55.576],
            [-13.831, 56.27],
            [-13.946, 56.444],
            [-15, 55.75],
          ],
        ],
      },
      properties: { name: 'South East Rockall Bank SAC', type: 'mpa', area: 1486 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-12.35, 42.25],
            [-11.167, 42.25],
            [-11.167, 43.279],
            [-12.35, 43.279],
            [-12.35, 42.25],
          ],
        ],
      },
      properties: { name: 'Banco de Galicia', type: 'mpa', area: 10235 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-6.807, 36.588],
            [-7.281, 36.697],
            [-7.478, 35.844],
            [-7.004, 35.735],
            [-6.807, 36.588],
          ],
        ],
      },
      properties: { name: 'Volcanes de fango del Golfo de Cádiz', type: 'mpa', area: 3184 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-6.6, 44.06],
            [-6.6, 43.681],
            [-5.6, 43.681],
            [-5.6, 44.06],
            [-6.6, 44.06],
          ],
        ],
      },
      properties: { name: 'Sistema de cañones submarinos de Avilés', type: 'mpa', area: 3389 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-12.25, 29.683],
            [-12.25, 30.374],
            [-13.136, 30.374],
            [-13.136, 29.683],
            [-12.25, 29.683],
          ],
        ],
      },
      properties: { name: 'Banco de la Concepción', type: 'mpa', area: 6121 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [3.08, 40.097],
            [3.124, 39.515],
            [4.225, 39.599],
            [4.181, 40.181],
            [3.08, 40.097],
          ],
        ],
      },
      properties: { name: 'Canal de Menorca', type: 'mpa', area: 3360 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-1.878, 36.545],
            [-1.911, 36.885],
            [-3.123, 36.769],
            [-3.091, 36.428],
            [-1.878, 36.545],
          ],
        ],
      },
      properties: { name: 'Sur de Almería - Seco de los Olivos', type: 'mpa', area: 2839 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-8.586, 43.332],
            [-8.919, 43.782],
            [-9.824, 43.114],
            [-9.492, 42.664],
            [-8.586, 43.332],
          ],
        ],
      },
      properties: { name: 'Espacio marino de la Costa da Morte', type: 'mpa', area: 3162 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-11.167, 42.25],
            [-11.167, 43.279],
            [-12.332, 43.279],
            [-12.332, 42.25],
            [-11.167, 42.25],
          ],
        ],
      },
      properties: { name: 'ZEPA Banco de Galicia', type: 'mpa', area: 8712 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-8.799, 42.067],
            [-8.799, 42.642],
            [-9.382, 42.642],
            [-9.382, 42.067],
            [-8.799, 42.067],
          ],
        ],
      },
      properties: { name: 'Espacio marino de las Rías Baixas de Galicia', type: 'mpa', area: 2222 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-6.529, 36.526],
            [-6.379, 36.822],
            [-7.264, 37.273],
            [-7.415, 36.977],
            [-6.529, 36.526],
          ],
        ],
      },
      properties: { name: 'Golfo de Cádiz', type: 'mpa', area: 2321 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.151, 36.583],
            [-2.151, 36.842],
            [-2.905, 36.842],
            [-2.905, 36.583],
            [-2.151, 36.583],
          ],
        ],
      },
      properties: { name: 'Bahía de Almería', type: 'mpa', area: 1274 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.355, 38.278],
            [-0.6, 38.35],
            [-0.809, 37.634],
            [-0.564, 37.563],
            [-0.355, 38.278],
          ],
        ],
      },
      properties: { name: 'Espacio marino de Tabarca-Cabo de Palos', type: 'mpa', area: 1264 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0.036, 38.119],
            [0.58, 38.148],
            [0.513, 39.357],
            [-0.03, 39.327],
            [0.036, 38.119],
          ],
        ],
      },
      properties: { name: 'Plataforma-talud marinos del Cabo de la Nao', type: 'mpa', area: 2683 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.116, 40.017],
            [0.441, 39.429],
            [1.792, 40.711],
            [1.234, 41.299],
            [-0.116, 40.017],
          ],
        ],
      },
      properties: {
        name: "Espacio marino del Delta de l'Ebre-Illes Columbretes",
        type: 'mpa',
        area: 9032,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [3.517, 40.181],
            [3.578, 39.894],
            [4.373, 40.063],
            [4.312, 40.35],
            [3.517, 40.181],
          ],
        ],
      },
      properties: { name: 'Espacio marino del norte y oeste de Menorca', type: 'mpa', area: 1615 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-17.39, 27.96],
            [-16.838, 27.96],
            [-16.838, 28.383],
            [-17.39, 28.383],
            [-17.39, 27.96],
          ],
        ],
      },
      properties: { name: 'Espacio marino de La Gomera-Teno', type: 'mpa', area: 2100 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-13.69, 29.446],
            [-13.616, 29.113],
            [-13.062, 29.236],
            [-13.135, 29.568],
            [-13.69, 29.446],
          ],
        ],
      },
      properties: { name: 'Espacio marino de los Islotes de Lanzarote', type: 'mpa', area: 1306 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-12.981, 29.732],
            [-12.25, 29.732],
            [-12.25, 30.374],
            [-12.981, 30.374],
            [-12.981, 29.732],
          ],
        ],
      },
      properties: { name: 'ZEPA Banco de la Concepción', type: 'mpa', area: 4538 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.151, 39.488],
            [0.836, 38.161],
            [4.646, 40.995],
            [3.659, 42.322],
            [-0.151, 39.488],
          ],
        ],
      },
      properties: {
        name: 'Corredor De Migración De Cetáceos Del Mediterráneo',
        type: 'mpa',
        area: 46419,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-62.946, 14.438],
            [-62.464, 13.174],
            [-57.062, 15.236],
            [-57.545, 16.5],
            [-62.946, 14.438],
          ],
        ],
      },
      properties: { name: 'Martinique', type: 'mpa', area: 47822 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-109.331, 10.589],
            [-109.508, 10.198],
            [-109.107, 10.016],
            [-108.929, 10.407],
            [-109.331, 10.589],
          ],
        ],
      },
      properties: {
        name: 'Aire Marine Protégée Dans Les Eaux Territoriales De L’Île De Clipperton',
        type: 'mpa',
        area: 1819,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-38.821, -13.152],
            [-38.348, -12.971],
            [-38.525, -12.511],
            [-38.997, -12.692],
            [-38.821, -13.152],
          ],
        ],
      },
      properties: {
        name: 'Área De Proteção Ambiental Baía De Todos Os Santos',
        type: 'mpa',
        area: 1393,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.966, 24.779],
            [-80.332, 25.117],
            [-80.902, 26.187],
            [-81.536, 25.849],
            [-80.966, 24.779],
          ],
        ],
      },
      properties: { name: 'Marjory Stoneman Douglas', type: 'mpa', area: 5417 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.797, 18.58],
            [-75.208, 18.61],
            [-75.237, 18.224],
            [-74.826, 18.193],
            [-74.797, 18.58],
          ],
        ],
      },
      properties: { name: 'Navassa Island National Wildlife Refuge', type: 'mpa', area: 1474 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [133.61, 34.056],
            [132.984, 34.584],
            [131.876, 33.271],
            [132.503, 32.743],
            [133.61, 34.056],
          ],
        ],
      },
      properties: { name: 'Common fishery right area (Ehime)', type: 'mpa', area: 1210 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [122.894, 24.438],
            [123.385, 23.546],
            [128.566, 26.399],
            [128.074, 27.292],
            [122.894, 24.438],
          ],
        ],
      },
      properties: { name: 'Common fishery right area (Okinawa)', type: 'mpa', area: 4232 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [129.49, 32.33],
            [129.898, 31.804],
            [130.829, 32.527],
            [130.421, 33.052],
            [129.49, 32.33],
          ],
        ],
      },
      properties: { name: 'Common fishery right area (Kumamoto)', type: 'mpa', area: 1271 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [130.895, 34.87],
            [130.674, 33.898],
            [132.408, 33.505],
            [132.628, 34.478],
            [130.895, 34.87],
          ],
        ],
      },
      properties: { name: 'Common fishery right area (Yamaguchi)', type: 'mpa', area: 3094 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [128.359, 27.014],
            [130.069, 26.581],
            [131.446, 32.02],
            [129.735, 32.452],
            [128.359, 27.014],
          ],
        ],
      },
      properties: { name: 'Common fishery right area (Kagoshima)', type: 'mpa', area: 3421 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [139.696, 38.387],
            [139.17, 38.981],
            [137.317, 37.342],
            [137.842, 36.747],
            [139.696, 38.387],
          ],
        ],
      },
      properties: { name: 'Common fishery right area (Niigata)', type: 'mpa', area: 1899 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [141.749, 40.451],
            [141.734, 41.599],
            [139.437, 41.568],
            [139.452, 40.42],
            [141.749, 40.451],
          ],
        ],
      },
      properties: { name: 'Common fishery right area (Aomori)', type: 'mpa', area: 1950 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [139.668, 35.641],
            [139.743, 34.846],
            [140.971, 34.962],
            [140.896, 35.757],
            [139.668, 35.641],
          ],
        ],
      },
      properties: { name: 'Common fishery right area (Chiba)', type: 'mpa', area: 1067 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [131.918, 32.681],
            [132.334, 33.007],
            [131.534, 34.028],
            [131.118, 33.702],
            [131.918, 32.681],
          ],
        ],
      },
      properties: { name: 'Common fishery right area (Oita)', type: 'mpa', area: 1408 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [129.52, 34.78],
            [127.472, 33.809],
            [128.45, 31.747],
            [130.497, 32.718],
            [129.52, 34.78],
          ],
        ],
      },
      properties: { name: 'Common fishery right area (Nagasaki)', type: 'mpa', area: 3110 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [141.413, 24.193],
            [143.012, 24.622],
            [140.215, 35.04],
            [138.616, 34.611],
            [141.413, 24.193],
          ],
        ],
      },
      properties: { name: 'Common fishery right area (Tokyo)', type: 'mpa', area: 1027 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [130.09, 34.274],
            [129.742, 33.11],
            [130.927, 32.756],
            [131.275, 33.92],
            [130.09, 34.274],
          ],
        ],
      },
      properties: { name: 'Common fishery right area (Fukuoka)', type: 'mpa', area: 1450 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [146.421, 42.087],
            [145.898, 46.184],
            [138.787, 45.276],
            [139.311, 41.179],
            [146.421, 42.087],
          ],
        ],
      },
      properties: { name: 'Common fishery right area (Hokkaido)', type: 'mpa', area: 48714 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [142.843, 44.663],
            [142.985, 44.815],
            [142.192, 45.555],
            [142.05, 45.402],
            [142.843, 44.663],
          ],
        ],
      },
      properties: { name: 'Soya tobu', type: 'mpa', area: 1052 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [140.746, 42.007],
            [140.975, 42.443],
            [140.468, 42.709],
            [140.239, 42.273],
            [140.746, 42.007],
          ],
        ],
      },
      properties: { name: 'Funka wan', type: 'mpa', area: 2003 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [143.978, 42.745],
            [143.81, 42.896],
            [143.226, 42.249],
            [143.394, 42.097],
            [143.978, 42.745],
          ],
        ],
      },
      properties: { name: 'Tokachi', type: 'mpa', area: 1413 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [144.227, 42.997],
            [144.263, 42.778],
            [145.364, 42.959],
            [145.328, 43.178],
            [144.227, 42.997],
          ],
        ],
      },
      properties: { name: 'Kushiro tobu', type: 'mpa', area: 1134 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [145.947, 43.317],
            [145.647, 43.868],
            [145.058, 43.547],
            [145.358, 42.997],
            [145.947, 43.317],
          ],
        ],
      },
      properties: { name: 'Nemuro hanto', type: 'mpa', area: 1886 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [142.852, 44.748],
            [142.766, 44.199],
            [145.266, 43.807],
            [145.352, 44.356],
            [142.852, 44.748],
          ],
        ],
      },
      properties: { name: 'Abashiri', type: 'mpa', area: 2257 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [136.211, 36.312],
            [136.553, 36.171],
            [137.22, 37.792],
            [136.877, 37.933],
            [136.211, 36.312],
          ],
        ],
      },
      properties: { name: 'Sotoura kaga', type: 'mpa', area: 1525 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-98.431, 75.825],
            [-98.527, 76.95],
            [-104.501, 76.437],
            [-104.404, 75.312],
            [-98.431, 75.825],
          ],
        ],
      },
      properties: { name: 'Qausuittuq National Park Of Canada', type: 'mpa', area: 11027 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2.524, 56.096],
            [2.52, 56.617],
            [1.826, 56.611],
            [1.831, 56.09],
            [2.524, 56.096],
          ],
        ],
      },
      properties: { name: 'Fulmar', type: 'mpa', area: 2431 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-8.2, 50.5],
            [-8.2, 50.077],
            [-7.362, 50.077],
            [-7.362, 50.5],
            [-8.2, 50.5],
          ],
        ],
      },
      properties: { name: 'Greater Haig Fras', type: 'mpa', area: 2039 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-4.154, 49.476],
            [-4.213, 49.732],
            [-5.55, 49.427],
            [-5.491, 49.17],
            [-4.154, 49.476],
          ],
        ],
      },
      properties: { name: 'Western Channel', type: 'mpa', area: 1612 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-114.98, 18.497],
            [-114.766, 17.611],
            [-110.45, 18.651],
            [-110.664, 19.538],
            [-114.98, 18.497],
          ],
        ],
      },
      properties: { name: 'Archipiélago de Revillagigedo', type: 'mpa', area: 6409 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [37.415, 19.666],
            [37.823, 19.772],
            [37.37, 21.52],
            [36.961, 21.414],
            [37.415, 19.666],
          ],
        ],
      },
      properties: {
        name: 'Sanganeb Marine National Park and Dungonab Bay - Mukkawar Island Marine National Park',
        type: 'mpa',
        area: 2594,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [135.41, 11.693],
            [128.203, 10.006],
            [130.297, 1.063],
            [137.504, 2.75],
            [135.41, 11.693],
          ],
        ],
      },
      properties: { name: 'Palau National Marine Sanctuary', type: 'mpa', area: 503522 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-15.675, 30.267],
            [-16.102, 30.264],
            [-16.1, 29.99],
            [-15.673, 29.993],
            [-15.675, 30.267],
          ],
        ],
      },
      properties: { name: 'Ilhas Selvagens', type: 'mpa', area: 1250 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-9.515, 39.56],
            [-9.189, 39.383],
            [-8.556, 40.544],
            [-8.882, 40.722],
            [-9.515, 39.56],
          ],
        ],
      },
      properties: { name: 'Aveiro/ Nazaré', type: 'mpa', area: 2929 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-9.393, 39.121],
            [-9.817, 39.045],
            [-9.709, 38.438],
            [-9.285, 38.513],
            [-9.393, 39.121],
          ],
        ],
      },
      properties: { name: 'Cabo Raso', type: 'mpa', area: 1336 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-15.377, 28.157],
            [-14.703, 27.25],
            [-12.606, 28.811],
            [-13.28, 29.717],
            [-15.377, 28.157],
          ],
        ],
      },
      properties: {
        name: 'Espacio marino del oriente y sur de Lanzarote-Fuerteventura',
        type: 'mpa',
        area: 14393,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-12.662, 36.721],
            [-12.238, 35.57],
            [-10.074, 36.368],
            [-10.498, 37.518],
            [-12.662, 36.721],
          ],
        ],
      },
      properties: { name: 'Banco Gorringe', type: 'mpa', area: 22914 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [21.205, 57.758],
            [21.249, 57.421],
            [22.82, 57.63],
            [22.775, 57.967],
            [21.205, 57.758],
          ],
        ],
      },
      properties: { name: 'Irbes saurums', type: 'mpa', area: 1719 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [23.516, 56.886],
            [23.687, 57.101],
            [22.704, 57.882],
            [22.533, 57.667],
            [23.516, 56.886],
          ],
        ],
      },
      properties: { name: 'Rigas lica rietumu piekraste', type: 'mpa', area: 1318 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-54.873, -34.781],
            [-54.036, -35.205],
            [-52.82, -32.8],
            [-53.657, -32.377],
            [-54.873, -34.781],
          ],
        ],
      },
      properties: { name: 'Bañados del Este y Franja Costera', type: 'mpa', area: 12445 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-75.779, -26.482],
            [-78.264, -21.56],
            [-84.859, -24.89],
            [-82.374, -29.811],
            [-75.779, -26.482],
          ],
        ],
      },
      properties: { name: 'Nazca-Desventuradas', type: 'mpa', area: 299913 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-132.631, -20.293],
            [-133.607, -28.014],
            [-121.698, -29.52],
            [-120.722, -21.798],
            [-132.631, -20.293],
          ],
        ],
      },
      properties: { name: 'Pitcairn Islands', type: 'mpa', area: 845614 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-71.684, 18.104],
            [-71.963, 17.662],
            [-71.51, 17.376],
            [-71.231, 17.818],
            [-71.684, 18.104],
          ],
        ],
      },
      properties: { name: 'Jaragua', type: 'mpa', area: 1584 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.967, 24.776],
            [-80.193, 25.184],
            [-80.76, 26.257],
            [-81.533, 25.849],
            [-80.967, 24.776],
          ],
        ],
      },
      properties: { name: 'Everglades', type: 'mpa', area: 6253 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.272, 24.716],
            [-83.064, 24.007],
            [-79.86, 24.945],
            [-80.068, 25.655],
            [-83.272, 24.716],
          ],
        ],
      },
      properties: { name: 'Florida Keys', type: 'mpa', area: 9900 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-81.999, 12.003],
            [-79.83, 12.003],
            [-79.83, 14.989],
            [-81.999, 14.989],
            [-81.999, 12.003],
          ],
        ],
      },
      properties: { name: 'Seaflower', type: 'mpa', area: 61151 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-117.131, 32.63],
            [-119.967, 30.572],
            [-114.056, 22.428],
            [-111.22, 24.486],
            [-117.131, 32.63],
          ],
        ],
      },
      properties: {
        name: 'Islas del Pacífico de la Península de Baja California',
        type: 'mpa',
        area: 11675,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-87.833, 17.918],
            [-85.457, 17.73],
            [-85.131, 21.839],
            [-87.508, 22.027],
            [-87.833, 17.918],
          ],
        ],
      },
      properties: { name: 'Caribe Mexicano Profundo', type: 'mpa', area: 38809 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-87.631, 17.946],
            [-85.488, 17.697],
            [-85.062, 21.361],
            [-87.205, 21.61],
            [-87.631, 17.946],
          ],
        ],
      },
      properties: { name: 'Caribe Mexicano Profundo', type: 'mpa', area: 19471 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-93.174, 11.731],
            [-91.933, 18.304],
            [-116.912, 23.02],
            [-118.153, 16.447],
            [-93.174, 11.731],
          ],
        ],
      },
      properties: { name: 'Pacífico Mexicano Profundo', type: 'mpa', area: 315793 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-93.3, 13.633],
            [-92.708, 19.768],
            [-117.28, 22.14],
            [-117.872, 16.005],
            [-93.3, 13.633],
          ],
        ],
      },
      properties: { name: 'Pacífico Mexicano Profundo', type: 'mpa', area: 122333 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [30.717, 44.866],
            [30.583, 45.217],
            [29.633, 44.855],
            [29.767, 44.504],
            [30.717, 44.866],
          ],
        ],
      },
      properties: {
        name: 'Lobul sudic al Cmpului de Phyllophora al lui Zernov',
        type: 'mpa',
        area: 1866,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [16.29, 56.097],
            [16.654, 55.223],
            [18.956, 56.179],
            [18.593, 57.053],
            [16.29, 56.097],
          ],
        ],
      },
      properties: { name: 'Hoburgs bank och Midsjbankarna', type: 'mpa', area: 10485 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [12.112, 56.609],
            [12.075, 56.158],
            [12.862, 56.093],
            [12.899, 56.544],
            [12.112, 56.609],
          ],
        ],
      },
      properties: { name: 'Nordvstra Sknes havsomrde', type: 'mpa', area: 1339 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [12.661, 55.425],
            [12.598, 55.152],
            [13.475, 54.949],
            [13.538, 55.221],
            [12.661, 55.425],
          ],
        ],
      },
      properties: { name: 'Sydvstsknes utsjvatten', type: 'mpa', area: 1148 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.08, 53.743],
            [4.219, 53.409],
            [5.372, 53.889],
            [5.233, 54.222],
            [4.08, 53.743],
          ],
        ],
      },
      properties: { name: 'Friese Front', type: 'mpa', area: 2877 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [163, -62.5],
            [168, -62.5],
            [168, -60],
            [163, -60],
            [163, -62.5],
          ],
        ],
      },
      properties: { name: 'Ross Sea Region Marine Protected Area', type: 'mpa', area: 74473 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [150, -69.667],
            [160, -69.667],
            [160, -62.5],
            [150, -62.5],
            [150, -69.667],
          ],
        ],
      },
      properties: { name: 'Ross Sea Region Marine Protected Area', type: 'mpa', area: 331891 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-164, -76.5],
            [-164, -73.5],
            [-180, -73.5],
            [-180, -76.5],
            [-164, -76.5],
          ],
        ],
      },
      properties: { name: 'Ross Sea Region Marine Protected Area', type: 'mpa', area: 109516 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [51.11, 24.47],
            [51.302, 24.084],
            [51.665, 24.264],
            [51.473, 24.651],
            [51.11, 24.47],
          ],
        ],
      },
      properties: { name: 'Jazirat al-Huwaysat / Dawhat Duwayhin', type: 'mpa', area: 1208 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [43.912, -18.794],
            [44.346, -18.47],
            [43.715, -17.626],
            [43.281, -17.95],
            [43.912, -18.794],
          ],
        ],
      },
      properties: { name: 'Iles Barren', type: 'mpa', area: 4657 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.305, 53.897],
            [-5.344, 53.255],
            [-4.219, 53.187],
            [-4.18, 53.829],
            [-5.305, 53.897],
          ],
        ],
      },
      properties: { name: 'North Anglesey Marine / Gogledd Mon Forol', type: 'mpa', area: 3243 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.863, 51.991],
            [-5.305, 51.333],
            [-3.988, 52.45],
            [-4.547, 53.108],
            [-5.863, 51.991],
          ],
        ],
      },
      properties: { name: 'West Wales Marine / Gorllewin Cymru Forol', type: 'mpa', area: 7358 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-4.799, 53.544],
            [-4.799, 53.108],
            [-4.014, 53.108],
            [-4.014, 53.544],
            [-4.799, 53.544],
          ],
        ],
      },
      properties: { name: 'Anglesey Terns / Morwenoliaid Ynys Mon', type: 'mpa', area: 1017 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-4.854, 51.559],
            [-4.97, 51.929],
            [-6.164, 51.553],
            [-6.048, 51.182],
            [-4.854, 51.559],
          ],
        ],
      },
      properties: {
        name: 'Skomer, Skokholm and the Seas off Pembrokeshire / Sgomer, Sgogwm a Moroedd Penfr',
        type: 'mpa',
        area: 1661,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.147, 58.213],
            [-6.992, 58.529],
            [-7.423, 56.015],
            [-5.578, 55.699],
            [-5.147, 58.213],
          ],
        ],
      },
      properties: { name: 'Inner Hebrides and the Minches', type: 'mpa', area: 13770 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-4.245, 51.671],
            [-5.045, 51.958],
            [-5.639, 50.302],
            [-4.839, 50.015],
            [-4.245, 51.671],
          ],
        ],
      },
      properties: {
        name: 'Bristol Channel Approaches / Dynesfeydd Mor Hafren',
        type: 'mpa',
        area: 5840,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [1.667, 51.069],
            [3.79, 52.156],
            [1.807, 56.03],
            [-0.317, 54.943],
            [1.667, 51.069],
          ],
        ],
      },
      properties: { name: 'Southern North Sea', type: 'mpa', area: 36875 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.65, 55.012],
            [-5.971, 54.579],
            [-5.187, 53.999],
            [-4.867, 54.432],
            [-5.65, 55.012],
          ],
        ],
      },
      properties: { name: 'North Channel', type: 'mpa', area: 1600 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.695, -0.641],
            [8.247, -0.883],
            [8.765, -1.84],
            [9.213, -1.598],
            [8.695, -0.641],
          ],
        ],
      },
      properties: { name: 'Reserve Aquatique de Mandji-Etimboue', type: 'mpa', area: 4083 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.536, -1.196],
            [8.813, -0.46],
            [7.765, -0.066],
            [7.488, -0.802],
            [8.536, -1.196],
          ],
        ],
      },
      properties: { name: 'Reserve Aquatique des Canyons du Cap Lopez', type: 'mpa', area: 9941 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.424, -6.116],
            [9.042, -6.622],
            [11.25, -3.925],
            [10.632, -3.419],
            [8.424, -6.116],
          ],
        ],
      },
      properties: { name: 'Reserve Aquatique du Grand Sud du Gabon', type: 'mpa', area: 27695 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [9.166, -1.517],
            [8.999, -1.614],
            [9.596, -2.642],
            [9.763, -2.545],
            [9.166, -1.517],
          ],
        ],
      },
      properties: { name: 'Reserve Aquatique de Koumandji', type: 'mpa', area: 1358 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [7.223, -3.22],
            [7.223, -3.68],
            [8.5, -3.68],
            [8.5, -3.22],
            [7.223, -3.22],
          ],
        ],
      },
      properties: { name: "Reserve Aquatique de l'Abysse Bleu", type: 'mpa', area: 7079 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-165.542, -9.689],
            [-167.077, -10.603],
            [-165.789, -12.767],
            [-164.254, -11.853],
            [-165.542, -9.689],
          ],
        ],
      },
      properties: { name: 'Marine Protected Area (Pukapuka/ Nassau)', type: 'mpa', area: 45097 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-157.62, -7.735],
            [-159.219, -8.596],
            [-158.326, -10.256],
            [-156.726, -9.395],
            [-157.62, -7.735],
          ],
        ],
      },
      properties: { name: 'Marine Protected Area (Penrhyn)', type: 'mpa', area: 32825 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-162.818, -12.026],
            [-164.381, -12.988],
            [-163.436, -14.524],
            [-161.873, -13.561],
            [-162.818, -12.026],
          ],
        ],
      },
      properties: { name: 'Marine Protected Area (Suwarrow)', type: 'mpa', area: 31551 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-160.203, -17.667],
            [-161.106, -19.507],
            [-157.005, -21.521],
            [-156.102, -19.681],
            [-160.203, -17.667],
          ],
        ],
      },
      properties: {
        name: 'Marine Protected Area (Aitutaki & Ngaputora)',
        type: 'mpa',
        area: 87127,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-158.892, -21.088],
            [-158.828, -22.83],
            [-156.946, -22.761],
            [-157.01, -21.019],
            [-158.892, -21.088],
          ],
        ],
      },
      properties: { name: 'Marine Protected Area (Mangaia)', type: 'mpa', area: 29649 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-160.581, -20.226],
            [-160.85, -21.958],
            [-158.973, -22.249],
            [-158.705, -20.516],
            [-160.581, -20.226],
          ],
        ],
      },
      properties: { name: 'Marine Protected Area (Rarotonga)', type: 'mpa', area: 30234 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-161.894, -18.005],
            [-163.205, -16.778],
            [-164.43, -18.087],
            [-163.12, -19.314],
            [-161.894, -18.005],
          ],
        ],
      },
      properties: { name: 'Marine Protected Area (Palmerston)', type: 'mpa', area: 29942 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-154.93, -5.76],
            [-168.562, -5.886],
            [-168.381, -25.401],
            [-154.75, -25.275],
            [-154.93, -5.76],
          ],
        ],
      },
      properties: { name: 'Marae Moana (Cook Islands Marine Park)', type: 'mpa', area: 1982029 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-160.507, -8.949],
            [-162.211, -9.449],
            [-161.604, -11.517],
            [-159.9, -11.016],
            [-160.507, -8.949],
          ],
        ],
      },
      properties: { name: 'Marine Protected Area (Rakahanga/ Manihiki)', type: 'mpa', area: 37928 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [131.997, -31.935],
            [132.017, -31.629],
            [129.019, -31.433],
            [128.999, -31.739],
            [131.997, -31.935],
          ],
        ],
      },
      properties: { name: 'Great Australian Bight', type: 'mpa', area: 1263 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.084, 24.705],
            [-81.275, 24.031],
            [-80.315, 22.336],
            [-79.124, 23.01],
            [-80.084, 24.705],
          ],
        ],
      },
      properties: { name: 'Cay Sal Marine Managed Area', type: 'mpa', area: 16855 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.242, 23.539],
            [-74.396, 22.359],
            [-71.876, 22.029],
            [-71.722, 23.209],
            [-74.242, 23.539],
          ],
        ],
      },
      properties: { name: 'Southeast Bahamas Marine Managed Area', type: 'mpa', area: 24459 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-76.699, -33.825],
            [-76.731, -33.15],
            [-81.098, -33.355],
            [-81.066, -34.029],
            [-76.699, -33.825],
          ],
        ],
      },
      properties: { name: 'Mar de Juan Fernández', type: 'mpa', area: 24006 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-79.444, -33.824],
            [-79.475, -33.555],
            [-80.048, -33.622],
            [-80.017, -33.89],
            [-79.444, -33.824],
          ],
        ],
      },
      properties: { name: 'Montes submarinos Crusoe y Selkirk', type: 'mpa', area: 1079 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [179.462, -16.36],
            [179.352, -16.064],
            [178.702, -16.306],
            [178.812, -16.602],
            [179.462, -16.36],
          ],
        ],
      },
      properties: { name: 'Qoliqoli Cokovata', type: 'mpa', area: 1353 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-115.471, 20.009],
            [-115.471, 17.655],
            [-110.078, 17.655],
            [-110.078, 20.009],
            [-115.471, 20.009],
          ],
        ],
      },
      properties: { name: 'Revillagigedo', type: 'mpa', area: 148835 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-69.331, 17.762],
            [-67.833, 17.764],
            [-67.834, 18.719],
            [-69.332, 18.717],
            [-69.331, 17.762],
          ],
        ],
      },
      properties: { name: 'Arrecifes del Sureste', type: 'mpa', area: 7907 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-70.891, 18.238],
            [-71.26, 18.418],
            [-71.869, 17.174],
            [-71.499, 16.994],
            [-70.891, 18.238],
          ],
        ],
      },
      properties: { name: 'Arrecifes del Suroeste', type: 'mpa', area: 2720 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-4.364, 49.455],
            [-4.249, 48.923],
            [-2.933, 49.207],
            [-3.048, 49.74],
            [-4.364, 49.455],
          ],
        ],
      },
      properties: { name: 'Nord Bretagne DH', type: 'mpa', area: 2832 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.898, 44.679],
            [-1.76, 47.114],
            [-8.861, 50.435],
            [-10, 48],
            [-2.898, 44.679],
          ],
        ],
      },
      properties: { name: 'Mers Celtiques - Talus du golfe de Gascogne', type: 'mpa', area: 62078 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.254, 42.364],
            [9.439, 43.148],
            [9.018, 43.785],
            [7.833, 43],
            [8.254, 42.364],
          ],
        ],
      },
      properties: { name: "Grands dauphins de l'Agriate", type: 'mpa', area: 5926 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [23.118, 37.84],
            [23.241, 38.166],
            [21.957, 38.651],
            [21.834, 38.325],
            [23.118, 37.84],
          ],
        ],
      },
      properties: { name: 'KORINTHIAKOS KOLPOS', type: 'mpa', area: 2370 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [21.445, 37.126],
            [21.289, 36.823],
            [21.944, 36.486],
            [22.1, 36.79],
            [21.445, 37.126],
          ],
        ],
      },
      properties: { name: 'THALASSIA PERIOCHI NOTIAS MESSINIAS', type: 'mpa', area: 1231 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [23.513, 35.804],
            [23.178, 35.423],
            [23.943, 34.749],
            [24.278, 35.13],
            [23.513, 35.804],
          ],
        ],
      },
      properties: {
        name: 'THALASSIA PERIOCHI  DYTIKIS KAI NOTIODYTIKIS KRITIS\n',
        type: 'mpa',
        area: 1642,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-17.46, 33.28],
            [-17.46, 32.25],
            [-16.13, 32.25],
            [-16.13, 33.28],
            [-17.46, 33.28],
          ],
        ],
      },
      properties: { name: 'Cetáceos da Madeira', type: 'mpa', area: 6833 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [109.43, -1.672],
            [109.377, -1.36],
            [108.613, -1.489],
            [108.665, -1.8],
            [109.43, -1.672],
          ],
        ],
      },
      properties: { name: 'Karimata', type: 'mpa', area: 1923 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [131.297, 1.101],
            [129.325, 1.168],
            [129.209, -2.241],
            [131.181, -2.309],
            [131.297, 1.101],
          ],
        ],
      },
      properties: { name: 'KKPD KABUPATEN KEPULAUAN RAJA AMPAT', type: 'mpa', area: 10324 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [132.348, -6.08],
            [132.616, -6.174],
            [132.797, -5.661],
            [132.529, -5.566],
            [132.348, -6.08],
          ],
        ],
      },
      properties: {
        name: 'KKPD PULAU KEI KECIL, PULAU-PULAU, DAN PERAIRAN SEKITARNYA',
        type: 'mpa',
        area: 1510,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [108.616, 2.193],
            [109.322, 2.511],
            [108.241, 4.91],
            [107.535, 4.591],
            [108.616, 2.193],
          ],
        ],
      },
      properties: { name: 'KKPN KEPULAUAN NATUNA', type: 'mpa', area: 2990 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [123.324, -2.517],
            [124.325, -1.864],
            [123.103, 0.009],
            [122.101, -0.644],
            [123.324, -2.517],
          ],
        ],
      },
      properties: {
        name: 'KKPD KABUPATEN BANGGAI, BANGGAI KEPULAUAN, DAN BANGGAI LAUT',
        type: 'mpa',
        area: 8756,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-28.269, -1.59],
            [-27.443, 0.196],
            [-30.341, 1.536],
            [-31.167, -0.25],
            [-28.269, -1.59],
          ],
        ],
      },
      properties: {
        name: 'Monumento Natural Do Arquipélago De São Pedro E São Paulo',
        type: 'mpa',
        area: 47554,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-27.263, -21.482],
            [-27.108, -19.666],
            [-32.704, -19.188],
            [-32.859, -21.004],
            [-27.263, -21.482],
          ],
        ],
      },
      properties: {
        name: 'Monumento Natural Das Ilhas De Trindade, Martim Vaz E Do Monte Columbia',
        type: 'mpa',
        area: 67994,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-33.01, -17.261],
            [-32.781, -23.992],
            [-25.18, -23.734],
            [-25.409, -17.002],
            [-33.01, -17.261],
          ],
        ],
      },
      properties: {
        name: 'Área De Proteção Ambiental Do Arquipélago De Trindade E Martim Vaz',
        type: 'mpa',
        area: 405907,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-25.823, 4.069],
            [-32.474, 4.46],
            [-32.868, -2.235],
            [-26.217, -2.626],
            [-25.823, 4.069],
          ],
        ],
      },
      properties: {
        name: 'Área De Proteção Ambiental Do Arquipélago De São Pedro E São Paulo',
        type: 'mpa',
        area: 387111,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [134.315, -6.966],
            [134.43, -7.197],
            [134.839, -6.993],
            [134.724, -6.762],
            [134.315, -6.966],
          ],
        ],
      },
      properties: { name: 'KKPN KEPULAUAN ARU BAGIAN TENGGARA', type: 'mpa', area: 1094 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-77.533, 4.486],
            [-77.11, 4.492],
            [-77.126, 5.526],
            [-77.549, 5.52],
            [-77.533, 4.486],
          ],
        ],
      },
      properties: { name: 'Encanto de los manglares del Bajo Baudo', type: 'mpa', area: 3148 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-82.102, 5],
            [-83.064, 5],
            [-83.064, 2.724],
            [-82.102, 2.724],
            [-82.102, 5],
          ],
        ],
      },
      properties: { name: 'Yurupari - Malpelo', type: 'mpa', area: 26987 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-79.371, 1.8],
            [-79.371, 1.431],
            [-78.783, 1.431],
            [-78.783, 1.8],
            [-79.371, 1.8],
          ],
        ],
      },
      properties: { name: 'Cabo Manglares Bajo Mira y Frontera', type: 'mpa', area: 1911 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-81.999, 12.003],
            [-79.83, 12.003],
            [-79.83, 14.989],
            [-81.999, 14.989],
            [-81.999, 12.003],
          ],
        ],
      },
      properties: {
        name: 'Area Marina Protegida de la Reserva de Biosfera Seaflower',
        type: 'mpa',
        area: 61014,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-88, 4.967],
            [-87.476, 4.517],
            [-86.433, 5.733],
            [-86.958, 6.183],
            [-88, 4.967],
          ],
        ],
      },
      properties: { name: 'Montes Submarinos', type: 'mpa', area: 9624 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-81.087, -1.237],
            [-81.087, -1.699],
            [-80.765, -1.699],
            [-80.765, -1.237],
            [-81.087, -1.237],
          ],
        ],
      },
      properties: { name: 'Cantagallo - Machalilla', type: 'mpa', area: 1429 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [53.641, 24.024],
            [53.687, 24.693],
            [52.963, 24.742],
            [52.917, 24.074],
            [53.641, 24.024],
          ],
        ],
      },
      properties: { name: 'Marawah Marine Biosphere Reserve', type: 'mpa', area: 4267 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-50.984, 2.848],
            [-53.082, -0.713],
            [-43.207, -6.53],
            [-41.109, -2.969],
            [-50.984, 2.848],
          ],
        ],
      },
      properties: { name: 'Amazon Estuary and its Mangroves', type: 'mpa', area: 38304 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-113.656, -24.294],
            [-112.669, -31.059],
            [-101.195, -29.385],
            [-102.182, -22.619],
            [-113.656, -24.294],
          ],
        ],
      },
      properties: { name: 'Rapa Nui', type: 'mpa', area: 579821 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.166, 54.097],
            [-0.528, 53.502],
            [1.707, 52.14],
            [2.069, 52.735],
            [-0.166, 54.097],
          ],
        ],
      },
      properties: { name: 'Greater Wash', type: 'mpa', area: 3529 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-64.584, -45.578],
            [-64.582, -43.663],
            [-67.661, -43.66],
            [-67.663, -45.575],
            [-64.584, -45.578],
          ],
        ],
      },
      properties: { name: 'Patagonia Azul', type: 'mpa', area: 30596 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-125.298, 70.333],
            [-125.298, 69.352],
            [-123.905, 69.352],
            [-123.905, 70.333],
            [-125.298, 70.333],
          ],
        ],
      },
      properties: { name: 'Anguniaqvia Niqiqyuam Marine Protected Area', type: 'mpa', area: 2354 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-128.969, 51.083],
            [-128.678, 51.335],
            [-130.604, 53.551],
            [-130.894, 53.298],
            [-128.969, 51.083],
          ],
        ],
      },
      properties: {
        name: 'Hecate Strait and Queen Charlotte Sound Glass Sponge Reefs Marine Protected Areas',
        type: 'mpa',
        area: 1502,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-129.017, 51.025],
            [-128.656, 51.326],
            [-130.562, 53.61],
            [-130.924, 53.308],
            [-129.017, 51.025],
          ],
        ],
      },
      properties: {
        name: 'Hecate Strait and Queen Charlotte Sound Glass Sponge Reefs Marine Protected Areas',
        type: 'mpa',
        area: 2410,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-70.705, 48.396],
            [-70.735, 47.68],
            [-69.316, 47.62],
            [-69.286, 48.336],
            [-70.705, 48.396],
          ],
        ],
      },
      properties: { name: 'Saguenay-St. Lawrence Marine Park', type: 'mpa', area: 1247 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-72.547, 70.976],
            [-72.575, 76.624],
            [-96.124, 76.506],
            [-96.095, 70.858],
            [-72.547, 70.976],
          ],
        ],
      },
      properties: {
        name: 'Tallurutiup Imanga National Marine Conservation Area',
        type: 'mpa',
        area: 108156,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.214, -48.219],
            [-73.163, -47.034],
            [-75.694, -46.926],
            [-75.744, -48.111],
            [-73.214, -48.219],
          ],
        ],
      },
      properties: { name: 'Tortel', type: 'mpa', area: 6658 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.598, 55.213],
            [4.748, 55.547],
            [3.788, 55.979],
            [3.638, 55.646],
            [4.598, 55.213],
          ],
        ],
      },
      properties: { name: 'Doggerbank', type: 'mpa', area: 1688 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.392, 55.367],
            [6.273, 54.636],
            [8.161, 54.331],
            [8.279, 55.061],
            [6.392, 55.367],
          ],
        ],
      },
      properties: { name: 'Sylter Außenriff - Östliche Deutsche Bucht', type: 'mpa', area: 5592 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [14.748, 54.498],
            [14.293, 55.045],
            [13.784, 54.621],
            [14.239, 54.075],
            [14.748, 54.498],
          ],
        ],
      },
      properties: { name: 'Pommersche Bucht - Rönnebank', type: 'mpa', area: 2088 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.463, 52.263],
            [5.294, 52.09],
            [5.499, 53.072],
            [4.669, 53.246],
            [4.463, 52.263],
          ],
        ],
      },
      properties: { name: 'Nnn-Nh', type: 'mpa', area: 1775 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [3.791, -54.624],
            [3.761, -54.159],
            [2.923, -54.214],
            [2.954, -54.679],
            [3.791, -54.624],
          ],
        ],
      },
      properties: { name: 'Bouvetøya (Antarctic)', type: 'mpa', area: 2258 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-82.123, -30.014],
            [-86.02, -33.638],
            [-80.774, -39.28],
            [-76.876, -35.656],
            [-82.123, -30.014],
          ],
        ],
      },
      properties: { name: 'Mar de Juan Fernández', type: 'mpa', area: 264960 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.581, -54.865],
            [-74.595, -58.702],
            [-67.63, -60.542],
            [-66.616, -56.704],
            [-73.581, -54.865],
          ],
        ],
      },
      properties: { name: 'Islas Diego Ramírez y Paso Drake', type: 'mpa', area: 143351 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.806, -49.798],
            [-76.302, -51.214],
            [-72.529, -55.202],
            [-71.033, -53.787],
            [-74.806, -49.798],
          ],
        ],
      },
      properties: { name: 'Kawésqar', type: 'mpa', area: 27890 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.971, -49.834],
            [-76.428, -51.371],
            [-72.383, -55.203],
            [-70.926, -53.666],
            [-74.971, -49.834],
          ],
        ],
      },
      properties: { name: 'Kawésqar', type: 'mpa', area: 26194 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [43.195, -8],
            [43.189, -11.134],
            [50.158, -11.149],
            [50.165, -8.014],
            [43.195, -8],
          ],
        ],
      },
      properties: { name: 'Aldabra Group (Marine) National Park', type: 'mpa', area: 195306 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [57.5, -8.004],
            [57.504, -3.502],
            [52.503, -3.498],
            [52.499, -8],
            [57.5, -8.004],
          ],
        ],
      },
      properties: {
        name: 'Amirantes (Marine) to Fortune Bank (Marine) Area of Outstanding Natural Beauty',
        type: 'mpa',
        area: 217390,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-58, -55.75],
            [-58, -54.622],
            [-60.75, -54.622],
            [-60.75, -55.75],
            [-58, -55.75],
          ],
        ],
      },
      properties: { name: 'Namuncurá - Banco Burdwood II', type: 'mpa', area: 19652 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-61.75, -55.5],
            [-60.75, -55.5],
            [-60.75, -54.432],
            [-61.75, -54.432],
            [-61.75, -55.5],
          ],
        ],
      },
      properties: { name: 'Namuncurá - Banco Burdwood II', type: 'mpa', area: 6078 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-64, -55.5],
            [-67.267, -55.5],
            [-67.267, -58.388],
            [-64, -58.388],
            [-64, -55.5],
          ],
        ],
      },
      properties: { name: 'Yaganes', type: 'mpa', area: 47273 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-64, -55.016],
            [-67.267, -55.016],
            [-67.267, -58.388],
            [-64, -58.388],
            [-64, -55.016],
          ],
        ],
      },
      properties: { name: 'Yaganes', type: 'mpa', area: 58284 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.793, -55.362],
            [-64.57, -54.197],
            [-67.731, -56.304],
            [-66.954, -57.469],
            [-63.793, -55.362],
          ],
        ],
      },
      properties: { name: 'Yaganes', type: 'mpa', area: 11011 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-4.364, 49.455],
            [-4.249, 48.923],
            [-2.933, 49.207],
            [-3.048, 49.74],
            [-4.364, 49.455],
          ],
        ],
      },
      properties: { name: 'Nord Bretagne DO', type: 'mpa', area: 2832 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.966, 43.108],
            [4.781, 43.6],
            [3.187, 43],
            [3.372, 42.509],
            [4.966, 43.108],
          ],
        ],
      },
      properties: { name: 'Grands dauphins du golfe du Lion', type: 'mpa', area: 4915 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.679, 44.576],
            [-1.54, 47.011],
            [-8.861, 50.435],
            [-10, 48],
            [-2.679, 44.576],
          ],
        ],
      },
      properties: { name: 'Mers Celtiques - Talus du golfe de Gascogne', type: 'mpa', area: 71661 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.251, 42.365],
            [9.44, 43.146],
            [9.023, 43.781],
            [7.833, 43],
            [8.251, 42.365],
          ],
        ],
      },
      properties: { name: "Oiseaux marins de l'Agriate", type: 'mpa', area: 6224 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [123.65, -16.135],
            [124.051, -16.864],
            [125.23, -16.215],
            [124.829, -15.485],
            [123.65, -16.135],
          ],
        ],
      },
      properties: { name: 'Lalang-garram / Horizontal Falls', type: 'mpa', area: 3437 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [129.033, -14.871],
            [128.899, -13.266],
            [124.298, -13.649],
            [124.431, -15.253],
            [129.033, -14.871],
          ],
        ],
      },
      properties: { name: 'North Kimberley', type: 'mpa', area: 16792 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [124.841, -15.201],
            [124.841, -14.97],
            [124.198, -14.969],
            [124.198, -15.2],
            [124.841, -15.201],
          ],
        ],
      },
      properties: { name: 'North Lalang-garram', type: 'mpa', area: 1106 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [134.94, 8.337],
            [134.392, 8.423],
            [134.277, 7.694],
            [134.826, 7.608],
            [134.94, 8.337],
          ],
        ],
      },
      properties: { name: 'Northern Reef Fisheries Management Project', type: 'mpa', area: 3901 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [134.94, 8.335],
            [134.391, 8.421],
            [134.277, 7.694],
            [134.826, 7.608],
            [134.94, 8.335],
          ],
        ],
      },
      properties: {
        name: 'Northern Reef Co-Managed Commercial Fisheries Zone',
        type: 'mpa',
        area: 2892,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [135.253, 8.025],
            [134.13, 8.737],
            [130.566, 3.115],
            [131.689, 2.403],
            [135.253, 8.025],
          ],
        ],
      },
      properties: { name: 'Coastal State Waters', type: 'mpa', area: 13690 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [136.633, 6.045],
            [136.632, 9.02],
            [133.289, 9.019],
            [133.29, 6.045],
            [136.633, 6.045],
          ],
        ],
      },
      properties: { name: 'Domestic Fishing Zone', type: 'mpa', area: 83085 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [125.812, 34.602],
            [126.196, 34.452],
            [126.438, 35.07],
            [126.053, 35.22],
            [125.812, 34.602],
          ],
        ],
      },
      properties: { name: 'Sinan', type: 'mpa', area: 1110 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [166.304, -21.527],
            [166.111, -21.789],
            [166.798, -22.295],
            [166.991, -22.033],
            [166.304, -21.527],
          ],
        ],
      },
      properties: { name: 'Parc de la Côte Oubliée', type: 'mpa', area: 1229 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-14.687, -3.142],
            [-19.183, -8.267],
            [-14.049, -12.771],
            [-9.553, -7.646],
            [-14.687, -3.142],
          ],
        ],
      },
      properties: { name: 'Ascension Island Marine Protected Area', type: 'mpa', area: 448891 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-52.239, 42.985],
            [-51.893, 43.503],
            [-54.308, 45.119],
            [-54.655, 44.602],
            [-52.239, 42.985],
          ],
        ],
      },
      properties: { name: 'Division 3O Coral closure', type: 'mpa', area: 10487 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-66.195, 41.451],
            [-66.582, 40.892],
            [-64.755, 39.627],
            [-64.367, 40.186],
            [-66.195, 41.451],
          ],
        ],
      },
      properties: {
        name: 'Corsair and Georges Canyons Conservation Area (Restricted Bottom Fisheries Zone)',
        type: 'mpa',
        area: 8785,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-59.433, 64.1],
            [-57.571, 64.141],
            [-57.627, 66.687],
            [-59.49, 66.645],
            [-59.433, 64.1],
          ],
        ],
      },
      properties: { name: 'Davis Strait Conservation Area', type: 'mpa', area: 17246 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-60.5, 68.25],
            [-60.5, 67.25],
            [-57.889, 67.25],
            [-57.889, 68.25],
            [-60.5, 68.25],
          ],
        ],
      },
      properties: {
        name: 'Disko Fan Conservation Area (portion closed to all bottom-contact fishing)',
        type: 'mpa',
        area: 7485,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-53.333, 49.667],
            [-52.5, 49.667],
            [-52.5, 50.833],
            [-53.333, 50.833],
            [-53.333, 49.667],
          ],
        ],
      },
      properties: { name: 'Funk Island Deep closure', type: 'mpa', area: 7276 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-61.233, 48.65],
            [-61.292, 48.363],
            [-60.626, 48.227],
            [-60.567, 48.513],
            [-61.233, 48.65],
          ],
        ],
      },
      properties: {
        name: 'Central Gulf Of St. Lawrence Coral Conservation Area',
        type: 'mpa',
        area: 1283,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-58.851, 62.766],
            [-62.914, 64.365],
            [-64.309, 60.821],
            [-60.245, 59.222],
            [-58.851, 62.766],
          ],
        ],
      },
      properties: { name: 'Hatton Basin Conservation Area', type: 'mpa', area: 42619 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-54.75, 52.5],
            [-53.333, 52.5],
            [-53.333, 53.333],
            [-54.75, 53.333],
            [-54.75, 52.5],
          ],
        ],
      },
      properties: { name: 'Hawke Channel closure', type: 'mpa', area: 8837 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-62.936, 48.654],
            [-62.817, 48.933],
            [-63.981, 49.43],
            [-64.1, 49.15],
            [-62.936, 48.654],
          ],
        ],
      },
      properties: {
        name: 'Eastern Honguedo Strait Coral And Sponge Conservation Area',
        type: 'mpa',
        area: 2326,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-59.318, 57.895],
            [-59.813, 57.133],
            [-56.163, 54.764],
            [-55.669, 55.526],
            [-59.318, 57.895],
          ],
        ],
      },
      properties: { name: 'Hopedale Saddle closure', type: 'mpa', area: 14828 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-64.368, 46.986],
            [-64.342, 47.399],
            [-65.235, 47.455],
            [-65.261, 47.042],
            [-64.368, 46.986],
          ],
        ],
      },
      properties: { name: 'Miramichi Bay Closure', type: 'mpa', area: 1466 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-49.603, 47.457],
            [-47.329, 48.267],
            [-49.034, 53.059],
            [-51.309, 52.25],
            [-49.603, 47.457],
          ],
        ],
      },
      properties: { name: 'Northeast Newfoundland Slope closure', type: 'mpa', area: 55374 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-128.32, 45.875],
            [-126.597, 48.464],
            [-132.456, 52.362],
            [-134.178, 49.773],
            [-128.32, 45.875],
          ],
        ],
      },
      properties: {
        name: 'Offshore Pacific Seamounts And Vents Closure',
        type: 'mpa',
        area: 82424,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.712, 45.727],
            [-63.212, 46.643],
            [-64.697, 47.453],
            [-65.196, 46.538],
            [-63.712, 45.727],
          ],
        ],
      },
      properties: { name: 'Scallop Buffer Zone (SFA 22)', type: 'mpa', area: 2852 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.743, 45.869],
            [-63.401, 44.924],
            [-60.326, 46.04],
            [-60.668, 46.985],
            [-63.743, 45.869],
          ],
        ],
      },
      properties: { name: 'Scallop Buffer Zone (SFA 24)', type: 'mpa', area: 2096 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.476, 43.46],
            [-63.222, 42.672],
            [-61.083, 43.362],
            [-61.337, 44.15],
            [-63.476, 43.46],
          ],
        ],
      },
      properties: {
        name: 'Western/Emerald Banks Conservation Area (Restricted Fisheries Zone)',
        type: 'mpa',
        area: 10223,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-82.932, 28.838],
            [-82.574, 29.247],
            [-84.009, 30.503],
            [-84.367, 30.094],
            [-82.932, 28.838],
          ],
        ],
      },
      properties: { name: 'Big Bend Seagrasses Aquatic Preserve', type: 'mpa', area: 2755 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-66.895, 38.83],
            [-65.874, 39.871],
            [-67.422, 41.39],
            [-68.443, 40.349],
            [-66.895, 38.83],
          ],
        ],
      },
      properties: {
        name: 'Northeast Canyons and Seamounts Marine National Monument',
        type: 'mpa',
        area: 12713,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.955, 24.769],
            [-80.187, 25.183],
            [-80.769, 26.263],
            [-81.538, 25.849],
            [-80.955, 24.769],
          ],
        ],
      },
      properties: { name: 'Everglades', type: 'mpa', area: 6202 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-138.531, 59.545],
            [-138.68, 58.429],
            [-134.759, 57.903],
            [-134.609, 59.019],
            [-138.531, 59.545],
          ],
        ],
      },
      properties: { name: 'Glacier Bay', type: 'mpa', area: 13286 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-176.64, 0.44],
            [-176.723, 0.034],
            [-176.316, -0.05],
            [-176.232, 0.357],
            [-176.64, 0.44],
          ],
        ],
      },
      properties: { name: 'Baker Island', type: 'mpa', area: 1674 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-176.765, 0.551],
            [-176.367, 0.648],
            [-176.468, 1.065],
            [-176.867, 0.967],
            [-176.765, 0.551],
          ],
        ],
      },
      properties: { name: 'Howland Island', type: 'mpa', area: 1711 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-159.781, -0.579],
            [-159.788, -0.159],
            [-160.217, -0.166],
            [-160.21, -0.585],
            [-159.781, -0.579],
          ],
        ],
      },
      properties: { name: 'Jarvis Island', type: 'mpa', area: 1760 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-162.145, 6.171],
            [-162.126, 6.62],
            [-162.878, 6.653],
            [-162.898, 6.204],
            [-162.145, 6.171],
          ],
        ],
      },
      properties: { name: 'Kingman Reef', type: 'mpa', area: 2135 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [142.222, 11.088],
            [147.574, 10.251],
            [149.597, 23.189],
            [144.245, 24.026],
            [142.222, 11.088],
          ],
        ],
      },
      properties: { name: 'Mariana Trench', type: 'mpa', area: 204500 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-177.054, 28.048],
            [-177.139, 28.525],
            [-177.692, 28.427],
            [-177.607, 27.949],
            [-177.054, 28.048],
          ],
        ],
      },
      properties: { name: 'Midway Atoll', type: 'mpa', area: 2352 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.797, 18.58],
            [-75.208, 18.61],
            [-75.237, 18.224],
            [-74.826, 18.193],
            [-74.797, 18.58],
          ],
        ],
      },
      properties: { name: 'Navassa Island', type: 'mpa', area: 1474 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-162.347, 6.074],
            [-162.307, 5.637],
            [-161.808, 5.683],
            [-161.849, 6.12],
            [-162.347, 6.074],
          ],
        ],
      },
      properties: { name: 'Palmyra Atoll', type: 'mpa', area: 2152 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [166.782, 19.005],
            [166.939, 19.418],
            [166.478, 19.594],
            [166.32, 19.181],
            [166.782, 19.005],
          ],
        ],
      },
      properties: { name: 'Wake Atoll', type: 'mpa', area: 2014 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-159.095, 59.831],
            [-159.203, 63.576],
            [-167.942, 63.326],
            [-167.835, 59.58],
            [-159.095, 59.831],
          ],
        ],
      },
      properties: { name: 'Yukon Delta', type: 'mpa', area: 84663 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-162.61, 6.205],
            [-162.161, 6.155],
            [-162.111, 6.602],
            [-162.56, 6.652],
            [-162.61, 6.205],
          ],
        ],
      },
      properties: { name: 'Kingman Reef National Wildlife Refu', type: 'mpa', area: 1968 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-162.347, 6.074],
            [-162.307, 5.637],
            [-161.808, 5.683],
            [-161.849, 6.12],
            [-162.347, 6.074],
          ],
        ],
      },
      properties: { name: 'Palmyra Atoll National Wildlife Refu', type: 'mpa', area: 2152 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-178.241, 28.85],
            [-178.675, 27.611],
            [-162.272, 21.871],
            [-161.838, 23.11],
            [-178.241, 28.85],
          ],
        ],
      },
      properties: { name: 'Northwestern Hawaiian Islands Marine Refuge', type: 'mpa', area: 2025 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [142.251, 11.046],
            [147.897, 10.429],
            [149.317, 23.432],
            [143.67, 24.049],
            [142.251, 11.046],
          ],
        ],
      },
      properties: { name: 'Marianas Trench Marine', type: 'mpa', area: 254654 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.062, 24.705],
            [-82.787, 23.926],
            [-79.809, 24.977],
            [-80.084, 25.756],
            [-83.062, 24.705],
          ],
        ],
      },
      properties: { name: 'Florida Keys Areas to be Avoided', type: 'mpa', area: 5344 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-175.923, 28.016],
            [-176.322, 26.889],
            [-162.312, 21.935],
            [-161.913, 23.062],
            [-175.923, 28.016],
          ],
        ],
      },
      properties: { name: 'Hawaiian Islands National Wildlife Refuge', type: 'mpa', area: 1037 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-66.895, 38.83],
            [-65.874, 39.871],
            [-67.422, 41.39],
            [-68.443, 40.349],
            [-66.895, 38.83],
          ],
        ],
      },
      properties: { name: 'Northeast Canyons And Seamounts Marine', type: 'mpa', area: 12701 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-178.278, 28.898],
            [-178.719, 27.65],
            [-162.284, 21.847],
            [-161.843, 23.095],
            [-178.278, 28.898],
          ],
        ],
      },
      properties: { name: 'Papahanaumokuakea Marine', type: 'mpa', area: 2659 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-169.012, -15.386],
            [-167.283, -15.386],
            [-167.283, -13.698],
            [-169.012, -13.698],
            [-169.012, -15.386],
          ],
        ],
      },
      properties: { name: 'Rose Atoll Marine', type: 'mpa', area: 34784 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-123.219, 48.885],
            [-123.325, 48.471],
            [-122.597, 48.284],
            [-122.491, 48.698],
            [-123.219, 48.885],
          ],
        ],
      },
      properties: { name: 'San Juan Islands', type: 'mpa', area: 1748 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-175.923, 28.016],
            [-176.322, 26.889],
            [-162.312, 21.935],
            [-161.913, 23.062],
            [-175.923, 28.016],
          ],
        ],
      },
      properties: { name: 'Hawaiian Islands', type: 'mpa', area: 1036 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-178.844, 29.795],
            [-179.766, 27.125],
            [-161.721, 20.895],
            [-160.799, 23.566],
            [-178.844, 29.795],
          ],
        ],
      },
      properties: {
        name: 'Papahanaumokuakea Marine National Monument Particularly Sensitive Sea Area',
        type: 'mpa',
        area: 362169,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-43.432, -2.617],
            [-43.536, -2.096],
            [-44.181, -2.225],
            [-44.077, -2.746],
            [-43.432, -2.617],
          ],
        ],
      },
      properties: { name: 'Reserva Extrativista Da Baía Do Tubarão', type: 'mpa', area: 2254 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-46.089, -1.242],
            [-45.764, -1.313],
            [-45.647, -0.781],
            [-45.973, -0.71],
            [-46.089, -1.242],
          ],
        ],
      },
      properties: { name: 'Reserva Extrativista Arapiranga-Tromaí', type: 'mpa', area: 1882 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.029, 54.034],
            [-0.079, 53.793],
            [0.846, 53.601],
            [0.896, 53.841],
            [-0.029, 54.034],
          ],
        ],
      },
      properties: { name: 'Holderness Offshore', type: 'mpa', area: 1174 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-4.902, 50.933],
            [-5.053, 51.109],
            [-5.641, 50.605],
            [-5.489, 50.428],
            [-4.902, 50.933],
          ],
        ],
      },
      properties: { name: 'South West Approaches To The Bristol Channel', type: 'mpa', area: 1127 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-9.532, 48.653],
            [-9.206, 48.137],
            [-7.869, 48.981],
            [-8.195, 49.497],
            [-9.532, 48.653],
          ],
        ],
      },
      properties: { name: 'South West Deeps (East)', type: 'mpa', area: 4651 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [44.618, -44.061],
            [48.965, -58.63],
            [84.906, -47.907],
            [80.559, -33.338],
            [44.618, -44.061],
          ],
        ],
      },
      properties: {
        name: 'Périmètre De Protection De La Réserve Naturelle Nationale Des Terres Australes Françaises',
        type: 'mpa',
        area: 989612,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [124.612, 37.955],
            [125.464, 32.97],
            [132.512, 34.176],
            [131.659, 39.161],
            [124.612, 37.955],
          ],
        ],
      },
      properties: { name: 'Natural Environment Conservation Areas', type: 'mpa', area: 9791 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [45.041, -44.85],
            [47.916, -57.13],
            [80.975, -49.39],
            [78.1, -37.11],
            [45.041, -44.85],
          ],
        ],
      },
      properties: { name: 'French Austral Lands and Seas', type: 'mpa', area: 670030 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [48.59, -12.251],
            [48.812, -12.596],
            [49.395, -12.222],
            [49.173, -11.876],
            [48.59, -12.251],
          ],
        ],
      },
      properties: { name: 'Nosy Hara', type: 'mpa', area: 1835 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.208, 12.303],
            [-83.208, 12.666],
            [-83.65, 12.667],
            [-83.65, 12.303],
            [-83.208, 12.303],
          ],
        ],
      },
      properties: { name: 'Cayos Perlas', type: 'mpa', area: 1472 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-14.815, 60.181],
            [-14.885, 56.594],
            [-6.766, 56.436],
            [-6.696, 60.022],
            [-14.815, 60.181],
          ],
        ],
      },
      properties: { name: 'West of Scotland', type: 'mpa', area: 107410 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-6.6, 43.681],
            [-5.6, 43.681],
            [-5.6, 44.06],
            [-6.6, 44.06],
            [-6.6, 43.681],
          ],
        ],
      },
      properties: { name: 'Sistema de cañones submarinos de Aviles', type: 'mpa', area: 3389 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-6.807, 36.588],
            [-7.281, 36.697],
            [-7.478, 35.844],
            [-7.004, 35.735],
            [-6.807, 36.588],
          ],
        ],
      },
      properties: { name: 'Volcanes de fango del Golfo de Cadiz', type: 'mpa', area: 3184 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.99, 32.623],
            [121.418, 32.845],
            [120.83, 33.979],
            [120.402, 33.757],
            [120.99, 32.623],
          ],
        ],
      },
      properties: {
        name: 'Migratory Bird Sanctuaries along the Coast of Yellow Sea-Bohai Gulf of China (Phase I)',
        type: 'mpa',
        area: 1882,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-60.747, -53.754],
            [-62.013, -53.751],
            [-62.016, -54.752],
            [-60.749, -54.755],
            [-60.747, -53.754],
          ],
        ],
      },
      properties: { name: 'Namuncurá - Banco Burdwood I', type: 'mpa', area: 5898 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-56.156, -54.843],
            [-56.154, -53.755],
            [-60.747, -53.744],
            [-60.75, -54.832],
            [-56.156, -54.843],
          ],
        ],
      },
      properties: { name: 'Namuncurá - Banco Burdwood I', type: 'mpa', area: 24708 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-62.74, 17.616],
            [-64.422, 19.1],
            [-69.847, 12.952],
            [-68.165, 11.468],
            [-62.74, 17.616],
          ],
        ],
      },
      properties: { name: 'Yarari', type: 'mpa', area: 25112 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [50.767, -10.5],
            [51.553, -10.335],
            [51.2, -8.65],
            [50.414, -8.815],
            [50.767, -10.5],
          ],
        ],
      },
      properties: {
        name: 'Farquhar Archipelago (Marine) Area of Outstanding Natural Beauty',
        type: 'mpa',
        area: 14337,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [47.705, -10.485],
            [48.183, -10.216],
            [47.678, -9.321],
            [47.2, -9.59],
            [47.705, -10.485],
          ],
        ],
      },
      properties: {
        name: 'Cosmoledo and Astove Archipelago (Marine) Area of Outstanding Natural Beauty',
        type: 'mpa',
        area: 5188,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [52.736, -6.173],
            [52.948, -6.379],
            [53.261, -6.056],
            [53.049, -5.851],
            [52.736, -6.173],
          ],
        ],
      },
      properties: { name: 'Amirantes South (Marine) National Park', type: 'mpa', area: 1330 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-56.499, 80.14],
            [-56.66, 86.996],
            [-110.164, 85.742],
            [-110.003, 78.886],
            [-56.499, 80.14],
          ],
        ],
      },
      properties: { name: 'Tuvaijuittuq Marine Protected Area', type: 'mpa', area: 319582 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-130.141, 51.101],
            [-130.022, 50.085],
            [-128.115, 50.308],
            [-128.234, 51.324],
            [-130.141, 51.101],
          ],
        ],
      },
      properties: { name: 'Scott Islands Marine National Widllife Area', type: 'mpa', area: 11565 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-56.521, 44.857],
            [-56.098, 45.35],
            [-58.651, 47.541],
            [-59.074, 47.049],
            [-56.521, 44.857],
          ],
        ],
      },
      properties: { name: 'Laurentian Channel Marine Protected Area', type: 'mpa', area: 11561 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-58.329, 45.985],
            [-58.408, 46.507],
            [-59.73, 46.305],
            [-59.65, 45.783],
            [-58.329, 45.985],
          ],
        ],
      },
      properties: { name: 'St Anns Bank Marine Protected Area', type: 'mpa', area: 4364 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-133.433, 69.349],
            [-133.524, 69.939],
            [-137.785, 69.285],
            [-137.694, 68.695],
            [-133.433, 69.349],
          ],
        ],
      },
      properties: { name: 'Tarium Niryutait Marine Protected Area', type: 'mpa', area: 1743 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-132.521, 54.291],
            [-133.322, 54.277],
            [-133.306, 53.365],
            [-132.505, 53.379],
            [-132.521, 54.291],
          ],
        ],
      },
      properties: { name: 'Duu Guusd Conservancy', type: 'mpa', area: 2292 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-69.539, 60.825],
            [-70.144, 60.849],
            [-70.172, 60.154],
            [-69.567, 60.13],
            [-69.539, 60.825],
          ],
        ],
      },
      properties: {
        name: 'Proposed Quaqtaq-Kangirsuk Biodiversity Reserve',
        type: 'mpa',
        area: 1253,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-71.93, 7.87],
            [-69.731, 10.429],
            [-71.595, 12.032],
            [-73.795, 9.473],
            [-71.93, 7.87],
          ],
        ],
      },
      properties: { name: 'Lago de Maracaibo', type: 'mpa', area: 58480 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-69.951, 12.154],
            [-70.43, 11.911],
            [-70.035, 11.132],
            [-69.556, 11.374],
            [-69.951, 12.154],
          ],
        ],
      },
      properties: {
        name: 'Zona de Utilidad Pública y de Interés Turístico Recreacional La Península de Paraguaná',
        type: 'mpa',
        area: 2919,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.27, 6.502],
            [-84.317, 6.502],
            [-84.317, 5.001],
            [-80.27, 5.001],
            [-80.27, 6.502],
          ],
        ],
      },
      properties: { name: 'Cordillera de Coiba', type: 'mpa', area: 68205 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.937, 9.438],
            [-80.187, 9.438],
            [-80.187, 11.001],
            [-80.937, 11.001],
            [-80.937, 9.438],
          ],
        ],
      },
      properties: { name: 'Banco Volcán', type: 'mpa', area: 14269 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-166.564, -18.024],
            [-170.37, -18.644],
            [-169.738, -22.528],
            [-165.932, -21.909],
            [-166.564, -18.024],
          ],
        ],
      },
      properties: { name: 'Niue Moana Mahu Marine Protected Area', type: 'mpa', area: 129186 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [98.802, 7.118],
            [99.339, 7.208],
            [99.129, 8.457],
            [98.592, 8.367],
            [98.802, 7.118],
          ],
        ],
      },
      properties: { name: 'Krabi Environmental Protected Area B.E. 2016', type: 'mpa', area: 2154 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [98.342, 7.81],
            [98.741, 7.9],
            [98.414, 9.36],
            [98.016, 9.271],
            [98.342, 7.81],
          ],
        ],
      },
      properties: {
        name: 'Phang-nga Environmental Protected Area B.E. 2016',
        type: 'mpa',
        area: 1801,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [98.177, 7.444],
            [98.519, 7.445],
            [98.517, 8.204],
            [98.176, 8.204],
            [98.177, 7.444],
          ],
        ],
      },
      properties: {
        name: 'Phuket Environmental Protected Area B.E. 2017',
        type: 'mpa',
        area: 2321,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [99.656, 9.29],
            [100.251, 9.289],
            [100.253, 10.221],
            [99.657, 10.222],
            [99.656, 9.29],
          ],
        ],
      },
      properties: {
        name: 'Suratthani Environmental Protected Area B.E. 2015',
        type: 'mpa',
        area: 3534,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [113.395, 3.858],
            [113.631, 3.727],
            [113.961, 4.322],
            [113.725, 4.453],
            [113.395, 3.858],
          ],
        ],
      },
      properties: { name: 'Miri-Sibuti Coral Reef National Park', type: 'mpa', area: 1734 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [116.497, 6.57],
            [117.585, 6.562],
            [117.592, 7.621],
            [116.504, 7.628],
            [116.497, 6.57],
          ],
        ],
      },
      properties: { name: 'Tun Mustapha Park', type: 'mpa', area: 9795 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [58.715, 69.052],
            [58.525, 68.675],
            [59.853, 68.006],
            [60.043, 68.383],
            [58.715, 69.052],
          ],
        ],
      },
      properties: { name: 'Hajpudyrskij', type: 'mpa', area: 1635 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [163.037, 70.546],
            [162.901, 71.472],
            [158.024, 70.754],
            [158.16, 69.829],
            [163.037, 70.546],
          ],
        ],
      },
      properties: { name: 'Medvezh`i ostrova', type: 'mpa', area: 8116 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [104.057, 78.676],
            [104.125, 79.737],
            [91.011, 80.57],
            [90.944, 79.509],
            [104.057, 78.676],
          ],
        ],
      },
      properties: { name: 'Severozemel`skij', type: 'mpa', area: 5114 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-174.786, 67.512],
            [-175.395, 64.704],
            [-170.195, 63.576],
            [-169.586, 66.384],
            [-174.786, 67.512],
          ],
        ],
      },
      properties: { name: 'Beringiya', type: 'mpa', area: 18095 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [53.123, 68.888],
            [53.241, 67.859],
            [59.627, 68.591],
            [59.509, 69.62],
            [53.123, 68.888],
          ],
        ],
      },
      properties: { name: 'Neneckij', type: 'mpa', area: 3118 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.136, 73.172],
            [73.966, 72.05],
            [79.433, 71.221],
            [79.603, 72.343],
            [74.136, 73.172],
          ],
        ],
      },
      properties: { name: 'Gydanskij', type: 'mpa', area: 8733 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [162.802, 69.055],
            [162.871, 69.617],
            [161.4, 69.797],
            [161.331, 69.235],
            [162.802, 69.055],
          ],
        ],
      },
      properties: { name: 'Kolyma-Koren (Del`ta Kolymy)', type: 'mpa', area: 2073 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [136.481, 55.394],
            [136.364, 54.508],
            [138.395, 54.239],
            [138.512, 55.125],
            [136.481, 55.394],
          ],
        ],
      },
      properties: { name: 'SHantarskie ostrova', type: 'mpa', area: 5158 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [69.597, 74.922],
            [70.802, 80.484],
            [44.933, 86.087],
            [43.729, 80.525],
            [69.597, 74.922],
          ],
        ],
      },
      properties: { name: 'Russkaya Arktika', type: 'mpa', area: 86972 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [139.914, 76.617],
            [140.017, 74.147],
            [159.09, 74.948],
            [158.986, 77.418],
            [139.914, 76.617],
          ],
        ],
      },
      properties: { name: 'Novosibirskie ostrova', type: 'mpa', area: 65400 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [119.588, 8.504],
            [120.221, 8.482],
            [120.249, 9.28],
            [119.615, 9.302],
            [119.588, 8.504],
          ],
        ],
      },
      properties: { name: 'Tubbataha Reefs Buffer', type: 'mpa', area: 3563 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [123.988, 16.047],
            [123.988, 15.537],
            [124.58, 15.537],
            [124.58, 16.047],
            [123.988, 16.047],
          ],
        ],
      },
      properties: { name: 'Philippine Rise Marine Resource Reserve', type: 'mpa', area: 3601 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [123.898, 12.222],
            [124.177, 12.566],
            [123.026, 13.501],
            [122.747, 13.157],
            [123.898, 12.222],
          ],
        ],
      },
      properties: { name: 'Ticao-Burias Pass Protected Seascape', type: 'mpa', area: 4165 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [119.588, 8.504],
            [120.221, 8.482],
            [120.249, 9.28],
            [119.615, 9.302],
            [119.588, 8.504],
          ],
        ],
      },
      properties: { name: 'Tubbataha Reefs Natural Park', type: 'mpa', area: 4539 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-31.997, 53.124],
            [-42, 53.126],
            [-42.003, 41.911],
            [-32, 41.909],
            [-31.997, 53.124],
          ],
        ],
      },
      properties: {
        name: 'North Atlantic Current and Evlanov Seamount',
        type: 'mpa',
        area: 594175,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [125.962, 6.186],
            [126.459, 6.07],
            [126.869, 7.821],
            [126.372, 7.938],
            [125.962, 6.186],
          ],
        ],
      },
      properties: { name: 'Pasempando', type: 'mpa', area: 3694 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [125.823, 10.257],
            [125.274, 10.106],
            [125.475, 9.376],
            [126.024, 9.527],
            [125.823, 10.257],
          ],
        ],
      },
      properties: {
        name: 'Hinatuan Passage Development Alliance (HIPADA)',
        type: 'mpa',
        area: 2013,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [126.464, 9.003],
            [126.021, 8.913],
            [126.242, 7.832],
            [126.685, 7.922],
            [126.464, 9.003],
          ],
        ],
      },
      properties: {
        name: 'Coastal Community Alliance Unified for Sustainable Ecosystem (CCAUSE)',
        type: 'mpa',
        area: 2803,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [125.42, 11.006],
            [125.605, 10.474],
            [126.146, 10.663],
            [125.961, 11.195],
            [125.42, 11.006],
          ],
        ],
      },
      properties: {
        name: 'Marine Protected Area Network with Guiuan Marine Resource Protected Landscape and Seascape',
        type: 'mpa',
        area: 2294,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [124.525, 12.957],
            [124.064, 12.827],
            [124.38, 11.706],
            [124.84, 11.835],
            [124.525, 12.957],
          ],
        ],
      },
      properties: {
        name: 'Marine Protected Area Network within Biri-Larosa Protected Landscape and Seascape',
        type: 'mpa',
        area: 1968,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [123.199, 14.289],
            [123.064, 13.641],
            [123.988, 13.449],
            [124.123, 14.096],
            [123.199, 14.289],
          ],
        ],
      },
      properties: {
        name: 'Marine Protected Area Development Action and Networking Goal for Accountability and Transformation (MPADANGAT)',
        type: 'mpa',
        area: 3501,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [124.165, 11.501],
            [124.226, 12.167],
            [122.905, 12.288],
            [122.844, 11.622],
            [124.165, 11.501],
          ],
        ],
      },
      properties: {
        name: 'Asid Gulf Marine Protected Area Network (AGMPAN)',
        type: 'mpa',
        area: 4472,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.119, 16.538],
            [119.734, 16.651],
            [119.504, 15.869],
            [119.89, 15.756],
            [120.119, 16.538],
          ],
        ],
      },
      properties: { name: 'BBBIDA Pangasinan', type: 'mpa', area: 1884 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [122.238, 16.461],
            [122.649, 16.448],
            [122.683, 17.507],
            [122.272, 17.52],
            [122.238, 16.461],
          ],
        ],
      },
      properties: {
        name: 'Northern Sierra Madre NP- Enforcement Network (Tentative Name)',
        type: 'mpa',
        area: 1615,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [119.853, 15.912],
            [119.532, 15.794],
            [119.993, 14.549],
            [120.314, 14.667],
            [119.853, 15.912],
          ],
        ],
      },
      properties: { name: 'Zambales Marine Protected Area Network', type: 'mpa', area: 2680 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [121.486, 11.566],
            [121.969, 11.229],
            [122.263, 11.651],
            [121.78, 11.988],
            [121.486, 11.566],
          ],
        ],
      },
      properties: {
        name: 'DENR Antique, BFAR Antique, Office of the Provincial Agriculture (OPA) Antique and Rare Inc.',
        type: 'mpa',
        area: 2521,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [35.358, 45.091],
            [35.676, 45.547],
            [34.677, 46.245],
            [34.359, 45.789],
            [35.358, 45.091],
          ],
        ],
      },
      properties: { name: 'Eastern Syvash', type: 'mpa', area: 1748 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [31.103, 46.1],
            [30.517, 45.471],
            [31.141, 44.891],
            [31.726, 45.52],
            [31.103, 46.1],
          ],
        ],
      },
      properties: { name: 'Zernov Phyllophora Field Zakaznyk', type: 'mpa', area: 4036 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [32.543, 46.199],
            [32.533, 45.949],
            [33.758, 45.902],
            [33.768, 46.153],
            [32.543, 46.199],
          ],
        ],
      },
      properties: { name: 'Zatoky', type: 'mpa', area: 1051 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [31.545, 46.586],
            [31.483, 46.253],
            [32.274, 46.105],
            [32.336, 46.438],
            [31.545, 46.586],
          ],
        ],
      },
      properties: { name: 'Black Sea Biosphere Reserve', type: 'mpa', area: 1158 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [35.435, 45.423],
            [35.464, 44.953],
            [36.682, 45.029],
            [36.653, 45.499],
            [35.435, 45.423],
          ],
        ],
      },
      properties: { name: 'Kerch peninsula', type: 'mpa', area: 1629 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-10.533, -45.92],
            [-4.257, -40.633],
            [-11.782, -31.7],
            [-18.059, -36.987],
            [-10.533, -45.92],
          ],
        ],
      },
      properties: { name: 'Tristan da Cunha', type: 'mpa', area: 688234 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [58.026, 20.679],
            [58.143, 20.209],
            [58.867, 20.389],
            [58.75, 20.86],
            [58.026, 20.679],
          ],
        ],
      },
      properties: { name: 'Al Wusta Wetland Reserve', type: 'mpa', area: 2636 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [143.901, 36.549],
            [140.924, 36.427],
            [141.332, 26.52],
            [144.309, 26.643],
            [143.901, 36.549],
          ],
        ],
      },
      properties: { name: 'Izu-Ogasawara Trench', type: 'mpa', area: 115689 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [138.766, 33.032],
            [137.666, 32.898],
            [138.4, 26.866],
            [139.5, 27],
            [138.766, 33.032],
          ],
        ],
      },
      properties: { name: 'Nishi-Shichito Ridge', type: 'mpa', area: 36596 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [141.378, 24.493],
            [139.705, 22.838],
            [141.667, 20.855],
            [143.34, 22.509],
            [141.378, 24.493],
          ],
        ],
      },
      properties: {
        name: 'Northern part of Naka Mariana Ridge and West Mariana Ridge',
        type: 'mpa',
        area: 63195,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [143.281, 25.124],
            [142.774, 24.629],
            [144.24, 23.127],
            [144.747, 23.622],
            [143.281, 25.124],
          ],
        ],
      },
      properties: { name: 'Northern part of Mariana Trench', type: 'mpa', area: 11227 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [40.085, 16.794],
            [39.294, 16.252],
            [40.184, 14.953],
            [40.975, 15.496],
            [40.085, 16.794],
          ],
        ],
      },
      properties: { name: 'Dahlak Island PA', type: 'mpa', area: 12042 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [39.868, 15.806],
            [39.445, 15.414],
            [40.453, 14.328],
            [40.875, 14.72],
            [39.868, 15.806],
          ],
        ],
      },
      properties: { name: 'Buri-Irrori Hawakil', type: 'mpa', area: 7276 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [112.757, 6.2],
            [111.956, 5.897],
            [112.444, 4.606],
            [113.245, 4.908],
            [112.757, 6.2],
          ],
        ],
      },
      properties: { name: 'Luconia Shoals National Park', type: 'mpa', area: 10169 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-9.381, 39.882],
            [-8.936, 39.775],
            [-8.624, 41.083],
            [-9.069, 41.189],
            [-9.381, 39.882],
          ],
        ],
      },
      properties: { name: 'Maceda - Praia da Vieira', type: 'mpa', area: 5022 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.495, 42.949],
            [10.495, 43.923],
            [9.721, 43.922],
            [9.721, 42.949],
            [10.495, 42.949],
          ],
        ],
      },
      properties: { name: 'Tutela del Tursiops truncatus', type: 'mpa', area: 3724 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [33.094, 34.356],
            [33.094, 35.356],
            [31.736, 35.356],
            [31.736, 34.356],
            [33.094, 34.356],
          ],
        ],
      },
      properties: { name: 'OCEANID', type: 'mpa', area: 8351 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [3.657, 42.302],
            [3.567, 41.9],
            [4.956, 41.587],
            [5.047, 41.99],
            [3.657, 42.302],
          ],
        ],
      },
      properties: { name: 'Oiseaux marins sud golfe du Lion', type: 'mpa', area: 3080 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [24.438, 39.36],
            [24.037, 39.663],
            [23.622, 39.113],
            [24.023, 38.81],
            [24.438, 39.36],
          ],
        ],
      },
      properties: {
        name: 'ETHNIKO THALASSIO PARKO ALONNISOU – VOREION SPORADON, ANATOLIKI SKOPELOS',
        type: 'mpa',
        area: 2497,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.604, 53.559],
            [6.393, 54.018],
            [4.33, 53.069],
            [4.541, 52.611],
            [6.604, 53.559],
          ],
        ],
      },
      properties: { name: 'Noordzeekustzone', type: 'mpa', area: 1442 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.833, 55.624],
            [6.778, 55.297],
            [8.042, 55.084],
            [8.097, 55.411],
            [6.833, 55.624],
          ],
        ],
      },
      properties: { name: 'Sydlige Nordsø', type: 'mpa', area: 2467 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [23.516, 56.886],
            [23.687, 57.101],
            [22.704, 57.882],
            [22.533, 57.667],
            [23.516, 56.886],
          ],
        ],
      },
      properties: { name: 'Rigas lica rietumu piekraste', type: 'mpa', area: 1318 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [16.29, 56.097],
            [16.654, 55.223],
            [18.956, 56.179],
            [18.593, 57.053],
            [16.29, 56.097],
          ],
        ],
      },
      properties: { name: 'Hoburgs bank och Midsjbankarna', type: 'mpa', area: 10485 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [12.112, 56.609],
            [12.075, 56.158],
            [12.862, 56.093],
            [12.899, 56.544],
            [12.112, 56.609],
          ],
        ],
      },
      properties: { name: 'Nordvstra Sknes havsomrde', type: 'mpa', area: 1339 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [20.577, 63.466],
            [20.583, 62.789],
            [22.131, 62.802],
            [22.125, 63.479],
            [20.577, 63.466],
          ],
        ],
      },
      properties: { name: 'Merenkurkun saaristo', type: 'mpa', area: 1274 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [15.226, 79.51],
            [15.15, 79.036],
            [16.667, 78.794],
            [16.743, 79.268],
            [15.226, 79.51],
          ],
        ],
      },
      properties: { name: 'Indre Wijdefjorden', type: 'mpa', area: 1121 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-118.634, 28.668],
            [-118.018, 28.668],
            [-118.018, 29.384],
            [-118.634, 29.384],
            [-118.634, 28.668],
          ],
        ],
      },
      properties: { name: 'Isla Guadalupe', type: 'mpa', area: 4789 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [51.828, 46.563],
            [52.025, 46.833],
            [51.467, 47.24],
            [51.27, 46.969],
            [51.828, 46.563],
          ],
        ],
      },
      properties: { name: 'State Nature Reservat "Akzhaiyk"', type: 'mpa', area: 1112 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [48.546, 46.598],
            [48.929, 44.099],
            [53.833, 44.851],
            [53.449, 47.35],
            [48.546, 46.598],
          ],
        ],
      },
      properties: {
        name: 'State Reserved Zone  in Northern part of Caspian Sea',
        type: 'mpa',
        area: 62991,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [38.082, -17.208],
            [38.383, -17.688],
            [40.421, -16.411],
            [40.12, -15.931],
            [38.082, -17.208],
          ],
        ],
      },
      properties: { name: 'Primeiras & Segundas', type: 'mpa', area: 8075 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [45.03, -44.853],
            [47.905, -57.133],
            [80.976, -49.391],
            [78.101, -37.11],
            [45.03, -44.853],
          ],
        ],
      },
      properties: { name: 'Terres Australes Françaises', type: 'mpa', area: 673680 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [21.233, 38.792],
            [21.251, 39.272],
            [20.641, 39.295],
            [20.622, 38.815],
            [21.233, 38.792],
          ],
        ],
      },
      properties: {
        name: 'Periochi Perivallontikou Elegchou Ethnikou Parkou Ygrotopon Amvrakikou (Zoni C)',
        type: 'mpa',
        area: 1523,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [24.451, 39.369],
            [24.119, 39.63],
            [23.769, 39.183],
            [24.101, 38.923],
            [24.451, 39.369],
          ],
        ],
      },
      properties: {
        name: 'Zoni A9: Periochi Eidikon Rythmiseon Ethnikou Thalassiou Parkou Alonnisou Voreion Sporadon',
        type: 'mpa',
        area: 1307,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-49.25, -28.809],
            [-49, -28.98],
            [-48.27, -27.91],
            [-48.52, -27.739],
            [-49.25, -28.809],
          ],
        ],
      },
      properties: { name: 'Área De Proteção Ambiental Da Baleia Franca', type: 'mpa', area: 1554 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.924, -1.175],
            [-45.243, -1.422],
            [-44.817, -1.974],
            [-44.497, -1.728],
            [-44.924, -1.175],
          ],
        ],
      },
      properties: { name: 'Reserva Extrativista De Cururupu', type: 'mpa', area: 1864 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-38.83, -15.317],
            [-39.065, -15.385],
            [-38.918, -15.898],
            [-38.682, -15.831],
            [-38.83, -15.317],
          ],
        ],
      },
      properties: { name: 'Reserva Extrativista De Canavieiras', type: 'mpa', area: 1013 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-39.278, -14.333],
            [-39.02, -14.394],
            [-38.899, -13.875],
            [-39.157, -13.815],
            [-39.278, -14.333],
          ],
        ],
      },
      properties: { name: 'Área De Proteção Ambiental Baía De Camamu', type: 'mpa', area: 1234 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-38.355, -12.954],
            [-38.135, -13.102],
            [-37.057, -11.488],
            [-37.278, -11.341],
            [-38.355, -12.954],
          ],
        ],
      },
      properties: {
        name: 'Área De Proteção Ambiental Plataforma Continental Do Litoral Norte',
        type: 'mpa',
        area: 3549,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-42.815, -2.535],
            [-42.867, -2.818],
            [-41.849, -3.007],
            [-41.797, -2.724],
            [-42.815, -2.535],
          ],
        ],
      },
      properties: {
        name: 'Área De Proteção Ambiental Da Foz Do Rio Das Preguiças - Pequenos Lençóis - Região Lagunar Adjacente',
        type: 'mpa',
        area: 2075,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [45.63, -16.425],
            [46.215, -16.358],
            [46.136, -15.669],
            [45.55, -15.736],
            [45.63, -16.425],
          ],
        ],
      },
      properties: { name: 'Complexe Zones Humides Mahavavy Kinkony', type: 'mpa', area: 3510 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [47.648, -14.442],
            [48.08, -14.437],
            [48.073, -13.84],
            [47.64, -13.845],
            [47.648, -14.442],
          ],
        ],
      },
      properties: { name: 'Sahamalaza Iles Radama', type: 'mpa', area: 1121 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [143.501, -38.911],
            [143.501, -39.35],
            [144, -39.35],
            [144, -38.911],
            [143.501, -38.911],
          ],
        ],
      },
      properties: { name: 'Apollo', type: 'mpa', area: 1185 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [147.467, -39.6],
            [147.467, -39.1],
            [146.47, -39.1],
            [146.47, -39.6],
            [147.467, -39.6],
          ],
        ],
      },
      properties: { name: 'Beagle', type: 'mpa', area: 2931 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [150.6, -37.633],
            [149.85, -37.633],
            [149.85, -38.5],
            [150.6, -38.5],
            [150.6, -37.633],
          ],
        ],
      },
      properties: { name: 'East Gippsland', type: 'mpa', area: 4143 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [148.587, -40.85],
            [148.98, -40.85],
            [148.98, -40.354],
            [148.587, -40.354],
            [148.587, -40.85],
          ],
        ],
      },
      properties: { name: 'Flinders', type: 'mpa', area: 1232 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [148.752, -40.421],
            [148.964, -41.147],
            [154.003, -39.677],
            [153.791, -38.95],
            [148.752, -40.421],
          ],
        ],
      },
      properties: { name: 'Flinders', type: 'mpa', area: 25845 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [152.813, -41.067],
            [148.638, -41.173],
            [148.7, -43.583],
            [152.874, -43.477],
            [152.813, -41.067],
          ],
        ],
      },
      properties: { name: 'Freycinet', type: 'mpa', area: 56831 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [147.044, -43.5],
            [146.518, -44.369],
            [148.303, -45.448],
            [148.828, -44.579],
            [147.044, -43.5],
          ],
        ],
      },
      properties: { name: 'Huon', type: 'mpa', area: 9603 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [164.301, -56.564],
            [164.651, -54.968],
            [158.898, -53.707],
            [158.548, -55.302],
            [164.301, -56.564],
          ],
        ],
      },
      properties: { name: 'Macquarie Island', type: 'mpa', area: 57004 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [158.588, -53.783],
            [158.588, -58.449],
            [164.691, -58.449],
            [164.691, -53.783],
            [158.588, -53.783],
          ],
        ],
      },
      properties: { name: 'Macquarie Island', type: 'mpa', area: 104493 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [137.937, -37.814],
            [136.7, -37.403],
            [135.933, -39.708],
            [137.17, -40.12],
            [137.937, -37.814],
          ],
        ],
      },
      properties: { name: 'Murray', type: 'mpa', area: 12769 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [139.166, -35.787],
            [137.887, -34.924],
            [136.366, -37.178],
            [137.645, -38.04],
            [139.166, -35.787],
          ],
        ],
      },
      properties: { name: 'Murray', type: 'mpa', area: 13079 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [139.045, -39.717],
            [139.451, -40.154],
            [140.71, -38.985],
            [140.304, -38.548],
            [139.045, -39.717],
          ],
        ],
      },
      properties: { name: 'Nelson', type: 'mpa', area: 6131 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [151.02, -46.07],
            [150.475, -44.733],
            [146.764, -46.244],
            [147.309, -47.581],
            [151.02, -46.07],
          ],
        ],
      },
      properties: { name: 'South Tasman Rise', type: 'mpa', area: 27696 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [144, -46.938],
            [146.391, -46.938],
            [146.391, -43.4],
            [144, -43.4],
            [144, -46.938],
          ],
        ],
      },
      properties: { name: 'Tasman Fracture', type: 'mpa', area: 41811 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [141.85, -42.5],
            [143.667, -42.5],
            [143.667, -39.79],
            [141.85, -39.79],
            [141.85, -42.5],
          ],
        ],
      },
      properties: { name: 'Zeehan', type: 'mpa', area: 19915 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [11.518, 42.355],
            [9.745, 45.275],
            [6.084, 43.052],
            [7.857, 40.132],
            [11.518, 42.355],
          ],
        ],
      },
      properties: {
        name: 'Pelagos Sanctuary For The Conservation Of Marine Mammals',
        type: 'mpa',
        area: 87714,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-167.499, 60.237],
            [-167.537, 59.87],
            [-165.541, 59.659],
            [-165.502, 60.026],
            [-167.499, 60.237],
          ],
        ],
      },
      properties: { name: 'Nunivak', type: 'mpa', area: 2408 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [22.894, 57.899],
            [22.835, 58.271],
            [21.634, 58.08],
            [21.693, 57.707],
            [22.894, 57.899],
          ],
        ],
      },
      properties: { name: 'Kura Kurgu Hoiuala', type: 'mpa', area: 1889 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [23.732, 58.368],
            [23.742, 58.058],
            [24.546, 58.081],
            [24.537, 58.392],
            [23.732, 58.368],
          ],
        ],
      },
      properties: { name: 'Pärnu Lahe Hoiuala', type: 'mpa', area: 1014 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-4.268, 47.983],
            [-4.268, 48.517],
            [-5.452, 48.517],
            [-5.452, 47.983],
            [-4.268, 47.983],
          ],
        ],
      },
      properties: { name: 'Iroise', type: 'mpa', area: 3428 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-7.265, 70.923],
            [-7.382, 71.527],
            [-9.719, 71.075],
            [-9.602, 70.471],
            [-7.265, 70.923],
          ],
        ],
      },
      properties: { name: 'Jan Mayen', type: 'mpa', area: 4659 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [21.205, 57.758],
            [21.249, 57.421],
            [22.82, 57.63],
            [22.775, 57.967],
            [21.205, 57.758],
          ],
        ],
      },
      properties: { name: 'Irbes Šaurums', type: 'mpa', area: 1719 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [23.516, 56.886],
            [23.687, 57.101],
            [22.704, 57.882],
            [22.533, 57.667],
            [23.516, 56.886],
          ],
        ],
      },
      properties: { name: 'Rīgas Līča Rietumu Piekraste', type: 'mpa', area: 1318 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [142.251, 11.046],
            [147.896, 10.429],
            [149.318, 23.432],
            [143.672, 24.049],
            [142.251, 11.046],
          ],
        ],
      },
      properties: { name: 'Marianas Trench Marine National Monument', type: 'mpa', area: 247237 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-167.283, -15.386],
            [-167.283, -13.698],
            [-169.013, -13.698],
            [-169.013, -15.386],
            [-167.283, -15.386],
          ],
        ],
      },
      properties: { name: 'Rose Atoll Marine National Monument', type: 'mpa', area: 34801 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-90.104, 22.599],
            [-89.75, 22.056],
            [-89.283, 22.36],
            [-89.636, 22.904],
            [-90.104, 22.599],
          ],
        ],
      },
      properties: { name: 'Parque Nacional Arrecife Alacranes', type: 'mpa', area: 3353 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [161.624, -45],
            [161.624, -46],
            [166.763, -46],
            [166.763, -45],
            [161.624, -45],
          ],
        ],
      },
      properties: { name: 'Fiorland Transect', type: 'mpa', area: 40595 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [167.561, -33.08],
            [168.037, -33.88],
            [173.017, -30.915],
            [172.541, -30.115],
            [167.561, -33.08],
          ],
        ],
      },
      properties: { name: 'Norfolk Deep', type: 'mpa', area: 44559 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [169.667, -40.083],
            [170.667, -40.083],
            [170.667, -38.25],
            [169.667, -38.25],
            [169.667, -40.083],
          ],
        ],
      },
      properties: { name: 'Challenger North', type: 'mpa', area: 17613 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [166.3, -41],
            [166.3, -42.667],
            [168.3, -42.667],
            [168.3, -41],
            [166.3, -41],
          ],
        ],
      },
      properties: { name: 'Challenger South', type: 'mpa', area: 30576 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-175.5, -43.667],
            [-174.333, -43.667],
            [-174.333, -43.167],
            [-175.5, -43.167],
            [-175.5, -43.667],
          ],
        ],
      },
      properties: { name: 'East Chatham Rise', type: 'mpa', area: 5251 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [161.76, -52],
            [161.76, -55.841],
            [167.667, -55.841],
            [167.667, -52],
            [161.76, -52],
          ],
        ],
      },
      properties: { name: 'Sub-Antarctic Deep', type: 'mpa', area: 98729 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [178.5, -53.059],
            [180, -53.059],
            [180, -48.5],
            [178.5, -48.5],
            [178.5, -53.059],
          ],
        ],
      },
      properties: { name: 'Antipodes Transect', type: 'mpa', area: 53232 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [179.326, -48.015],
            [179.392, -47.599],
            [178.75, -47.498],
            [178.685, -47.915],
            [179.326, -48.015],
          ],
        ],
      },
      properties: { name: 'Bounty Heritage', type: 'mpa', area: 1790 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [168.652, -52.274],
            [168.659, -52.827],
            [169.6, -52.815],
            [169.593, -52.262],
            [168.652, -52.274],
          ],
        ],
      },
      properties: { name: 'Campbell Heritage', type: 'mpa', area: 2880 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [173.683, -51.833],
            [173.683, -50.267],
            [171.833, -50.267],
            [171.833, -51.833],
            [173.683, -51.833],
          ],
        ],
      },
      properties: { name: 'Campbell East', type: 'mpa', area: 22576 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [179.699, -34.433],
            [179.102, -34.05],
            [178.001, -35.764],
            [178.598, -36.147],
            [179.699, -34.433],
          ],
        ],
      },
      properties: { name: 'Tectonic Reach', type: 'mpa', area: 13645 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-180, -41],
            [-180, -42.167],
            [-175, -42.167],
            [-175, -41],
            [-180, -41],
          ],
        ],
      },
      properties: { name: 'Hikurangi Deep', type: 'mpa', area: 54066 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-69.141, 18.524],
            [-67.941, 19.517],
            [-69.921, 21.91],
            [-71.121, 20.917],
            [-69.141, 18.524],
          ],
        ],
      },
      properties: {
        name: 'Santuario de los Bancos de La Plata y La Navidad',
        type: 'mpa',
        area: 35469,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [104.539, 8.429],
            [105.089, 8.431],
            [105.087, 9.434],
            [104.536, 9.433],
            [104.539, 8.429],
          ],
        ],
      },
      properties: { name: 'Mui Ca Mau', type: 'mpa', area: 4906 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-48, -61.5],
            [-48, -64],
            [-41, -64],
            [-41, -61.5],
            [-48, -61.5],
          ],
        ],
      },
      properties: {
        name: 'South Orkney Islands Southern Shelf Marine Protected Area',
        type: 'mpa',
        area: 93274,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [105.316, 9.39],
            [105.446, 10.39],
            [103.814, 10.601],
            [103.684, 9.601],
            [105.316, 9.39],
          ],
        ],
      },
      properties: { name: 'Kien Giang', type: 'mpa', area: 11686 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [105.96, 19.933],
            [106.254, 19.671],
            [106.898, 20.393],
            [106.604, 20.656],
            [105.96, 19.933],
          ],
        ],
      },
      properties: { name: 'Red River Delta', type: 'mpa', area: 1689 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [180, -26.448],
            [177.282, -26.448],
            [177.282, -34.524],
            [180, -34.525],
            [180, -26.448],
          ],
        ],
      },
      properties: { name: 'Kermadec', type: 'mpa', area: 161121 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [177.667, -43.167],
            [177.624, -43.494],
            [179.999, -43.807],
            [180.043, -43.479],
            [177.667, -43.167],
          ],
        ],
      },
      properties: { name: 'Mid Chatham Rise', type: 'mpa', area: 6978 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-38.997, -17.688],
            [-39.232, -17.528],
            [-39.533, -17.971],
            [-39.298, -18.131],
            [-38.997, -17.688],
          ],
        ],
      },
      properties: { name: 'Reserva Extrativista De Cassurubá', type: 'mpa', area: 1011 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.639, 53.062],
            [5.812, 51.49],
            [9.503, 54.247],
            [8.329, 55.818],
            [4.639, 53.062],
          ],
        ],
      },
      properties: { name: 'The Wadden Sea', type: 'mpa', area: 11550 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [17.882, 63.333],
            [17.912, 62.674],
            [21.934, 62.852],
            [21.905, 63.511],
            [17.882, 63.333],
          ],
        ],
      },
      properties: { name: 'High Coast / Kvarken Archipelago', type: 'mpa', area: 3541 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.94, 21.539],
            [-80.525, 22.148],
            [-81.764, 22.994],
            [-82.18, 22.384],
            [-80.94, 21.539],
          ],
        ],
      },
      properties: { name: 'Ciénaga de Zapata', type: 'mpa', area: 6503 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [121.027, 39.212],
            [121.027, 38.919],
            [121.563, 38.918],
            [121.564, 39.211],
            [121.027, 39.212],
          ],
        ],
      },
      properties: { name: 'Dalian National Spotted Seal Nature Reserve', type: 'mpa', area: 1171 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.756, 32.562],
            [121.088, 32.735],
            [120.089, 34.645],
            [119.758, 34.472],
            [120.756, 32.562],
          ],
        ],
      },
      properties: { name: 'Yancheng National Nature Reserve', type: 'mpa', area: 2879 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.76, 13.373],
            [-82.627, 13.159],
            [-82.311, 14.832],
            [-83.444, 15.046],
            [-83.76, 13.373],
          ],
        ],
      },
      properties: { name: 'Cayos Miskitos y Franja Costera Inmediata', type: 'mpa', area: 8947 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.635, 12.224],
            [-84.105, 12.233],
            [-84.113, 11.798],
            [-83.642, 11.79],
            [-83.635, 12.224],
          ],
        ],
      },
      properties: {
        name: 'Sistema de Humedales de la Bahía de Bluefields',
        type: 'mpa',
        area: 1482,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [145.666, -38.613],
            [145.725, -38.206],
            [144.686, -38.056],
            [144.627, -38.463],
            [145.666, -38.613],
          ],
        ],
      },
      properties: { name: 'Mornington Peninsula & Western Port', type: 'mpa', area: 2146 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [165.566, 55.815],
            [165.249, 54.995],
            [168.204, 53.851],
            [168.521, 54.67],
            [165.566, 55.815],
          ],
        ],
      },
      properties: { name: 'Commander Islands', type: 'mpa', area: 11191 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [149.239, -15.994],
            [148.866, -17.199],
            [152.102, -18.199],
            [152.474, -16.994],
            [149.239, -15.994],
          ],
        ],
      },
      properties: {
        name: 'Coral Sea Reserves (Coringa-Herald and Lihou Reefs and Cays)',
        type: 'mpa',
        area: 17386,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [158.917, -30.05],
            [159.165, -30.074],
            [159.233, -29.35],
            [158.986, -29.326],
            [158.917, -30.05],
          ],
        ],
      },
      properties: {
        name: 'Elizabeth and Middleton Reefs Marine National Nature Reserve',
        type: 'mpa',
        area: 1884,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [5.225, 53.179],
            [4.987, 52.858],
            [5.531, 52.454],
            [5.769, 52.775],
            [5.225, 53.179],
          ],
        ],
      },
      properties: { name: 'IJsselmeer', type: 'mpa', area: 1080 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.604, 53.559],
            [6.393, 54.018],
            [4.33, 53.069],
            [4.541, 52.611],
            [6.604, 53.559],
          ],
        ],
      },
      properties: { name: 'North Sea Coastal Area', type: 'mpa', area: 1442 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-78.544, 22.606],
            [-78.957, 22.988],
            [-79.461, 22.443],
            [-79.048, 22.061],
            [-78.544, 22.606],
          ],
        ],
      },
      properties: { name: 'Buenavista', type: 'mpa', area: 3152 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.226, 21.632],
            [-83.168, 21.358],
            [-82.453, 21.51],
            [-82.511, 21.784],
            [-83.226, 21.632],
          ],
        ],
      },
      properties: {
        name: 'Ciénaga de Lanier y Sur de la Isla de la Juventud',
        type: 'mpa',
        area: 1299,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-78.868, 22.59],
            [-78.867, 22.078],
            [-78.075, 22.08],
            [-78.076, 22.591],
            [-78.868, 22.59],
          ],
        ],
      },
      properties: { name: 'Gran Humedal del Norte de Ciego de Ávila', type: 'mpa', area: 2514 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [130.663, 42.59],
            [130.824, 42.208],
            [131.952, 42.682],
            [131.791, 43.065],
            [130.663, 42.59],
          ],
        ],
      },
      properties: { name: 'Far East Marine', type: 'mpa', area: 1308 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-88.138, 18.896],
            [-87.566, 18.715],
            [-87.145, 20.04],
            [-87.717, 20.222],
            [-88.138, 18.896],
          ],
        ],
      },
      properties: { name: "Sian Ka'an", type: 'mpa', area: 6559 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-113.864, 27.866],
            [-114.417, 28.058],
            [-114.584, 27.575],
            [-114.031, 27.383],
            [-113.864, 27.866],
          ],
        ],
      },
      properties: { name: 'Laguna Ojo de Liebre', type: 'mpa', area: 2275 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-108.317, 25.386],
            [-108.486, 25.234],
            [-107.982, 24.672],
            [-107.812, 24.824],
            [-108.317, 25.386],
          ],
        ],
      },
      properties: { name: 'Laguna Playa Colorada-Santa Marea La Reforma', type: 'mpa', area: 1224 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-113.137, 27.281],
            [-113.453, 27.149],
            [-113.105, 26.312],
            [-112.789, 26.443],
            [-113.137, 27.281],
          ],
        ],
      },
      properties: { name: 'Laguna San Ignacio', type: 'mpa', area: 1433 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-87.474, 18.813],
            [-87.474, 18.361],
            [-87.2, 18.362],
            [-87.2, 18.814],
            [-87.474, 18.813],
          ],
        ],
      },
      properties: { name: 'Reserva de la Biosfera Banco Chinchorro', type: 'mpa', area: 1453 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-90.296, 20.525],
            [-90.756, 20.573],
            [-90.83, 19.866],
            [-90.37, 19.817],
            [-90.296, 20.525],
          ],
        ],
      },
      properties: { name: 'Reserva de la Biosfera Los Petenes', type: 'mpa', area: 2841 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-92.493, 18.67],
            [-92.226, 18.025],
            [-90.856, 18.59],
            [-91.122, 19.236],
            [-92.493, 18.67],
          ],
        ],
      },
      properties: {
        name: 'Área de Protección de Flora y Fauna Laguna de Términos',
        type: 'mpa',
        area: 7102,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-114.98, 18.497],
            [-114.766, 17.611],
            [-110.45, 18.651],
            [-110.664, 19.538],
            [-114.98, 18.497],
          ],
        ],
      },
      properties: {
        name: 'Reserva de la Biosfera Archipiélago de Revillagigedo',
        type: 'mpa',
        area: 6409,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-110.751, 25.589],
            [-110.751, 26.131],
            [-111.359, 26.131],
            [-111.359, 25.589],
            [-110.751, 25.589],
          ],
        ],
      },
      properties: { name: 'Parque Nacional Bahía de Loreto', type: 'mpa', area: 2084 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-87.515, 21.705],
            [-87.515, 21.24],
            [-87.097, 21.24],
            [-87.098, 21.705],
            [-87.515, 21.705],
          ],
        ],
      },
      properties: {
        name: 'Área de Protección de Flora y Fauna Yum Balam',
        type: 'mpa',
        area: 1549,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-97.312, 25.463],
            [-97.72, 25.623],
            [-98.075, 24.722],
            [-97.667, 24.562],
            [-97.312, 25.463],
          ],
        ],
      },
      properties: { name: 'Laguna Madre', type: 'mpa', area: 3097 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [39.964, -7.619],
            [39.363, -7.395],
            [38.961, -8.471],
            [39.563, -8.696],
            [39.964, -7.619],
          ],
        ],
      },
      properties: { name: 'Rufiji-Mafia-Kilwa', type: 'mpa', area: 5192 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-81.84, 7.945],
            [-82.31, 7.466],
            [-81.772, 6.938],
            [-81.302, 7.417],
            [-81.84, 7.945],
          ],
        ],
      },
      properties: {
        name: 'Coiba National Park and its Special Zone of Marine Protection',
        type: 'mpa',
        area: 4330,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-72.045, -53.565],
            [-72.474, -55.15],
            [-66.497, -56.766],
            [-66.068, -55.181],
            [-72.045, -53.565],
          ],
        ],
      },
      properties: { name: 'Cabo de Hornos', type: 'mpa', area: 48487 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [122.023, 40.753],
            [122.018, 41.218],
            [121.466, 41.212],
            [121.472, 40.747],
            [122.023, 40.753],
          ],
        ],
      },
      properties: { name: 'Shuangtai Estuary', type: 'mpa', area: 1282 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-82, 3.533],
            [-81.133, 3.533],
            [-81.133, 4.433],
            [-82, 4.433],
            [-82, 3.533],
          ],
        ],
      },
      properties: { name: 'Malpelo Fauna and Flora Sanctuary', type: 'mpa', area: 9642 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [167.252, -23.264],
            [168.368, -21.923],
            [163.153, -17.585],
            [162.037, -18.926],
            [167.252, -23.264],
          ],
        ],
      },
      properties: {
        name: 'Lagoons of New Caledonia: Reef Diversity and Associated Ecosystems',
        type: 'mpa',
        area: 15752,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [52.008, 12.536],
            [52.093, 11.904],
            [54.639, 12.245],
            [54.554, 12.878],
            [52.008, 12.536],
          ],
        ],
      },
      properties: { name: 'Socotra Archipelago', type: 'mpa', area: 4108 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [129.83, 0.585],
            [129.676, 0.239],
            [130.262, -0.024],
            [130.417, 0.322],
            [129.83, 0.585],
          ],
        ],
      },
      properties: { name: 'KKPN KEPULAUAN WAIGEO SEBELAH BARAT', type: 'mpa', area: 2689 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [133.747, -2.825],
            [132.69, -3.968],
            [134.058, -5.231],
            [135.114, -4.088],
            [133.747, -2.825],
          ],
        ],
      },
      properties: { name: 'Kaimana', type: 'mpa', area: 5444 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [131.026, -2.264],
            [131.023, -1.824],
            [130.078, -1.829],
            [130.08, -2.268],
            [131.026, -2.264],
          ],
        ],
      },
      properties: { name: 'Southeast Misool (Raja Ampat)', type: 'mpa', area: 3346 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [118.905, 0.999],
            [119.388, 1.632],
            [118.137, 2.585],
            [117.655, 1.952],
            [118.905, 0.999],
          ],
        ],
      },
      properties: {
        name: 'KKPD KEPULAUAN DERAWAN DAN PERAIRAN SEKITARNYA',
        type: 'mpa',
        area: 2869,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [123.725, -8.122],
            [123.767, -8.636],
            [124.811, -8.552],
            [124.769, -8.038],
            [123.725, -8.122],
          ],
        ],
      },
      properties: {
        name: 'KKPD SELAT PANTAR DAN PERAIRAN SEKITARNYA KABUPATEN ALOR',
        type: 'mpa',
        area: 2731,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [118.989, -8.648],
            [118.745, -10.708],
            [124.254, -11.36],
            [124.498, -9.3],
            [118.989, -8.648],
          ],
        ],
      },
      properties: { name: 'KKPN LAUT SAWU', type: 'mpa', area: 33765 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [104.438, 0.61],
            [104.048, 0.287],
            [104.718, -0.519],
            [105.107, -0.196],
            [104.438, 0.61],
          ],
        ],
      },
      properties: { name: 'KKPD KABUPATEN LINGGA', type: 'mpa', area: 3549 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [99.563, -2.165],
            [99.717, -1.896],
            [99.151, -1.572],
            [98.997, -1.841],
            [99.563, -2.165],
          ],
        ],
      },
      properties: { name: 'KKPD SELAT BUNGA LAUT KABUPATEN MENTAWAI', type: 'mpa', area: 1307 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [104.555, 1.213],
            [104.594, 0.322],
            [107.999, 0.468],
            [107.961, 1.36],
            [104.555, 1.213],
          ],
        ],
      },
      properties: { name: 'Kabupaten Bintan', type: 'mpa', area: 12234 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [104.464, 0.78],
            [104.072, 0.936],
            [103.925, 0.567],
            [104.316, 0.41],
            [104.464, 0.78],
          ],
        ],
      },
      properties: { name: 'Kota Batam', type: 'mpa', area: 1180 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [130.841, 0.36],
            [131.125, 0.204],
            [131.536, 0.952],
            [131.252, 1.108],
            [130.841, 0.36],
          ],
        ],
      },
      properties: { name: 'Ayau-Asia Island (Raja Ampat)', type: 'mpa', area: 1019 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-178.844, 29.795],
            [-179.766, 27.125],
            [-161.721, 20.895],
            [-160.799, 23.566],
            [-178.844, 29.795],
          ],
        ],
      },
      properties: { name: 'Papahānaumokuākea', type: 'mpa', area: 364793 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-175.866, -6.618],
            [-169.706, -6.618],
            [-169.706, -0.983],
            [-175.866, -0.983],
            [-175.866, -6.618],
          ],
        ],
      },
      properties: { name: 'Phoenix Islands Protected Area', type: 'mpa', area: 408258 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-180, -34.68],
            [-174.021, -34.68],
            [-174.021, -25.902],
            [-180, -25.902],
            [-180, -34.68],
          ],
        ],
      },
      properties: { name: 'Kermadec', type: 'mpa', area: 460101 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-173, -46.999],
            [-171.201, -46.999],
            [-171.201, -41.356],
            [-173, -41.356],
            [-173, -46.999],
          ],
        ],
      },
      properties: { name: 'Arrow Plateau', type: 'mpa', area: 64475 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [167.303, -23.371],
            [167.859, -22.766],
            [166.961, -21.942],
            [166.406, -22.547],
            [167.303, -23.371],
          ],
        ],
      },
      properties: { name: 'Parc du Grand Lagon Sud', type: 'mpa', area: 6758 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [166.039, -21.646],
            [165.214, -21.152],
            [165.008, -21.495],
            [165.834, -21.989],
            [166.039, -21.646],
          ],
        ],
      },
      properties: { name: 'Parc de la Zone Côtière Ouest', type: 'mpa', area: 2566 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [117.184, 20.449],
            [117.083, 21.031],
            [116.436, 20.919],
            [116.537, 20.337],
            [117.184, 20.449],
          ],
        ],
      },
      properties: { name: 'Dongsha', type: 'mpa', area: 3602 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [129.246, -1.127],
            [129.247, -1.426],
            [130.001, -1.423],
            [130, -1.124],
            [129.246, -1.127],
          ],
        ],
      },
      properties: { name: 'Kofiau and Boo Islands (Raja Ampat)', type: 'mpa', area: 1589 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [14.691, -24.432],
            [14.233, -24.562],
            [15.23, -28.06],
            [15.689, -27.93],
            [14.691, -24.432],
          ],
        ],
      },
      properties: { name: 'Namibian Islands Marine Protected Area', type: 'mpa', area: 9542 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-130.941, 51.735],
            [-130.555, 52.26],
            [-131.837, 53.201],
            [-132.223, 52.676],
            [-130.941, 51.735],
          ],
        ],
      },
      properties: {
        name: 'Gwaii Haanas National Marine Conservation Area Reserve & Haida Heritage Site',
        type: 'mpa',
        area: 3483,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [68.866, -1.963],
            [67.016, -9.579],
            [74.948, -11.506],
            [76.798, -3.89],
            [68.866, -1.963],
          ],
        ],
      },
      properties: {
        name: 'British Indian Ocean Territory Marine Protected Area (Chagos)',
        type: 'mpa',
        area: 642340,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [43.315, -46.566],
            [40.601, -40.858],
            [31.997, -44.948],
            [34.71, -50.656],
            [43.315, -46.566],
          ],
        ],
      },
      properties: { name: 'Prince Edward Island Marine Protected Area', type: 'mpa', area: 181250 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-22.78, 43.36],
            [-22.1, 43.36],
            [-22.1, 43.82],
            [-22.78, 43.82],
            [-22.78, 43.36],
          ],
        ],
      },
      properties: { name: 'Antialtair Seamount High Seas MPA', type: 'mpa', area: 2808 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-34.46, 44.86],
            [-34.46, 44.32],
            [-33.54, 44.32],
            [-33.54, 44.86],
            [-34.46, 44.86],
          ],
        ],
      },
      properties: { name: 'Altair Seamount High Seas MPA', type: 'mpa', area: 4384 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-15.72, 36.76],
            [-15.074, 35.772],
            [-13.296, 36.935],
            [-13.942, 37.923],
            [-15.72, 36.76],
          ],
        ],
      },
      properties: { name: 'Josephine Seamount High Seas MPA', type: 'mpa', area: 19402 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-41.22, 45.297],
            [-41.22, 44.177],
            [-39.1, 44.177],
            [-39.1, 45.297],
            [-41.22, 45.297],
          ],
        ],
      },
      properties: { name: 'Milne Seamount Complex MPA', type: 'mpa', area: 20915 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-24.8, 43.3],
            [-24.8, 44.7],
            [-32.3, 44.7],
            [-32.3, 43.3],
            [-24.8, 43.3],
          ],
        ],
      },
      properties: { name: 'MAR North of the Azores High Seas MPA', type: 'mpa', area: 93596 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-27, 53.5],
            [-37, 53.5],
            [-37, 49],
            [-27, 49],
            [-27, 53.5],
          ],
        ],
      },
      properties: { name: 'Charlie-Gibbs South High Seas MPA', type: 'mpa', area: 146438 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-30.901, 29.01],
            [-26.406, 29.459],
            [-27.025, 35.648],
            [-31.52, 35.198],
            [-30.901, 29.01],
          ],
        ],
      },
      properties: { name: 'Arquipélago Submarino Do Meteor', type: 'mpa', area: 123661 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-31.224, 37.71],
            [-31.538, 38.197],
            [-34.315, 36.404],
            [-34.001, 35.917],
            [-31.224, 37.71],
          ],
        ],
      },
      properties: { name: 'Campos Hidrotermais A Sudoeste Dos Açores', type: 'mpa', area: 11058 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [7.211, 53.232],
            [7.145, 53.683],
            [4.666, 53.318],
            [4.733, 52.867],
            [7.211, 53.232],
          ],
        ],
      },
      properties: { name: 'Waddenzee', type: 'mpa', area: 2712 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.604, 53.559],
            [6.393, 54.018],
            [4.33, 53.069],
            [4.541, 52.611],
            [6.604, 53.559],
          ],
        ],
      },
      properties: { name: 'Noordzeekustzone', type: 'mpa', area: 1442 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [5.259, 53.192],
            [4.988, 52.868],
            [5.503, 52.438],
            [5.774, 52.762],
            [5.259, 53.192],
          ],
        ],
      },
      properties: { name: 'Ijsselmeer', type: 'mpa', area: 1131 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [43.283, -14.123],
            [44.941, -15.503],
            [47.425, -12.52],
            [45.768, -11.14],
            [43.283, -14.123],
          ],
        ],
      },
      properties: { name: 'Mayotte', type: 'mpa', area: 68801 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-180, -43.473],
            [-180.043, -43.801],
            [-179.417, -43.883],
            [-179.374, -43.556],
            [-180, -43.473],
          ],
        ],
      },
      properties: { name: 'Mid Chatham Rise', type: 'mpa', area: 1737 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-180, -52.966],
            [-176.43, -52.966],
            [-176.43, -48.5],
            [-180, -48.5],
            [-180, -52.966],
          ],
        ],
      },
      properties: { name: 'Antipodes Transect', type: 'mpa', area: 56630 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-128.505, 51.489],
            [-127.901, 51.484],
            [-127.896, 52.013],
            [-128.5, 52.019],
            [-128.505, 51.489],
          ],
        ],
      },
      properties: { name: 'Hakai Luxvbalis Conservancy', type: 'mpa', area: 1211 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-136.905, 53.939],
            [-137.021, 53.253],
            [-135.059, 52.919],
            [-134.942, 53.605],
            [-136.905, 53.939],
          ],
        ],
      },
      properties: {
        name: 'SGaan Kinghlas – Bowie Seamount Marine Protected Area',
        type: 'mpa',
        area: 6110,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-87.09, 64.688],
            [-86.773, 66.022],
            [-92.416, 67.362],
            [-92.733, 66.028],
            [-87.09, 64.688],
          ],
        ],
      },
      properties: { name: 'Ukkusiksalik National Park Of Canada', type: 'mpa', area: 20892 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-68.667, 69.834],
            [-68.667, 69.284],
            [-66.12, 69.283],
            [-66.12, 69.833],
            [-68.667, 69.834],
          ],
        ],
      },
      properties: { name: 'Ninginganiq National Wildlife Area', type: 'mpa', area: 3360 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [27.258, 42.213],
            [27.239, 41.927],
            [28.239, 41.859],
            [28.259, 42.145],
            [27.258, 42.213],
          ],
        ],
      },
      properties: { name: 'Strandzha', type: 'mpa', area: 1537 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [7.96, 55.108],
            [7.861, 53.959],
            [8.997, 53.861],
            [9.096, 55.01],
            [7.96, 55.108],
          ],
        ],
      },
      properties: {
        name: 'NTP S-H Wattenmeer und angrenzende Küstengebiete',
        type: 'mpa',
        area: 4515,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.598, 55.213],
            [4.748, 55.548],
            [3.786, 55.98],
            [3.636, 55.645],
            [4.598, 55.213],
          ],
        ],
      },
      properties: { name: 'Doggerbank', type: 'mpa', area: 1692 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.039, 54.499],
            [8.066, 55.198],
            [6.337, 55.266],
            [6.309, 54.567],
            [8.039, 54.499],
          ],
        ],
      },
      properties: { name: 'Sylter Außenriff', type: 'mpa', area: 5306 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [14.056, 54.5],
            [14.056, 54.126],
            [14.748, 54.126],
            [14.748, 54.5],
            [14.056, 54.5],
          ],
        ],
      },
      properties: { name: 'Pommersche Bucht mit Oderbank', type: 'mpa', area: 1097 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.564, 53.766],
            [6.627, 53.172],
            [8.739, 53.396],
            [8.677, 53.99],
            [6.564, 53.766],
          ],
        ],
      },
      properties: { name: 'Nationalpark Niedersächsisches Wattenmeer', type: 'mpa', area: 2761 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.163, 55.824],
            [7.859, 55.352],
            [8.663, 54.835],
            [8.966, 55.306],
            [8.163, 55.824],
          ],
        ],
      },
      properties: {
        name: 'Vadehavet med Ribe Å, Tved Å og Varde Å vest for Varde',
        type: 'mpa',
        area: 1351,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [9.796, 58.03],
            [9.912, 57.533],
            [11.013, 57.79],
            [10.897, 58.287],
            [9.796, 58.03],
          ],
        ],
      },
      properties: { name: 'Skagens Gren og Skagerak', type: 'mpa', area: 2697 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [23.948, 58.391],
            [24.036, 59.01],
            [22.584, 59.216],
            [22.496, 58.597],
            [23.948, 58.391],
          ],
        ],
      },
      properties: { name: 'Väinamere', type: 'mpa', area: 2532 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.553, 37.388],
            [-0.549, 37.631],
            [-1.546, 37.647],
            [-1.55, 37.405],
            [-0.553, 37.388],
          ],
        ],
      },
      properties: { name: 'Valles submarinos del Escarpe de Mazarrón', type: 'mpa', area: 1550 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.267, 44.2],
            [-5.267, 43.883],
            [-4.433, 43.883],
            [-4.433, 44.2],
            [-5.267, 44.2],
          ],
        ],
      },
      properties: { name: 'El Cachucho', type: 'mpa', area: 2351 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [21.051, 60.151],
            [21.038, 59.647],
            [22.804, 59.599],
            [22.818, 60.104],
            [21.051, 60.151],
          ],
        ],
      },
      properties: { name: 'Saaristomeri', type: 'mpa', area: 1516 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [1.777, 51.303],
            [1.781, 51.033],
            [2.538, 51.045],
            [2.533, 51.315],
            [1.777, 51.303],
          ],
        ],
      },
      properties: { name: 'Bancs des Flandres', type: 'mpa', area: 1121 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.087, 46.43],
            [-2.084, 45.655],
            [-1.087, 45.659],
            [-1.091, 46.434],
            [-2.087, 46.43],
          ],
        ],
      },
      properties: { name: 'Pertuis Charentais', type: 'mpa', area: 4561 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.875, 43.194],
            [5.002, 43.532],
            [4.389, 43.762],
            [4.262, 43.425],
            [4.875, 43.194],
          ],
        ],
      },
      properties: { name: 'Camargue', type: 'mpa', area: 1134 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [9.694, 42.816],
            [9.575, 43.281],
            [8.896, 43.107],
            [9.015, 42.642],
            [9.694, 42.816],
          ],
        ],
      },
      properties: { name: 'Plateau du Cap Corse', type: 'mpa', area: 1776 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [24.438, 39.36],
            [24.037, 39.663],
            [23.622, 39.113],
            [24.023, 38.81],
            [24.438, 39.36],
          ],
        ],
      },
      properties: {
        name: 'ETHNIKO THALASSIO PARKO ALONNISOU – VOREION SPORADON, ANATOLIKI SKOPELOS',
        type: 'mpa',
        area: 2497,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [20.093, 39.532],
            [19.889, 39.243],
            [20.554, 38.774],
            [20.758, 39.063],
            [20.093, 39.532],
          ],
        ],
      },
      properties: {
        name: 'NISOI PAXOI KAI ANTIPAXOI KAI EVRYTERI THALASSIA PERIOCHI',
        type: 'mpa',
        area: 1355,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-13.167, 52.448],
            [-13.239, 52.158],
            [-12.515, 51.977],
            [-12.442, 52.267],
            [-13.167, 52.448],
          ],
        ],
      },
      properties: { name: 'Hovland Mound Province SAC', type: 'mpa', area: 1085 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [15.425, 54.169],
            [15.311, 54.634],
            [14.179, 54.356],
            [14.292, 53.891],
            [15.425, 54.169],
          ],
        ],
      },
      properties: { name: 'Ostoja na Zatoce Pomorskiej', type: 'mpa', area: 2424 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-8.475, 37.94],
            [-9.152, 37.938],
            [-9.148, 36.853],
            [-8.471, 36.855],
            [-8.475, 37.94],
          ],
        ],
      },
      properties: { name: 'Costa Sudoeste', type: 'mpa', area: 2629 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [28.694, 44.35],
            [29.888, 44.934],
            [29.357, 46.02],
            [28.163, 45.436],
            [28.694, 44.35],
          ],
        ],
      },
      properties: { name: 'Delta Dunării', type: 'mpa', area: 4532 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [30.157, 45.055],
            [29.883, 45.407],
            [28.63, 44.433],
            [28.904, 44.081],
            [30.157, 45.055],
          ],
        ],
      },
      properties: { name: 'Delta Dunării - zona marină', type: 'mpa', area: 3360 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2.413, 51.617],
            [2.209, 51.338],
            [2.72, 50.963],
            [2.924, 51.242],
            [2.413, 51.617],
          ],
        ],
      },
      properties: { name: 'Vlaamse Banken', type: 'mpa', area: 1106 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [7.211, 53.232],
            [7.145, 53.683],
            [4.666, 53.318],
            [4.733, 52.867],
            [7.211, 53.232],
          ],
        ],
      },
      properties: { name: 'Waddenzee', type: 'mpa', area: 2643 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.26, 55.365],
            [3.902, 55.909],
            [2.405, 54.923],
            [2.763, 54.379],
            [4.26, 55.365],
          ],
        ],
      },
      properties: { name: 'Doggersbank', type: 'mpa', area: 4763 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2.783, 54.292],
            [2.783, 53.848],
            [3.318, 53.848],
            [3.318, 54.292],
            [2.783, 54.292],
          ],
        ],
      },
      properties: { name: 'Klaverbank', type: 'mpa', area: 1536 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.317, 55.328],
            [7.633, 54.753],
            [8.617, 53.582],
            [9.302, 54.157],
            [8.317, 55.328],
          ],
        ],
      },
      properties: {
        name: 'Ramsar-Gebiet S-H Wattenmeer und angrenzende Küstengebiete',
        type: 'mpa',
        area: 4629,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [7.211, 55.232],
            [7.095, 54.501],
            [8.161, 54.332],
            [8.277, 55.062],
            [7.211, 55.232],
          ],
        ],
      },
      properties: { name: 'SPA Östliche Deutsche Bucht', type: 'mpa', area: 3128 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [13.316, 54.335],
            [13.285, 54.628],
            [12.326, 54.528],
            [12.357, 54.234],
            [13.316, 54.335],
          ],
        ],
      },
      properties: {
        name: 'Vorpommersche Boddenlandschaft und nördlicher Strelasund',
        type: 'mpa',
        area: 1220,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [14.748, 54.498],
            [14.364, 54.959],
            [13.855, 54.535],
            [14.239, 54.074],
            [14.748, 54.498],
          ],
        ],
      },
      properties: { name: 'SPA Pommersche Bucht', type: 'mpa', area: 1999 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.539, 54.38],
            [8.042, 54.733],
            [7.699, 54.25],
            [8.195, 53.897],
            [8.539, 54.38],
          ],
        ],
      },
      properties: { name: 'Seevogelschutzgebiet Helgoland', type: 'mpa', area: 1610 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.373, 53.749],
            [6.452, 53.135],
            [8.746, 53.433],
            [8.667, 54.046],
            [6.373, 53.749],
          ],
        ],
      },
      properties: {
        name: 'Niedersächsisches Wattenmeer und angrenzendes Küstenmeer',
        type: 'mpa',
        area: 3537,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.476, 54.806],
            [8.863, 55.057],
            [8.378, 55.807],
            [7.99, 55.556],
            [8.476, 54.806],
          ],
        ],
      },
      properties: { name: 'Vadehavet', type: 'mpa', area: 1159 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [11.407, 57.118],
            [11.178, 57.537],
            [10.71, 57.281],
            [10.939, 56.862],
            [11.407, 57.118],
          ],
        ],
      },
      properties: { name: 'Læsø, sydlige del', type: 'mpa', area: 1030 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.99, 56.501],
            [11.008, 57.266],
            [10.438, 57.28],
            [10.419, 56.515],
            [10.99, 56.501],
          ],
        ],
      },
      properties: { name: 'Ålborg Bugt, østlige del', type: 'mpa', area: 1777 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [23.983, 58.418],
            [24.012, 59.063],
            [22.525, 59.128],
            [22.496, 58.483],
            [23.983, 58.418],
          ],
        ],
      },
      properties: { name: 'Väinamere', type: 'mpa', area: 2724 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [24.545, 58.08],
            [24.538, 58.408],
            [23.667, 58.391],
            [23.673, 58.063],
            [24.545, 58.08],
          ],
        ],
      },
      properties: { name: 'Pärnu lahe', type: 'mpa', area: 1102 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [22.894, 57.899],
            [22.835, 58.271],
            [21.634, 58.08],
            [21.693, 57.707],
            [22.894, 57.899],
          ],
        ],
      },
      properties: { name: 'Kura kurgu', type: 'mpa', area: 1934 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [21.051, 60.151],
            [21.038, 59.647],
            [22.804, 59.599],
            [22.818, 60.104],
            [21.051, 60.151],
          ],
        ],
      },
      properties: { name: 'Saaristomeri', type: 'mpa', area: 1616 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [1.029, 49.944],
            [0.94, 50.204],
            [-0.146, 49.832],
            [-0.057, 49.571],
            [1.029, 49.944],
          ],
        ],
      },
      properties: { name: 'Littoral seino-marin', type: 'mpa', area: 1796 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [1.777, 51.303],
            [1.781, 51.028],
            [2.546, 51.04],
            [2.542, 51.316],
            [1.777, 51.303],
          ],
        ],
      },
      properties: { name: 'Bancs des Flandres', type: 'mpa', area: 1163 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.81, 46.764],
            [-2.81, 46.428],
            [-1.665, 46.428],
            [-1.665, 46.764],
            [-2.81, 46.764],
          ],
        ],
      },
      properties: {
        name: "Secteur marin de l'le d'Yeu jusqu'au continent",
        type: 'mpa',
        area: 2455,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.671, 46.428],
            [-2.667, 45.64],
            [-1.087, 45.647],
            [-1.091, 46.435],
            [-2.671, 46.428],
          ],
        ],
      },
      properties: { name: 'Pertuis charentais - Rochebonne', type: 'mpa', area: 8192 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-1.919, 45.072],
            [-2.613, 45.072],
            [-2.613, 44.473],
            [-1.919, 44.473],
            [-1.919, 45.072],
          ],
        ],
      },
      properties: { name: 'Tte de Canyon du Cap Ferret', type: 'mpa', area: 3654 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.905, 43.121],
            [4.957, 43.667],
            [4.256, 43.734],
            [4.204, 43.187],
            [4.905, 43.121],
          ],
        ],
      },
      properties: { name: 'Camargue', type: 'mpa', area: 2204 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [16.039, 42.159],
            [15.969, 42.483],
            [15.166, 42.309],
            [15.236, 41.985],
            [16.039, 42.159],
          ],
        ],
      },
      properties: { name: 'Isole Tremiti', type: 'mpa', area: 1938 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [12.201, 35.513],
            [12.602, 35.134],
            [13.255, 35.826],
            [12.854, 36.205],
            [12.201, 35.513],
          ],
        ],
      },
      properties: {
        name: 'Arcipelago delle Pelagie - area marina e terrestre',
        type: 'mpa',
        area: 3880,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [18.645, 54.844],
            [18.582, 55.133],
            [16.098, 54.595],
            [16.16, 54.307],
            [18.645, 54.844],
          ],
        ],
      },
      properties: { name: 'Przybrzeżne wody Bałtyku', type: 'mpa', area: 1944 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [16.212, 54.296],
            [16.111, 54.78],
            [14.187, 54.378],
            [14.288, 53.894],
            [16.212, 54.296],
          ],
        ],
      },
      properties: { name: 'Zatoka Pomorska', type: 'mpa', area: 3084 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-9.885, 39.163],
            [-9.715, 39.005],
            [-9.299, 39.451],
            [-9.468, 39.61],
            [-9.885, 39.163],
          ],
        ],
      },
      properties: { name: 'Ilhas Berlengas', type: 'mpa', area: 1027 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-8.654, 37.838],
            [-9.016, 37.9],
            [-9.176, 36.963],
            [-8.814, 36.901],
            [-8.654, 37.838],
          ],
        ],
      },
      properties: { name: 'Costa Sudoeste', type: 'mpa', area: 1009 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [28.624, 44.318],
            [29.897, 44.895],
            [29.398, 45.997],
            [28.125, 45.42],
            [28.624, 44.318],
          ],
        ],
      },
      properties: { name: 'Delta Dunării și Complexul Razim - Sinoie', type: 'mpa', area: 5078 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [29.903, 45.083],
            [29.621, 45.353],
            [28.318, 43.988],
            [28.601, 43.718],
            [29.903, 45.083],
          ],
        ],
      },
      properties: { name: 'Marea Neagră', type: 'mpa', area: 1490 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [7.211, 53.232],
            [7.145, 53.683],
            [4.666, 53.318],
            [4.733, 52.867],
            [7.211, 53.232],
          ],
        ],
      },
      properties: { name: 'Waddenzee', type: 'mpa', area: 2712 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [5.259, 53.192],
            [4.988, 52.868],
            [5.503, 52.438],
            [5.774, 52.762],
            [5.259, 53.192],
          ],
        ],
      },
      properties: { name: 'IJsselmeer', type: 'mpa', area: 1131 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.504, -21.621],
            [113.973, -21.414],
            [113.007, -23.89],
            [113.538, -24.097],
            [114.504, -21.621],
          ],
        ],
      },
      properties: { name: 'Ningaloo Coast', type: 'mpa', area: 6090 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [51.852, 24.724],
            [51.441, 24.441],
            [51.805, 23.91],
            [52.217, 24.192],
            [51.852, 24.724],
          ],
        ],
      },
      properties: { name: 'Al Yasat Marine Protected Area', type: 'mpa', area: 2267 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [53.641, 24.024],
            [53.687, 24.693],
            [52.963, 24.742],
            [52.917, 24.074],
            [53.641, 24.024],
          ],
        ],
      },
      properties: { name: 'Marawah', type: 'mpa', area: 4268 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [106.916, 2.792],
            [106.421, 3.793],
            [104.998, 3.088],
            [105.493, 2.087],
            [106.916, 2.792],
          ],
        ],
      },
      properties: { name: 'KKPN KEPULAUAN ANAMBAS DAN LAUT SEKITARNYA', type: 'mpa', area: 12714 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [119.165, -4.546],
            [119.085, -4.987],
            [119.5, -5.062],
            [119.58, -4.621],
            [119.165, -4.546],
          ],
        ],
      },
      properties: { name: 'KKPD KABUPATEN PANGKAJENE KEPULAUAN', type: 'mpa', area: 1765 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [100.539, -2.015],
            [100.786, -1.932],
            [100.581, -1.327],
            [100.334, -1.411],
            [100.539, -2.015],
          ],
        ],
      },
      properties: { name: 'KKPD PULAU PENYU', type: 'mpa', area: 1279 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [129.794, 0.424],
            [129.709, 0.239],
            [130.258, -0.014],
            [130.343, 0.171],
            [129.794, 0.424],
          ],
        ],
      },
      properties: { name: 'Kawe / Kep. Wayag Sayang / Kep. Panjang', type: 'mpa', area: 1304 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.925, 4.34],
            [9.08, 4.739],
            [8.591, 4.929],
            [8.436, 4.529],
            [8.925, 4.34],
          ],
        ],
      },
      properties: { name: 'Estuaire du Rio Del Rey', type: 'mpa', area: 1862 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [33.8, 27.187],
            [34.078, 27.383],
            [33.666, 27.968],
            [33.388, 27.773],
            [33.8, 27.187],
          ],
        ],
      },
      properties: { name: 'Red Sea Islands', type: 'mpa', area: 1713 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [16.212, 54.296],
            [16.111, 54.78],
            [14.187, 54.378],
            [14.288, 53.894],
            [16.212, 54.296],
          ],
        ],
      },
      properties: { name: 'Zatoka Pomorska', type: 'mpa', area: 3111 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [18.645, 54.844],
            [18.582, 55.133],
            [16.098, 54.595],
            [16.16, 54.307],
            [18.645, 54.844],
          ],
        ],
      },
      properties: { name: 'Przybrzezne Wody Baltyku', type: 'mpa', area: 1944 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.99, 56.501],
            [11.008, 57.266],
            [10.438, 57.28],
            [10.419, 56.515],
            [10.99, 56.501],
          ],
        ],
      },
      properties: { name: 'Alborg Bugt, østlige de', type: 'mpa', area: 1777 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [22.894, 57.899],
            [22.835, 58.271],
            [21.634, 58.08],
            [21.693, 57.707],
            [22.894, 57.899],
          ],
        ],
      },
      properties: { name: 'Kura Kurk', type: 'mpa', area: 1988 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [24.544, 58.078],
            [24.539, 58.408],
            [23.667, 58.393],
            [23.672, 58.064],
            [24.544, 58.078],
          ],
        ],
      },
      properties: { name: 'Pärnu lahe', type: 'mpa', area: 1147 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [19.213, 63.133],
            [19.084, 63.439],
            [17.854, 62.923],
            [17.983, 62.617],
            [19.213, 63.133],
          ],
        ],
      },
      properties: { name: 'High Coast', type: 'mpa', area: 1514 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [18.099, 56.323],
            [18.702, 56.323],
            [18.703, 56.834],
            [18.099, 56.834],
            [18.099, 56.323],
          ],
        ],
      },
      properties: { name: 'Hoburgs Bank', type: 'mpa', area: 1223 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [20.577, 63.466],
            [20.583, 62.789],
            [22.131, 62.802],
            [22.125, 63.479],
            [20.577, 63.466],
          ],
        ],
      },
      properties: {
        name: 'Merenkurkun saaristo /Outer Bothnian Threshold Archipelago (The Quark)',
        type: 'mpa',
        area: 1274,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [14.748, 54.498],
            [14.293, 55.044],
            [13.784, 54.621],
            [14.239, 54.074],
            [14.748, 54.498],
          ],
        ],
      },
      properties: { name: 'Westliche Rönnebank', type: 'mpa', area: 2085 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [23.983, 58.418],
            [24.011, 59.063],
            [22.525, 59.128],
            [22.496, 58.483],
            [23.983, 58.418],
          ],
        ],
      },
      properties: { name: 'Väinameri', type: 'mpa', area: 2719 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [11.407, 57.118],
            [11.178, 57.537],
            [10.71, 57.281],
            [10.939, 56.862],
            [11.407, 57.118],
          ],
        ],
      },
      properties: { name: 'Waters around Læsø', type: 'mpa', area: 1037 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [152.269, -26.345],
            [153.303, -26.429],
            [153.446, -24.664],
            [152.412, -24.58],
            [152.269, -26.345],
          ],
        ],
      },
      properties: { name: 'Great Sandy', type: 'mpa', area: 12462 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-105.805, -29.419],
            [-101.649, -29.194],
            [-101.896, -24.63],
            [-106.052, -24.854],
            [-105.805, -29.419],
          ],
        ],
      },
      properties: { name: 'Motu Motiro Hiva', type: 'mpa', area: 150120 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.731, -6.207],
            [-82.001, -7.243],
            [-72.608, -18.755],
            [-71.338, -17.719],
            [-80.731, -6.207],
          ],
        ],
      },
      properties: { name: 'Sistema de Islas, Islotes y Puntas Guaneras', type: 'mpa', area: 1417 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-4.268, 47.985],
            [-4.268, 48.518],
            [-5.452, 48.517],
            [-5.452, 47.984],
            [-4.268, 47.985],
          ],
        ],
      },
      properties: { name: 'Iroise', type: 'mpa', area: 3429 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-26.483, 40.667],
            [-27.25, 40.667],
            [-27.25, 40.1],
            [-26.483, 40.1],
            [-26.483, 40.667],
          ],
        ],
      },
      properties: { name: 'Monte Submarino Sedlo', type: 'mpa', area: 4101 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-24.8, 43.3],
            [-24.8, 44.7],
            [-32.3, 44.7],
            [-32.3, 43.3],
            [-24.8, 43.3],
          ],
        ],
      },
      properties: {
        name: 'Marna (Mid-Atlantic Ridge North Of The Azores)',
        type: 'mpa',
        area: 93590,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-34.46, 44.86],
            [-34.46, 44.32],
            [-33.54, 44.32],
            [-33.54, 44.86],
            [-34.46, 44.86],
          ],
        ],
      },
      properties: { name: 'Monte Submarino Altair', type: 'mpa', area: 4384 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-22.78, 43.82],
            [-22.78, 43.36],
            [-22.1, 43.36],
            [-22.1, 43.82],
            [-22.78, 43.82],
          ],
        ],
      },
      properties: { name: 'Monte Submarino Antialtair', type: 'mpa', area: 2808 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-31.467, 41.5],
            [-31.933, 41.5],
            [-31.933, 40.883],
            [-31.467, 40.883],
            [-31.467, 41.5],
          ],
        ],
      },
      properties: { name: 'Oceânica Do Corvo', type: 'mpa', area: 2684 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-29.267, 41.417],
            [-29.267, 42],
            [-29.75, 42],
            [-29.75, 41.417],
            [-29.267, 41.417],
          ],
        ],
      },
      properties: { name: 'Oceânica Do Faial', type: 'mpa', area: 2608 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.267, 43.883],
            [-4.433, 43.883],
            [-4.433, 44.2],
            [-5.267, 44.2],
            [-5.267, 43.883],
          ],
        ],
      },
      properties: { name: 'El Cachucho', type: 'mpa', area: 2351 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [3.034, 42.96],
            [3.034, 42.435],
            [3.9, 42.435],
            [3.9, 42.96],
            [3.034, 42.96],
          ],
        ],
      },
      properties: { name: 'Golfe Du Lion', type: 'mpa', area: 4010 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [126.485, 34.704],
            [126.175, 35.286],
            [124.788, 34.545],
            [125.098, 33.964],
            [126.485, 34.704],
          ],
        ],
      },
      properties: { name: 'Shinan Dadohae', type: 'mpa', area: 3238 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-42.772, -49.107],
            [-45.09, -58.959],
            [-21.22, -64.576],
            [-18.902, -54.725],
            [-42.772, -49.107],
          ],
        ],
      },
      properties: {
        name: 'South Georgia and South Sandwich Islands Marine Protected Area',
        type: 'mpa',
        area: 1069872,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [179.461, -16.36],
            [179.351, -16.064],
            [178.702, -16.306],
            [178.813, -16.602],
            [179.461, -16.36],
          ],
        ],
      },
      properties: { name: 'Macuata/Dreketi/Sasa/Mali Districts', type: 'mpa', area: 1350 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [177.366, -16.992],
            [177.218, -17.29],
            [177.704, -17.532],
            [177.852, -17.234],
            [177.366, -16.992],
          ],
        ],
      },
      properties: { name: 'Votua village', type: 'mpa', area: 1529 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [178.395, -16.874],
            [178.453, -16.393],
            [177.985, -16.337],
            [177.927, -16.817],
            [178.395, -16.874],
          ],
        ],
      },
      properties: { name: 'Yadua Taba Island', type: 'mpa', area: 1976 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-13.239, 8.646],
            [-12.805, 8.76],
            [-12.902, 9.128],
            [-13.336, 9.013],
            [-13.239, 8.646],
          ],
        ],
      },
      properties: { name: 'Scarcies River Estuary', type: 'mpa', area: 1477 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-12.386, 7.291],
            [-12.176, 7.682],
            [-12.939, 8.093],
            [-13.149, 7.703],
            [-12.386, 7.291],
          ],
        ],
      },
      properties: { name: 'Sherbro River Estuary', type: 'mpa', area: 1759 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [134.4, 7.499],
            [134.104, 7.244],
            [134.294, 7.024],
            [134.59, 7.278],
            [134.4, 7.499],
          ],
        ],
      },
      properties: { name: 'Rock Islands Southern Lagoon', type: 'mpa', area: 1011 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [139.061, -35.708],
            [138.944, -35.037],
            [137.501, -35.288],
            [137.618, -35.959],
            [139.061, -35.708],
          ],
        ],
      },
      properties: { name: 'Encounter', type: 'mpa', area: 1904 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [132.001, -31.938],
            [132.029, -31.521],
            [129.025, -31.325],
            [128.998, -31.741],
            [132.001, -31.938],
          ],
        ],
      },
      properties: { name: 'Far West Coast', type: 'mpa', area: 1703 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [132.131, -31.809],
            [131.988, -32.436],
            [133.847, -32.861],
            [133.99, -32.233],
            [132.131, -31.809],
          ],
        ],
      },
      properties: { name: 'Nuyts Archipelago', type: 'mpa', area: 1879 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [133.727, -32.836],
            [134.011, -32.28],
            [132.527, -31.519],
            [132.243, -32.075],
            [133.727, -32.836],
          ],
        ],
      },
      properties: { name: 'Nuyts Archipelago', type: 'mpa', area: 1805 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [136.762, -34.302],
            [136.089, -34.302],
            [136.089, -34.857],
            [136.762, -34.857],
            [136.762, -34.302],
          ],
        ],
      },
      properties: { name: 'Sir Joseph Banks Group', type: 'mpa', area: 1224 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [136.089, -34.857],
            [136.517, -34.857],
            [136.517, -34.302],
            [136.089, -34.302],
            [136.089, -34.857],
          ],
        ],
      },
      properties: { name: 'Sir Joseph Banks Group', type: 'mpa', area: 1245 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [136.781, -35.574],
            [137.46, -35.574],
            [137.46, -34.809],
            [136.781, -34.809],
            [136.781, -35.574],
          ],
        ],
      },
      properties: { name: 'Southern Spencer Gulf', type: 'mpa', area: 1270 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [136.781, -35.702],
            [137.312, -35.702],
            [137.312, -34.809],
            [136.781, -34.809],
            [136.781, -35.702],
          ],
        ],
      },
      properties: { name: 'Southern Spencer Gulf', type: 'mpa', area: 1569 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [136.023, -35.143],
            [136.133, -34.621],
            [134.751, -34.33],
            [134.641, -34.852],
            [136.023, -35.143],
          ],
        ],
      },
      properties: { name: 'Thorny Passage', type: 'mpa', area: 1672 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [143.431, -10.671],
            [140.942, -12.894],
            [151.81, -25.064],
            [154.299, -22.841],
            [143.431, -10.671],
          ],
        ],
      },
      properties: { name: 'Great Barrier Reef Coast', type: 'mpa', area: 15887 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [142.753, -10.481],
            [140.375, -12.706],
            [152.065, -25.199],
            [154.443, -22.974],
            [142.753, -10.481],
          ],
        ],
      },
      properties: { name: 'Great Barrier Reef Coast', type: 'mpa', area: 42677 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [143.009, -11.401],
            [141.527, -12.525],
            [151.064, -25.093],
            [152.546, -23.969],
            [143.009, -11.401],
          ],
        ],
      },
      properties: { name: 'Great Barrier Reef Coast', type: 'mpa', area: 4106 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [153.067, -26.07],
            [153.902, -25.502],
            [152.841, -23.945],
            [152.006, -24.513],
            [153.067, -26.07],
          ],
        ],
      },
      properties: { name: 'Great Sandy', type: 'mpa', area: 6030 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [115.673, -20.485],
            [115.335, -20.417],
            [115.191, -21.141],
            [115.528, -21.209],
            [115.673, -20.485],
          ],
        ],
      },
      properties: { name: 'Barrow Island', type: 'mpa', area: 1134 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [47.673, -13.735],
            [48.115, -13.735],
            [48.115, -13.379],
            [47.673, -13.379],
            [47.673, -13.735],
          ],
        ],
      },
      properties: { name: 'Ankivonjy', type: 'mpa', area: 1396 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [48.743, -13.046],
            [48.743, -12.711],
            [48.406, -12.711],
            [48.406, -13.046],
            [48.743, -13.046],
          ],
        ],
      },
      properties: { name: 'Ankarea', type: 'mpa', area: 1357 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [9.458, 2.35],
            [9.84, 2.35],
            [9.84, 2.635],
            [9.458, 2.635],
            [9.458, 2.35],
          ],
        ],
      },
      properties: { name: 'Manyange na Elombo-Campo', type: 'mpa', area: 1115 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-75.386, -15.277],
            [-75.053, -15.04],
            [-75.328, -14.655],
            [-75.661, -14.893],
            [-75.386, -15.277],
          ],
        ],
      },
      properties: { name: 'San Fernando', type: 'mpa', area: 1557 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-169.203, 16.573],
            [-169.297, 17.029],
            [-169.814, 16.922],
            [-169.721, 16.466],
            [-169.203, 16.573],
          ],
        ],
      },
      properties: { name: 'Johnston Atoll', type: 'mpa', area: 2294 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [165.663, 11.419],
            [165.649, 11.81],
            [165.103, 11.792],
            [165.116, 11.4],
            [165.663, 11.419],
          ],
        ],
      },
      properties: { name: 'Bikini', type: 'mpa', area: 2035 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [167.369, 11.15],
            [167.668, 11.287],
            [167.532, 11.583],
            [167.233, 11.446],
            [167.369, 11.15],
          ],
        ],
      },
      properties: { name: 'Rongerik', type: 'mpa', area: 1007 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [110.4, -24.3],
            [109.233, -24.3],
            [109.233, -26.2],
            [110.4, -26.2],
            [110.4, -24.3],
          ],
        ],
      },
      properties: { name: 'Abrolhos', type: 'mpa', area: 23338 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [112.305, -28.78],
            [113.121, -29.133],
            [113.889, -27.353],
            [113.073, -27.001],
            [112.305, -28.78],
          ],
        ],
      },
      properties: { name: 'Abrolhos', type: 'mpa', area: 2557 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.391, -29.374],
            [114.722, -26.745],
            [109.301, -26.061],
            [108.97, -28.691],
            [114.391, -29.374],
          ],
        ],
      },
      properties: { name: 'Abrolhos', type: 'mpa', area: 62511 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [134.835, -9.415],
            [133.813, -8.191],
            [131.758, -9.905],
            [132.779, -11.129],
            [134.835, -9.415],
          ],
        ],
      },
      properties: { name: 'Arafura', type: 'mpa', area: 23070 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.333, -17.75],
            [120.333, -14.4],
            [116.4, -14.4],
            [116.4, -17.75],
            [120.333, -17.75],
          ],
        ],
      },
      properties: { name: 'Argo-Rowley Terrace', type: 'mpa', area: 110578 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.333, -15.167],
            [120.333, -13.243],
            [117.25, -13.243],
            [117.25, -15.167],
            [120.333, -15.167],
          ],
        ],
      },
      properties: { name: 'Argo-Rowley Terrace', type: 'mpa', area: 36263 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [134.3, -11],
            [133.46, -11],
            [133.46, -11.906],
            [134.3, -11.906],
            [134.3, -11],
          ],
        ],
      },
      properties: { name: 'Arnhem', type: 'mpa', area: 7169 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [119.6, -34.742],
            [120.1, -34.742],
            [120.1, -34.112],
            [119.6, -34.112],
            [119.6, -34.742],
          ],
        ],
      },
      properties: { name: 'Bremer', type: 'mpa', area: 1303 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.1, -34.077],
            [119.6, -34.077],
            [119.6, -35.2],
            [120.1, -35.2],
            [120.1, -34.077],
          ],
        ],
      },
      properties: { name: 'Bremer', type: 'mpa', area: 3180 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [110.6, -23.317],
            [110.6, -24],
            [111.4, -24],
            [111.4, -23.317],
            [110.6, -23.317],
          ],
        ],
      },
      properties: { name: 'Carnarvon Canyon', type: 'mpa', area: 6205 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [156.633, -27.217],
            [153.658, -27.217],
            [153.658, -33.582],
            [156.633, -33.582],
            [156.633, -27.217],
          ],
        ],
      },
      properties: { name: 'Central Eastern', type: 'mpa', area: 61540 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [155.8, -31.2],
            [156.633, -31.2],
            [156.633, -30.283],
            [155.8, -30.283],
            [155.8, -31.2],
          ],
        ],
      },
      properties: { name: 'Central Eastern', type: 'mpa', area: 8136 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [150.805, -18.392],
            [149.193, -21.548],
            [155.363, -24.701],
            [156.976, -21.545],
            [150.805, -18.392],
          ],
        ],
      },
      properties: { name: 'Coral Sea', type: 'mpa', area: 66810 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [159.034, -15.212],
            [146.362, -8.615],
            [141.486, -17.983],
            [154.157, -24.58],
            [159.034, -15.212],
          ],
        ],
      },
      properties: { name: 'Coral Sea', type: 'mpa', area: 239756 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [156.284, -26.589],
            [162.014, -20.738],
            [147.518, -6.541],
            [141.787, -12.393],
            [156.284, -26.589],
          ],
        ],
      },
      properties: { name: 'Coral Sea', type: 'mpa', area: 688689 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [117.113, -20.567],
            [117.517, -20.567],
            [117.517, -20.3],
            [117.113, -20.3],
            [117.113, -20.567],
          ],
        ],
      },
      properties: { name: 'Dampier', type: 'mpa', area: 1080 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [123.333, -34.725],
            [124, -34.725],
            [124, -33.675],
            [123.333, -33.675],
            [123.333, -34.725],
          ],
        ],
      },
      properties: { name: 'Eastern Recherche', type: 'mpa', area: 5023 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [124.397, -33.616],
            [123.542, -33.474],
            [122.849, -37.632],
            [123.704, -37.775],
            [124.397, -33.616],
          ],
        ],
      },
      properties: { name: 'Eastern Recherche', type: 'mpa', area: 15598 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [118.844, -19.517],
            [119.054, -20.202],
            [121.757, -19.37],
            [121.547, -18.686],
            [118.844, -19.517],
          ],
        ],
      },
      properties: { name: 'Eighty Mile Beach', type: 'mpa', area: 10842 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [111.917, -21.5],
            [111.917, -20.7],
            [110.242, -20.7],
            [110.242, -21.5],
            [111.917, -21.5],
          ],
        ],
      },
      properties: { name: 'Gascoyne', type: 'mpa', area: 9177 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [113.379, -23.892],
            [115.155, -22.522],
            [112.693, -19.33],
            [110.917, -20.7],
            [113.379, -23.892],
          ],
        ],
      },
      properties: { name: 'Gascoyne', type: 'mpa', area: 33818 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [113.381, -24.051],
            [114.166, -22.144],
            [110.583, -20.67],
            [109.799, -22.576],
            [113.381, -24.051],
          ],
        ],
      },
      properties: { name: 'Gascoyne', type: 'mpa', area: 39171 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [131.325, -36.965],
            [133.904, -35.708],
            [131.4, -30.572],
            [128.821, -31.83],
            [131.325, -36.965],
          ],
        ],
      },
      properties: { name: 'Great Australian Bight', type: 'mpa', area: 38191 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [130.367, -32.467],
            [131.235, -32.467],
            [131.235, -31.516],
            [130.367, -31.516],
            [130.367, -32.467],
          ],
        ],
      },
      properties: { name: 'Great Australian Bight', type: 'mpa', area: 7751 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [140.083, -15],
            [139.554, -15],
            [139.554, -16.55],
            [140.083, -16.55],
            [140.083, -15],
          ],
        ],
      },
      properties: { name: 'Gulf of Carpentaria', type: 'mpa', area: 3644 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [140.757, -16.7],
            [140.757, -15],
            [138.502, -15],
            [138.502, -16.7],
            [140.757, -16.7],
          ],
        ],
      },
      properties: { name: 'Gulf of Carpentaria', type: 'mpa', area: 20263 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [152.296, -32.333],
            [152.296, -32.683],
            [153.058, -32.683],
            [153.058, -32.333],
            [152.296, -32.333],
          ],
        ],
      },
      properties: { name: 'Hunter', type: 'mpa', area: 1744 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [152.9, -32.017],
            [152.9, -32.683],
            [153.7, -32.683],
            [153.7, -32.017],
            [152.9, -32.017],
          ],
        ],
      },
      properties: { name: 'Hunter', type: 'mpa', area: 4532 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [151.008, -35],
            [151.008, -35.4],
            [151.6, -35.4],
            [151.6, -35],
            [151.008, -35],
          ],
        ],
      },
      properties: { name: 'Jervis', type: 'mpa', area: 1970 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [127.902, -14.404],
            [128.417, -15.169],
            [129.979, -14.119],
            [129.464, -13.354],
            [127.902, -14.404],
          ],
        ],
      },
      properties: { name: 'Joseph Bonaparte Gulf', type: 'mpa', area: 8648 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.908, -30.093],
            [114.561, -30.184],
            [114.725, -30.805],
            [115.072, -30.714],
            [114.908, -30.093],
          ],
        ],
      },
      properties: { name: 'Jurien', type: 'mpa', area: 1826 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.308, -15.279],
            [121.181, -17.451],
            [127.168, -15.043],
            [126.294, -12.87],
            [120.308, -15.279],
          ],
        ],
      },
      properties: { name: 'Kimberley', type: 'mpa', area: 62773 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [122.35, -16.317],
            [123.469, -16.317],
            [123.469, -15.283],
            [122.35, -15.283],
            [122.35, -16.317],
          ],
        ],
      },
      properties: { name: 'Kimberley', type: 'mpa', area: 5698 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [122.269, -15.699],
            [122.508, -16.288],
            [124.367, -15.534],
            [124.129, -14.946],
            [122.269, -15.699],
          ],
        ],
      },
      properties: { name: 'Kimberley', type: 'mpa', area: 6429 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [135.669, -15],
            [135.669, -15.361],
            [136.3, -15.361],
            [136.3, -15],
            [135.669, -15],
          ],
        ],
      },
      properties: { name: 'Limmen', type: 'mpa', area: 1407 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [158.2, -35.127],
            [159.9, -35.127],
            [159.9, -29.883],
            [158.2, -29.883],
            [158.2, -35.127],
          ],
        ],
      },
      properties: { name: 'Lord Howe', type: 'mpa', area: 61356 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [158.2, -31.283],
            [159.9, -31.283],
            [159.9, -28.883],
            [158.2, -28.883],
            [158.2, -31.283],
          ],
        ],
      },
      properties: { name: 'Lord Howe', type: 'mpa', area: 39794 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [159.9, -29.35],
            [158.8, -29.35],
            [158.8, -32.333],
            [159.9, -32.333],
            [159.9, -29.35],
          ],
        ],
      },
      properties: { name: 'Lord Howe', type: 'mpa', area: 9302 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [115.252, -20.836],
            [116, -20.836],
            [116, -20],
            [115.252, -20],
            [115.252, -20.836],
          ],
        ],
      },
      properties: { name: 'Montebello', type: 'mpa', area: 3430 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.244, -21.673],
            [113.812, -21.547],
            [113.248, -23.472],
            [113.68, -23.598],
            [114.244, -21.673],
          ],
        ],
      },
      properties: { name: 'Ningaloo', type: 'mpa', area: 2330 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [170.367, -27.6],
            [166.083, -27.6],
            [166.083, -32.478],
            [170.367, -32.478],
            [170.367, -27.6],
          ],
        ],
      },
      properties: { name: 'Norfolk', type: 'mpa', area: 139254 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [167.667, -29.75],
            [168.333, -29.75],
            [168.333, -28.633],
            [167.667, -28.633],
            [167.667, -29.75],
          ],
        ],
      },
      properties: { name: 'Norfolk', type: 'mpa', area: 8015 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [168.967, -27.6],
            [168.967, -25.845],
            [166.65, -25.845],
            [166.65, -27.6],
            [168.967, -27.6],
          ],
        ],
      },
      properties: { name: 'Norfolk', type: 'mpa', area: 41827 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [129.258, -11.75],
            [130.1, -11.75],
            [130.1, -10.833],
            [129.258, -10.833],
            [129.258, -11.75],
          ],
        ],
      },
      properties: { name: 'Oceanic Shoals', type: 'mpa', area: 6972 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [125.592, -11.718],
            [126.451, -13.496],
            [131.787, -10.919],
            [130.928, -9.141],
            [125.592, -11.718],
          ],
        ],
      },
      properties: { name: 'Oceanic Shoals', type: 'mpa', area: 64808 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114, -31.7],
            [114, -32.4],
            [115.133, -32.4],
            [115.133, -31.7],
            [114, -31.7],
          ],
        ],
      },
      properties: { name: 'Perth Canyon', type: 'mpa', area: 4365 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.5, -32.3],
            [114.934, -32.3],
            [114.934, -31.7],
            [114.5, -31.7],
            [114.5, -32.3],
          ],
        ],
      },
      properties: { name: 'Perth Canyon', type: 'mpa', area: 1244 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.5, -32.4],
            [115.25, -32.4],
            [115.25, -31.9],
            [114.5, -31.9],
            [114.5, -32.4],
          ],
        ],
      },
      properties: { name: 'Perth Canyon', type: 'mpa', area: 1822 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [113.107, -24.3],
            [112.5, -24.3],
            [112.5, -25.5],
            [113.107, -25.5],
            [113.107, -24.3],
          ],
        ],
      },
      properties: { name: 'Shark Bay', type: 'mpa', area: 7475 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [111.917, -34.693],
            [111.099, -36.602],
            [116.401, -38.875],
            [117.22, -36.966],
            [111.917, -34.693],
          ],
        ],
      },
      properties: { name: 'South-west Corner', type: 'mpa', area: 95270 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [110.99, -33.275],
            [110.69, -38.072],
            [121.871, -38.77],
            [122.17, -33.973],
            [110.99, -33.275],
          ],
        ],
      },
      properties: { name: 'South-west Corner', type: 'mpa', area: 54959 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [111.713, -33.295],
            [111.407, -38.132],
            [121.938, -38.797],
            [122.243, -33.961],
            [111.713, -33.295],
          ],
        ],
      },
      properties: { name: 'South-west Corner', type: 'mpa', area: 122154 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [125.8, -33.1],
            [126.44, -33.1],
            [126.44, -32.294],
            [125.8, -32.294],
            [125.8, -33.1],
          ],
        ],
      },
      properties: { name: 'Twilight', type: 'mpa', area: 3615 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [126.44, -32.605],
            [126.44, -32.298],
            [125.8, -32.298],
            [125.8, -32.605],
            [126.44, -32.605],
          ],
        ],
      },
      properties: { name: 'Twilight', type: 'mpa', area: 1039 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [137.25, -10.833],
            [136.75, -10.833],
            [136.75, -11.417],
            [137.25, -11.417],
            [137.25, -10.833],
          ],
        ],
      },
      properties: { name: 'Wessel', type: 'mpa', area: 2110 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [136.979, -12.431],
            [137.362, -12.386],
            [137.198, -10.967],
            [136.815, -11.011],
            [136.979, -12.431],
          ],
        ],
      },
      properties: { name: 'Wessel', type: 'mpa', area: 3835 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [142.001, -11.169],
            [142.235, -10.479],
            [140.757, -9.977],
            [140.523, -10.667],
            [142.001, -11.169],
          ],
        ],
      },
      properties: { name: 'West Cape York', type: 'mpa', area: 3350 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [141.7, -11.7],
            [142.093, -11.7],
            [142.093, -11.067],
            [141.7, -11.067],
            [141.7, -11.7],
          ],
        ],
      },
      properties: { name: 'West Cape York', type: 'mpa', area: 2585 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [141.7, -11.7],
            [141.7, -10.667],
            [139.996, -10.667],
            [139.996, -11.7],
            [141.7, -11.7],
          ],
        ],
      },
      properties: { name: 'West Cape York', type: 'mpa', area: 10178 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [134.064, -37.168],
            [135.746, -36.521],
            [134.006, -31.996],
            [132.324, -32.643],
            [134.064, -37.168],
          ],
        ],
      },
      properties: { name: 'Western Eyre', type: 'mpa', area: 40604 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [134.464, -33.141],
            [133.232, -33.23],
            [133.667, -39.261],
            [134.9, -39.171],
            [134.464, -33.141],
          ],
        ],
      },
      properties: { name: 'Western Eyre', type: 'mpa', area: 17467 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [136.9, -36.217],
            [136.9, -35.664],
            [136.1, -35.664],
            [136.1, -36.217],
            [136.9, -36.217],
          ],
        ],
      },
      properties: { name: 'Western Kangaroo Island', type: 'mpa', area: 2220 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.99, 56.501],
            [11.008, 57.266],
            [10.438, 57.28],
            [10.419, 56.515],
            [10.99, 56.501],
          ],
        ],
      },
      properties: { name: 'Ålborg Bugt, østlige del', type: 'mpa', area: 1776 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-11.51, 57.698],
            [-11.531, 57.18],
            [-10.569, 57.142],
            [-10.548, 57.659],
            [-11.51, 57.698],
          ],
        ],
      },
      properties: { name: 'Anton Dohrn Seamount', type: 'mpa', area: 1425 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [1.777, 51.303],
            [1.781, 51.033],
            [2.538, 51.045],
            [2.533, 51.315],
            [1.777, 51.303],
          ],
        ],
      },
      properties: { name: 'Bancs des Flandres', type: 'mpa', area: 1121 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [17.994, 74.705],
            [17.999, 74.126],
            [20.017, 74.144],
            [20.012, 74.723],
            [17.994, 74.705],
          ],
        ],
      },
      properties: { name: 'Bjørnøya', type: 'mpa', area: 2790 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.7, 58.267],
            [10.7, 58.583],
            [10.029, 58.583],
            [10.029, 58.267],
            [10.7, 58.267],
          ],
        ],
      },
      properties: { name: 'Bratten', type: 'mpa', area: 1205 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-7.65, 59.617],
            [-6.783, 59.617],
            [-6.783, 59.9],
            [-7.65, 59.9],
            [-7.65, 59.617],
          ],
        ],
      },
      properties: { name: 'Darwin Mounds', type: 'mpa', area: 1375 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [1.079, 55.068],
            [1.335, 53.98],
            [3.484, 54.485],
            [3.228, 55.573],
            [1.079, 55.068],
          ],
        ],
      },
      properties: { name: 'Dogger Bank', type: 'mpa', area: 12308 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.598, 55.213],
            [4.748, 55.548],
            [3.786, 55.98],
            [3.636, 55.645],
            [4.598, 55.213],
          ],
        ],
      },
      properties: { name: 'Doggerbank', type: 'mpa', area: 1692 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-13.862, 56.568],
            [-12.553, 56.966],
            [-13.165, 58.979],
            [-14.474, 58.581],
            [-13.862, 56.568],
          ],
        ],
      },
      properties: { name: 'East Rockall Bank', type: 'mpa', area: 3687 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.267, 44.21],
            [-5.267, 43.883],
            [-4.443, 43.883],
            [-4.443, 44.21],
            [-5.267, 44.21],
          ],
        ],
      },
      properties: { name: 'El Cachucho', type: 'mpa', area: 2396 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2.314, 52.66],
            [2.261, 53.109],
            [1.532, 53.024],
            [1.585, 52.575],
            [2.314, 52.66],
          ],
        ],
      },
      properties: { name: 'Haisborough, Hammond and Winterton', type: 'mpa', area: 1466 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-19.606, 58.469],
            [-18.971, 57.187],
            [-14.489, 59.411],
            [-15.124, 60.692],
            [-19.606, 58.469],
          ],
        ],
      },
      properties: { name: 'Hatton Bank', type: 'mpa', area: 15673 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-13.167, 52.448],
            [-13.239, 52.158],
            [-12.515, 51.977],
            [-12.442, 52.267],
            [-13.167, 52.448],
          ],
        ],
      },
      properties: { name: 'Hovland Mound Province', type: 'mpa', area: 1085 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-7.269, 70.924],
            [-7.385, 71.528],
            [-9.727, 71.077],
            [-9.61, 70.473],
            [-7.269, 70.924],
          ],
        ],
      },
      properties: { name: 'Jan Mayen', type: 'mpa', area: 4296 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2.806, 54.202],
            [2.805, 53.834],
            [3.318, 53.832],
            [3.319, 54.201],
            [2.806, 54.202],
          ],
        ],
      },
      properties: { name: 'Klaverbank', type: 'mpa', area: 1237 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.929, 53.481],
            [-3.093, 53.996],
            [-4.346, 53.599],
            [-4.182, 53.083],
            [-2.929, 53.481],
          ],
        ],
      },
      properties: { name: 'Liverpool Bay / Bae Lerpwl', type: 'mpa', area: 1700 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.278, 57.725],
            [-3.396, 58.181],
            [-4.496, 57.895],
            [-4.377, 57.44],
            [-3.278, 57.725],
          ],
        ],
      },
      properties: { name: 'Moray Firth', type: 'mpa', area: 1509 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.565, 53.768],
            [6.623, 53.22],
            [8.736, 53.445],
            [8.677, 53.992],
            [6.565, 53.768],
          ],
        ],
      },
      properties: { name: 'Niedersächsisches Wattenmeer', type: 'mpa', area: 2741 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.607, 53.56],
            [6.396, 54.019],
            [4.33, 53.069],
            [4.541, 52.61],
            [6.607, 53.56],
          ],
        ],
      },
      properties: { name: 'Noordzeekustzone', type: 'mpa', area: 1413 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2.55, 52.968],
            [2.607, 53.701],
            [1.563, 53.782],
            [1.506, 53.049],
            [2.55, 52.968],
          ],
        ],
      },
      properties: { name: 'North Norfolk Sandbanks and Saturn Reef', type: 'mpa', area: 3602 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-13.098, 57.813],
            [-13.505, 58.509],
            [-15.194, 57.52],
            [-14.786, 56.824],
            [-13.098, 57.813],
          ],
        ],
      },
      properties: { name: 'North West Rockall Bank', type: 'mpa', area: 4356 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0.731, 51.477],
            [1.244, 51.041],
            [2.475, 52.487],
            [1.962, 52.924],
            [0.731, 51.477],
          ],
        ],
      },
      properties: { name: 'Outer Thames Estuary', type: 'mpa', area: 3788 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-4.801, 51.534],
            [-4.801, 51.946],
            [-5.751, 51.946],
            [-5.751, 51.534],
            [-4.801, 51.534],
          ],
        ],
      },
      properties: { name: 'Pembrokeshire Marine / Sir Benfro Forol', type: 'mpa', area: 1368 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-4.828, 52.983],
            [-4.856, 52.439],
            [-3.934, 52.392],
            [-3.906, 52.936],
            [-4.828, 52.983],
          ],
        ],
      },
      properties: {
        name: 'Pen Llyn a`r Sarnau / Lleyn Peninsula and the Sarnau',
        type: 'mpa',
        area: 1439,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.087, 46.43],
            [-2.084, 45.655],
            [-1.087, 45.659],
            [-1.091, 46.434],
            [-2.087, 46.43],
          ],
        ],
      },
      properties: { name: 'Pertuis charentais', type: 'mpa', area: 4561 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.671, 46.428],
            [-2.668, 45.64],
            [-1.087, 45.647],
            [-1.091, 46.434],
            [-2.671, 46.428],
          ],
        ],
      },
      properties: { name: 'Pertuis charentais - Rochebonne', type: 'mpa', area: 8193 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.54, 54.381],
            [8.044, 54.734],
            [7.701, 54.251],
            [8.197, 53.898],
            [8.54, 54.381],
          ],
        ],
      },
      properties: { name: 'S-H Seabird Protection Area', type: 'mpa', area: 1615 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [9.223, 54.961],
            [7.973, 55.127],
            [7.825, 54.007],
            [9.075, 53.842],
            [9.223, 54.961],
          ],
        ],
      },
      properties: { name: 'S-H Wadden sea National Park', type: 'mpa', area: 4592 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.81, 46.764],
            [-2.81, 46.428],
            [-1.665, 46.428],
            [-1.665, 46.764],
            [-2.81, 46.764],
          ],
        ],
      },
      properties: { name: "Secteur de l'île d'Yeu", type: 'mpa', area: 2455 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-27.25, 40.111],
            [-26.483, 40.111],
            [-26.483, 40.667],
            [-27.25, 40.667],
            [-27.25, 40.111],
          ],
        ],
      },
      properties: { name: 'Sedlo Seamount', type: 'mpa', area: 4020 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [9.796, 58.03],
            [9.912, 57.533],
            [11.013, 57.79],
            [10.897, 58.287],
            [9.796, 58.03],
          ],
        ],
      },
      properties: { name: 'Skagens Gren og Skagerrak', type: 'mpa', area: 2689 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [16.83, 81.159],
            [16.665, 76.537],
            [34.534, 75.899],
            [34.699, 80.521],
            [16.83, 81.159],
          ],
        ],
      },
      properties: { name: 'Svalbard East', type: 'mpa', area: 55104 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [17.92, 75.675],
            [18.976, 78.972],
            [10.097, 81.817],
            [9.041, 78.52],
            [17.92, 75.675],
          ],
        ],
      },
      properties: { name: 'Svalbard West', type: 'mpa', area: 19952 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.833, 55.624],
            [6.778, 55.297],
            [8.042, 55.084],
            [8.097, 55.411],
            [6.833, 55.624],
          ],
        ],
      },
      properties: { name: 'Sydlige Nordsø', type: 'mpa', area: 2467 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.39, 55.362],
            [6.274, 54.632],
            [8.161, 54.332],
            [8.277, 55.062],
            [6.39, 55.362],
          ],
        ],
      },
      properties: { name: 'Sylt.Aussenr.-Oestl.Dt.Bucht', type: 'mpa', area: 5587 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0.015, 53.153],
            [-0.017, 52.827],
            [1.096, 52.719],
            [1.127, 53.045],
            [0.015, 53.153],
          ],
        ],
      },
      properties: { name: 'The Wash and North Norfolk Coast', type: 'mpa', area: 1042 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.48, 54.8],
            [8.866, 55.05],
            [8.376, 55.806],
            [7.99, 55.556],
            [8.48, 54.8],
          ],
        ],
      },
      properties: {
        name: 'Vadehavet med Ribe Å, Tved Å og Varde Å vest for Varde',
        type: 'mpa',
        area: 1135,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2.292, 51.452],
            [2.488, 51.034],
            [3, 51.274],
            [2.804, 51.692],
            [2.292, 51.452],
          ],
        ],
      },
      properties: { name: 'Vlaamse Banken , SBZ 1 and SBZ2', type: 'mpa', area: 1180 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-1.953, 50.401],
            [-1.96, 50.162],
            [-1.043, 50.137],
            [-1.036, 50.376],
            [-1.953, 50.401],
          ],
        ],
      },
      properties: { name: 'Wight-Barfleur Reef', type: 'mpa', area: 1372 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-7.437, 60.212],
            [-7.475, 59.96],
            [-5.919, 59.723],
            [-5.881, 59.974],
            [-7.437, 60.212],
          ],
        ],
      },
      properties: { name: 'Wyville Thomson Ridge', type: 'mpa', area: 1735 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-37, 55],
            [-37, 51.4],
            [-27, 51.4],
            [-27, 55],
            [-37, 55],
          ],
        ],
      },
      properties: { name: 'Charlie-Gibbs North High Seas MPA', type: 'mpa', area: 177300 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.26, 55.366],
            [3.934, 55.861],
            [2.436, 54.874],
            [2.762, 54.378],
            [4.26, 55.366],
          ],
        ],
      },
      properties: { name: 'Doggerbank', type: 'mpa', area: 4687 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-132.705, 53.557],
            [-132.898, 53.36],
            [-132.15, 52.627],
            [-131.957, 52.824],
            [-132.705, 53.557],
          ],
        ],
      },
      properties: { name: 'Daawuuxusda Conservancy', type: 'mpa', area: 1163 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-61.836, -38.832],
            [-62.354, -38.833],
            [-62.351, -39.834],
            [-61.833, -39.833],
            [-61.836, -38.832],
          ],
        ],
      },
      properties: { name: 'Bahía Blanca, Bahía Falsa y Bahía Verde', type: 'mpa', area: 2551 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-62.252, -40.818],
            [-61.629, -40.51],
            [-62.025, -39.707],
            [-62.649, -40.015],
            [-62.252, -40.818],
          ],
        ],
      },
      properties: { name: 'Bahía San Blas', type: 'mpa', area: 3978 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-65.448, -45.064],
            [-65.484, -44.849],
            [-66.751, -45.058],
            [-66.716, -45.272],
            [-65.448, -45.064],
          ],
        ],
      },
      properties: { name: 'Patagonia Austral', type: 'mpa', area: 1033 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-65.504, -47.919],
            [-65.762, -47.64],
            [-66.54, -48.361],
            [-66.282, -48.64],
            [-65.504, -47.919],
          ],
        ],
      },
      properties: { name: 'Isla Pingüino', type: 'mpa', area: 1573 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [40.358, -22.706],
            [40.709, -22.368],
            [40.371, -22.017],
            [40.02, -22.355],
            [40.358, -22.706],
          ],
        ],
      },
      properties: { name: "Ile d'Europa", type: 'mpa', area: 2146 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-8.639, 49.213],
            [-8.883, 49.604],
            [-9.601, 49.155],
            [-9.357, 48.764],
            [-8.639, 49.213],
          ],
        ],
      },
      properties: { name: 'South-West Deeps (West)', type: 'mpa', area: 1824 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.02, 55.999],
            [-0.019, 55.499],
            [1.342, 55.501],
            [1.341, 56.001],
            [-0.02, 55.999],
          ],
        ],
      },
      properties: { name: 'Swallow Sand', type: 'mpa', area: 4735 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [5.975, 43.127],
            [6.016, 42.865],
            [6.822, 42.989],
            [6.781, 43.252],
            [5.975, 43.127],
          ],
        ],
      },
      properties: { name: "Port-Cros [Aire D'Adhésion]", type: 'mpa', area: 1299 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [5.659, 42.888],
            [5.739, 43.226],
            [5.066, 43.384],
            [4.986, 43.046],
            [5.659, 42.888],
          ],
        ],
      },
      properties: { name: "Calanques [Aire D'Adhésion]", type: 'mpa', area: 1002 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0.785, 50.393],
            [1.124, 49.838],
            [1.911, 50.319],
            [1.571, 50.874],
            [0.785, 50.393],
          ],
        ],
      },
      properties: { name: "Estuaires Picards Et Mer D'Opale", type: 'mpa', area: 2339 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [46.613, -12.96],
            [48.893, -11.898],
            [48.046, -10.078],
            [45.766, -11.139],
            [46.613, -12.96],
          ],
        ],
      },
      properties: { name: 'Glorieuses', type: 'mpa', area: 43780 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-1.203, 56.843],
            [-2.105, 56.837],
            [-2.099, 55.948],
            [-1.198, 55.953],
            [-1.203, 56.843],
          ],
        ],
      },
      properties: { name: 'Firth Of Forth Banks Complex', type: 'mpa', area: 2127 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.188, 59.532],
            [-2.422, 60.114],
            [-4.143, 59.422],
            [-3.909, 58.84],
            [-2.188, 59.532],
          ],
        ],
      },
      properties: { name: 'North-West Orkney', type: 'mpa', area: 4355 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [1.602, 56.906],
            [1.763, 57.422],
            [0.946, 57.677],
            [0.785, 57.161],
            [1.602, 56.906],
          ],
        ],
      },
      properties: { name: 'East Of Gannet And Montrose Fields', type: 'mpa', area: 1836 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-1.523, 61.26],
            [-1.639, 61.569],
            [-4.553, 60.479],
            [-4.437, 60.169],
            [-1.523, 61.26],
          ],
        ],
      },
      properties: { name: 'Faroe-Shetland Sponge Belt', type: 'mpa', area: 5256 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-8.608, 58.019],
            [-8.506, 58.343],
            [-9.696, 58.718],
            [-9.798, 58.394],
            [-8.608, 58.019],
          ],
        ],
      },
      properties: { name: 'Geikie Slide And Hebridean Slope', type: 'mpa', area: 2212 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-16.648, 57.85],
            [-16.141, 57.85],
            [-16.141, 58.25],
            [-16.648, 58.25],
            [-16.648, 57.85],
          ],
        ],
      },
      properties: { name: 'Hatton-Rockall Basin', type: 'mpa', area: 1254 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0.964, 62.547],
            [0.023, 64.182],
            [-2.788, 62.564],
            [-1.847, 60.929],
            [0.964, 62.547],
          ],
        ],
      },
      properties: { name: 'North-East Faroe-Shetland Channel', type: 'mpa', area: 23619 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-8.961, 56.359],
            [-8.961, 56.845],
            [-10.638, 56.845],
            [-10.638, 56.359],
            [-8.961, 56.359],
          ],
        ],
      },
      properties: { name: 'The Barra Fan And Hebrides Terrace Seamount', type: 'mpa', area: 4377 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.953, 59.508],
            [-4.016, 59.923],
            [-6.119, 59.604],
            [-6.056, 59.189],
            [-3.953, 59.508],
          ],
        ],
      },
      properties: { name: 'West Shetland Shelf', type: 'mpa', area: 4082 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [9.601, 42.428],
            [9.872, 43.188],
            [8.272, 43.76],
            [8, 43],
            [9.601, 42.428],
          ],
        ],
      },
      properties: { name: 'Cap Corse Et Agriate', type: 'mpa', area: 6828 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-51.233, 2.732],
            [-50.754, 2.835],
            [-51.137, 4.606],
            [-51.615, 4.502],
            [-51.233, 2.732],
          ],
        ],
      },
      properties: { name: 'Parque Nacional Do Cabo Orange', type: 'mpa', area: 6617 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-81.089, -33.538],
            [-81.059, -34.046],
            [-78.516, -33.894],
            [-78.547, -33.386],
            [-81.089, -33.538],
          ],
        ],
      },
      properties: { name: 'Archipielago Juan Fernández', type: 'mpa', area: 12212 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-86.745, 5.47],
            [-86.981, 5.842],
            [-87.379, 5.59],
            [-87.142, 5.218],
            [-86.745, 5.47],
          ],
        ],
      },
      properties: { name: 'Isla del Coco', type: 'mpa', area: 2045 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-92.204, 2.595],
            [-93.985, -0.136],
            [-89.787, -2.873],
            [-88.006, -0.142],
            [-92.204, 2.595],
          ],
        ],
      },
      properties: { name: 'Galápagos Islands', type: 'mpa', area: 146962 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-76.002, -14.448],
            [-76.002, -13.785],
            [-76.502, -13.785],
            [-76.502, -14.448],
            [-76.002, -14.448],
          ],
        ],
      },
      properties: { name: 'de Paracas', type: 'mpa', area: 3373 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [135.478, 34.275],
            [135.204, 35.228],
            [130.942, 34.001],
            [131.217, 33.049],
            [135.478, 34.275],
          ],
        ],
      },
      properties: { name: 'Setonaikai', type: 'mpa', area: 9044 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [124.473, 24.416],
            [124.276, 24.755],
            [123.484, 24.295],
            [123.681, 23.956],
            [124.473, 24.416],
          ],
        ],
      },
      properties: { name: 'Iriomote ishigaki', type: 'mpa', area: 1228 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [141.259, 25.396],
            [142.665, 25.705],
            [142.205, 27.796],
            [140.799, 27.487],
            [141.259, 25.396],
          ],
        ],
      },
      properties: { name: 'Ogasawara', type: 'mpa', area: 1281 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-16.747, 19.33],
            [-15.968, 19.337],
            [-15.981, 20.835],
            [-16.759, 20.829],
            [-16.747, 19.33],
          ],
        ],
      },
      properties: { name: "Banc d'Arguin", type: 'mpa', area: 11926 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [35.317, -22.049],
            [35.542, -22.049],
            [35.542, -21.458],
            [35.317, -21.458],
            [35.317, -22.049],
          ],
        ],
      },
      properties: { name: 'Bazaruto', type: 'mpa', area: 1228 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [12.9, 77.746],
            [12.813, 76.5],
            [18.362, 76.113],
            [18.449, 77.359],
            [12.9, 77.746],
          ],
        ],
      },
      properties: { name: 'Sør-Spitsbergen', type: 'mpa', area: 13104 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [15.056, 79.24],
            [14.997, 80.302],
            [9.431, 79.994],
            [9.49, 78.932],
            [15.056, 79.24],
          ],
        ],
      },
      properties: { name: 'Nordvest-Spitsbergen', type: 'mpa', area: 9796 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [42.945, 17.734],
            [42.897, 18.404],
            [41.394, 18.296],
            [41.442, 17.627],
            [42.945, 17.734],
          ],
        ],
      },
      properties: { name: '‘Asir National Park', type: 'mpa', area: 6493 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [24.197, -34.11],
            [24.202, -33.807],
            [22.515, -33.778],
            [22.51, -34.082],
            [24.197, -34.11],
          ],
        ],
      },
      properties: { name: 'Garden Route National Park', type: 'mpa', area: 1264 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [99.826, 6.518],
            [99.787, 6.8],
            [99.081, 6.702],
            [99.12, 6.42],
            [99.826, 6.518],
          ],
        ],
      },
      properties: { name: 'Tarutao', type: 'mpa', area: 1727 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.967, 24.776],
            [-80.193, 25.184],
            [-80.76, 26.257],
            [-81.533, 25.849],
            [-80.967, 24.776],
          ],
        ],
      },
      properties: { name: 'Everglades National Park', type: 'mpa', area: 6227 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-138.537, 59.546],
            [-138.687, 58.429],
            [-135.386, 57.987],
            [-135.236, 59.104],
            [-138.537, 59.546],
          ],
        ],
      },
      properties: { name: 'Glacier Bay National Park & Preserve', type: 'mpa', area: 13289 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [9.804, 4.097],
            [9.383, 3.915],
            [9.709, 3.162],
            [10.13, 3.345],
            [9.804, 4.097],
          ],
        ],
      },
      properties: { name: 'Douala Edéa', type: 'mpa', area: 2735 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [34.597, 78.1],
            [34.697, 80.456],
            [16.838, 81.217],
            [16.738, 78.861],
            [34.597, 78.1],
          ],
        ],
      },
      properties: { name: 'Nordaust-Svalbard', type: 'mpa', area: 55073 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [19.629, 78.672],
            [19.625, 76.671],
            [26.099, 76.659],
            [26.102, 78.66],
            [19.629, 78.672],
          ],
        ],
      },
      properties: { name: 'Søraust-Svalbard', type: 'mpa', area: 21690 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [46.657, -9.597],
            [46.657, -9.226],
            [46.083, -9.226],
            [46.083, -9.597],
            [46.657, -9.597],
          ],
        ],
      },
      properties: { name: 'Aldabra Atoll', type: 'mpa', area: 2430 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [119.808, -8.865],
            [119.885, -8.488],
            [119.389, -8.387],
            [119.312, -8.764],
            [119.808, -8.865],
          ],
        ],
      },
      properties: { name: 'Komodo', type: 'mpa', area: 1214 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.977, 24.78],
            [-80.331, 25.116],
            [-80.889, 26.187],
            [-81.534, 25.851],
            [-80.977, 24.78],
          ],
        ],
      },
      properties: { name: 'Everglades National Park', type: 'mpa', area: 5853 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [118.405, -33.883],
            [118.879, -34.895],
            [120.664, -34.059],
            [120.19, -33.047],
            [118.405, -33.883],
          ],
        ],
      },
      properties: { name: 'Fitzgerald', type: 'mpa', area: 15325 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-10.94, 71],
            [-10.94, 83.73],
            [-63.13, 83.73],
            [-63.13, 71],
            [-10.94, 71],
          ],
        ],
      },
      properties: { name: 'North-East Greenland', type: 'mpa', area: 958745 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [119.79, -8.831],
            [119.827, -8.418],
            [119.352, -8.375],
            [119.315, -8.788],
            [119.79, -8.831],
          ],
        ],
      },
      properties: { name: 'Komodo', type: 'mpa', area: 1717 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-75.602, 10.246],
            [-75.869, 10.301],
            [-75.999, 9.681],
            [-75.732, 9.625],
            [-75.602, 10.246],
          ],
        ],
      },
      properties: { name: 'Los Corales del Rosario y San Bernardo', type: 'mpa', area: 1239 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-67.002, 12.063],
            [-67.002, 11.697],
            [-66.502, 11.697],
            [-66.502, 12.063],
            [-67.002, 12.063],
          ],
        ],
      },
      properties: { name: 'Archipiélago Los Roques', type: 'mpa', area: 2218 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [105.176, -6.437],
            [105.011, -6.733],
            [105.502, -7.006],
            [105.667, -6.71],
            [105.176, -6.437],
          ],
        ],
      },
      properties: { name: 'Ujung Kulon', type: 'mpa', area: 1114 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-72.591, -48.339],
            [-72.207, -46.034],
            [-75.615, -45.467],
            [-75.998, -47.771],
            [-72.591, -48.339],
          ],
        ],
      },
      properties: { name: 'Laguna San Rafael', type: 'mpa', area: 51185 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [144.071, -9.47],
            [140.913, -11.894],
            [151.851, -26.148],
            [155.01, -23.724],
            [144.071, -9.47],
          ],
        ],
      },
      properties: { name: 'Great Barrier Reef', type: 'mpa', area: 348233 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [144.116, -10.137],
            [141.15, -12.541],
            [152.094, -26.044],
            [155.059, -23.641],
            [144.116, -10.137],
          ],
        ],
      },
      properties: { name: 'Great Barrier Reef', type: 'mpa', area: 114930 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [143.13, -11.286],
            [141.295, -12.819],
            [152.132, -25.798],
            [153.967, -24.265],
            [143.13, -11.286],
          ],
        ],
      },
      properties: { name: 'Great Barrier Reef', type: 'mpa', area: 15106 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [144.099, -9.496],
            [140.957, -11.885],
            [151.632, -25.919],
            [154.774, -23.529],
            [144.099, -9.496],
          ],
        ],
      },
      properties: { name: 'Great Barrier Reef', type: 'mpa', area: 214901 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-176.64, 0.44],
            [-176.723, 0.034],
            [-176.316, -0.05],
            [-176.232, 0.357],
            [-176.64, 0.44],
          ],
        ],
      },
      properties: { name: 'Baker Island National Wildlife Refuge', type: 'mpa', area: 1674 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-176.765, 0.551],
            [-176.367, 0.648],
            [-176.468, 1.065],
            [-176.867, 0.967],
            [-176.765, 0.551],
          ],
        ],
      },
      properties: { name: 'Howland Island National Wildlife Refuge', type: 'mpa', area: 1711 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-160.206, -0.588],
            [-159.778, -0.574],
            [-159.792, -0.156],
            [-160.22, -0.17],
            [-160.206, -0.588],
          ],
        ],
      },
      properties: { name: 'Jarvis Island National Wildlife Refuge', type: 'mpa', area: 1745 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-169.203, 16.573],
            [-169.297, 17.029],
            [-169.814, 16.922],
            [-169.721, 16.466],
            [-169.203, 16.573],
          ],
        ],
      },
      properties: { name: 'Johnston Island National Wildlife Refuge', type: 'mpa', area: 2294 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-16.834, 13.59],
            [-16.351, 13.589],
            [-16.35, 14.355],
            [-16.833, 14.356],
            [-16.834, 13.59],
          ],
        ],
      },
      properties: { name: 'Delta du Saloum', type: 'mpa', area: 3206 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [12.439, 77.729],
            [12.649, 78.492],
            [9.545, 79.349],
            [9.334, 78.586],
            [12.439, 77.729],
          ],
        ],
      },
      properties: { name: 'Forlandet', type: 'mpa', area: 4600 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [142.915, -9.141],
            [143.095, -9.601],
            [143.614, -9.397],
            [143.433, -8.937],
            [142.915, -9.141],
          ],
        ],
      },
      properties: { name: 'Maza', type: 'mpa', area: 2350 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.769, 15.421],
            [-63.366, 15.523],
            [-63.466, 15.917],
            [-63.869, 15.814],
            [-63.769, 15.421],
          ],
        ],
      },
      properties: { name: 'Isla Aves', type: 'mpa', area: 1573 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [125.193, 34.864],
            [125.13, 34.218],
            [127.86, 33.949],
            [127.923, 34.595],
            [125.193, 34.864],
          ],
        ],
      },
      properties: { name: 'Dadohaehaesang', type: 'mpa', area: 2319 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.999, 76.635],
            [-64.082, 75.97],
            [-57.991, 75.207],
            [-57.908, 75.872],
            [-63.999, 76.635],
          ],
        ],
      },
      properties: { name: 'Melville Bay', type: 'mpa', area: 7958 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [106.448, -5.78],
            [106.734, -5.777],
            [106.731, -5.453],
            [106.445, -5.455],
            [106.448, -5.78],
          ],
        ],
      },
      properties: { name: 'Kepulauan Seribu', type: 'mpa', area: 1137 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [159.334, -31.415],
            [159.001, -31.415],
            [159.001, -31.832],
            [159.334, -31.832],
            [159.334, -31.415],
          ],
        ],
      },
      properties: { name: 'Lord Howe Island Group', type: 'mpa', area: 1465 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-71.685, 18.103],
            [-71.961, 17.662],
            [-71.509, 17.379],
            [-71.233, 17.82],
            [-71.685, 18.103],
          ],
        ],
      },
      properties: { name: 'Jaragua', type: 'mpa', area: 1542 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [65.996, 25.919],
            [65.964, 25.496],
            [66.412, 25.462],
            [66.444, 25.885],
            [65.996, 25.919],
          ],
        ],
      },
      properties: { name: 'Dhrun', type: 'mpa', area: 1675 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [64.236, 25.268],
            [64.329, 25.651],
            [63.924, 25.75],
            [63.831, 25.367],
            [64.236, 25.268],
          ],
        ],
      },
      properties: { name: 'Buzi Makola', type: 'mpa', area: 1446 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-48.033, -25.501],
            [-48.016, -24.997],
            [-48.766, -24.972],
            [-48.782, -25.477],
            [-48.033, -25.501],
          ],
        ],
      },
      properties: { name: 'Área De Proteção Ambiental De Guaraqueçaba', type: 'mpa', area: 2837 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [98.387, 11.037],
            [97.982, 11.039],
            [97.979, 10.533],
            [98.384, 10.531],
            [98.387, 11.037],
          ],
        ],
      },
      properties: { name: 'Lampi Marine National Park', type: 'mpa', area: 2025 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [135.166, -1.715],
            [134.085, -1.716],
            [134.086, -3.382],
            [135.167, -3.382],
            [135.166, -1.715],
          ],
        ],
      },
      properties: { name: 'Teluk Cendrawasih', type: 'mpa', area: 14568 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [131.195, -1.151],
            [131.347, -0.58],
            [130.498, -0.354],
            [130.346, -0.925],
            [131.195, -1.151],
          ],
        ],
      },
      properties: { name: 'Selat Dampier (Raja Ampat)', type: 'mpa', area: 3021 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [110.103, -5.913],
            [110.535, -5.919],
            [110.539, -5.68],
            [110.107, -5.674],
            [110.103, -5.913],
          ],
        ],
      },
      properties: { name: 'Kepulauan Karimun Jawa', type: 'mpa', area: 1213 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [97.033, 2.363],
            [97.034, 1.995],
            [97.555, 1.996],
            [97.554, 2.364],
            [97.033, 2.363],
          ],
        ],
      },
      properties: { name: 'Kepulauan Banyak', type: 'mpa', area: 2321 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [121.414, -7.088],
            [121.409, -6.213],
            [120.883, -6.216],
            [120.889, -7.091],
            [121.414, -7.088],
          ],
        ],
      },
      properties: { name: 'Take Bone Rate', type: 'mpa', area: 5638 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [123.782, -6.167],
            [124.037, -5.986],
            [123.583, -5.345],
            [123.328, -5.526],
            [123.782, -6.167],
          ],
        ],
      },
      properties: { name: 'Kepulauan Tukang Besi', type: 'mpa', area: 2339 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.398, -51.797],
            [-71.591, -49.598],
            [-74.39, -47.299],
            [-76.196, -49.499],
            [-73.398, -51.797],
          ],
        ],
      },
      properties: { name: "Bernardo O'Higgins", type: 'mpa', area: 44628 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.195, -44.155],
            [-73.593, -44.725],
            [-73.07, -45.091],
            [-72.671, -44.521],
            [-73.195, -44.155],
          ],
        ],
      },
      properties: { name: 'Isla Magdalena', type: 'mpa', area: 2558 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.598, -48.615],
            [-73.693, -47.448],
            [-75.692, -47.611],
            [-75.597, -48.777],
            [-73.598, -48.615],
          ],
        ],
      },
      properties: { name: 'Katalalixar', type: 'mpa', area: 6610 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-159.095, 59.831],
            [-159.203, 63.576],
            [-167.942, 63.326],
            [-167.835, 59.58],
            [-159.095, 59.831],
          ],
        ],
      },
      properties: { name: 'Yukon Delta National Wildlife Refuge', type: 'mpa', area: 84394 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-154.876, 57.399],
            [-154.41, 56.48],
            [-152.161, 57.621],
            [-152.627, 58.54],
            [-154.876, 57.399],
          ],
        ],
      },
      properties: { name: 'Kodiak', type: 'mpa', area: 7620 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-92.204, 2.595],
            [-93.985, -0.136],
            [-89.787, -2.873],
            [-88.006, -0.142],
            [-92.204, 2.595],
          ],
        ],
      },
      properties: { name: 'Archipielágo de Colón (Galápagos)', type: 'mpa', area: 146679 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [162.313, 54.585],
            [162.061, 55.736],
            [159.529, 55.179],
            [159.782, 54.029],
            [162.313, 54.585],
          ],
        ],
      },
      properties: { name: 'Kronotskiy', type: 'mpa', area: 11463 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-92.19, 2.465],
            [-93.869, -0.14],
            [-89.811, -2.755],
            [-88.133, -0.151],
            [-92.19, 2.465],
          ],
        ],
      },
      properties: { name: 'Galápagos', type: 'mpa', area: 123847 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.561, 53.773],
            [6.64, 53.16],
            [8.746, 53.433],
            [8.667, 54.046],
            [6.561, 53.773],
          ],
        ],
      },
      properties: { name: 'Niedersächsisches Wattenmeer', type: 'mpa', area: 3450 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [130.613, -2.232],
            [130.616, -1.961],
            [130.157, -1.957],
            [130.154, -2.228],
            [130.613, -2.232],
          ],
        ],
      },
      properties: { name: 'Teluk Lelintah', type: 'mpa', area: 1227 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [42.253, 16.306],
            [42.512, 16.82],
            [41.556, 17.302],
            [41.297, 16.788],
            [42.253, 16.306],
          ],
        ],
      },
      properties: { name: 'Farasan Islands', type: 'mpa', area: 5424 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [50.408, 24.468],
            [51.024, 24.875],
            [50.192, 26.135],
            [49.576, 25.728],
            [50.408, 24.468],
          ],
        ],
      },
      properties: { name: 'Khalij Salwa', type: 'mpa', area: 7835 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [34.453, 27.912],
            [35.311, 27.651],
            [35.719, 28.994],
            [34.861, 29.255],
            [34.453, 27.912],
          ],
        ],
      },
      properties: { name: 'Ra’s Suwayhil / Ra’s al-Qasbah', type: 'mpa', area: 3658 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [37.515, 24.113],
            [37.836, 24.332],
            [36.713, 25.982],
            [36.392, 25.763],
            [37.515, 24.113],
          ],
        ],
      },
      properties: { name: 'Al-Wajh Bank', type: 'mpa', area: 3871 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-68.043, 18.357],
            [-68.183, 18.002],
            [-67.772, 17.841],
            [-67.632, 18.195],
            [-68.043, 18.357],
          ],
        ],
      },
      properties: { name: 'Isla de Mona Natural Reserve', type: 'mpa', area: 1570 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-85.085, 22.06],
            [-85.093, 21.753],
            [-84.181, 21.729],
            [-84.173, 22.036],
            [-85.085, 22.06],
          ],
        ],
      },
      properties: { name: 'Peninsula de Guanahacabibes', type: 'mpa', area: 1521 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-88.644, 16.125],
            [-88.805, 15.881],
            [-88.327, 15.567],
            [-88.167, 15.811],
            [-88.644, 16.125],
          ],
        ],
      },
      properties: { name: 'Punta de Manabique', type: 'mpa', area: 1392 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.727, 13.549],
            [-82.594, 13.335],
            [-82.311, 14.832],
            [-83.444, 15.046],
            [-83.727, 13.549],
          ],
        ],
      },
      properties: { name: 'Cayos Miskitos y Franja Costera Inmediata', type: 'mpa', area: 8567 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [7.21, 53.245],
            [7.142, 53.698],
            [4.667, 53.327],
            [4.735, 52.874],
            [7.21, 53.245],
          ],
        ],
      },
      properties: { name: 'Waddensea Area', type: 'mpa', area: 2431 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [118.564, 2.364],
            [118.426, 2.164],
            [119.104, 1.696],
            [119.242, 1.897],
            [118.564, 2.364],
          ],
        ],
      },
      properties: { name: 'Pulau Maratua-Karang Muaras', type: 'mpa', area: 1836 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [132.222, -10.87],
            [131.696, -11.261],
            [132.157, -11.88],
            [132.682, -11.488],
            [132.222, -10.87],
          ],
        ],
      },
      properties: { name: 'Garig Gunak Barlu', type: 'mpa', area: 2248 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [24.451, 39.369],
            [24.078, 39.662],
            [23.684, 39.159],
            [24.057, 38.867],
            [24.451, 39.369],
          ],
        ],
      },
      properties: {
        name: 'Ethniko Thalassio Parko Alonnisou Voreion Sporadon',
        type: 'mpa',
        area: 2306,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-128.16, 69.322],
            [-128.079, 69.653],
            [-129.305, 69.953],
            [-129.386, 69.622],
            [-128.16, 69.322],
          ],
        ],
      },
      properties: { name: 'Anderson River Delta Bird Sanctuary', type: 'mpa', area: 1185 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-105.497, 68.504],
            [-105.689, 66.396],
            [-97.279, 65.629],
            [-97.087, 67.736],
            [-105.497, 68.504],
          ],
        ],
      },
      properties: { name: 'Ahiak Bird Sanctuary', type: 'mpa', area: 62927 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.983, 73.82],
            [-81.027, 72.782],
            [-75.968, 72.567],
            [-75.924, 73.606],
            [-80.983, 73.82],
          ],
        ],
      },
      properties: { name: 'Bylot Island Bird Sanctuary', type: 'mpa', area: 12827 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-82.5, 64.127],
            [-82.498, 63.831],
            [-81.285, 63.84],
            [-81.287, 64.135],
            [-82.5, 64.127],
          ],
        ],
      },
      properties: { name: 'Qaqsauqtuuq Sanctuary', type: 'mpa', area: 1130 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-86.333, 64],
            [-86.333, 63.547],
            [-85.5, 63.547],
            [-85.5, 64],
            [-86.333, 64],
          ],
        ],
      },
      properties: { name: 'Ikattuaq Bird Sanctuary', type: 'mpa', area: 1438 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-57.055, 6.136],
            [-57.084, 5.825],
            [-56.371, 5.758],
            [-56.342, 6.07],
            [-57.055, 6.136],
          ],
        ],
      },
      properties: { name: 'Bigi Pan', type: 'mpa', area: 1515 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.945, 17.465],
            [-63.642, 17.016],
            [-63.057, 17.411],
            [-63.361, 17.86],
            [-63.945, 17.465],
          ],
        ],
      },
      properties: { name: 'Saba', type: 'mpa', area: 2704 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [119.129, 10.547],
            [119.576, 10.552],
            [119.569, 11.122],
            [119.122, 11.117],
            [119.129, 10.547],
          ],
        ],
      },
      properties: { name: 'Malampaya Sound Protected Landscape', type: 'mpa', area: 2018 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-16.747, 19.332],
            [-15.976, 19.338],
            [-15.988, 20.834],
            [-16.759, 20.828],
            [-16.747, 19.332],
          ],
        ],
      },
      properties: { name: 'Banc d’Arguin', type: 'mpa', area: 11916 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-81.544, 7.895],
            [-81.938, 7.895],
            [-81.937, 7.169],
            [-81.543, 7.169],
            [-81.544, 7.895],
          ],
        ],
      },
      properties: { name: 'Coiba', type: 'mpa', area: 2562 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [109.43, -1.672],
            [109.377, -1.36],
            [108.613, -1.489],
            [108.665, -1.8],
            [109.43, -1.672],
          ],
        ],
      },
      properties: { name: 'Kepulauan Karimata', type: 'mpa', area: 2105 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-177.054, 28.048],
            [-177.139, 28.525],
            [-177.692, 28.427],
            [-177.607, 27.949],
            [-177.054, 28.048],
          ],
        ],
      },
      properties: { name: 'Midway Atoll National Wildlife Refuge', type: 'mpa', area: 2352 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.556, 52.545],
            [-80.414, 53.107],
            [-81.477, 53.374],
            [-81.619, 52.813],
            [-80.556, 52.545],
          ],
        ],
      },
      properties: { name: 'Akimiski Island Bird Sanctuary', type: 'mpa', area: 3534 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.373, 67.15],
            [-74.756, 65.743],
            [-72.918, 65.243],
            [-72.535, 66.65],
            [-74.373, 67.15],
          ],
        ],
      },
      properties: { name: 'Isulijarnik Bird Sanctuary', type: 'mpa', area: 8166 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.601, 58.244],
            [-5.525, 57.871],
            [-4.768, 58.026],
            [-4.844, 58.399],
            [-5.601, 58.244],
          ],
        ],
      },
      properties: { name: 'Assynt - Coigach', type: 'mpa', area: 1294 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.869, 57.856],
            [-5.71, 57.358],
            [-5.093, 57.555],
            [-5.252, 58.053],
            [-5.869, 57.856],
          ],
        ],
      },
      properties: { name: 'Wester Ross', type: 'mpa', area: 1629 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-7.008, 58.354],
            [-7.519, 57.677],
            [-6.975, 57.266],
            [-6.464, 57.943],
            [-7.008, 58.354],
          ],
        ],
      },
      properties: { name: 'South Lewis, Harris And North Uist', type: 'mpa', area: 2013 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-16.752, 19.342],
            [-15.964, 19.341],
            [-15.963, 20.834],
            [-16.75, 20.834],
            [-16.752, 19.342],
          ],
        ],
      },
      properties: { name: "Banc d'Arguin National Park", type: 'mpa', area: 12008 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [122.467, -0.568],
            [122.406, 0.01],
            [121.506, -0.085],
            [121.567, -0.663],
            [122.467, -0.568],
          ],
        ],
      },
      properties: { name: 'Kepulauan Togean', type: 'mpa', area: 3659 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [150.046, -22.03],
            [149.488, -22.058],
            [149.52, -22.699],
            [150.078, -22.671],
            [150.046, -22.03],
          ],
        ],
      },
      properties: { name: 'Broad Sound', type: 'mpa', area: 1711 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [113.652, -26.688],
            [114.381, -26.515],
            [113.981, -24.836],
            [113.253, -25.009],
            [113.652, -26.688],
          ],
        ],
      },
      properties: { name: 'Shark Bay', type: 'mpa', area: 1537 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [113.639, -26.709],
            [114.369, -26.091],
            [113.485, -25.048],
            [112.755, -25.667],
            [113.639, -26.709],
          ],
        ],
      },
      properties: { name: 'Shark Bay', type: 'mpa', area: 5265 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.618, 53.697],
            [9.25, 53.958],
            [8.736, 55.201],
            [8.104, 54.94],
            [8.618, 53.697],
          ],
        ],
      },
      properties: {
        name: 'Waddensea and Hallig Islands of Schleswig-Holstein',
        type: 'mpa',
        area: 2933,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [104.588, -2.464],
            [105.004, -2.207],
            [104.556, -1.481],
            [104.14, -1.739],
            [104.588, -2.464],
          ],
        ],
      },
      properties: { name: 'Sembilang', type: 'mpa', area: 2696 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-71.713, 9.05],
            [-71.675, 9.577],
            [-72.433, 9.632],
            [-72.471, 9.105],
            [-71.713, 9.05],
          ],
        ],
      },
      properties: { name: 'Ciénagas de Juan Manuel', type: 'mpa', area: 1890 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-82.904, 14.628],
            [-82.144, 15.015],
            [-82.899, 16.498],
            [-83.659, 16.111],
            [-82.904, 14.628],
          ],
        ],
      },
      properties: { name: 'Cayos Misquitos', type: 'mpa', area: 9028 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-84.282, 15.816],
            [-84.447, 15.629],
            [-83.956, 15.195],
            [-83.791, 15.382],
            [-84.282, 15.816],
          ],
        ],
      },
      properties: { name: 'Laguna de Karataska', type: 'mpa', area: 1337 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-81.212, 21.723],
            [-80.846, 22.257],
            [-81.807, 22.917],
            [-82.173, 22.383],
            [-81.212, 21.723],
          ],
        ],
      },
      properties: { name: 'Ciénaga de Zapata', type: 'mpa', area: 4201 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [9.047, 55.046],
            [7.95, 55.105],
            [7.886, 53.921],
            [8.983, 53.862],
            [9.047, 55.046],
          ],
        ],
      },
      properties: { name: 'Schleswig-Holsteinisches Wattenmeer', type: 'mpa', area: 4374 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-16.416, 11.011],
            [-16.212, 10.721],
            [-15.778, 11.025],
            [-15.982, 11.316],
            [-16.416, 11.011],
          ],
        ],
      },
      properties: { name: 'Orango', type: 'mpa', area: 1582 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-162.101, 55.196],
            [-162.172, 55.597],
            [-163.478, 55.365],
            [-163.407, 54.964],
            [-162.101, 55.196],
          ],
        ],
      },
      properties: { name: 'Izembek', type: 'mpa', area: 1646 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-82.35, 21.495],
            [-82.386, 21.798],
            [-83.219, 21.701],
            [-83.184, 21.398],
            [-82.35, 21.495],
          ],
        ],
      },
      properties: { name: 'Sur de la Isla de la Juventud', type: 'mpa', area: 1548 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-86.707, 16.115],
            [-86.706, 15.777],
            [-86.279, 15.779],
            [-86.28, 16.116],
            [-86.707, 16.115],
          ],
        ],
      },
      properties: { name: 'Cayos Cochinos', type: 'mpa', area: 1226 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-58.897, 7.546],
            [-58.759, 7.696],
            [-59.68, 8.547],
            [-59.818, 8.398],
            [-58.897, 7.546],
          ],
        ],
      },
      properties: { name: 'Shell Beach Protected Area', type: 'mpa', area: 1203 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [49.806, 27.335],
            [49.585, 27.734],
            [48.937, 27.374],
            [49.158, 26.976],
            [49.806, 27.335],
          ],
        ],
      },
      properties: { name: 'Jubail Marine Wildlife Sanctuary', type: 'mpa', area: 2383 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.368, -21.734],
            [113.922, -21.583],
            [113.123, -23.948],
            [113.569, -24.099],
            [114.368, -21.734],
          ],
        ],
      },
      properties: { name: 'Ningaloo', type: 'mpa', area: 1693 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [113.458, -24.519],
            [112.459, -25.129],
            [113.876, -27.449],
            [114.875, -26.839],
            [113.458, -24.519],
          ],
        ],
      },
      properties: { name: 'Shark Bay, Western Australia', type: 'mpa', area: 22092 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [119.808, -8.862],
            [119.885, -8.49],
            [119.391, -8.388],
            [119.315, -8.759],
            [119.808, -8.862],
          ],
        ],
      },
      properties: { name: 'Komodo National Park', type: 'mpa', area: 1786 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [105.457, -6.028],
            [104.967, -6.144],
            [105.165, -6.976],
            [105.655, -6.859],
            [105.457, -6.028],
          ],
        ],
      },
      properties: { name: 'Ujung Kulon National Park', type: 'mpa', area: 1269 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [29.811, 44.912],
            [29.488, 45.555],
            [28.366, 44.993],
            [28.688, 44.35],
            [29.811, 44.912],
          ],
        ],
      },
      properties: { name: 'Danube Delta', type: 'mpa', area: 3151 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.756, 32.562],
            [121.088, 32.735],
            [120.089, 34.645],
            [119.758, 34.472],
            [120.756, 32.562],
          ],
        ],
      },
      properties: { name: 'Yancheng', type: 'mpa', area: 2879 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.596, 53.634],
            [6.68, 53.132],
            [9.396, 53.585],
            [9.312, 54.087],
            [6.596, 53.634],
          ],
        ],
      },
      properties: { name: 'Waddensea of Lower Saxony', type: 'mpa', area: 2183 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [139.831, -36.542],
            [140.21, -36.154],
            [139.112, -35.081],
            [138.733, -35.469],
            [139.831, -36.542],
          ],
        ],
      },
      properties: {
        name: 'The Coorong, and Lakes Alexandrina and Albert Wetland',
        type: 'mpa',
        area: 1430,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [128.626, -14.887],
            [128.303, -14.78],
            [128.007, -15.676],
            [128.33, -15.783],
            [128.626, -14.887],
          ],
        ],
      },
      properties: { name: 'Ord River Floodplain', type: 'mpa', area: 1424 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [119.737, -19.947],
            [120.2, -20.832],
            [121.99, -19.895],
            [121.526, -19.01],
            [119.737, -19.947],
          ],
        ],
      },
      properties: { name: 'Eighty-mile Beach', type: 'mpa', area: 1764 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.553, 66.255],
            [-74.038, 64.922],
            [-72.294, 65.595],
            [-72.809, 66.929],
            [-74.553, 66.255],
          ],
        ],
      },
      properties: { name: 'Dewey Soper Migratory Bird Sanctuary', type: 'mpa', area: 7825 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.217, 55.835],
            [7.877, 55.416],
            [8.73, 54.722],
            [9.071, 55.142],
            [8.217, 55.835],
          ],
        ],
      },
      properties: { name: 'Vadehavet', type: 'mpa', area: 1508 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-51.059, 68.298],
            [-51.094, 68.667],
            [-52.518, 68.529],
            [-52.483, 68.16],
            [-51.059, 68.298],
          ],
        ],
      },
      properties: { name: 'Naternaq (Lersletten)', type: 'mpa', area: 1805 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.616, 53.647],
            [6.689, 53.161],
            [8.109, 53.375],
            [8.035, 53.862],
            [6.616, 53.647],
          ],
        ],
      },
      properties: {
        name: 'Wattenmeer, Ostfriesisches Wattenmeer & Dollart',
        type: 'mpa',
        area: 1298,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.618, 53.697],
            [9.25, 53.958],
            [8.736, 55.201],
            [8.104, 54.94],
            [8.618, 53.697],
          ],
        ],
      },
      properties: {
        name: 'Schleswig-Holstein Wadden Sea and adjacent areas',
        type: 'mpa',
        area: 2933,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [7.211, 53.232],
            [7.145, 53.683],
            [4.666, 53.318],
            [4.733, 52.867],
            [7.211, 53.232],
          ],
        ],
      },
      properties: { name: 'Wadden Sea', type: 'mpa', area: 2705 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-76.502, -14.448],
            [-76.002, -14.448],
            [-76.002, -13.785],
            [-76.502, -13.785],
            [-76.502, -14.448],
          ],
        ],
      },
      properties: { name: 'Paracas', type: 'mpa', area: 3374 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [28.706, 44.321],
            [29.875, 44.91],
            [29.304, 46.043],
            [28.135, 45.453],
            [28.706, 44.321],
          ],
        ],
      },
      properties: { name: 'Danube Delta', type: 'mpa', area: 6278 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [32.448, 67.178],
            [32.313, 66.717],
            [33.975, 66.23],
            [34.11, 66.691],
            [32.448, 67.178],
          ],
        ],
      },
      properties: { name: 'Kandalaksha Bay', type: 'mpa', area: 2237 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [47.438, 45.738],
            [47.737, 44.979],
            [49.796, 45.793],
            [49.496, 46.552],
            [47.438, 45.738],
          ],
        ],
      },
      properties: { name: 'Volga Delta', type: 'mpa', area: 10646 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-16.834, 13.59],
            [-16.351, 13.589],
            [-16.35, 14.355],
            [-16.833, 14.356],
            [-16.834, 13.59],
          ],
        ],
      },
      properties: { name: 'Delta du Saloum', type: 'mpa', area: 3206 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-162.103, 55.156],
            [-162.165, 55.583],
            [-163.37, 55.411],
            [-163.308, 54.983],
            [-162.103, 55.156],
          ],
        ],
      },
      properties: { name: 'Izembek Lagoon National Wildlife Refuge', type: 'mpa', area: 2183 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.984, 24.778],
            [-80.334, 25.112],
            [-80.886, 26.184],
            [-81.535, 25.85],
            [-80.984, 24.778],
          ],
        ],
      },
      properties: { name: 'Everglades National Park', type: 'mpa', area: 5741 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-77.345, 38.414],
            [-77.209, 36.966],
            [-75.528, 37.123],
            [-75.663, 38.572],
            [-77.345, 38.414],
          ],
        ],
      },
      properties: { name: 'Chesapeake Bay Estuarine Complex', type: 'mpa', area: 1752 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [34.496, 45.972],
            [34.356, 46.89],
            [29.547, 46.153],
            [29.687, 45.236],
            [34.496, 45.972],
          ],
        ],
      },
      properties: { name: 'Yagorlytska Bay', type: 'mpa', area: 1150 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [51.735, 24.708],
            [51.576, 25.049],
            [50.895, 24.73],
            [51.054, 24.389],
            [51.735, 24.708],
          ],
        ],
      },
      properties: { name: 'Khor Al Adaid', type: 'mpa', area: 1841 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [122.237, 17.544],
            [122.236, 17.833],
            [121.816, 17.831],
            [121.817, 17.543],
            [122.237, 17.544],
          ],
        ],
      },
      properties: { name: 'Peñablanca Protected Landscape and Seascape', type: 'mpa', area: 1194 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.461, 55.024],
            [8.14, 54.684],
            [8.707, 54.148],
            [9.028, 54.488],
            [8.461, 55.024],
          ],
        ],
      },
      properties: { name: 'Nordfriesisches Wattenmeer', type: 'mpa', area: 1373 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-12.716, -36.985],
            [-13.141, -37.392],
            [-9.931, -40.749],
            [-9.506, -40.343],
            [-12.716, -36.985],
          ],
        ],
      },
      properties: { name: 'Gough and Inaccessible Islands', type: 'mpa', area: 3997 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-44.262, -2.761],
            [-43.537, -1.517],
            [-45.671, -0.275],
            [-46.395, -1.52],
            [-44.262, -2.761],
          ],
        ],
      },
      properties: { name: 'Reentrancias Maranhenses', type: 'mpa', area: 26332 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-52.331, 4.863],
            [-52.301, 4.38],
            [-51.866, 4.408],
            [-51.896, 4.89],
            [-52.331, 4.863],
          ],
        ],
      },
      properties: { name: 'Marais De Kaw', type: 'mpa', area: 1545 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [153.419, -26.748],
            [152.932, -26.842],
            [153.154, -27.987],
            [153.64, -27.893],
            [153.419, -26.748],
          ],
        ],
      },
      properties: { name: 'Moreton Bay', type: 'mpa', area: 1211 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [70.224, 66.644],
            [70.282, 66.318],
            [71.751, 66.579],
            [71.693, 66.905],
            [70.224, 66.644],
          ],
        ],
      },
      properties: { name: 'Islands in Ob Estuary, Kara Sea', type: 'mpa', area: 1754 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [121.708, 20.201],
            [122.096, 20.193],
            [122.116, 21.178],
            [121.728, 21.185],
            [121.708, 20.201],
          ],
        ],
      },
      properties: { name: 'Batanes Protected Landscape & Seascape', type: 'mpa', area: 2118 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-114.481, 31.73],
            [-114.888, 32.06],
            [-115.3, 31.55],
            [-114.893, 31.221],
            [-114.481, 31.73],
          ],
        ],
      },
      properties: {
        name: 'Alto Golfo de California y Delta del Río Colorado',
        type: 'mpa',
        area: 1656,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-113.598, 31.343],
            [-113.865, 32.426],
            [-115.246, 32.085],
            [-114.979, 31.001],
            [-113.598, 31.343],
          ],
        ],
      },
      properties: {
        name: 'Alto Golfo de California y Delta del Río Colorado',
        type: 'mpa',
        area: 7727,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-92.493, 18.67],
            [-92.226, 18.025],
            [-90.856, 18.59],
            [-91.122, 19.236],
            [-92.493, 18.67],
          ],
        ],
      },
      properties: { name: 'Laguna de Términos', type: 'mpa', area: 7102 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-21.643, 65.032],
            [-21.701, 65.727],
            [-23.718, 65.56],
            [-23.66, 64.865],
            [-21.643, 65.032],
          ],
        ],
      },
      properties: { name: 'Breiðafjörður', type: 'mpa', area: 2831 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-87.515, 21.705],
            [-87.515, 21.24],
            [-87.097, 21.24],
            [-87.098, 21.705],
            [-87.515, 21.705],
          ],
        ],
      },
      properties: { name: 'Yum Balam', type: 'mpa', area: 1549 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-87.474, 18.813],
            [-87.474, 18.361],
            [-87.2, 18.362],
            [-87.2, 18.814],
            [-87.474, 18.813],
          ],
        ],
      },
      properties: { name: 'Banco Chinchorro', type: 'mpa', area: 1452 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [83.854, 69.656],
            [84.07, 70.865],
            [81.804, 71.27],
            [81.588, 70.061],
            [83.854, 69.656],
          ],
        ],
      },
      properties: { name: 'Brekhovsky Islands in the Yenisei estuary', type: 'mpa', area: 7379 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-88.181, 13.006],
            [-88.105, 13.204],
            [-88.753, 13.451],
            [-88.828, 13.253],
            [-88.181, 13.006],
          ],
        ],
      },
      properties: { name: 'Xiriualtique-Jiquilisco', type: 'mpa', area: 1005 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-112.933, 28.348],
            [-112.55, 28.766],
            [-113.591, 29.722],
            [-113.975, 29.305],
            [-112.933, 28.348],
          ],
        ],
      },
      properties: {
        name: 'Zona marina Bahía de los Ángeles, canales de Ballenas y de Salsipuedes',
        type: 'mpa',
        area: 3907,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-109.163, 20.619],
            [-108.807, 20.751],
            [-111.226, 27.242],
            [-111.582, 27.109],
            [-109.163, 20.619],
          ],
        ],
      },
      properties: {
        name: 'Ventilas Hidrotermales de La Cuenca de Guaymas y de La Dorsal del Pacífico Oriental',
        type: 'mpa',
        area: 1463,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-87.515, 21.803],
            [-87.515, 21.488],
            [-86.803, 21.488],
            [-86.803, 21.803],
            [-87.515, 21.803],
          ],
        ],
      },
      properties: { name: 'Tiburón Ballena', type: 'mpa', area: 1466 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.917, -4.014],
            [11.429, -4.512],
            [12.045, -3.879],
            [11.533, -3.381],
            [10.917, -4.014],
          ],
        ],
      },
      properties: { name: 'Conkouati-Douli', type: 'mpa', area: 5168 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [49.824, -45.91],
            [52.566, -55.037],
            [80.503, -46.643],
            [77.761, -37.517],
            [49.824, -45.91],
          ],
        ],
      },
      properties: {
        name: 'Réserve Naturelle Nationale des Terres Australes Française',
        type: 'mpa',
        area: 23332,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-38.75, -18.1],
            [-38.75, -17.333],
            [-39.378, -17.333],
            [-39.378, -18.1],
            [-38.75, -18.1],
          ],
        ],
      },
      properties: {
        name: 'Área De Proteção Ambiental Ponta Da Baleia / Abrolhos',
        type: 'mpa',
        area: 3474,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-41.174, -3.176],
            [-41.097, -2.839],
            [-42.463, -2.529],
            [-42.54, -2.865],
            [-41.174, -3.176],
          ],
        ],
      },
      properties: { name: 'Área De Proteção Ambiental Delta Do Parnaiba', type: 'mpa', area: 3117 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-46.073, -0.819],
            [-46.348, -2.222],
            [-44.03, -2.676],
            [-43.755, -1.273],
            [-46.073, -0.819],
          ],
        ],
      },
      properties: {
        name: 'Área De Proteção Ambiental Das Reentrâncias Maranhenses',
        type: 'mpa',
        area: 26519,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-34.075, -3.896],
            [-33.134, -4.8],
            [-28.395, 0.128],
            [-29.336, 1.033],
            [-34.075, -3.896],
          ],
        ],
      },
      properties: {
        name: 'Área De Proteção Ambiental De Fernando De Noronha',
        type: 'mpa',
        area: 1554,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.272, 24.716],
            [-83.064, 24.007],
            [-79.86, 24.945],
            [-80.068, 25.655],
            [-83.272, 24.716],
          ],
        ],
      },
      properties: { name: 'Florida Keys National Marine Sanctuary', type: 'mpa', area: 9858 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-88.377, 16.095],
            [-87.747, 15.96],
            [-87.294, 18.078],
            [-87.924, 18.213],
            [-88.377, 16.095],
          ],
        ],
      },
      properties: { name: 'Belize Barrier Reef Reserve System', type: 'mpa', area: 1165 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [113.925, -26.454],
            [114.251, -26.439],
            [114.231, -25.972],
            [113.905, -25.986],
            [113.925, -26.454],
          ],
        ],
      },
      properties: { name: 'Hamelin Pool', type: 'mpa', area: 1150 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [126.122, 10.189],
            [125.679, 9.925],
            [125.975, 9.429],
            [126.418, 9.692],
            [126.122, 10.189],
          ],
        ],
      },
      properties: {
        name: 'Siargao Island Protected Landscape and Seascape',
        type: 'mpa',
        area: 2852,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-16.797, 11.602],
            [-16.734, 10.622],
            [-15.261, 10.718],
            [-15.324, 11.697],
            [-16.797, 11.602],
          ],
        ],
      },
      properties: { name: 'Bolama - Bijagos', type: 'mpa', area: 10540 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-92.515, 14.789],
            [-92.39, 14.918],
            [-93.222, 15.721],
            [-93.347, 15.592],
            [-92.515, 14.789],
          ],
        ],
      },
      properties: { name: 'Reserva de la Biosfera La Encrucijada', type: 'mpa', area: 1465 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-67.002, 12.063],
            [-67.002, 11.697],
            [-66.502, 11.697],
            [-66.502, 12.063],
            [-67.002, 12.063],
          ],
        ],
      },
      properties: { name: 'Parque Nacional Archipiélago Los Roques', type: 'mpa', area: 2218 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.226, -52.859],
            [72.308, -53.546],
            [74.225, -53.319],
            [74.143, -52.631],
            [72.226, -52.859],
          ],
        ],
      },
      properties: { name: 'Heard and McDonald Islands', type: 'mpa', area: 6442 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [159.381, -54.251],
            [158.659, -54.019],
            [158.272, -55.222],
            [158.993, -55.454],
            [159.381, -54.251],
          ],
        ],
      },
      properties: { name: 'Macquarie Island', type: 'mpa', area: 5560 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [89.94, 21.768],
            [89.875, 22.102],
            [89.01, 21.936],
            [89.075, 21.601],
            [89.94, 21.768],
          ],
        ],
      },
      properties: { name: 'The Sundarbans', type: 'mpa', area: 1670 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-87.358, 5.6],
            [-87.146, 5.24],
            [-86.758, 5.469],
            [-86.97, 5.829],
            [-87.358, 5.6],
          ],
        ],
      },
      properties: { name: 'Cocos Island National Park', type: 'mpa', area: 1876 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-62.061, 16.36],
            [-61.927, 15.882],
            [-61.294, 16.058],
            [-61.428, 16.537],
            [-62.061, 16.36],
          ],
        ],
      },
      properties: { name: "Guadeloupe [Aire D'Adhésion]", type: 'mpa', area: 2137 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [150.767, -23.036],
            [151.108, -22.735],
            [150.452, -21.993],
            [150.112, -22.294],
            [150.767, -23.036],
          ],
        ],
      },
      properties: {
        name: 'Shoalwater and Corio Bays Area (Shoalwater Bay Training Area, in part - Corio Bay)',
        type: 'mpa',
        area: 2029,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [53.946, 37.204],
            [54.599, 37.451],
            [53.554, 40.209],
            [52.901, 39.961],
            [53.946, 37.204],
          ],
        ],
      },
      properties: { name: 'Hazar', type: 'mpa', area: 2663 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [165.491, -47.832],
            [165.598, -52.896],
            [179.467, -52.603],
            [179.36, -47.539],
            [165.491, -47.832],
          ],
        ],
      },
      properties: { name: 'New Zealand Sub-Antarctic Islands', type: 'mpa', area: 14722 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.936, 41.531],
            [11.809, 42.969],
            [8.319, 45.086],
            [7.447, 43.648],
            [10.936, 41.531],
          ],
        ],
      },
      properties: { name: 'Santuario Per I Mammiferi Marini', type: 'mpa', area: 19861 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [16.169, 78.515],
            [16.092, 79.071],
            [12.679, 78.595],
            [12.756, 78.039],
            [16.169, 78.515],
          ],
        ],
      },
      properties: { name: 'Nordre Isfjorden', type: 'mpa', area: 2938 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [13.529, 77.97],
            [13.541, 77.684],
            [17.081, 77.821],
            [17.069, 78.108],
            [13.529, 77.97],
          ],
        ],
      },
      properties: { name: 'Nordenskiöld Land', type: 'mpa', area: 1354 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [24.012, 76.796],
            [24.07, 76.153],
            [26.397, 76.362],
            [26.339, 77.005],
            [24.012, 76.796],
          ],
        ],
      },
      properties: { name: 'Hopen', type: 'mpa', area: 3164 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [17.994, 74.705],
            [17.999, 74.126],
            [20.017, 74.144],
            [20.012, 74.723],
            [17.994, 74.705],
          ],
        ],
      },
      properties: { name: 'Bjørnøya', type: 'mpa', area: 2966 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-85.236, 10.752],
            [-85.345, 11.15],
            [-86.041, 10.96],
            [-85.932, 10.563],
            [-85.236, 10.752],
          ],
        ],
      },
      properties: { name: 'Area de Conservación Guanacaste', type: 'mpa', area: 1514 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [32.968, -26.862],
            [32.353, -26.693],
            [31.895, -28.355],
            [32.51, -28.524],
            [32.968, -26.862],
          ],
        ],
      },
      properties: { name: 'iSimangaliso Wetland Park', type: 'mpa', area: 3216 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-88.638, 16.13],
            [-88.798, 15.893],
            [-88.322, 15.572],
            [-88.162, 15.809],
            [-88.638, 16.13],
          ],
        ],
      },
      properties: { name: 'Punta de Manabique', type: 'mpa', area: 1315 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.94, 21.539],
            [-80.525, 22.148],
            [-81.764, 22.994],
            [-82.18, 22.384],
            [-80.94, 21.539],
          ],
        ],
      },
      properties: { name: 'Ciénaga de Zapata', type: 'mpa', area: 6503 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-78.544, 22.606],
            [-78.957, 22.988],
            [-79.461, 22.443],
            [-79.048, 22.061],
            [-78.544, 22.606],
          ],
        ],
      },
      properties: { name: 'Buenavista', type: 'mpa', area: 3152 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [123.338, -5.207],
            [123.345, -6.167],
            [124.65, -6.157],
            [124.643, -5.197],
            [123.338, -5.207],
          ],
        ],
      },
      properties: { name: 'Kepulauan Wakatobi', type: 'mpa', area: 13259 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [136.743, -1.422],
            [136.743, -1.077],
            [136.25, -1.077],
            [136.25, -1.423],
            [136.743, -1.422],
          ],
        ],
      },
      properties: { name: 'KKPN PADAIDO', type: 'mpa', area: 1785 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [118.085, 6.627],
            [117.875, 6.349],
            [118.524, 5.858],
            [118.734, 6.136],
            [118.085, 6.627],
          ],
        ],
      },
      properties: { name: 'Turtle Islands Wildlife Sanctuary', type: 'mpa', area: 2432 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-156.02, 19.694],
            [-155.557, 20.381],
            [-159.215, 22.847],
            [-159.678, 22.16],
            [-156.02, 19.694],
          ],
        ],
      },
      properties: {
        name: 'Hawaiian Islands Humpback Whale National Marine Sanctuary',
        type: 'mpa',
        area: 3537,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-77.33, 17.951],
            [-77.326, 17.465],
            [-76.855, 17.47],
            [-76.859, 17.956],
            [-77.33, 17.951],
          ],
        ],
      },
      properties: { name: 'Portland Bight', type: 'mpa', area: 1984 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-162.61, 6.205],
            [-162.161, 6.155],
            [-162.111, 6.602],
            [-162.56, 6.652],
            [-162.61, 6.205],
          ],
        ],
      },
      properties: { name: 'Kingman Reef National Wildlife Refuge', type: 'mpa', area: 1968 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-162.347, 6.074],
            [-162.307, 5.637],
            [-161.808, 5.683],
            [-161.849, 6.12],
            [-162.347, 6.074],
          ],
        ],
      },
      properties: { name: 'Palmyra Atoll National Wildlife Refuge', type: 'mpa', area: 2152 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-78.225, 22.118],
            [-77.748, 21.702],
            [-77.472, 22.019],
            [-77.949, 22.434],
            [-78.225, 22.118],
          ],
        ],
      },
      properties: { name: 'Humedales de Cayo Romano', type: 'mpa', area: 2374 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-78.286, 22.696],
            [-78.953, 22.462],
            [-78.721, 21.799],
            [-78.054, 22.032],
            [-78.286, 22.696],
          ],
        ],
      },
      properties: { name: 'Humedales del Norte de Ciego de Avila', type: 'mpa', area: 2784 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-79.379, 21.369],
            [-79.532, 21.092],
            [-78.369, 20.451],
            [-78.216, 20.728],
            [-79.379, 21.369],
          ],
        ],
      },
      properties: { name: 'Jardines de la Reina', type: 'mpa', area: 2170 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.791, 21.567],
            [-80.481, 22.209],
            [-81.93, 22.908],
            [-82.24, 22.265],
            [-80.791, 21.567],
          ],
        ],
      },
      properties: { name: 'Península de Zapata', type: 'mpa', area: 7227 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-78.548, 22.612],
            [-79.002, 22.999],
            [-79.478, 22.442],
            [-79.024, 22.054],
            [-78.548, 22.612],
          ],
        ],
      },
      properties: { name: 'Buenavista', type: 'mpa', area: 3163 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-85.087, 22.059],
            [-85.093, 21.749],
            [-84.172, 21.73],
            [-84.166, 22.041],
            [-85.087, 22.059],
          ],
        ],
      },
      properties: { name: 'Peninsula de Guanahacabibes', type: 'mpa', area: 1604 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-82.102, 3.482],
            [-80.369, 3.482],
            [-80.369, 5],
            [-82.102, 5],
            [-82.102, 3.482],
          ],
        ],
      },
      properties: { name: 'Malpelo', type: 'mpa', area: 26729 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [134.189, -6.922],
            [134.515, -7.188],
            [134.917, -6.696],
            [134.591, -6.43],
            [134.189, -6.922],
          ],
        ],
      },
      properties: { name: 'Cagar Alam Laut Aru Tenggara', type: 'mpa', area: 1738 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [45.625, -16.102],
            [45.554, -15.839],
            [44.876, -16.023],
            [44.948, -16.287],
            [45.625, -16.102],
          ],
        ],
      },
      properties: { name: 'Baie de Baly', type: 'mpa', area: 1254 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [43.554, -21.106],
            [44.005, -21.362],
            [44.406, -20.656],
            [43.954, -20.4],
            [43.554, -21.106],
          ],
        ],
      },
      properties: { name: 'Kirindy Mite', type: 'mpa', area: 2375 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-54.254, 5.777],
            [-54.217, 6.107],
            [-55.158, 6.212],
            [-55.195, 5.882],
            [-54.254, 5.777],
          ],
        ],
      },
      properties: { name: 'North Commewijne - Marowijne', type: 'mpa', area: 2012 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-55.283, 5.845],
            [-55.311, 6.123],
            [-55.98, 6.055],
            [-55.951, 5.777],
            [-55.283, 5.845],
          ],
        ],
      },
      properties: { name: 'Noord Saramacca', type: 'mpa', area: 1547 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-78.43, 75.781],
            [-78.471, 76.274],
            [-80.116, 76.137],
            [-80.075, 75.644],
            [-78.43, 75.781],
          ],
        ],
      },
      properties: { name: 'Nirjutiqarvik National Wildlife Area', type: 'mpa', area: 1783 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-59.062, 43.398],
            [-58.516, 43.609],
            [-58.797, 44.334],
            [-59.342, 44.123],
            [-59.062, 43.398],
          ],
        ],
      },
      properties: { name: 'Gully Marine Protected Area', type: 'mpa', area: 2364 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [125.303, 5.498],
            [125.549, 5.924],
            [124.578, 6.485],
            [124.332, 6.059],
            [125.303, 5.498],
          ],
        ],
      },
      properties: { name: 'Sarangani Bay Protected Seascape', type: 'mpa', area: 2122 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [165.479, -50.947],
            [166.374, -51.319],
            [166.745, -50.428],
            [165.85, -50.056],
            [165.479, -50.947],
          ],
        ],
      },
      properties: { name: 'Auckland Islands - Motu Maha', type: 'mpa', area: 5025 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [29.548, -31.618],
            [29.671, -31.77],
            [30.331, -31.237],
            [30.208, -31.085],
            [29.548, -31.618],
          ],
        ],
      },
      properties: { name: 'Pondoland Marine Protected Area', type: 'mpa', area: 1237 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-150.045, 61.227],
            [-150.068, 61.506],
            [-151.078, 61.425],
            [-151.055, 61.145],
            [-150.045, 61.227],
          ],
        ],
      },
      properties: { name: 'Susitna Flats State', type: 'mpa', area: 1201 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [124.039, 11.256],
            [123.698, 11.386],
            [122.971, 9.481],
            [123.311, 9.351],
            [124.039, 11.256],
          ],
        ],
      },
      properties: { name: 'Tañon Strait Protected Seascape', type: 'mpa', area: 5383 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [34.472, 24.888],
            [34.472, 24.086],
            [35.764, 24.086],
            [35.764, 24.888],
            [34.472, 24.888],
          ],
        ],
      },
      properties: { name: 'Wadi El-Gemal - Hamata', type: 'mpa', area: 6900 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-90.105, 22.6],
            [-89.75, 22.056],
            [-89.283, 22.361],
            [-89.637, 22.905],
            [-90.105, 22.6],
          ],
        ],
      },
      properties: { name: 'Arrecife Alacranes', type: 'mpa', area: 3035 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-110.751, 26.131],
            [-111.359, 26.131],
            [-111.359, 25.589],
            [-110.751, 25.589],
            [-110.751, 26.131],
          ],
        ],
      },
      properties: { name: 'Bahía de Loreto', type: 'mpa', area: 2086 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-106.684, 22.083],
            [-107.05, 21.7],
            [-106.267, 20.951],
            [-105.9, 21.334],
            [-106.684, 22.083],
          ],
        ],
      },
      properties: { name: 'Islas Marías', type: 'mpa', area: 6297 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-144.484, 60.064],
            [-144.408, 60.459],
            [-146.118, 60.788],
            [-146.194, 60.394],
            [-144.484, 60.064],
          ],
        ],
      },
      properties: { name: 'Copper River Delta', type: 'mpa', area: 2205 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-151.89, 59.381],
            [-150.919, 59.327],
            [-150.892, 59.817],
            [-151.863, 59.872],
            [-151.89, 59.381],
          ],
        ],
      },
      properties: {
        name: 'Kachemak Bay National Estuarine Research Reserve',
        type: 'mpa',
        area: 1502,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [9.016, 4.35],
            [9.017, 4.833],
            [8.501, 4.834],
            [8.5, 4.351],
            [9.016, 4.35],
          ],
        ],
      },
      properties: { name: 'Ndongere', type: 'mpa', area: 2362 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [153.511, -26.745],
            [152.948, -26.832],
            [153.125, -27.989],
            [153.688, -27.903],
            [153.511, -26.745],
          ],
        ],
      },
      properties: { name: 'Moreton Bay', type: 'mpa', area: 2634 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-175.822, -6.48],
            [-169.691, -6.463],
            [-169.706, -0.983],
            [-175.837, -0.999],
            [-175.822, -6.48],
          ],
        ],
      },
      properties: { name: 'Phoenix Islands Protected Area', type: 'mpa', area: 400099 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.627, 48.396],
            [-122.714, 48.882],
            [-123.336, 48.771],
            [-123.249, 48.284],
            [-122.627, 48.396],
          ],
        ],
      },
      properties: {
        name: 'San Juan County/Cypress Island Marine Biological Preserve',
        type: 'mpa',
        area: 1658,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [37.109, 21.997],
            [37.115, 23.818],
            [34.496, 23.827],
            [34.49, 22.006],
            [37.109, 21.997],
          ],
        ],
      },
      properties: { name: 'Elba', type: 'mpa', area: 30517 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.917, -4.014],
            [11.429, -4.512],
            [12.045, -3.879],
            [11.533, -3.381],
            [10.917, -4.014],
          ],
        ],
      },
      properties: { name: 'Conkouati-Douli', type: 'mpa', area: 5169 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-177.557, -29.148],
            [-178.079, -28.907],
            [-179.226, -31.397],
            [-178.704, -31.637],
            [-177.557, -29.148],
          ],
        ],
      },
      properties: { name: 'Kermadec Islands', type: 'mpa', area: 7578 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-35.694, -9.584],
            [-35.372, -9.807],
            [-34.712, -8.853],
            [-35.034, -8.63],
            [-35.694, -9.584],
          ],
        ],
      },
      properties: { name: 'Área De Proteção Ambiental Costa Dos Corais', type: 'mpa', area: 4069 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [143.669, -13.977],
            [143.468, -14.397],
            [144.144, -14.72],
            [144.345, -14.301],
            [143.669, -13.977],
          ],
        ],
      },
      properties: { name: 'Princess Charlotte Bay', type: 'mpa', area: 1234 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-70.217, 42.767],
            [-70.626, 42.656],
            [-70.444, 41.983],
            [-70.035, 42.093],
            [-70.217, 42.767],
          ],
        ],
      },
      properties: {
        name: 'Gerry E. Studds/Stellwagen Bank National Marine Sanctuary',
        type: 'mpa',
        area: 2191,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [177.075, -17.335],
            [176.865, -17.459],
            [177.133, -17.911],
            [177.342, -17.787],
            [177.075, -17.335],
          ],
        ],
      },
      properties: { name: 'Yanuca (Malolo (Mamanuca Group)-Solevu/Yaro)', type: 'mpa', area: 1096 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [139.751, 32.985],
            [140.316, 33.324],
            [138.9, 35.683],
            [138.335, 35.343],
            [139.751, 32.985],
          ],
        ],
      },
      properties: { name: 'Fuji hakone izu', type: 'mpa', area: 1668 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-14.944, 11.557],
            [-15.075, 11.848],
            [-15.658, 11.587],
            [-15.527, 11.295],
            [-14.944, 11.557],
          ],
        ],
      },
      properties: { name: 'Rio Grande de Buba', type: 'mpa', area: 1156 },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [122.221, 16.601],
            [122.68, 16.736],
            [122.408, 17.659],
            [121.949, 17.524],
            [122.221, 16.601],
          ],
        ],
      },
      properties: { name: 'Northern Sierra Madre Natural Park', type: 'mpa', area: 3592 },
    },
  ],
}
export default mpasAreas
