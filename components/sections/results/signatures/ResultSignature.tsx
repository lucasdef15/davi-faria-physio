import BreathingSignature from './BreathingSignature';
import EffortSignature from './EffortSignature';
import MobilitySignature from './MobilitySignature';
import RoutineSignature from './RoutineSignature';

interface ResultSignatureProps {
  index: number;
}

export default function ResultSignature({ index }: ResultSignatureProps) {
  switch (index) {
    case 0:
      return <BreathingSignature />;
    case 1:
      return <EffortSignature />;
    case 2:
      return <MobilitySignature />;
    default:
      return <RoutineSignature />;
  }
}
