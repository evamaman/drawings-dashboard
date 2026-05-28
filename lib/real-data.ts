// ─── Real data processed from Wild Immersion CSV exports ────────────────────
// Sources: WebDrawing.csv, drawing_count.csv, Animal.csv, user.csv, ecosystem.csv, shared_drawing.csv

import { ecosystems as ECOSYSTEMS, RAW_CLIENTS } from "./mock-data";
export { ECOSYSTEMS };

// ─── Ecosystems ──────────────────────────────────────────────────────────────

export const ECOSYSTEM_MAP: Record<string, { id: number; emoji: string; color: string }> = {
  "Forêt Européenne":         { id: 1, emoji: "🌿", color: "#10b981" },
  "Forêt Asie-Australie":     { id: 2, emoji: "🐨", color: "#a78bfa" },
  "Océans du Monde":          { id: 3, emoji: "🌊", color: "#00d4ff" },
  "La Jungle Tropicale":      { id: 4, emoji: "🌴", color: "#22c55e" },
  "La Savane":                { id: 5, emoji: "🦁", color: "#f59e0b" },
  "Alice In Bloomland":       { id: 6, emoji: "🌸", color: "#ec4899" },
  "La Jungle Tropicale Biodôme": { id: 7, emoji: "🦜", color: "#84cc16" },
  "Récifs Côtiers":           { id: 8, emoji: "🐠", color: "#06b6d4" },
  "Corals":                   { id: 9, emoji: "🪸", color: "#f97316" },
};

// ─── Animals (from Animal.csv) ────────────────────────────────────────────────

