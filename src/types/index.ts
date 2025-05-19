export interface MotorSettings {
  motor1: { direction: number; speed: number };
  motor2: { direction: number; speed: number };
  motor3: { direction: number; speed: number };
  motor4: { direction: number; speed: number };
}

export interface Command {
  speed: number;
  direction: string;
}
