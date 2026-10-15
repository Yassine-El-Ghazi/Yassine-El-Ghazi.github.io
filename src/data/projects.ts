export interface MetaRow { label: string; value: string; }

export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  approach?: string;
  outcome: string;
  tags: string[];
  meta?: MetaRow[];
  url: string;
  linkLabel: string;
  table?: { title: string; source: string; head: [string, string]; rows: [string, string][] };
}

// Every statement below traces to the linked public repository (README, source, or the project's own report).
export const featured: Project = {
  id: 'android-malware-detection',
  name: 'Android Malware Detection',
  category: 'Static analysis / classification',
  description:
    'A static Android malware detector. Androguard reads an APK’s manifest, the permissions and intent actions are matched against the Drebin-215 feature vocabulary, and a Random Forest returns a benign or malicious verdict with confidence and high-risk permission flags. Ships as a CLI scanner and a Flask web app.',
  approach:
    'Five classifiers were compared on the same split; Random Forest (200 trees) was kept for its interpretable feature importances. The APK is never executed.',
  outcome:
    'The benchmark numbers come from the project report, agree with 5-fold cross-validation, and were reproduced by re-running the training script. They describe a static first pass: obfuscation and dynamic payloads can evade it, and the repository says so.',
  tags: ['Python', 'Androguard', 'scikit-learn', 'Flask'],
  meta: [{ label: 'DATASET', value: 'Drebin-215 · 5,560 malware · 9,476 benign' }],
  url: 'https://github.com/Yassine-El-Ghazi/android-malware-detection-rf',
  linkLabel: 'android-malware-detection-rf',
};

export const secondary: Project[] = [
  {
    id: 'fortigate-vpn-ha',
    name: 'FortiGate Multi-Site VPN & HA Lab',
    category: 'Network security / virtual lab',
    description:
      'A two-site virtual network in EVE-NG: an IKEv2/IPsec tunnel to a dynamically addressed branch, with active-passive FortiGate high availability at headquarters.',
    outcome:
      'Validated bidirectional traffic, RDP, ESP packet captures, and recovery after HA failover. Investigated a return-path routing issue and documented production-hardening gaps.',
    tags: ['FortiGate', 'EVE-NG', 'Wireshark'],
    table: {
      title: 'Validation log',
      source: 'lab README',
      head: ['Check', 'Result'],
      rows: [
        ['IKEv2/IPsec selector', '1/1 active on both peers'],
        ['Routing', 'Correct remote subnet routes'],
        ['ICMP', 'Bidirectional'],
        ['TCP/3389', 'Reachable'],
        ['RDP', 'Interactive session established'],
        ['Packet analysis', 'RDP on LAN, ESP on WAN'],
        ['Internet access', 'Independent from both sites'],
        ['HA failover', 'Secondary promoted, traffic recovered'],
        ['Post-failover VPN', 'Selector and route restored'],
      ],
    },
    url: 'https://github.com/Yassine-El-Ghazi/fortigate-multisite-vpn-ha-lab',
    linkLabel: 'fortigate-multisite-vpn-ha-lab',
  },
  {
    id: 'securebank-soc',
    name: 'SecureBank SOC Lab',
    category: 'Detection & monitoring · team project',
    description:
      'A team-built SOC lab combining web-server log collection, SIEM alerts, and service monitoring with Wazuh, the Elastic Stack, and Zabbix.',
    outcome:
      'Built practical experience with log analysis and alerting; wrote helper scripts for service health, investigation, and recovery checks.',
    tags: ['Wazuh', 'Elastic Stack', 'Zabbix', 'Bash'],
    table: {
      title: 'Lab roles',
      source: 'lab README',
      head: ['Host', 'Runs'],
      rows: [
        ['VM-SIEM', 'Elasticsearch, Kibana, Wazuh Manager, Filebeat, Zabbix Server'],
        ['VM-WEB', 'Apache / DVWA, Wazuh Agent, Zabbix Agent2'],
      ],
    },
    url: 'https://github.com/Yassine-El-Ghazi/securebank-soc-lab',
    linkLabel: 'securebank-soc-lab',
  },
];

export const compact: Project = {
  id: 'myhyprlandrice',
  name: 'MyHyprlandRice',
  category: 'Linux / systems engineering',
  description:
    'A reproducible Arch Linux / CachyOS desktop with automated setup, configuration management, recovery tooling, and a custom settings interface.',
  outcome:
    'Engineered repeatable installation, conflict backups, state separation, and CI checks for shell scripts and configuration.',
  tags: ['Linux', 'Bash', 'Lua', 'Quickshell', 'GNU Stow', 'ShellCheck'],
  table: {
    title: 'State model',
    source: 'repository README',
    head: ['Location', 'Role'],
    rows: [
      ['dotfiles/', 'Declarative files, linked individually with GNU Stow'],
      ['defaults/', 'First-run values copied into mutable files'],
      ['examples/', 'Safe templates for host-specific overrides'],
      ['~/.local/state/myhyprlandrice/', 'Conflict backups and reversible migration archives'],
    ],
  },
  url: 'https://github.com/Yassine-El-Ghazi/myHyprlandRice',
  linkLabel: 'myHyprlandRice',
};

export const scripts = [
  ['sb-status', 'SIEM, WEB and forwarded-port health'],
  ['sb-investigate', 'status, Zabbix checks, recent alerts, autofix logs'],
  ['sb-run', 'run commands on SIEM or WEB over SSH'],
  ['securebank-autofix.sh', 'Zabbix action script for automatic recovery'],
] as const;