export const ANIMALS: Record<string, { name: string; ecosystemId: number; emoji: string }> = {
  "Alice_Cat":          { name: "Cat",              ecosystemId: 6, emoji: "🐱" },
  "Alice_Caterpillar":  { name: "Caterpillar",      ecosystemId: 6, emoji: "🐛" },
  "Alice_Dormouse":     { name: "Dormouse",         ecosystemId: 6, emoji: "🐭" },
  "Alice_Flamingo":     { name: "Flamingo",         ecosystemId: 6, emoji: "🦩" },
  "Alice_Hare":         { name: "Hase",             ecosystemId: 6, emoji: "🐇" },
  "Alice_Rabbit":       { name: "Rabbit",           ecosystemId: 6, emoji: "🐰" },
  "Aqua_Clownfish":     { name: "Clown Fish",       ecosystemId: 3, emoji: "🐠" },
  "Aqua_Crab":          { name: "Crab",             ecosystemId: 3, emoji: "🦀" },
  "Aqua_Jellyfish":     { name: "Jellyfish",        ecosystemId: 3, emoji: "🪼" },
  "Aqua_Moray":         { name: "Moray",            ecosystemId: 3, emoji: "🐍" },
  "Aqua_Seahorse":      { name: "Sea Horse",        ecosystemId: 3, emoji: "🐴" },
  "Aqua_Turtle":        { name: "Turtle",           ecosystemId: 3, emoji: "🐢" },
  "Asia_Orangoutan":    { name: "Orangutan",        ecosystemId: 2, emoji: "🦧" },
  "Asia_Panda":         { name: "Red Panda",        ecosystemId: 2, emoji: "🐼" },
  "Calanques_Circaète jean le Blanc": { name: "Circaète",ecosystemId: 8, emoji: "🦅" },
  "Calanques_Goéland":  { name: "Gull",             ecosystemId: 8, emoji: "🐦" },
  "Calanques_Lézard Ocellé": { name: "Lézard",     ecosystemId: 8, emoji: "🦎" },
  "Calanques_Mérou":    { name: "Mérou",            ecosystemId: 8, emoji: "🐟" },
  "Calanques_Murène":   { name: "Murène",           ecosystemId: 8, emoji: "🐍" },
  "Calanques_Poulpe":   { name: "Octopus",          ecosystemId: 8, emoji: "🐙" },
  "Corals_Clam":        { name: "Clam",             ecosystemId: 9, emoji: "🦪" },
  "Corals_Clownfish":   { name: "Clownfish",        ecosystemId: 9, emoji: "🐠" },
  "Corals_Cowfish":     { name: "Cowfish",          ecosystemId: 9, emoji: "🐡" },
  "Corals_Jelly":       { name: "Jelly",            ecosystemId: 9, emoji: "🪼" },
  "Corals_Shark":       { name: "Shark",            ecosystemId: 9, emoji: "🦈" },
  "Corals_Torch Coral": { name: "Torch Coral",     ecosystemId: 9, emoji: "🪸" },
  "Europe_Bear":        { name: "Bear",             ecosystemId: 1, emoji: "🐻" },
  "Europe_Deer":        { name: "Red Deer",         ecosystemId: 1, emoji: "🦌" },
  "Europe_Fox":         { name: "Fox",              ecosystemId: 1, emoji: "🦊" },
  "Europe_Owl":         { name: "Barn Owl",         ecosystemId: 1, emoji: "🦉" },
  "Europe_Squirrel":    { name: "Red Squirrel",     ecosystemId: 1, emoji: "🐿️" },
  "Europe_Wolf":        { name: "Grey Wolf",        ecosystemId: 1, emoji: "🐺" },
  "Jungle_Butterfly":   { name: "Butterfly",        ecosystemId: 4, emoji: "🦋" },
  "Jungle_Capuchin":    { name: "Capuchin",         ecosystemId: 4, emoji: "🐒" },
  "Jungle_Crocodile":   { name: "Crocodile",        ecosystemId: 4, emoji: "🐊" },
  "Jungle_Frog":        { name: "Frog",             ecosystemId: 4, emoji: "🐸" },
  "Jungle_Macaw":       { name: "Macaw",            ecosystemId: 4, emoji: "🦜" },
  "Jungle_Panther":     { name: "Panther",          ecosystemId: 4, emoji: "🐆" },
  "Savannah_Elephant":  { name: "Elephant",         ecosystemId: 5, emoji: "🐘" },
  "Savannah_Giraffe":   { name: "Giraffe",          ecosystemId: 5, emoji: "🦒" },
  "Savannah_Lion":      { name: "Lion",             ecosystemId: 5, emoji: "🦁" },
  "Savannah_Meekat":    { name: "Meekat",           ecosystemId: 5, emoji: "🦡" },
  "Savannah_Rhinoceros":{ name: "Rhinoceros",       ecosystemId: 5, emoji: "🦏" },
  "Savannah_Warthog":   { name: "Warthog",          ecosystemId: 5, emoji: "🐗" },
  "Singapour_Pangolin": { name: "Pangolin",         ecosystemId: 2, emoji: "🦔" },
  "Singapour_Python":   { name: "Python",           ecosystemId: 2, emoji: "🐍" },
  "Singapour_Tigre":    { name: "Tiger",            ecosystemId: 2, emoji: "🐯" },
  "Singapour_Varan":    { name: "Varan",            ecosystemId: 2, emoji: "🦎" },
};

// ─── Client ranking (drawing_count.csv totals) ────────────────────────────────

export const DRAWING_COUNT_TOTALS: Record<string, number> = {
  "51": 25969, "47": 18855, "14": 8957, "55": 8170, "56": 1405,
  "43": 986, "25": 935, "61": 651, "2": 424, "13": 351,
  "59": 340, "58": 226, "60": 110, "63": 37,
  "38": 7, "48": 7, "10": 1, "57": 1,
};

export const GLOBAL_TOTAL_DRAWINGS = Object.values(DRAWING_COUNT_TOTALS).reduce((a, b) => a + b, 0);
// = 67,651

// ─── Global aggregations (from WebDrawing.csv) ────────────────────────────────

export const GLOBAL_BY_ECOSYSTEM: Record<string, number> = {
  "Corals": 453,
  "Récifs Côtiers": 75,
  "Océans du Monde": 67,
  "Forêt Européenne": 36,
  "La Jungle Tropicale": 35,
  "Forêt Asie-Australie": 31,
  "La Savane": 26,
  "Alice In Bloomland": 15,
};

export const GLOBAL_BY_ANIMAL: [string, number][] = [
  ["Corals_Clam", 119], ["Corals_Clownfish", 104], ["Corals_Cowfish", 96],
  ["Corals_Jelly", 51], ["Corals_Shark", 45], ["Corals_Torch Coral", 38],
  ["Aqua_Clownfish", 24], ["Calanques_Circaète jean le Blanc", 24],
  ["Calanques_Goéland", 14], ["Aqua_Crab", 14], ["Aqua_Jellyfish", 12],
  ["Aqua_Turtle", 12],
];

