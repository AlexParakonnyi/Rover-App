interface LightningProps {
  isCharging: boolean;
}

const Lightning: React.FC<LightningProps> = ({ isCharging }) => (
  <div
    className="w-10 h-10 bg-[url('/lightning.png')] bg-no-repeat bg-center bg-cover"
    style={{ display: isCharging ? "block" : "none" }}
  />
);

export default Lightning;
