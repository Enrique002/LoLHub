import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  SimpleGrid,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Checkbox,
  CheckboxGroup,
  Stack,
  Button,
  Wrap,
  WrapItem,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  Container,
  Heading,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
} from '@chakra-ui/react'
import { Search } from 'lucide-react'
import axios from 'axios'
import { DATA_DRAGON_BASE } from '../config'

type ItemMap = {
  [id: string]: {
    name: string
    description?: string
    plaintext?: string
    tags?: string[]
    gold?: { base: number; total: number; sell: number; purchasable: boolean }
    image?: { full: string }
    stats?: Record<string, number>
    maps?: Record<string, boolean>
    requiredChampion?: string
    inStore?: boolean
  }
}

type ItemsResponse = {
  data: ItemMap
}

type RoleFilter = 'Tank' | 'Assassin' | 'Marksman' | 'Support' | 'Fighter' | 'Mage'

const roleToTags: Record<RoleFilter, string[]> = {
  Tank: ['Health', 'Armor', 'SpellBlock'],
  Assassin: ['CriticalStrike', 'Lethality', 'AbilityHaste'],
  Marksman: ['AttackSpeed', 'CriticalStrike', 'OnHit'],
  Support: ['ManaRegen', 'HealAndShieldPower', 'Vision', 'Mana'],
  Fighter: ['AttackDamage', 'AbilityHaste', 'Lifesteal'],
  Mage: ['SpellDamage', 'Mana', 'ManaRegen'],
}

type ItemData = {
  id: string;
  name: string;
  price: number;
  tags: string[];
  image: string;
  plaintext?: string;
  description?: string;
  stats?: Record<string, number>;
  maps?: Record<string, boolean>;
  requiredChampion?: string;
  inStore?: boolean;
}