export const GLOBAL_BY_HOUR: Record<string, number> = {
  "01": 1, "05": 1, "06": 8, "07": 10, "08": 18, "09": 65,
  "10": 3, "11": 78, "12": 21, "13": 59, "14": 164, "15": 79,
  "16": 52, "17": 51, "18": 11, "19": 94, "20": 4, "21": 10,
  "22": 2, "23": 7,
};

// Source: drawing_count.csv — all clients aggregated by date (265 dates, total 67,651)
export const GLOBAL_TIMELINE: { date: string; count: number }[] = [
  {"date":"2025-07-29","count":3},{"date":"2025-07-30","count":2},{"date":"2025-07-31","count":79},
  {"date":"2025-08-01","count":2},{"date":"2025-08-02","count":16},{"date":"2025-08-03","count":30},
  {"date":"2025-08-04","count":183},{"date":"2025-08-05","count":604},{"date":"2025-08-06","count":462},
  {"date":"2025-08-07","count":492},{"date":"2025-08-08","count":496},{"date":"2025-08-09","count":566},
  {"date":"2025-08-10","count":9},{"date":"2025-08-11","count":528},{"date":"2025-08-12","count":453},
  {"date":"2025-08-13","count":216},{"date":"2025-08-14","count":270},{"date":"2025-08-15","count":305},
  {"date":"2025-08-16","count":117},{"date":"2025-08-17","count":296},{"date":"2025-08-18","count":194},
  {"date":"2025-08-19","count":216},{"date":"2025-08-20","count":339},{"date":"2025-08-21","count":461},
  {"date":"2025-08-22","count":276},{"date":"2025-08-23","count":349},{"date":"2025-08-24","count":416},
  {"date":"2025-08-25","count":237},{"date":"2025-08-26","count":305},{"date":"2025-08-27","count":491},
  {"date":"2025-08-28","count":268},{"date":"2025-08-29","count":271},{"date":"2025-08-30","count":284},
  {"date":"2025-08-31","count":480},{"date":"2025-09-01","count":220},{"date":"2025-09-02","count":251},
  {"date":"2025-09-03","count":190},{"date":"2025-09-04","count":328},{"date":"2025-09-05","count":483},
  {"date":"2025-09-06","count":420},{"date":"2025-09-07","count":349},{"date":"2025-09-08","count":484},
  {"date":"2025-09-09","count":225},{"date":"2025-09-10","count":41},{"date":"2025-09-11","count":23},
  {"date":"2025-09-12","count":38},{"date":"2025-09-13","count":99},{"date":"2025-09-14","count":108},
  {"date":"2025-09-16","count":85},{"date":"2025-09-17","count":48},{"date":"2025-09-18","count":45},
  {"date":"2025-09-19","count":106},{"date":"2025-09-20","count":103},{"date":"2025-09-21","count":185},
  {"date":"2025-09-22","count":166},{"date":"2025-09-23","count":145},{"date":"2025-09-24","count":302},
  {"date":"2025-09-25","count":243},{"date":"2025-09-26","count":442},{"date":"2025-09-27","count":418},
  {"date":"2025-09-28","count":491},{"date":"2025-09-29","count":342},{"date":"2025-09-30","count":224},
  {"date":"2025-10-01","count":353},{"date":"2025-10-02","count":421},{"date":"2025-10-03","count":46},
  {"date":"2025-10-04","count":179},{"date":"2025-10-05","count":136},{"date":"2025-10-06","count":32},
  {"date":"2025-10-07","count":403},{"date":"2025-10-08","count":501},{"date":"2025-10-09","count":457},
  {"date":"2025-10-10","count":598},{"date":"2025-10-11","count":679},{"date":"2025-10-12","count":699},
  {"date":"2025-10-13","count":360},{"date":"2025-10-14","count":405},{"date":"2025-10-15","count":228},
  {"date":"2025-10-16","count":444},{"date":"2025-10-17","count":847},{"date":"2025-10-18","count":829},
  {"date":"2025-10-19","count":484},{"date":"2025-10-20","count":271},{"date":"2025-10-21","count":609},
  {"date":"2025-10-22","count":243},{"date":"2025-10-23","count":196},{"date":"2025-10-24","count":881},
  {"date":"2025-10-25","count":232},{"date":"2025-10-26","count":251},{"date":"2025-10-27","count":142},
  {"date":"2025-10-28","count":738},{"date":"2025-10-29","count":390},{"date":"2025-10-30","count":533},
  {"date":"2025-10-31","count":429},{"date":"2025-11-01","count":276},{"date":"2025-11-02","count":173},
  {"date":"2025-11-04","count":10},{"date":"2025-11-05","count":38},{"date":"2025-11-06","count":37},
  {"date":"2025-11-07","count":190},{"date":"2025-11-08","count":236},{"date":"2025-11-09","count":495},
  {"date":"2025-11-10","count":61},{"date":"2025-11-11","count":140},{"date":"2025-11-12","count":529},
  {"date":"2025-11-13","count":480},{"date":"2025-11-14","count":349},{"date":"2025-11-15","count":270},
  {"date":"2025-11-16","count":261},{"date":"2025-11-17","count":60},{"date":"2025-11-18","count":68},
  {"date":"2025-11-19","count":211},{"date":"2025-11-20","count":219},{"date":"2025-11-21","count":225},
  {"date":"2025-11-22","count":185},{"date":"2025-11-23","count":270},{"date":"2025-11-24","count":57},
  {"date":"2025-11-25","count":111},{"date":"2025-11-26","count":219},{"date":"2025-11-27","count":346},
  {"date":"2025-11-28","count":323},{"date":"2025-11-29","count":150},{"date":"2025-11-30","count":253},
  {"date":"2025-12-01","count":54},{"date":"2025-12-02","count":94},{"date":"2025-12-03","count":118},
  {"date":"2025-12-04","count":358},{"date":"2025-12-05","count":137},{"date":"2025-12-06","count":141},
  {"date":"2025-12-07","count":129},{"date":"2025-12-08","count":59},{"date":"2025-12-09","count":74},
  {"date":"2025-12-10","count":131},{"date":"2025-12-11","count":274},{"date":"2025-12-12","count":246},
  {"date":"2025-12-13","count":404},{"date":"2025-12-14","count":239},{"date":"2025-12-15","count":67},
  {"date":"2025-12-16","count":184},{"date":"2025-12-17","count":232},{"date":"2025-12-18","count":194},
  {"date":"2025-12-19","count":311},{"date":"2025-12-20","count":510},{"date":"2025-12-21","count":341},
  {"date":"2025-12-22","count":535},{"date":"2025-12-23","count":370},{"date":"2025-12-24","count":44},
  {"date":"2025-12-25","count":106},{"date":"2025-12-26","count":378},{"date":"2025-12-27","count":396},
  {"date":"2025-12-28","count":372},{"date":"2025-12-29","count":210},{"date":"2025-12-30","count":307},
  {"date":"2025-12-31","count":512},{"date":"2026-01-01","count":467},{"date":"2026-01-02","count":1304},
  {"date":"2026-01-03","count":980},{"date":"2026-01-04","count":590},{"date":"2026-01-05","count":433},
  {"date":"2026-01-06","count":523},{"date":"2026-01-07","count":365},{"date":"2026-01-08","count":301},
  {"date":"2026-01-09","count":373},{"date":"2026-01-10","count":311},{"date":"2026-01-11","count":206},
  {"date":"2026-01-12","count":38},{"date":"2026-01-13","count":117},{"date":"2026-01-14","count":122},
  {"date":"2026-01-15","count":257},{"date":"2026-01-16","count":220},{"date":"2026-01-17","count":429},
  {"date":"2026-01-18","count":242},{"date":"2026-01-19","count":103},{"date":"2026-01-20","count":56},
  {"date":"2026-01-21","count":52},{"date":"2026-01-22","count":175},{"date":"2026-01-23","count":109},
  {"date":"2026-01-24","count":395},{"date":"2026-01-25","count":213},{"date":"2026-01-26","count":57},
  {"date":"2026-01-27","count":74},{"date":"2026-01-28","count":99},{"date":"2026-01-29","count":311},
  {"date":"2026-01-30","count":210},{"date":"2026-01-31","count":292},{"date":"2026-02-01","count":285},
  {"date":"2026-02-02","count":23},{"date":"2026-02-03","count":37},{"date":"2026-02-04","count":208},
  {"date":"2026-02-05","count":63},{"date":"2026-02-06","count":163},{"date":"2026-02-07","count":216},
  {"date":"2026-02-08","count":408},{"date":"2026-02-09","count":278},{"date":"2026-02-10","count":236},
  {"date":"2026-02-11","count":457},{"date":"2026-02-12","count":489},{"date":"2026-02-13","count":692},
  {"date":"2026-02-14","count":427},{"date":"2026-02-15","count":578},{"date":"2026-02-16","count":226},
  {"date":"2026-02-17","count":226},{"date":"2026-02-18","count":333},{"date":"2026-02-19","count":420},
  {"date":"2026-02-20","count":595},{"date":"2026-02-21","count":777},{"date":"2026-02-22","count":519},
  {"date":"2026-02-23","count":305},{"date":"2026-02-24","count":336},{"date":"2026-02-25","count":557},
  {"date":"2026-02-26","count":405},{"date":"2026-02-27","count":439},{"date":"2026-02-28","count":362},
  {"date":"2026-03-01","count":518},{"date":"2026-03-02","count":154},{"date":"2026-03-03","count":130},
  {"date":"2026-03-04","count":164},{"date":"2026-03-05","count":142},{"date":"2026-03-06","count":190},
  {"date":"2026-03-07","count":395},{"date":"2026-03-08","count":327},{"date":"2026-03-09","count":101},
  {"date":"2026-03-10","count":184},{"date":"2026-03-11","count":94},{"date":"2026-03-12","count":313},
  {"date":"2026-03-13","count":85},{"date":"2026-03-14","count":304},{"date":"2026-03-15","count":206},
  {"date":"2026-03-16","count":53},{"date":"2026-03-17","count":19},{"date":"2026-03-19","count":17},
  {"date":"2026-03-23","count":4},{"date":"2026-03-25","count":1},{"date":"2026-03-26","count":30},
  {"date":"2026-03-30","count":65},{"date":"2026-04-01","count":39},{"date":"2026-04-02","count":62},
  {"date":"2026-04-07","count":12},{"date":"2026-04-10","count":5},{"date":"2026-04-12","count":1},
  {"date":"2026-04-13","count":1},{"date":"2026-04-14","count":19},{"date":"2026-04-15","count":36},
  {"date":"2026-04-16","count":130},{"date":"2026-04-17","count":3},{"date":"2026-04-21","count":4},
  {"date":"2026-04-22","count":1},{"date":"2026-04-23","count":30},{"date":"2026-04-24","count":20},
  {"date":"2026-04-27","count":102},{"date":"2026-04-28","count":31},{"date":"2026-04-29","count":27},
  {"date":"2026-04-30","count":12},{"date":"2026-05-04","count":56},{"date":"2026-05-05","count":88},
  {"date":"2026-05-06","count":214},{"date":"2026-05-07","count":348},{"date":"2026-05-08","count":18},
  {"date":"2026-05-09","count":5},{"date":"2026-05-10","count":9},{"date":"2026-05-11","count":15},
  {"date":"2026-05-12","count":16},{"date":"2026-05-13","count":157},{"date":"2026-05-14","count":98},
  {"date":"2026-05-15","count":7},
];

