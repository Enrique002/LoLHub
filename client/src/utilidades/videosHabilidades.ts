'use strict';

/**
 * Módulo de utilidades para videos de habilidades
 * Contiene funciones para construir URLs de videos de habilidades de campeones
 */

/**
 * Mapeo de IDs de campeones (nombre) a IDs numéricos para videos
 * Este mapeo puede expandirse según sea necesario
 */
const mapeoIdCampeon: Record<string, string> = {
  'Akali': '0084',
  'Aatrox': '0266',
  'Ahri': '0103',
  'Alistar': '0012',
  'Amumu': '0032',
  'Anivia': '0034',
  'Annie': '0001',
  'Aphelios': '0523',
  'Ashe': '0022',
  'AurelionSol': '0136',
  'Azir': '0268',
  'Bard': '0432',
  'Blitzcrank': '0053',
  'Brand': '0063',
  'Braum': '0201',
  'Caitlyn': '0051',
  'Camille': '0164',
  'Cassiopeia': '0069',
  'Chogath': '0031',
  'Corki': '0042',
  'Darius': '0122',
  'Diana': '0131',
  'Draven': '0119',
  'DrMundo': '0036',
  'Ekko': '0245',
  'Elise': '0060',
  'Evelynn': '0028',
  'Ezreal': '0081',
  'Fiddlesticks': '0009',
  'Fiora': '0114',
  'Fizz': '0105',
  'Galio': '0003',
  'Gangplank': '0041',
  'Garen': '0086',
  'Gnar': '0150',
  'Gragas': '0079',
  'Graves': '0104',
  'Gwen': '0887',
  'Hecarim': '0120',
  'Heimerdinger': '0074',
  'Illaoi': '0420',
  'Irelia': '0039',
  'Ivern': '0427',
  'Janna': '0040',
  'JarvanIV': '0059',
  'Jax': '0024',
  'Jayce': '0126',
  'Jhin': '0202',
  'Jinx': '0222',
  'Kaisa': '0145',
  'Kalista': '0429',
  'Karma': '0043',
  'Karthus': '0030',
  'Kassadin': '0038',
  'Katarina': '0055',
  'Kayle': '0010',
  'Kayn': '0141',
  'Kennen': '0085',
  'Khazix': '0121',
  'Kindred': '0203',
  'Kled': '0240',
  'KogMaw': '0096',
  'Leblanc': '0007',
  'LeeSin': '0064',
  'Leona': '0089',
  'Lillia': '0876',
  'Lissandra': '0127',
  'Lucian': '0236',
  'Lulu': '0117',
  'Lux': '0099',
  'Malphite': '0054',
  'Malzahar': '0090',
  'Maokai': '0057',
  'MasterYi': '0011',
  'MissFortune': '0021',
  'Mordekaiser': '0082',
  'Morgana': '0025',
  'Nami': '0267',
  'Nasus': '0075',
  'Nautilus': '0111',
  'Neeko': '0518',
  'Nidalee': '0076',
  'Nocturne': '0056',
  'Nunu': '0020',
  'Olaf': '0002',
  'Orianna': '0061',
  'Ornn': '0516',
  'Pantheon': '0080',
  'Poppy': '0078',
  'Pyke': '0555',
  'Qiyana': '0246',
  'Quinn': '0133',
  'Rakan': '0497',
  'Rammus': '0033',
  'RekSai': '0421',
  'Rell': '0896',
  'Renekton': '0058',
  'Rengar': '0107',
  'Riven': '0092',
  'Rumble': '0068',
  'Ryze': '0013',
  'Samira': '0360',
  'Sejuani': '0113',
  'Senna': '0235',
  'Seraphine': '0147',
  'Sett': '0875',
  'Shaco': '0035',
  'Shen': '0098',
  'Shyvana': '0102',
  'Singed': '0027',
  'Sion': '0014',
  'Sivir': '0015',
  'Skarner': '0072',
  'Sona': '0037',
  'Soraka': '0016',
  'Swain': '0050',
  'Sylas': '0517',
  'Syndra': '0134',
  'TahmKench': '0223',
  'Taliyah': '0163',
  'Talon': '0091',
  'Taric': '0044',
  'Teemo': '0017',
  'Thresh': '0412',
  'Tristana': '0018',
  'Trundle': '0048',
  'Tryndamere': '0023',
  'TwistedFate': '0004',
  'Twitch': '0029',
  'Udyr': '0077',
  'Urgot': '0006',
  'Varus': '0110',
  'Vayne': '0067',
  'Veigar': '0045',
  'Velkoz': '0161',
  'Vex': '0711',
  'Vi': '0254',
  'Viego': '0234',
  'Viktor': '0112',
  'Vladimir': '0008',
  'Volibear': '0106',
  'Warwick': '0019',
  'Xayah': '0498',
  'Xerath': '0101',
  'XinZhao': '0005',
  'Yasuo': '0157',
  'Yone': '0777',
  'Yorick': '0083',
  'Yuumi': '0350',
  'Zac': '0154',
  'Zed': '0238',
  'Zeri': '0221',
  'Ziggs': '0115',
  'Zilean': '0026',
  'Zoe': '0142',
  'Zyra': '0143',
  // Campeones nuevos añadidos (2024-2025)
  'Smolder': '0902',
  'Hwei': '0910',
  'Briar': '0903',
  'Naafiri': '0901',
  'Milio': '0902',
  'Ksante': '0897',
  'Belveth': '0895',
  'Nilah': '0894',
  'Renata': '0888',
  'Akshan': '0166',
};

