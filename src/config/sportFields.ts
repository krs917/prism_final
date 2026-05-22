// Sport-specific stat field configuration
// Each sport defines position options and stat fields per position

export type SportType =
  | "Football"
  | "Basketball"
  | "Baseball"
  | "Softball"
  | "Soccer"
  | "Swimming"
  | "Track & Field"
  | "Cross Country"
  | "Lacrosse"
  | "Wrestling"
  | "Volleyball"
  | "Tennis"
  | "Golf"
  | "Other";

export const ALL_SPORTS: SportType[] = [
  "Football",
  "Basketball",
  "Baseball",
  "Softball",
  "Soccer",
  "Swimming",
  "Track & Field",
  "Cross Country",
  "Lacrosse",
  "Wrestling",
  "Volleyball",
  "Tennis",
  "Golf",
  "Other",
];

export interface StatFieldDef {
  key: string;
  label: string;
  placeholder?: string;
}

export interface PositionOption {
  value: string;
  label: string;
}

export interface SportConfig {
  positions?: PositionOption[];
  positionLabel?: string; // e.g. "Position", "Role"
  /** Fields shown for ALL positions (or if no positions) */
  commonFields: StatFieldDef[];
  /** Fields per position value */
  positionFields?: Record<string, StatFieldDef[]>;
}

const football: SportConfig = {
  positionLabel: "Position Group",
  positions: [
    { value: "QB", label: "Quarterback (QB)" },
    { value: "RB", label: "Running Back (RB)" },
    { value: "WR", label: "Wide Receiver (WR)" },
    { value: "TE", label: "Tight End (TE)" },
    { value: "OL", label: "Offensive Line (OL)" },
    { value: "DEF", label: "Defense (DL/LB/DB)" },
    { value: "K", label: "Kicker/Punter" },
  ],
  commonFields: [
    { key: "fortyYard", label: "40-Yard Dash", placeholder: "4.5s" },
  ],
  positionFields: {
    QB: [
      { key: "passingYards", label: "Passing Yards", placeholder: "2,500" },
      { key: "passingTDs", label: "Passing TDs", placeholder: "25" },
      { key: "completionPct", label: "Completion %", placeholder: "65%" },
    ],
    RB: [
      { key: "rushingYards", label: "Rushing Yards", placeholder: "1,200" },
      { key: "receivingYards", label: "Receiving Yards", placeholder: "300" },
      { key: "totalTDs", label: "Total TDs", placeholder: "15" },
    ],
    WR: [
      { key: "receivingYards", label: "Receiving Yards", placeholder: "900" },
      { key: "rushingYards", label: "Rushing Yards", placeholder: "50" },
      { key: "totalTDs", label: "Total TDs", placeholder: "10" },
    ],
    TE: [
      { key: "receivingYards", label: "Receiving Yards", placeholder: "500" },
      { key: "totalTDs", label: "Total TDs", placeholder: "6" },
    ],
    OL: [
      { key: "pancakeBlocks", label: "Pancake Blocks", placeholder: "30" },
    ],
    DEF: [
      { key: "tackles", label: "Tackles", placeholder: "85" },
      { key: "sacks", label: "Sacks", placeholder: "8" },
      { key: "interceptions", label: "Interceptions", placeholder: "3" },
    ],
    K: [
      { key: "fgPct", label: "FG %", placeholder: "80%" },
      { key: "longFG", label: "Longest FG", placeholder: "48 yds" },
    ],
  },
};

const basketball: SportConfig = {
  commonFields: [
    { key: "ppg", label: "Points Per Game", placeholder: "15.2" },
    { key: "rpg", label: "Rebounds Per Game", placeholder: "5.1" },
    { key: "apg", label: "Assists Per Game", placeholder: "4.3" },
    { key: "fgPct", label: "Field Goal %", placeholder: "48%" },
    { key: "threePtPct", label: "3-Point %", placeholder: "36%" },
    { key: "ftPct", label: "Free Throw %", placeholder: "82%" },
    { key: "verticalJump", label: "Vertical Jump", placeholder: '32"' },
  ],
};