export const GLOBAL_AVG_COMPLETION_SEC = 53;
export const GLOBAL_SHARED_DRAWINGS = 333;
export const GLOBAL_WEB_DRAWINGS = 738;

// ─── Global shared analytics (shared_drawing.csv — users 2, 59, 60, 61) ─────

export const GLOBAL_TOP_SHARED_ANIMALS: [string, number][] = [
  ["Corals_Cowfish", 72], ["Corals_Clownfish", 65], ["Corals_Clam", 44],
  ["Corals_Shark", 38], ["Corals_Jelly", 35], ["Aqua_Clownfish", 13],
  ["Corals_Torch Coral", 25], ["Calanques_Circaète jean le Blanc", 2],
  ["Aqua_Turtle", 2], ["Europe_Owl", 2],
];

// ─── Global session data (WebVisitorSession.csv — users 61, 62) ──────────────

export const GLOBAL_SESSIONS = 14; // total sessions across all clients

// ─── Per-client detailed data (clients with WebDrawing records) ───────────────

export type ClientDetail = {
  id: string;
  name: string;
  webDrawings: number;       // WebDrawing.csv count
  totalDrawings: number;     // drawing_count.csv total
  sharedDrawings: number;    // shared_drawing.csv count
  avgCompletionSec: number | null; // WebDrawing.csv (consumedAt - createdAt)
  byEcosystem: Record<string, number>;    // WebDrawing.csv
  topAnimals: [string, number][];         // WebDrawing.csv
  byHour: Record<string, number>;         // WebDrawing.csv
  timeline: { date: string; count: number }[]; // drawing_count.csv
  // shared_drawing.csv detail
  topSharedAnimals?: [string, number][];
  sharedByEcosystem?: Record<string, number>;
  sharedTimeline?: { date: string; count: number }[];
  // WebVisitorSession.csv
  sessionCount?: number;
  avgDrawingsPerSession?: number;
};