/**
 * Obtiene el ID numérico de un campeón para construir la URL del video
 * @param {string} idCampeon - ID del campeón (nombre)
 * @returns {string|null} ID numérico del campeón o null si no se encuentra
 */
const obtenerIdNumericoCampeon = (idCampeon: string): string | null => {
  return mapeoIdCampeon[idCampeon] || null;
};

/**
 * Obtiene la clave de la habilidad basándose en el índice
 * @param {number} indice - Índice de la habilidad (0 = Pasiva, 1 = Q, 2 = W, 3 = E, 4 = R)
 * @returns {string} Clave de la habilidad (P1, Q1, W1, E1, R1)
 */
const obtenerClaveHabilidad = (indice: number): string => {
  const claves = ['P1', 'Q1', 'W1', 'E1', 'R1'];
  return claves[indice] || 'Q1';
};

/**
 * Construye la URL del video de una habilidad
 * @param {string} idCampeon - ID del campeón (nombre)
 * @param {number} indiceHabilidad - Índice de la habilidad (0 = Pasiva, 1 = Q, 2 = W, 3 = E, 4 = R)
 * @param {string|null} idNumericoOpcional - ID numérico opcional del campeón (si viene de la API)
 * @returns {string|null} URL del video o null si no se puede construir
 */
export const construirUrlVideoHabilidad = (
  idCampeon: string,
  indiceHabilidad: number,
  idNumericoOpcional?: string | null
): string | null => {
  // Intentar usar el ID numérico opcional primero si existe y es válido, luego el mapeo
  let idNumerico: string | null = null;
  
  if (idNumericoOpcional && typeof idNumericoOpcional === 'string' && idNumericoOpcional.trim() !== '') {
    // Si el ID opcional viene de la API, formatearlo a 4 dígitos con ceros a la izquierda
    const idNum = parseInt(idNumericoOpcional, 10);
    if (!isNaN(idNum) && idNum > 0) {
      idNumerico = idNum.toString().padStart(4, '0');
    }
  }
  
  // Si no se obtuvo del parámetro opcional, usar el mapeo (comportamiento original)
  if (!idNumerico) {
    idNumerico = obtenerIdNumericoCampeon(idCampeon);
  }
  
  if (!idNumerico) {
    console.warn(`No se encontró ID numérico para el campeón: ${idCampeon}. El video no se mostrará.`);
    return null;
  }
  
  const claveHabilidad = obtenerClaveHabilidad(indiceHabilidad);
  const urlBase = 'https://d28xe8vt774jo5.cloudfront.net/champion-abilities';
  
  return `${urlBase}/${idNumerico}/ability_${idNumerico}_${claveHabilidad}.webm`;
};

