// ─── Ecosystems ───────────────────────────────────────────────────────────────
// These IDs match the ecosystem_ids array stored in the clients table.
// The names match the keys used in by_ecosystem JSON fields in global_stats
// and client_stats tables.

export type Ecosystem = {
  id: number
  name: string
  emoji: string
  color: string
}

export const ECOSYSTEMS: Ecosystem[] = [
  { id: 1, name: "Forêt Européenne",           emoji: "🌿", color: "#10b981" },
  { id: 2, name: "Forêt Asie-Australie",        emoji: "🐨", color: "#a78bfa" },
  { id: 3, name: "Océans du Monde",             emoji: "🌊", color: "#00d4ff" },
  { id: 4, name: "La Jungle Tropicale",         emoji: "🌴", color: "#22c55e" },
  { id: 5, name: "La Savane",                   emoji: "🦁", color: "#f59e0b" },
  { id: 6, name: "Alice In Bloomland",          emoji: "🌸", color: "#ec4899" },
  { id: 7, name: "La Jungle Tropicale Biodôme", emoji: "🦜", color: "#84cc16" },
  { id: 8, name: "Récifs Côtiers",              emoji: "🐠", color: "#06b6d4" },
  { id: 9, name: "Corals",                      emoji: "🪸", color: "#f97316" },
]

export const ECOSYSTEM_BY_ID: Record<number, Ecosystem> = Object.fromEntries(
  ECOSYSTEMS.map((e) => [e.id, e])
)

// Matches the string keys used in by_ecosystem JSON fields
export const ECOSYSTEM_BY_NAME: Record<string, Ecosystem> = Object.fromEntries(
  ECOSYSTEMS.map((e) => [e.name, e])
)

// ─── Animals ──────────────────────────────────────────────────────────────────
// Maps the raw animal keys from top_animals / by_animal JSON fields
// to human-readable names and emojis.

export type Animal = {
  key: string
  name: string
  emoji: string
  ecosystemId: number
}