export const CLIENT_DETAILS: Record<string, ClientDetail> = {
  // Timelines use drawing_count.csv (authoritative daily totals, consistent with totalDrawings).
  // byEcosystem / topAnimals / byHour / avgCompletionSec use WebDrawing.csv (per-drawing detail).
  "2": {
    id: "2", name: "UserOctarina",
    webDrawings: 7, totalDrawings: 424, sharedDrawings: 25, avgCompletionSec: 1,
    byEcosystem: { "Corals": 6, "Océans du Monde": 1 },
    topAnimals: [["Corals_Cowfish",2],["Aqua_Seahorse",1],["Corals_Clownfish",1],["Corals_Jelly",1],["Corals_Clam",1],["Corals_Torch Coral",1]],
    byHour: { "09": 6, "15": 1 },
    topSharedAnimals: [["Aqua_Clownfish",10],["Aqua_Turtle",2],["Singapour_Varan",2],["Corals_Clownfish",1],["Aqua_Jellyfish",1],["Aqua_Seahorse",1],["Corals_Shark",1],["Europe_Owl",1]],
    sharedByEcosystem: { "Aqua":16, "Asie":4, "Corals":2, "Jungle":2, "Europe":1 },
    sharedTimeline: [{"date":"2026-04-15","count":11},{"date":"2026-04-16","count":7},{"date":"2026-04-17","count":1},{"date":"2026-04-22","count":1},{"date":"2026-04-24","count":3},{"date":"2026-04-27","count":2}],
    timeline: [
      {"date":"2025-07-29","count":3},{"date":"2025-07-30","count":2},{"date":"2025-08-01","count":2},
      {"date":"2025-09-23","count":1},{"date":"2025-09-24","count":1},{"date":"2025-10-03","count":5},
      {"date":"2025-10-06","count":5},{"date":"2025-11-04","count":3},{"date":"2025-11-10","count":4},
      {"date":"2025-11-12","count":2},{"date":"2025-11-18","count":1},{"date":"2025-11-20","count":2},
      {"date":"2025-11-24","count":9},{"date":"2025-11-26","count":1},{"date":"2025-12-01","count":2},
      {"date":"2025-12-08","count":10},{"date":"2025-12-09","count":14},{"date":"2025-12-18","count":3},
      {"date":"2026-01-20","count":1},{"date":"2026-01-21","count":1},{"date":"2026-01-22","count":3},
      {"date":"2026-02-05","count":1},{"date":"2026-02-10","count":4},{"date":"2026-02-24","count":1},
      {"date":"2026-03-02","count":1},{"date":"2026-03-19","count":17},{"date":"2026-03-26","count":24},
      {"date":"2026-03-30","count":44},{"date":"2026-04-01","count":1},{"date":"2026-04-02","count":36},
      {"date":"2026-04-10","count":5},{"date":"2026-04-13","count":1},{"date":"2026-04-14","count":19},
      {"date":"2026-04-15","count":26},{"date":"2026-04-16","count":26},{"date":"2026-04-17","count":3},
      {"date":"2026-04-22","count":1},{"date":"2026-04-24","count":20},{"date":"2026-04-27","count":24},
      {"date":"2026-04-29","count":27},{"date":"2026-04-30","count":12},{"date":"2026-05-04","count":33},
      {"date":"2026-05-05","count":8},{"date":"2026-05-06","count":8},{"date":"2026-05-07","count":3},
      {"date":"2026-05-11","count":4},
    ],
  },
  "59": {
    id: "59", name: "Demo Octarina",
    webDrawings: 173, totalDrawings: 340, sharedDrawings: 81, avgCompletionSec: 20,
    byEcosystem: { "Corals": 168, "Forêt Européenne": 5 },
    topAnimals: [["Corals_Clam",41],["Corals_Clownfish",37],["Corals_Cowfish",36],["Corals_Jelly",26],["Corals_Shark",16],["Corals_Torch Coral",12]],
    byHour: { "07":4, "09":18, "10":1, "11":59, "12":2, "13":1, "14":27, "15":47, "16":4, "17":10 },
    topSharedAnimals: [["Corals_Cowfish",26],["Corals_Clownfish",20],["Corals_Shark",12],["Corals_Clam",10],["Corals_Jelly",7],["Corals_Torch Coral",5],["Europe_Owl",1]],
    sharedByEcosystem: { "Corals":80, "Europe":1 },
    sharedTimeline: [{"date":"2026-05-05","count":9},{"date":"2026-05-06","count":16},{"date":"2026-05-07","count":53},{"date":"2026-05-13","count":3}],
    timeline: [
      {"date":"2026-03-23","count":3},{"date":"2026-05-05","count":12},{"date":"2026-05-06","count":131},
      {"date":"2026-05-07","count":189},{"date":"2026-05-13","count":4},{"date":"2026-05-15","count":1},
    ],
  },
  "60": {
    id: "60", name: "Maritime Aquarium",
    webDrawings: 43, totalDrawings: 110, sharedDrawings: 44, avgCompletionSec: 111,
    byEcosystem: { "Océans du Monde":27, "Corals":5, "Récifs Côtiers":2, "Forêt Asie-Australie":4, "Forêt Européenne":2, "Alice In Bloomland":3 },
    topAnimals: [["Aqua_Clownfish",6],["Aqua_Crab",6],["Aqua_Jellyfish",4],["Aqua_Turtle",4],["Aqua_Moray",4],["Aqua_Seahorse",3]],
    byHour: { "09":3, "10":2, "13":2, "14":26, "15":5, "17":5 },
    topSharedAnimals: [["Corals_Torch Coral",4],["Corals_Jelly",4],["Corals_Clownfish",3],["Aqua_Clownfish",3],["Aqua_Jellyfish",2],["Asia_Panda",2],["Calanques_Poulpe",2],["Calanques_Circaète jean le Blanc",2]],
    sharedByEcosystem: { "Corals":17, "Aqua":8, "Calanques":7, "Jungle":5, "Asie":4, "Europe":2, "Savanne":1 },
    sharedTimeline: [{"date":"2026-04-23","count":3},{"date":"2026-04-27","count":1},{"date":"2026-04-28","count":23},{"date":"2026-05-04","count":6},{"date":"2026-05-07","count":11}],
    timeline: [
      {"date":"2026-03-23","count":1},{"date":"2026-03-25","count":1},{"date":"2026-03-26","count":6},
      {"date":"2026-03-30","count":21},{"date":"2026-04-01","count":8},{"date":"2026-04-23","count":3},
      {"date":"2026-04-27","count":3},{"date":"2026-04-28","count":31},{"date":"2026-05-04","count":6},
      {"date":"2026-05-07","count":30},
    ],
  },
  "61": {
    id: "61", name: "Ripley's Aquarium",
    webDrawings: 335, totalDrawings: 651, sharedDrawings: 183, avgCompletionSec: 70,
    byEcosystem: { "Corals":268, "Océans du Monde":28, "Récifs Côtiers":6, "Forêt Asie-Australie":9, "La Jungle Tropicale":6, "La Savane":6, "Alice In Bloomland":6, "Forêt Européenne":6 },
    topAnimals: [["Corals_Clam",75],["Corals_Clownfish",61],["Corals_Cowfish",55],["Corals_Shark",29],["Corals_Torch Coral",25],["Corals_Jelly",23]],
    byHour: { "01":1, "08":9, "11":3, "12":18, "13":2, "14":89, "15":22, "16":34, "17":36, "18":11, "19":89, "20":2, "21":10, "22":2, "23":7 },
    topSharedAnimals: [["Corals_Cowfish",46],["Corals_Clownfish",41],["Corals_Clam",33],["Corals_Shark",24],["Corals_Jelly",23],["Corals_Torch Coral",16]],
    sharedByEcosystem: { "Corals":183 },
    sharedTimeline: [{"date":"2026-05-04","count":15},{"date":"2026-05-05","count":29},{"date":"2026-05-06","count":38},{"date":"2026-05-07","count":18},{"date":"2026-05-13","count":34},{"date":"2026-05-14","count":49}],
    sessionCount: 8,
    avgDrawingsPerSession: 1.4,
    timeline: [
      {"date":"2026-04-01","count":2},{"date":"2026-04-27","count":67},{"date":"2026-05-04","count":17},
      {"date":"2026-05-05","count":68},{"date":"2026-05-06","count":75},{"date":"2026-05-07","count":112},
      {"date":"2026-05-08","count":18},{"date":"2026-05-09","count":5},{"date":"2026-05-10","count":9},
      {"date":"2026-05-11","count":11},{"date":"2026-05-12","count":16},{"date":"2026-05-13","count":153},
      {"date":"2026-05-14","count":98},
    ],
  },
  "63": {
    id: "63", name: "TestCam",
    webDrawings: 36, totalDrawings: 37, sharedDrawings: 0, avgCompletionSec: 73,
    byEcosystem: { "La Jungle Tropicale":17, "La Savane":11, "Récifs Côtiers":8 },
    topAnimals: [["Jungle_Butterfly",5],["Jungle_Panther",4],["Savannah_Elephant",4],["Savannah_Lion",3],["Jungle_Capuchin",3],["Jungle_Crocodile",2]],
    byHour: { "08":7, "09":24, "13":5 },
    timeline: [{"date":"2026-04-16","count":37}],
  },
};

