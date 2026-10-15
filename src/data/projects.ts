export interface MetaRow { label: string; value: string; }

export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  approach?: string;
  outcome: string;
  tags: string[];
  meta: MetaRow[];
  url: string;
  linkLabel: string;
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
    'On a 20% held-out split of Drebin-215 (15,036 apps) the project report records about 98.7% accuracy and 0.999 ROC-AUC, with 5-fold cross-validation agreeing; re-running the training script reproduces both. It is a benchmark result for a static first pass: obfuscation and dynamic payloads can evade it, and the repository says so.',
  tags: ['Python', 'Androguard', 'scikit-learn', 'Flask'],
  meta: [
    { label: 'TYPE', value: 'Android APK' },
    { label: 'ANALYSIS', value: 'Static · manifest' },
    { label: 'TARGET', value: 'Benign / malicious' },
    { label: 'DATASET', value: 'Drebin-215 · 5,560 malware · 9,476 benign' },
  ],
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
    meta: [
      { label: 'PROTOCOL', value: 'IKEv2 / IPsec' },
      { label: 'SECURITY', value: 'FortiGate HA · active-passive' },
      { label: 'EVIDENCE', value: 'ESP captures · failover test' },
    ],
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
    meta: [
      { label: 'DETECTION', value: 'Wazuh / Elastic' },
      { label: 'MONITORING', value: 'Zabbix' },
      { label: 'SCOPE', value: 'Team project' },
    ],
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
  tags: ['Linux', 'Bash', 'Lua', 'Quickshell'],
  meta: [
    { label: 'SYSTEM', value: 'Arch / CachyOS' },
    { label: 'CHECKS', value: 'ShellCheck · CI' },
  ],
  url: 'https://github.com/Yassine-El-Ghazi/myHyprlandRice',
  linkLabel: 'myHyprlandRice',
};
