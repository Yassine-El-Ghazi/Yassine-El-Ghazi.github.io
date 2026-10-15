export interface Project {
  name: string;
  category: string;
  description: string;
  outcome: string;
  tags: string[];
  url: string;
  motif: 'network' | 'soc' | 'malware' | 'linux';
}

const selectedProjects: Project[] = [
  {
    name: 'FortiGate Multi-Site VPN & HA Lab',
    category: 'Network security / virtual lab',
    description: 'A two-site virtual network in EVE-NG: an IKEv2/IPsec tunnel to a dynamically addressed branch, with active-passive FortiGate high availability at headquarters.',
    outcome: 'Validated bidirectional traffic, RDP, ESP packet captures, and recovery after HA failover. Investigated a return-path routing issue and documented production-hardening gaps.',
    tags: ['FortiGate', 'EVE-NG', 'IKEv2 / IPsec', 'Wireshark'],
    url: 'https://github.com/Yassine-El-Ghazi/fortigate-multisite-vpn-ha-lab',
    motif: 'network',
  },
  {
    name: 'SecureBank SOC Lab',
    category: 'Detection & monitoring',
    description: 'A team-built SOC lab combining web-server log collection, SIEM alerts, and service monitoring with Wazuh, the Elastic Stack, and Zabbix.',
    outcome: 'Built practical experience with log analysis and alerting; wrote helper scripts for service health, investigation, and recovery checks.',
    tags: ['Wazuh', 'Elastic Stack', 'Zabbix', 'Bash'],
    url: 'https://github.com/Yassine-El-Ghazi/securebank-soc-lab',
    motif: 'soc',
  },
  {
    name: 'Android Malware Detection',
    category: 'Static analysis / machine learning',
    description: 'A Random Forest classifier using Drebin-215 static APK features, with a command-line scanner and Flask interface for results and risk indicators.',
    outcome: 'Connected feature extraction, model evaluation, and a usable scanner. Documented the limitations of static-only detection.',
    tags: ['Python', 'Random Forest', 'Flask', 'Drebin-215'],
    url: 'https://github.com/Yassine-El-Ghazi/android-malware-detection-rf',
    motif: 'malware',
  },
  {
    name: 'MyHyprlandRice',
    category: 'Linux / systems engineering',
    description: 'A reproducible Arch Linux / CachyOS desktop with automated setup, configuration management, recovery tooling, and a custom settings interface.',
    outcome: 'Engineered repeatable installation, conflict backups, state separation, and CI checks for shell scripts and configuration.',
    tags: ['Linux', 'Bash', 'Lua', 'Quickshell'],
    url: 'https://github.com/Yassine-El-Ghazi/myHyprlandRice',
    motif: 'linux',
  },
];

// Analysis leads the portfolio; network and systems work provide broader evidence.
export const projects = [selectedProjects[2], selectedProjects[0], selectedProjects[1], selectedProjects[3]];
