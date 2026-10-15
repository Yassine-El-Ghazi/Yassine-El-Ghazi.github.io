export interface LogEntry {
  event: string;
  result: string;
  team: string;
  detail?: string;
  url?: string;
  rank?: { pos: number; total: number };
}

// Team results only. Rankings that change by season and individual contribution scores are intentionally omitted.
export const featuredResult = {
  event: 'CSAW’26',
  series: 'CTF Finals MENA',
  status: 'Qualified',
  global: '36 / 504',
  globalLabel: 'Global qualification scoreboard',
  team: '0xUEMF',
  url: 'https://ctftime.org/event/3355',
};

export const ctfLog: { year: string; entries: LogEntry[] }[] = [
  {
    year: '2026',
    entries: [
      {
        event: 'CSAW CTF',
        result: 'Finals MENA · qualified',
        team: '0xUEMF',
        detail: '36th of 504 teams in the global qualification round. Finals are held at NYU Abu Dhabi.',
        url: 'https://ctftime.org/event/3355',
        rank: { pos: 36, total: 504 },
      },
      { event: 'NorthSec CTF', result: '2nd place', team: 'MDN_1CH94N', detail: 'Team result.' },
      { event: 'HTB Cyber Apocalypse', result: '66th of 6,744 teams', team: '0xUEMF', detail: '136 / 136 flags. Team result.', rank: { pos: 66, total: 6744 } },
    ],
  },
];
