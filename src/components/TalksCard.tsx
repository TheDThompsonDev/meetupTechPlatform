import { Talk } from "../types/scheduler";
import { ClockIcon, UserIcon } from "./Icons";

interface TalkCardProps {
  talk: Talk;
  onDragStart: (talkId: string) => void;
}

const TalkCard = ({ talk, onDragStart }: TalkCardProps) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", talk.id);
    onDragStart(talk.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="talk-card p-4 mb-2 bg-white rounded-lg shadow hover:shadow-md transition-all border-l-4 border-blue-500"
    >
      <div>
        {" "}
        <h3 className="text-lg font-semibold text-blue-900">{talk.title}</h3>
      </div>
      <div className="talk-info">
        <UserIcon />
        <span>
          {" "}
          <p className="text-blue-700">{talk.speaker}</p>
        </span>
      </div>
      <div className="talk-info">
        <ClockIcon />
        <span className="text-sm text-blue-600">{talk.duration} minutes</span>
      </div>
    </div>
  );
};

export default TalkCard;
