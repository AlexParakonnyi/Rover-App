export interface MotorSettings {
  motor1: { direction: number; speed: number }; // Передний левый
  motor2: { direction: number; speed: number }; // Задний левый
  motor3: { direction: number; speed: number }; // Передний правый
  motor4: { direction: number; speed: number }; // Задний правый
}

interface Command {
  speed: number;
  direction: string;
}

export const getMotorSettings = ({
  speed,
  direction,
}: Command): MotorSettings => {
  const motors: MotorSettings = {
    motor1: { direction: 0, speed: 0 },
    motor2: { direction: 0, speed: 0 },
    motor3: { direction: 0, speed: 0 },
    motor4: { direction: 0, speed: 0 },
  };

  const turnReduction = 0.3;

  switch (direction) {
    case "n":
      motors.motor1 = { direction: 1, speed };
      motors.motor2 = { direction: 1, speed };
      motors.motor3 = { direction: 1, speed };
      motors.motor4 = { direction: 1, speed };
      break;
    case "s":
      motors.motor1 = { direction: -1, speed };
      motors.motor2 = { direction: -1, speed };
      motors.motor3 = { direction: -1, speed };
      motors.motor4 = { direction: -1, speed };
      break;
    case "e":
      motors.motor1 = { direction: -1, speed };
      motors.motor2 = { direction: -1, speed };
      motors.motor3 = { direction: 1, speed };
      motors.motor4 = { direction: 1, speed };
      break;
    case "w":
      motors.motor1 = { direction: 1, speed };
      motors.motor2 = { direction: 1, speed };
      motors.motor3 = { direction: -1, speed };
      motors.motor4 = { direction: -1, speed };
      break;
    case "nw":
      motors.motor1 = { direction: 1, speed };
      motors.motor2 = { direction: 1, speed };
      motors.motor3 = { direction: 1, speed: speed * turnReduction };
      motors.motor4 = { direction: 1, speed: speed * turnReduction };
      break;
    case "ne":
      motors.motor1 = { direction: 1, speed: speed * turnReduction };
      motors.motor2 = { direction: 1, speed: speed * turnReduction };
      motors.motor3 = { direction: 1, speed };
      motors.motor4 = { direction: 1, speed };
      break;
    case "sw":
      motors.motor1 = { direction: -1, speed };
      motors.motor2 = { direction: -1, speed };
      motors.motor3 = { direction: -1, speed: speed * turnReduction };
      motors.motor4 = { direction: -1, speed: speed * turnReduction };
      break;
    case "se":
      motors.motor1 = { direction: -1, speed: speed * turnReduction };
      motors.motor2 = { direction: -1, speed: speed * turnReduction };
      motors.motor3 = { direction: -1, speed };
      motors.motor4 = { direction: -1, speed };
      break;
    default:
      motors.motor1 = { direction: 0, speed: 0 };
      motors.motor2 = { direction: 0, speed: 0 };
      motors.motor3 = { direction: 0, speed: 0 };
      motors.motor4 = { direction: 0, speed: 0 };
      break;
  }

  return motors;
};