const baseballSoftball: SportConfig = {
  positionLabel: "Role",
  positions: [
    { value: "pitcher", label: "Pitcher" },
    { value: "position", label: "Position Player" },
  ],
  commonFields: [
    { key: "sixtyYard", label: "60-Yard Dash", placeholder: "7.0s" },
  ],
  positionFields: {
    pitcher: [
      { key: "era", label: "ERA", placeholder: "2.50" },
      { key: "strikeouts", label: "Strikeouts", placeholder: "85" },
      { key: "inningsPitched", label: "Innings Pitched", placeholder: "65" },
      { key: "fastballVelo", label: "Fastball Velocity", placeholder: "88 mph" },
    ],
    position: [
      { key: "battingAvg", label: "Batting Average", placeholder: ".350" },
      { key: "homeRuns", label: "Home Runs", placeholder: "8" },
      { key: "rbis", label: "RBIs", placeholder: "45" },
      { key: "obp", label: "On-Base %", placeholder: ".420" },
      { key: "fieldingPct", label: "Fielding %", placeholder: ".975" },
    ],
  },
};

const soccer: SportConfig = {
  positionLabel: "Role",
  positions: [
    { value: "goalkeeper", label: "Goalkeeper" },
    { value: "field", label: "Field Player" },
  ],
  commonFields: [
    { key: "clubTeam", label: "Club/Travel Team", placeholder: "FC United Academy" },
  ],
  positionFields: {
    goalkeeper: [
      { key: "gaa", label: "Goals Against Average", placeholder: "0.85" },
      { key: "savePct", label: "Save %", placeholder: "82%" },
    ],
    field: [
      { key: "goals", label: "Goals", placeholder: "15" },
      { key: "assists", label: "Assists", placeholder: "8" },
      { key: "gamesPlayed", label: "Games Played", placeholder: "22" },
    ],
  },
};

const swimming: SportConfig = {
  commonFields: [
    { key: "primaryEvents", label: "Primary Event(s)", placeholder: "100m Freestyle, 200m IM" },
    { key: "bestTimes", label: "Best Time(s)", placeholder: "50.2s (100 Free), 2:05.3 (200 IM)" },
    { key: "ranking", label: "State/Regional Ranking", placeholder: "3rd in State" },
    { key: "qualifyingCuts", label: "Qualifying Cuts Achieved", placeholder: "State A-cut, Sectional" },
  ],
};

const trackField: SportConfig = {
  commonFields: [
    { key: "primaryEvents", label: "Primary Event(s)", placeholder: "800m, 1600m" },
    { key: "personalRecord", label: "Personal Record (PR)", placeholder: "1:58.3 (800m)" },
    { key: "seasonBest", label: "Season Best", placeholder: "2:00.1 (800m)" },
    { key: "stateQualifier", label: "State Qualifier", placeholder: "Yes / No" },
  ],
};

const lacrosse: SportConfig = {
  positionLabel: "Position",
  positions: [
    { value: "attack", label: "Attack" },
    { value: "midfield", label: "Midfield" },
    { value: "defense", label: "Defense" },
    { value: "goalie", label: "Goalie" },
  ],
  commonFields: [],
  positionFields: {
    attack: [
      { key: "goals", label: "Goals", placeholder: "35" },
      { key: "assists", label: "Assists", placeholder: "20" },
      { key: "groundBalls", label: "Ground Balls", placeholder: "40" },
      { key: "drawControls", label: "Draw Controls (Women's)", placeholder: "25" },
    ],
    midfield: [
      { key: "goals", label: "Goals", placeholder: "20" },
      { key: "assists", label: "Assists", placeholder: "15" },
      { key: "groundBalls", label: "Ground Balls", placeholder: "55" },
      { key: "drawControls", label: "Draw Controls (Women's)", placeholder: "20" },
    ],
    defense: [
      { key: "groundBalls", label: "Ground Balls", placeholder: "60" },
      { key: "causedTurnovers", label: "Caused Turnovers", placeholder: "25" },
    ],
    goalie: [
      { key: "savePct", label: "Save %", placeholder: "60%" },
      { key: "goalsAgainst", label: "Goals Against Avg", placeholder: "7.5" },
    ],
  },
};