export const ANIMALS: Animal[] = [
  { key: "Alice_Cat",          name: "Chat",         emoji: "🐱", ecosystemId: 6 },
  { key: "Alice_Caterpillar",  name: "Chenille",     emoji: "🐛", ecosystemId: 6 },
  { key: "Alice_Dormouse",     name: "Loir",         emoji: "🐭", ecosystemId: 6 },
  { key: "Alice_Flamingo",     name: "Flamant",      emoji: "🦩", ecosystemId: 6 },
  { key: "Alice_Hare",         name: "Lièvre",       emoji: "🐇", ecosystemId: 6 },
  { key: "Alice_Rabbit",       name: "Lapin",        emoji: "🐰", ecosystemId: 6 },
  { key: "Aqua_Clownfish",     name: "Clown Fish",   emoji: "🐠", ecosystemId: 3 },
  { key: "Aqua_Crab",          name: "Crabe",        emoji: "🦀", ecosystemId: 3 },
  { key: "Aqua_Jellyfish",     name: "Méduse",       emoji: "🪼", ecosystemId: 3 },
  { key: "Aqua_Moray",         name: "Murène",       emoji: "🐍", ecosystemId: 3 },
  { key: "Aqua_Seahorse",      name: "Hippocampe",   emoji: "🐴", ecosystemId: 3 },
  { key: "Aqua_Turtle",        name: "Tortue",       emoji: "🐢", ecosystemId: 3 },
  { key: "Asia_Orangoutan",    name: "Orang-outan",  emoji: "🦧", ecosystemId: 2 },
  { key: "Asia_Panda",         name: "Panda Roux",   emoji: "🐼", ecosystemId: 2 },
  { key: "Calanques_Circaète jean le Blanc", name: "Circaète", emoji: "🦅", ecosystemId: 8 },
  { key: "Calanques_Goéland",  name: "Goéland",      emoji: "🐦", ecosystemId: 8 },
  { key: "Calanques_Lézard Ocellé", name: "Lézard", emoji: "🦎", ecosystemId: 8 },
  { key: "Calanques_Mérou",    name: "Mérou",        emoji: "🐟", ecosystemId: 8 },
  { key: "Calanques_Murène",   name: "Murène",       emoji: "🐍", ecosystemId: 8 },
  { key: "Calanques_Poulpe",   name: "Poulpe",       emoji: "🐙", ecosystemId: 8 },
  { key: "Corals_Clam",        name: "Palourde",     emoji: "🦪", ecosystemId: 9 },
  { key: "Corals_Clownfish",   name: "Clownfish",    emoji: "🐠", ecosystemId: 9 },
  { key: "Corals_Cowfish",     name: "Cowfish",      emoji: "🐡", ecosystemId: 9 },
  { key: "Corals_Jelly",       name: "Méduse",       emoji: "🪼", ecosystemId: 9 },
  { key: "Corals_Shark",       name: "Requin",       emoji: "🦈", ecosystemId: 9 },
  { key: "Corals_Torch Coral", name: "Corail",       emoji: "🪸", ecosystemId: 9 },
  { key: "Europe_Bear",        name: "Ours",         emoji: "🐻", ecosystemId: 1 },
  { key: "Europe_Deer",        name: "Cerf",         emoji: "🦌", ecosystemId: 1 },
  { key: "Europe_Fox",         name: "Renard",       emoji: "🦊", ecosystemId: 1 },
  { key: "Europe_Owl",         name: "Chouette",     emoji: "🦉", ecosystemId: 1 },
  { key: "Europe_Squirrel",    name: "Écureuil",     emoji: "🐿️", ecosystemId: 1 },
  { key: "Europe_Wolf",        name: "Loup",         emoji: "🐺", ecosystemId: 1 },
  { key: "Jungle_Butterfly",   name: "Papillon",     emoji: "🦋", ecosystemId: 4 },
  { key: "Jungle_Capuchin",    name: "Capucin",      emoji: "🐒", ecosystemId: 4 },
  { key: "Jungle_Crocodile",   name: "Crocodile",    emoji: "🐊", ecosystemId: 4 },
  { key: "Jungle_Frog",        name: "Grenouille",   emoji: "🐸", ecosystemId: 4 },
  { key: "Jungle_Macaw",       name: "Ara",          emoji: "🦜", ecosystemId: 4 },
  { key: "Jungle_Panther",     name: "Panthère",     emoji: "🐆", ecosystemId: 4 },
  { key: "Savannah_Elephant",  name: "Éléphant",     emoji: "🐘", ecosystemId: 5 },
  { key: "Savannah_Giraffe",   name: "Girafe",       emoji: "🦒", ecosystemId: 5 },
  { key: "Savannah_Lion",      name: "Lion",         emoji: "🦁", ecosystemId: 5 },
  { key: "Savannah_Meekat",    name: "Suricate",     emoji: "🦡", ecosystemId: 5 },
  { key: "Savannah_Rhinoceros",name: "Rhinocéros",   emoji: "🦏", ecosystemId: 5 },
  { key: "Savannah_Warthog",   name: "Phacochère",   emoji: "🐗", ecosystemId: 5 },
  { key: "Singapour_Pangolin", name: "Pangolin",     emoji: "🦔", ecosystemId: 2 },
  { key: "Singapour_Python",   name: "Python",       emoji: "🐍", ecosystemId: 2 },
  { key: "Singapour_Tigre",    name: "Tigre",        emoji: "🐯", ecosystemId: 2 },
  { key: "Singapour_Varan",    name: "Varan",        emoji: "🦎", ecosystemId: 2 },
]

export const ANIMAL_BY_KEY: Record<string, Animal> = Object.fromEntries(
  ANIMALS.map((a) => [a.key, a])
)

// ─── Design tokens ────────────────────────────────────────────────────────────

export const COLORS = {
  bg: "#050c18",
  surface: "rgba(9,20,34,0.8)",
  border: "rgba(255,255,255,0.06)",
  accent: "#00d4ff",
  accentAlt: "#00c9a7",
  muted: "#4a6a9c",
  text: "#e8f0fe",
  textSub: "#7b96c2",
  textFaint: "#2d4a6e",
} as const

export const CHART_COLORS = [
  "#00d4ff", "#00c9a7", "#818cf8", "#10b981",
  "#f59e0b", "#ec4899", "#f97316", "#a78bfa",
] as const
