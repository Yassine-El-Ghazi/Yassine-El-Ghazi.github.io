export const profile = {
  name: 'Yassine El Ghazi',
  role: 'Cybersecurity Engineering Student',
  university: 'Université Euro-Méditerranéenne de Fès',
  github: 'https://github.com/Yassine-El-Ghazi',
  linkedin: 'https://www.linkedin.com/in/yassine-elghazi',
  ctftime: 'https://ctftime.org/user/213391',
  email: 'yassine.elghazi@eidia.ueuromed.org',
  description:
    'Cybersecurity engineering student at UEMF exploring reverse engineering and malware analysis through static APK analysis, security labs, and CTFs.',
};

// Each tool is cross-referenced to the public project (or the CTF log) where it is used, as recorded in that
// repository's README, source, or requirements.
export const toolXrefs = [
  { href: '#p-android', name: 'Android Malware Detection', tools: ['Python', 'Androguard', 'scikit-learn', 'Flask', 'Static APK analysis'] },
  { href: '#p-forti', name: 'FortiGate VPN & HA Lab', tools: ['FortiGate', 'EVE-NG', 'IKEv2 / IPsec', 'Active-passive HA', 'Firewall policies', 'TCP/IP & routing', 'Wireshark'] },
  { href: '#p-soc', name: 'SecureBank SOC Lab', tools: ['Wazuh', 'Elastic Stack', 'Zabbix', 'Bash'] },
  { href: '#p-rice', name: 'MyHyprlandRice', tools: ['Linux', 'Bash', 'Lua', 'Quickshell', 'GNU Stow', 'ShellCheck'] },
  { href: '#ctf', name: 'CTF log', tools: ['Ghidra'] },
];
