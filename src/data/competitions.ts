export interface LogEntry {
  id: string;
  event: string;
  main?: boolean;
  result: string;
  team: string;
  detail?: string;
  url?: string;
  rank?: { pos: number; total: number };
}

// Team results only. Rankings that change by season and individual contribution scores are intentionally omitted.
// MDN_1CH94N is the owner's main team; 0xUEMF was a one-time line-up. The hero names the main
// team's result once; ranks and the scoreboard link live in the CTF log below.
export const mainTeam = { team: 'MDN_1CH94N', result: '2nd place', event: 'NorthSec CTF', anchor: '#c-northsec' };

export const ctfLog: { year: string; entries: LogEntry[] }[] = [
  {
    year: '2026',
    entries: [
      { id: 'c-northsec', event: 'NorthSec CTF', result: '2nd place', team: 'MDN_1CH94N', main: true, detail: 'Team result with my main team.' },
      {
        id: 'c-csaw',
        event: 'CSAW CTF',
        result: 'Finals MENA · qualified',
        team: '0xUEMF',
        detail: '36th of 504 teams in the global qualification round. Finals are held at NYU Abu Dhabi.',
        url: 'https://ctftime.org/event/3355',
        rank: { pos: 36, total: 504 },
      },
      { id: 'c-htb', event: 'HTB Cyber Apocalypse', result: '66th of 6,744 teams', team: '0xUEMF', detail: '136 / 136 flags. Team result.', rank: { pos: 66, total: 6744 } },
    ],
  },
];
