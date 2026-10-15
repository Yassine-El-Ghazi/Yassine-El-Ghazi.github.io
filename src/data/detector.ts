// Real numbers from android-malware-detection-rf, produced by re-running the repository's own train.py
// (fixed RANDOM_STATE, stratified 80/20 split of Drebin-215, Random Forest with 200 trees) and reading the
// fitted model. The repository's report quotes 98.74% accuracy; a re-run with a newer scikit-learn gave 98.77%.
export const confusion = { tn: 1884, fp: 12, fn: 25, tp: 1087, benign: 1896, malicious: 1112 };

export interface TopFeature { name: string; importance: number; malware: number; benign: number; }
// importance in percent; malware / benign = share of apps in each class that contain the feature, in percent.
export const topFeatures: TopFeature[] = [
  { name: 'SEND_SMS', importance: 6.6, malware: 54, benign: 6 },
  { name: 'READ_PHONE_STATE', importance: 4.8, malware: 89, benign: 48 },
  { name: 'transact', importance: 4.3, malware: 6, benign: 64 },
  { name: 'android.os.Binder', importance: 4.3, malware: 13, benign: 70 },
  { name: 'attachInterface', importance: 4.3, malware: 6, benign: 62 },
  { name: 'onServiceConnected', importance: 3.4, malware: 8, benign: 66 },
  { name: 'ServiceConnection', importance: 3.2, malware: 8, benign: 66 },
  { name: 'Ljava.lang.Class.getCanonicalName', importance: 3.1, malware: 4, benign: 50 },
  { name: 'android.telephony.SmsManager', importance: 3.1, malware: 41, benign: 6 },
  { name: 'bindService', importance: 3.0, malware: 8, benign: 66 },
  { name: 'TelephonyManager.getDeviceId', importance: 2.4, malware: 66, benign: 47 },
  { name: 'INTERNET', importance: 2.3, malware: 96, benign: 82 },
];