// ─── Client ranking (all clients sorted by total drawings) ────────────────────

const CLIENT_NAME_MAP: Record<string, string> = {
  "51": "Aéroport Marseille Provence", "47": "Bergen Aquarium",
  "14": "UNAM", "55": "El Trompo", "56": "Akumal",
  "43": "Parc Animalier d'Auvergne", "25": "Zoo de la Barben",
  "61": "Ripley's Aquarium", "2": "UserOctarina", "13": "Test",
  "59": "Demo Octarina", "58": "Parc Aïn Sebâa Casablanca",
  "60": "Maritime Aquarium", "63": "TestCam",
  "38": "Biodôme de Montréal", "48": "The Belize Zoo",
  "10": "Adrien Crespinée", "57": "TinyMDM",
};

export type ClientRankEntry = {
  id: string;
  name: string;
  totalDrawings: number;
  hasDetail: boolean;
  sharedDrawings?: number;
  avgCompletionSec?: number | null;
  webDrawings?: number;
};

export const CLIENT_RANKING: ClientRankEntry[] = Object.entries(DRAWING_COUNT_TOTALS)
  .sort((a, b) => b[1] - a[1])
  .map(([id, total]) => ({
    id,
    name: CLIENT_NAME_MAP[id] ?? `Client #${id}`,
    totalDrawings: total,
    hasDetail: id in CLIENT_DETAILS,
    sharedDrawings: CLIENT_DETAILS[id]?.sharedDrawings,
    avgCompletionSec: CLIENT_DETAILS[id]?.avgCompletionSec,
    webDrawings: CLIENT_DETAILS[id]?.webDrawings,
  }));

// ─── Helper to get client info from RAW_CLIENTS by id ─────────────────────────

export function getClientById(id: string) {
  return RAW_CLIENTS.find((c) => String(c.id) === id) ?? null;
}

// ─── Format completion time ────────────────────────────────────────────────────

export function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}