const wrestling: SportConfig = {
  commonFields: [
    { key: "weightClass", label: "Weight Class", placeholder: "152 lbs" },
    { key: "record", label: "Win/Loss Record", placeholder: "32-5" },
    { key: "pins", label: "Pins", placeholder: "18" },
    { key: "tournamentResults", label: "Tournament Placements", placeholder: "1st District, 3rd Regional" },
    { key: "stateQualifier", label: "State Qualifier", placeholder: "Yes / No" },
  ],
};

const volleyball: SportConfig = {
  positionLabel: "Position",
  positions: [
    { value: "setter", label: "Setter" },
    { value: "hitter", label: "Hitter/Outside" },
    { value: "middle", label: "Middle Blocker" },
    { value: "libero", label: "Libero/DS" },
  ],
  commonFields: [
    { key: "aces", label: "Aces", placeholder: "45" },
    { key: "verticalJump", label: "Vertical Jump", placeholder: '28"' },
  ],
  positionFields: {
    setter: [
      { key: "assists", label: "Assists", placeholder: "600" },
    ],
    hitter: [
      { key: "kills", label: "Kills", placeholder: "250" },
      { key: "killPct", label: "Kill %", placeholder: ".320" },
    ],
    middle: [
      { key: "kills", label: "Kills", placeholder: "150" },
      { key: "blocks", label: "Blocks", placeholder: "80" },
    ],
    libero: [
      { key: "digs", label: "Digs", placeholder: "400" },
    ],
  },
};

const tennis: SportConfig = {
  commonFields: [
    { key: "singlesRecord", label: "Singles Record", placeholder: "15-3" },
    { key: "doublesRecord", label: "Doubles Record", placeholder: "12-4" },
    { key: "ranking", label: "District/State Ranking", placeholder: "#5 in District" },
  ],
};

const golf: SportConfig = {
  commonFields: [
    { key: "scoringAvg", label: "Scoring Average", placeholder: "78.5" },
    { key: "bestRound", label: "Best Round", placeholder: "72" },
    { key: "tournamentResults", label: "Tournament Results", placeholder: "2nd at Regionals" },
  ],
};

const other: SportConfig = {
  commonFields: [
    { key: "custom1", label: "Stat 1", placeholder: "Label: Value" },
    { key: "custom2", label: "Stat 2", placeholder: "Label: Value" },
    { key: "custom3", label: "Stat 3", placeholder: "Label: Value" },
    { key: "custom4", label: "Stat 4", placeholder: "Label: Value" },
  ],
};

export const SPORT_CONFIGS: Record<SportType, SportConfig> = {
  Football: football,
  Basketball: basketball,
  Baseball: baseballSoftball,
  Softball: baseballSoftball,
  Soccer: soccer,
  Swimming: swimming,
  "Track & Field": trackField,
  "Cross Country": trackField,
  Lacrosse: lacrosse,
  Wrestling: wrestling,
  Volleyball: volleyball,
  Tennis: tennis,
  Golf: golf,
  Other: other,
};

/** Get all stat fields for a sport + position combo */
export function getStatFields(sport: SportType, position?: string): StatFieldDef[] {
  const config = SPORT_CONFIGS[sport];
  if (!config) return [];
  const posFields = position && config.positionFields?.[position] ? config.positionFields[position] : [];
  return [...posFields, ...config.commonFields];
}
