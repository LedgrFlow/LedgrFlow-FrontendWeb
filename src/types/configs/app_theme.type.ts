export interface AppThemeType {
  name: string;
  theme: Theme;
}

export interface Theme {
  base: Base;
  dashboard: Dashboard;
}

export interface Base {
  background: string;
  foreground: string;
  foreground_alt: string;
  overlay: string;
  titles: string;
  subtitles: string;
  accent: string;
  border: string;
  error: Error;
  warning: Warning;
  info: Info;
  success: Success;

  typography: {
    primary: string;
    secondary: string;
    muted: string;
    placeholder: string;
    disabled: string;
  };
}

export interface Error {
  text: string;
  border: string;
  background: string;
}

export interface Warning {
  text: string;
  border: string;
  background: string;
}

export interface Info {
  text: string;
  border: string;
  background: string;
}

export interface Success {
  text: string;
  border: string;
  background: string;
}

export interface Dashboard {
  graphLine: GraphLine;
  graphPie: GraphPie;
  graphBalance: GraphBalance;
}

export interface GraphLine {
  expense: string;
  income: string;
}

export interface GraphPie {
  income: string[];
  expense: string[];
}

export interface GraphBalance {
  balance: string;
}
