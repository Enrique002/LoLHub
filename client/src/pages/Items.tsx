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
  Tooltip,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
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

const Items: React.FC = () => {
  const [items, setItems] = useState<Array<{
    id: string;
    name: string;
    price: number;
    tags: string[];
    image: string;
    plaintext?: string;
    stats?: Record<string, number>;
    maps?: Record<string, boolean>;
    requiredChampion?: string;
    inStore?: boolean;
  }>>([])
  const [searchText, setSearchText] = useState('')
  const [activeRoles, setActiveRoles] = useState<RoleFilter[]>([])
  const [selectedStats, setSelectedStats] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'name-asc' | 'price-asc' | 'price-desc'>('name-asc')
  const [selectedMode, setSelectedMode] = useState<'all' | 'sr' | 'aram'>('all')
  const cardBg = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const url = `${DATA_DRAGON_BASE}/data/en_US/item.json`
        const response = await axios.get<ItemsResponse>(url)
        const map = response.data.data
        const list = Object.entries(map).map(([id, item]) => ({
          id,
          name: item.name,
          price: item.gold?.total ?? 0,
          tags: item.tags ?? [],
          image: `${DATA_DRAGON_BASE}/img/item/${item.image?.full}`,
          plaintext: item.plaintext,
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
      : byRole.filter((it) => selectedStats.every((statKey) => (it.stats?.[statKey] ?? 0) !== 0))

    const sorted = [...byStats]
    if (sortBy === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    return sorted
  }, [items, searchText, activeRoles, selectedStats, sortBy, selectedMode])

  const formatItemStats = (stats: Record<string, number> | undefined) => {
    if (!stats) return [] as string[]
    const labelMap: Record<string, { label: string; suffix?: string; round?: boolean }> = {
      FlatHPPoolMod: { label: '+ Vida' },
      FlatMPPoolMod: { label: '+ Maná' },
      FlatPhysicalDamageMod: { label: '+ Daño físico' },
      FlatMagicDamageMod: { label: '+ Poder de habilidad' },
      FlatArmorMod: { label: '+ Armadura' },
      FlatSpellBlockMod: { label: '+ Resistencia mágica' },
      FlatMovementSpeedMod: { label: '+ Velocidad de movimiento' },
      PercentMovementSpeedMod: { label: '+ Velocidad de movimiento', suffix: '%', round: true },
      PercentAttackSpeedMod: { label: '+ Velocidad de ataque', suffix: '%', round: true },
      FlatCritChanceMod: { label: '+ Probabilidad de crítico', suffix: '%', round: true },
      FlatCritDamageMod: { label: '+ Daño crítico', suffix: '%', round: true },
      PercentLifeStealMod: { label: '+ Robo de vida', suffix: '%', round: true },
      FlatMagicPenetrationMod: { label: '+ Penetración mágica' },
      PercentMagicPenetrationMod: { label: '+ Penetración mágica', suffix: '%', round: true },
      FlatArmorPenetrationMod: { label: '+ Penetración de armadura' },
      PercentArmorPenetrationMod: { label: '+ Penetración de armadura', suffix: '%', round: true },
      AbilityHaste: { label: '+ Prisa de habilidad' },
      HealAndShieldPower: { label: '+ Poder de curación/escudo', suffix: '%', round: true },
      Lethality: { label: '+ Letalidad' },
      SpellVamp: { label: '+ Vampirismo de hechizos', suffix: '%', round: true },
    }
    const lines: string[] = []
    for (const [key, value] of Object.entries(stats)) {
      if (!value) continue
      const meta = labelMap[key]
      if (!meta) continue
      const shown = meta.round ? Math.round(value * 100) / 1 : value
      const suffix = meta.suffix ?? ''
      lines.push(`${meta.label} ${shown}${suffix}`)
    }
    return lines.slice(0, 5)
  }

  return (
    <Container maxW="1400px">
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" mb={2} color={useColorModeValue('gray.800', 'white')}>
            Objetos
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="lg">
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
              <Tab>Summoner's Rift</Tab>
              <Tab>ARAM</Tab>
            </TabList>
          </Tabs>
          <Text fontSize="lg" fontWeight="bold" color={useColorModeValue('gray.700', 'gray.300')}>
            {filteredItems.length} objetos
          </Text>
        </HStack>
      <HStack align="start" spacing={4} flexWrap="wrap">
        <InputGroup maxW={{ base: 'full', md: 'md' }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar items..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="lg"
          />
        </InputGroup>

        <Select
          maxW={{ base: 'full', md: 'xs' }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          size="lg"
        >
          <option value="name-asc">Nombre (A-Z)</option>
          <option value="price-asc">Precio (↑)</option>
          <option value="price-desc">Precio (↓)</option>
        </Select>
      </HStack>

      <Wrap spacing={3}>
        {(['Tank', 'Assassin', 'Marksman', 'Support', 'Fighter', 'Mage'] as RoleFilter[]).map((role) => (
          <WrapItem key={role}>
            <Button
              size="sm"
              variant={activeRoles.includes(role) ? 'solid' : 'outline'}
              colorScheme={activeRoles.includes(role) ? 'blue' : 'gray'}
              onClick={() => toggleRole(role)}
            >
              {role}
            </Button>
          </WrapItem>
        ))}
      </Wrap>

      <Box>
        <Text fontWeight="bold" mb={2} color={useColorModeValue('gray.700', 'gray.300')}>Filtrar por estadísticas</Text>
        <CheckboxGroup value={selectedStats} onChange={(vals) => setSelectedStats(vals as string[])}>
          <Stack spacing={3} direction={{ base: 'column', md: 'row' }} wrap="wrap">
            <Checkbox value="FlatHPPoolMod" colorScheme="blue">+ Vida</Checkbox>
            <Checkbox value="FlatMPPoolMod" colorScheme="blue">+ Maná</Checkbox>
            <Checkbox value="FlatPhysicalDamageMod" colorScheme="blue">+ AD</Checkbox>
            <Checkbox value="FlatMagicDamageMod" colorScheme="blue">+ AP</Checkbox>
            <Checkbox value="FlatArmorMod" colorScheme="blue">+ Armadura</Checkbox>
            <Checkbox value="FlatSpellBlockMod" colorScheme="blue">+ Resistencia mágica</Checkbox>
            <Checkbox value="PercentAttackSpeedMod" colorScheme="blue">+ Velocidad de ataque</Checkbox>
            <Checkbox value="FlatCritChanceMod" colorScheme="blue">+ Crítico</Checkbox>
            <Checkbox value="PercentLifeStealMod" colorScheme="blue">+ Robo de vida</Checkbox>
            <Checkbox value="AbilityHaste" colorScheme="blue">+ Prisa de habilidad</Checkbox>
          </Stack>
        </CheckboxGroup>
      </Box>

      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={4}>
        {filteredItems.map((item) => (
          <Tooltip
            key={item.id}
            label={
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold" fontSize="md">
                  {item.name}
                </Text>
                {item.plaintext && (
                  <Text fontSize="sm" maxW="300px">
                    {item.plaintext}
                  </Text>
                )}
                {formatItemStats(item.stats).length > 0 && (
                  <VStack align="start" spacing={1}>
                    {formatItemStats(item.stats).map((line) => (
                      <Text key={line} fontSize="xs" color="gray.300">
                        {line}
                      </Text>
                    ))}
                  </VStack>
                )}
              </VStack>
            }
            placement="top"
            hasArrow
            bg="gray.800"
            color="white"
            borderRadius="md"
            p={3}
          >
            <Box
              p={3}
              bg={cardBg}
              borderRadius="lg"
              boxShadow="md"
              border="2px"
              borderColor="transparent"
              transition="all 0.2s"
              cursor="pointer"
              _hover={{
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: 'xl',
                borderColor: 'gold.200',
              }}
            >
              <VStack align="start" spacing={2}>
                <Box position="relative" w="100%">
                  <Image
                    src={item.image}
                    alt={item.name}
                    borderRadius="md"
                    w="100%"
                    objectFit="cover"
                  />
                  {item.price > 0 && (
                    <Badge
                      position="absolute"
                      bottom={2}
                      right={2}
                      colorScheme="green"
                      fontSize="xs"
                    >
                      {item.price}g
                    </Badge>
                  )}
                </Box>
                <Text fontWeight="bold" fontSize="sm" noOfLines={2}>
                  {item.name}
                </Text>
                {formatItemStats(item.stats).length > 0 && (
                  <VStack spacing={0.5} align="start" w="100%">
                    {formatItemStats(item.stats).slice(0, 2).map((line) => (
                      <Text key={line} fontSize="xs" color={useColorModeValue('gray.600', 'foreground.muted')}>
                        {line}
                      </Text>
                    ))}
                  </VStack>
                )}
              </VStack>
            </Box>
          </Tooltip>
        ))}
      </SimpleGrid>
      </VStack>
    </Container>
  )
}

export default Items