const Items: React.FC = () => {
  const [items, setItems] = useState<ItemData[]>([])
  const [searchText, setSearchText] = useState('')
  const [activeRoles, setActiveRoles] = useState<RoleFilter[]>([])
  const [selectedStats, setSelectedStats] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'name-asc' | 'price-asc' | 'price-desc'>('price-desc')
  const [selectedMode, setSelectedMode] = useState<'all' | 'sr' | 'aram'>('all')
  const [itemSeleccionado, setItemSeleccionado] = useState<ItemData | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const url = `${DATA_DRAGON_BASE}/data/es_ES/item.json`
        const response = await axios.get<ItemsResponse>(url)
        const map = response.data.data
        const list = Object.entries(map).map(([id, item]) => ({
          id,
          name: item.name,
          price: item.gold?.total ?? 0,
          tags: item.tags ?? [],
          image: `${DATA_DRAGON_BASE}/img/item/${item.image?.full}`,
          plaintext: item.plaintext,
          description: item.description,
          stats: item.stats ?? {},
          maps: item.maps ?? {},
          requiredChampion: item.requiredChampion,
          inStore: item.inStore,
        }))
        setItems(list)
      } catch (err) {
        console.error('Error fetching items', err)
      }
    }
    fetchItems()
  }, [])

  const toggleRole = (role: RoleFilter) => {
    setActiveRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
  }

  // Función para limpiar HTML y normalizar texto
  const limpiarTextoParaBusqueda = (texto: string | undefined): string => {
    if (!texto) return ''
    return texto
      .replace(/<[^>]*>/g, ' ') // Elimina etiquetas HTML
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/[^\w\s]/g, ' ') // Reemplaza caracteres especiales por espacios
      .replace(/\s+/g, ' ') // Normaliza espacios múltiples
      .toLowerCase()
      .trim()
  }

  // Mapeo de estadísticas con emojis (solo los filtros solicitados)
  const statConfig: Record<string, { 
    label: string
    emoji: string
    suffix?: string
    round?: boolean
    statKeys: string[] // Claves de stats relacionadas
  }> = {
    'ad': { 
      label: 'Daño de ataque (AD)', 
      emoji: '⚔️',
      statKeys: ['FlatPhysicalDamageMod']
    },
    'ap': { 
      label: 'Poder de habilidad (AP)', 
      emoji: '🔥',
      statKeys: ['FlatMagicDamageMod']
    },
    'attack-speed': { 
      label: 'Velocidad de ataque', 
      emoji: '🗡️',
      suffix: '%',
      round: true,
      statKeys: ['PercentAttackSpeedMod']
    },
    'lethality-armor-pen': { 
      label: 'Letalidad / Penetración de armadura', 
      emoji: '💥',
      statKeys: ['Lethality', 'FlatArmorPenetrationMod', 'PercentArmorPenetrationMod']
    },
    'armor': { 
      label: 'Armadura', 
      emoji: '🛡️',
      statKeys: ['FlatArmorMod']
    },
    'magic-resist': { 
      label: 'Resistencia mágica', 
      emoji: '🌀',
      statKeys: ['FlatSpellBlockMod']
    },
    'health': { 
      label: 'Vida', 
      emoji: '❤️',
      statKeys: ['FlatHPPoolMod']
    },
    'regen': { 
      label: 'Regeneración (vida o maná)', 
      emoji: '💧',
      statKeys: ['FlatHPRegenMod', 'PercentHPRegenMod', 'FlatMPRegenMod', 'PercentMPRegenMod']
    },
    'lifesteal-omnivamp': { 
      label: 'Robo de vida / Omnivampirismo', 
      emoji: '🔁',
      statKeys: ['PercentLifeStealMod', 'Omnivamp']
    },
    'heal-shield-power': { 
      label: 'Curaciones y escudos potenciados', 
      emoji: '💗',
      statKeys: ['HealAndShieldPower']
    },
    'tenacity': { 
      label: 'Tenacidad / Resistencia a control de masas / reducción de daño', 
      emoji: '🛡️',
      statKeys: ['Tenacity']
    },
    'ability-haste': { 
      label: 'Aceleración de habilidad (Ability Haste / CDR)', 
      emoji: '⏱️',
      statKeys: ['AbilityHaste']
    },
    'movement-speed': { 
      label: 'Velocidad de movimiento', 
      emoji: '🌀',
      statKeys: ['FlatMovementSpeedMod', 'PercentMovementSpeedMod']
    },
    'on-hit': { 
      label: 'Daño por golpe (On-Hit / daño básico potenciado)', 
      emoji: '🦷',
      statKeys: [] // Se buscará en tags o descripción
    },
  }

  // Función para verificar si un item tiene una estadística (priorizando stats directos)
  const itemHasStat = (item: ItemData, filterKey: string): boolean => {
    const config = statConfig[filterKey]
    if (!config) return false
    
    // PRIMERO: Verificar en stats directos (prioridad máxima)
    if (item.stats && config.statKeys.length > 0) {
      for (const statKey of config.statKeys) {
        if (item.stats[statKey] !== undefined && item.stats[statKey] !== 0) {
          return true
        }
      }
    }
    
    // Para On-Hit, buscar en tags
    if (filterKey === 'on-hit') {
      if (item.tags && item.tags.includes('OnHit')) {
        return true
      }
      // También buscar en descripción como último recurso
      const descLimpia = limpiarTextoParaBusqueda(item.description)
      const plaintextLimpio = limpiarTextoParaBusqueda(item.plaintext)
      const combinedText = `${descLimpia} ${plaintextLimpio}`
      return combinedText.includes('on-hit') || combinedText.includes('golpe') || combinedText.includes('ataque básico')
    }
    
    // SOLO como último recurso para otros stats: buscar en descripción (mínimo uso)
    // Solo si no se encontró en stats directos
    return false
  }

  // Mapeo de palabras clave en español para buscar en descripciones/pasivas (ya no se usa mucho)
  const statKeywords: Record<string, string[]> = {
    FlatHPPoolMod: ['vida', 'salud', 'hp', 'puntos de vida', 'vitalidad', 'vidas', 'vida maxima', 'vida máxima'],
    FlatMPPoolMod: ['maná', 'mana', 'puntos de maná', 'manas', 'mana maxima', 'mana máxima'],
    FlatPhysicalDamageMod: [
      'daño de ataque', 'ataque físico', 'ad', 'daño físico', 'ataque', 'daño', 'físico', 'ataques',
      'danio de ataque', 'ataque fisico', 'danio fisico', 'danio', 'fisico'
    ],
    FlatMagicDamageMod: [
      'poder de habilidad', 'ap', 'poder mágico', 'daño mágico', 'poder', 'magia', 'mágico',
      'poder magico', 'danio magico', 'poder de habilidades'
    ],
    FlatArmorMod: ['armadura', 'armor', 'armaduras'],
    FlatSpellBlockMod: [
      'resistencia mágica', 'mr', 'resistencia', 'magia', 'resistencia mágicas',
      'resistencia magica', 'resistencia magicas', 'resist mágica', 'resist magica'
    ],
    FlatMovementSpeedMod: [
      'velocidad de movimiento', 'movimiento', 'velocidad', 'movimientos',
      'velocidad movimiento', 'ms', 'mov speed'
    ],
    PercentMovementSpeedMod: [
      'velocidad de movimiento', 'movimiento', 'velocidad', 'movimientos',
      'velocidad movimiento', 'ms', 'mov speed'
    ],
    PercentAttackSpeedMod: [
      'velocidad de ataque', 'ataque', 'velocidad', 'velocidad de ataques',
      'velocidad ataque', 'attack speed', 'as', 'velocidad ataque'
    ],
    FlatCritChanceMod: [
      'probabilidad de crítico', 'crítico', 'crit', 'golpe crítico', 'críticos', 'criticos',
      'probabilidad critico', 'chance critico', 'crit chance', 'critico'
    ],
    FlatCritDamageMod: [
      'daño crítico', 'crítico', 'crit', 'criticos', 'danio critico',
      'crit damage', 'daño critico'
    ],
    PercentLifeStealMod: [
      'robo de vida', 'vampirismo', 'lifesteal', 'sustento', 'sustento vital',
      'robo vida', 'life steal', 'sustento de vida'
    ],
    FlatMagicPenetrationMod: [
      'penetración mágica', 'magic pen', 'penetración', 'penetracion magica',
      'penetracion mágica', 'magic penetration', 'mpen'
    ],
    PercentMagicPenetrationMod: [
      'penetración mágica', 'magic pen', 'penetración', 'penetracion magica',
      'penetracion mágica', 'magic penetration', 'mpen'
    ],
    FlatArmorPenetrationMod: [
      'penetración de armadura', 'armor pen', 'penetración', 'penetracion armadura',
      'armor penetration', 'apen', 'penetracion de armadura'
    ],
    PercentArmorPenetrationMod: [
      'penetración de armadura', 'armor pen', 'penetración', 'penetracion armadura',
      'armor penetration', 'apen', 'penetracion de armadura'
    ],
    AbilityHaste: [
      'prisa de habilidad', 'cdr', 'reducción de enfriamiento', 'aceleración', 'enfriamiento',
      'reduccion enfriamiento', 'cooldown', 'reduccion de enfriamiento', 'ability haste',
      'haste', 'prisa habilidad'
    ],
    HealAndShieldPower: [
      'curación', 'escudo', 'curar', 'sanar', 'poder de curación', 'poder de escudo',
      'curaciones', 'escudos', 'sanación', 'curacion', 'poder curacion', 'poder escudo',
      'heal power', 'shield power', 'heal and shield'
    ],
    Lethality: ['letalidad', 'lethality'],
    SpellVamp: [
      'vampirismo de hechizos', 'spell vamp', 'vampirismo', 'vampirismo hechizos',
      'spellvamp', 'vampirismo hechizo'
    ],
    Omnivamp: [
      'omnivampirismo', 'omnivamp', 'cortacuras', 'vampirismo omnidireccional',
      'omnivampirismo', 'vampirismo omnidireccional'
    ],
    FlatHPRegenMod: [
      'regeneración de vida', 'regenerar vida', 'regen vida', 'regeneracion vida',
      'regenera vida', 'hp regen', 'vida por segundo', 'hp5'
    ],
    PercentHPRegenMod: [
      'regeneración de vida', 'regenerar vida', 'regen vida', 'regeneracion vida',
      'hp regen', 'vida por segundo'
    ],
    FlatMPRegenMod: [
      'regeneración de maná', 'regenerar maná', 'regen maná', 'regeneracion mana',
      'regenera mana', 'mp regen', 'mana por segundo', 'mp5'
    ],
    PercentMPRegenMod: [
      'regeneración de maná', 'regenerar maná', 'regen maná', 'regeneracion mana',
      'mp regen', 'mana por segundo'
    ],
    Tenacity: [
      'tenacidad', 'resistencia a control de masas', 'control de masas',
      'reducción de control', 'reduccion control', 'tenacity', 'cc reduction'
    ],
  }

  // Función para verificar si un item tiene una estadística (priorizando stats directos)
  const itemHasStat = (item: ItemData, filterKey: string): boolean => {
    const config = statConfig[filterKey]
    if (!config) return false
    
    // PRIMERO: Verificar en stats directos (prioridad máxima)
    if (item.stats && config.statKeys.length > 0) {
      for (const statKey of config.statKeys) {
        if (item.stats[statKey] !== undefined && item.stats[statKey] !== 0) {
          return true
        }
      }
    }
    
    // Para On-Hit, buscar en tags
    if (filterKey === 'on-hit') {
      if (item.tags && item.tags.includes('OnHit')) {
        return true
      }
      // También buscar en descripción como último recurso
      const descLimpia = limpiarTextoParaBusqueda(item.description)
      const plaintextLimpio = limpiarTextoParaBusqueda(item.plaintext)
      const combinedText = `${descLimpia} ${plaintextLimpio}`
      return combinedText.includes('on-hit') || combinedText.includes('golpe') || combinedText.includes('ataque básico')
    }
    
    // SOLO como último recurso para otros stats: buscar en descripción (mínimo uso)
    // Solo si no se encontró en stats directos
    return false
  }

  const filteredItems = useMemo(() => {
    const byName = items.filter((it) => it.name.toLowerCase().includes(searchText.toLowerCase()))

    // Excluir pasivas de campeones y objetos fuera de tienda
    const withoutChampionPassives = byName.filter((it) => !it.requiredChampion)
    const onlyStoreItems = withoutChampionPassives.filter((it) => it.inStore !== false)

    // Filtrar por modo (11: SR, 12: ARAM)
    const byMode = onlyStoreItems.filter((it) => {
      if (selectedMode === 'all') return true
      const maps = it.maps || {}
      if (selectedMode === 'sr') return maps['11'] === true
      if (selectedMode === 'aram') return maps['12'] === true
      return true
    })

    const byRole = activeRoles.length === 0
      ? byMode
      : byMode.filter((it) => activeRoles.some((role) => roleToTags[role].some((tag) => it.tags.includes(tag))))

    const byStats = selectedStats.length === 0
      ? byRole
      : byRole.filter((it) => selectedStats.every((statKey) => itemHasStat(it, statKey)))

    const sorted = [...byStats]
    if (sortBy === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    return sorted
  }, [items, searchText, activeRoles, selectedStats, sortBy, selectedMode])
  
  // Mapeo para formatear stats en el modal (usa las claves originales de la API)
  const statConfigForDisplay: Record<string, { 
    label: string
    emoji: string
    suffix?: string
    round?: boolean
  }> = {
    FlatHPPoolMod: { label: 'Vida', emoji: '❤️' },
    FlatMPPoolMod: { label: 'Maná', emoji: '💙' },
    FlatPhysicalDamageMod: { label: 'Daño de Ataque (AD)', emoji: '⚔️' },
    FlatMagicDamageMod: { label: 'Poder de Habilidad (AP)', emoji: '🔥' },
    FlatArmorMod: { label: 'Armadura', emoji: '🛡️' },
    FlatSpellBlockMod: { label: 'Resistencia Mágica', emoji: '🌀' },
    FlatMovementSpeedMod: { label: 'Velocidad de Movimiento', emoji: '🌀' },
    PercentMovementSpeedMod: { label: 'Velocidad de Movimiento', emoji: '🌀', suffix: '%', round: true },
    PercentAttackSpeedMod: { label: 'Velocidad de Ataque', emoji: '🗡️', suffix: '%', round: true },
    FlatCritChanceMod: { label: 'Probabilidad de Crítico', emoji: '💥', suffix: '%', round: true },
    FlatCritDamageMod: { label: 'Daño Crítico', emoji: '💥', suffix: '%', round: true },
    PercentLifeStealMod: { label: 'Robo de Vida', emoji: '🔁', suffix: '%', round: true },
    FlatMagicPenetrationMod: { label: 'Penetración Mágica', emoji: '🌀' },
    PercentMagicPenetrationMod: { label: 'Penetración Mágica', emoji: '🌀', suffix: '%', round: true },
    FlatArmorPenetrationMod: { label: 'Penetración de Armadura', emoji: '💥' },
    PercentArmorPenetrationMod: { label: 'Penetración de Armadura', emoji: '💥', suffix: '%', round: true },
    AbilityHaste: { label: 'Aceleración de Habilidad (CDR)', emoji: '⏱️' },
    HealAndShieldPower: { label: 'Curaciones y Escudos Potenciados', emoji: '💗', suffix: '%', round: true },
    Lethality: { label: 'Letalidad', emoji: '💥' },
    SpellVamp: { label: 'Vampirismo de Hechizos', emoji: '🔁', suffix: '%', round: true },
    Omnivamp: { label: 'Cortacuras (Omnivampirismo)', emoji: '🔁', suffix: '%', round: true },
    FlatHPRegenMod: { label: 'Regeneración de Vida', emoji: '💧' },
    PercentHPRegenMod: { label: 'Regeneración de Vida', emoji: '💧', suffix: '%', round: true },
    FlatMPRegenMod: { label: 'Regeneración de Maná', emoji: '💧' },
    PercentMPRegenMod: { label: 'Regeneración de Maná', emoji: '💧', suffix: '%', round: true },
    Tenacity: { label: 'Tenacidad', emoji: '🛡️', suffix: '%', round: true },
  }

  const formatItemStats = (stats: Record<string, number> | undefined) => {
    if (!stats) return [] as string[]
    const lines: string[] = []
    for (const [key, value] of Object.entries(stats)) {
      if (!value) continue
      const meta = statConfigForDisplay[key]
      if (!meta) continue
      const shown = meta.round ? Math.round(value * 100) / 1 : value
      const suffix = meta.suffix ?? ''
      lines.push(`${meta.label} ${shown}${suffix}`)
    }
    return lines
  }

  const limpiarHTML = (texto: string | undefined): string => {
    if (!texto) return ''
    return texto
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim()
  }

  return (
    <Container maxW="1400px">
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading 
            size={{ base: '3xl', md: '4xl' }}
            mb={2}
            fontWeight="extrabold"
            letterSpacing="tight"
            lineHeight="tight"
            color="foreground.primary"
          >
            <Box as="span" color="foreground.primary">
              Catálogo de{' '}
            </Box>
            <Box as="span" color="gold.200">
              Objetos
            </Box>
          </Heading>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="foreground.muted" lineHeight="relaxed">
            Explora todos los objetos disponibles en League of Legends
          </Text>
        </Box>

        <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Tabs
            index={selectedMode === 'all' ? 0 : selectedMode === 'sr' ? 1 : 2}
            onChange={(index) => {
              if (index === 0) setSelectedMode('all')
              else if (index === 1) setSelectedMode('sr')
              else setSelectedMode('aram')
            }}
          >
            <TabList>
              <Tab>Todos</Tab>
              <Tab>Grieta del Invocador</Tab>
              <Tab>ARAM</Tab>
            </TabList>
          </Tabs>
          <Text fontSize="lg" fontWeight="bold" color="foreground.primary">
            {filteredItems.length} objetos
          </Text>
        </HStack>
      <HStack align="start" spacing={4} flexWrap="wrap">
        <InputGroup maxW={{ base: 'full', md: 'md' }}>
          <InputLeftElement pointerEvents="none">
            <Icon as={Search} color="foreground.muted" />
          </InputLeftElement>
            <Input
              placeholder="Buscar objetos..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              variant="outline"
              bg="background.card"
              borderColor="background.muted"
              _focus={{
                borderColor: 'gold.200',
                boxShadow: '0 0 0 1px var(--chakra-colors-gold-200)',
              }}
            />
        </InputGroup>

        <Select
          maxW={{ base: 'full', md: 'xs' }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          variant="outline"
          bg="background.card"
          borderColor="background.muted"
          _focus={{
            borderColor: 'gold.200',
            boxShadow: '0 0 0 1px var(--chakra-colors-gold-200)',
          }}
        >
          <option value="name-asc">Nombre (A-Z)</option>
          <option value="price-asc">Precio (↑)</option>
          <option value="price-desc">Precio (↓)</option>
        </Select>
      </HStack>

      <Wrap spacing={3}>
        {([
          { key: 'Tank', label: 'Tanque' },
          { key: 'Assassin', label: 'Asesino' },
          { key: 'Marksman', label: 'Tirador' },
          { key: 'Support', label: 'Apoyo' },
          { key: 'Fighter', label: 'Luchador' },
          { key: 'Mage', label: 'Mago' },
        ] as Array<{ key: RoleFilter; label: string }>).map(({ key, label }) => (
          <WrapItem key={key}>
            <Button
              size="sm"
              variant={activeRoles.includes(key) ? 'default' : 'outline'}
              colorScheme="gold"
              onClick={() => toggleRole(key)}
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: 'xl',
              }}
              transition="all 0.2s"
            >
              {label}
            </Button>
          </WrapItem>
        ))}
      </Wrap>

      <Box>
        <Text fontWeight="bold" mb={4} fontSize="sm" color="foreground.primary" textTransform="uppercase" letterSpacing="wide">
          Filtrar por estadísticas
        </Text>
        <CheckboxGroup value={selectedStats} onChange={(vals) => setSelectedStats(vals as string[])}>
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={3}>
            {Object.entries(statConfig)
              .map(([key, config]) => (
                <Checkbox
                  key={key}
                  value={key}
                  colorScheme="gold"
                  size="md"
                  _hover={{
                    transform: 'scale(1.02)',
                  }}
                  transition="all 0.2s"
                >
                  <HStack spacing={2} align="center">
                    <Text as="span" fontSize="18px" lineHeight="1">
                      {config.emoji}
                    </Text>
                    <Text fontSize="sm" color="foreground.primary">
                      {config.label}
                    </Text>
                  </HStack>
                </Checkbox>
              ))}
          </SimpleGrid>
        </CheckboxGroup>
      </Box>

      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={4}>
        {filteredItems.map((item) => (
          <Box
            key={item.id}
            bg="background.card"
            borderRadius="lg"
            boxShadow="md"
            border="1px"
            borderColor="background.muted"
            transition="all 0.2s"
            cursor="pointer"
            overflow="hidden"
            onClick={() => {
              setItemSeleccionado(item)
              onOpen()
            }}
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: '2xl',
              borderColor: 'gold.200',
            }}
          >
            {/* Imagen con fondo fijo */}
            <Box
              position="relative"
              w="100%"
              h="120px"
              bg={useColorModeValue('gray.100', 'background.secondary')}
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={4}
            >
              <Image
                src={item.image}
                alt={item.name}
                maxW="100%"
                maxH="100%"
                objectFit="contain"
                loading="lazy"
              />
              {item.price > 0 && (
                <Badge
                  position="absolute"
                  top={2}
                  right={2}
                  variant="gold"
                  fontSize="xs"
                  px={2}
                  py={1}
                >
                  {item.price}g
                </Badge>
              )}
            </Box>

            {/* Contenido */}
            <VStack spacing={2} p={3} align="stretch">
              <Text
                fontWeight="bold"
                fontSize="sm"
                noOfLines={2}
                color="foreground.primary"
                textAlign="center"
                minH="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {item.name}
              </Text>
              {formatItemStats(item.stats).length > 0 && (
                <VStack spacing={1} align="start" w="100%">
                  {formatItemStats(item.stats).slice(0, 3).map((line) => (
                    <Text key={line} fontSize="xs" color="foreground.muted" noOfLines={1}>
                      {line}
                    </Text>
                  ))}
                  {formatItemStats(item.stats).length > 3 && (
                    <Text fontSize="xs" color="gold.200" fontWeight="semibold">
                      +{formatItemStats(item.stats).length - 3} más
                    </Text>
                  )}
                </VStack>
              )}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Modal de Detalles de Item */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(10px)" />
        <ModalContent
          bg={useColorModeValue('white', 'background.card')}
          borderRadius="xl"
          maxW="800px"
          boxShadow="2xl"
        >
          <ModalHeader
            fontSize="3xl"
            fontWeight="extrabold"
            letterSpacing="tight"
            color="foreground.primary"
            pb={4}
            borderBottom="1px"
            borderColor="background.muted"
          >
            <HStack spacing={4} align="center">
              <Image
                src={itemSeleccionado?.image}
                alt={itemSeleccionado?.name}
                boxSize="64px"
                borderRadius="lg"
                objectFit="contain"
                bg={useColorModeValue('gray.50', 'background.secondary')}
                p={2}
              />
              <VStack align="start" spacing={1} flex={1}>
                <Text fontSize="3xl" fontWeight="extrabold" color="foreground.primary">
                  {itemSeleccionado?.name}
                </Text>
                {itemSeleccionado?.price && itemSeleccionado.price > 0 && (
                  <HStack spacing={2}>
                    <Badge variant="gold" fontSize="md" px={3} py={1}>
                      {itemSeleccionado.price} oro
                    </Badge>
                    {itemSeleccionado.price > 0 && (
                      <Text fontSize="sm" color="foreground.muted">
                        Venta: {Math.floor(itemSeleccionado.price * 0.7)} oro
                      </Text>
                    )}
                  </HStack>
                )}
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton size="lg" />
          <ModalBody pb={8} pt={6}>
            {itemSeleccionado && (
              <VStack spacing={6} align="stretch">
                {/* Descripción corta */}
                {itemSeleccionado.plaintext && (
                  <Box
                    bg={useColorModeValue('gray.50', 'background.secondary')}
                    p={4}
                    borderRadius="lg"
                    borderLeft="4px"
                    borderColor="gold.200"
                  >
                    <Text
                      fontSize="md"
                      color="foreground.primary"
                      lineHeight="relaxed"
                      fontStyle="italic"
                    >
                      {itemSeleccionado.plaintext}
                    </Text>
                  </Box>
                )}

                {/* Estadísticas */}
                {formatItemStats(itemSeleccionado.stats).length > 0 && (
                  <Box>
                    <Heading 
                      size="md" 
                      mb={4} 
                      fontWeight="bold" 
                      color="foreground.primary"
                      textTransform="uppercase"
                      letterSpacing="wide"
                      fontSize="sm"
                    >
                      Estadísticas
                    </Heading>
                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                      {formatItemStats(itemSeleccionado.stats).map((line) => {
                        // Extraer el emoji correspondiente si existe
                        const statKey = Object.keys(statConfig).find(key => {
                          const config = statConfig[key]
                          return line.includes(config.label)
                        })
                        const emoji = statKey ? statConfig[statKey]?.emoji : ''
                        
                        return (
                          <HStack
                            key={line}
                            spacing={3}
                            p={3}
                            bg={useColorModeValue('gray.50', 'background.secondary')}
                            borderRadius="md"
                            align="center"
                          >
                            {emoji && (
                              <Text fontSize="xl" lineHeight="1">
                                {emoji}
                              </Text>
                            )}
                            <Text fontSize="sm" color="foreground.primary" fontWeight="medium">
                              {line}
                            </Text>
                          </HStack>
                        )
                      })}
                    </SimpleGrid>
                  </Box>
                )}

                {/* Descripción Completa con Pasivas */}
                {itemSeleccionado.description && (
                  <Box>
                    <Heading 
                      size="md" 
                      mb={4} 
                      fontWeight="bold" 
                      color="foreground.primary"
                      textTransform="uppercase"
                      letterSpacing="wide"
                      fontSize="sm"
                    >
                      Descripción Completa y Pasivas
                    </Heading>
                    <Box
                      bg={useColorModeValue('gray.50', 'background.secondary')}
                      p={5}
                      borderRadius="lg"
                      border="1px"
                      borderColor="background.muted"
                    >
                      <Text
                        fontSize="sm"
                        color="foreground.primary"
                        lineHeight="relaxed"
                        whiteSpace="pre-wrap"
                        dangerouslySetInnerHTML={{ __html: itemSeleccionado.description }}
                        sx={{
                          '& p': {
                            marginBottom: '0.75rem',
                          },
                          '& strong': {
                            color: 'gold.200',
                            fontWeight: 'bold',
                          },
                          '& em': {
                            color: 'magic.400',
                            fontStyle: 'italic',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      </VStack>
    </Container>
  )
}

export default Items


