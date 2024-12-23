import React from "react";
import { TimeSlot, Talk } from "../types/scheduler";
import TalkCard from "./TalksCard";

interface TimeSlotCardProps {
  slot: TimeSlot;
  talks: Talk[];
  onDrop: (slotId: string) => void;
  onDragStart: (talkId: string) => void;
  startHour: number;
}

const TimeSlotCard = ({
  slot,
  talks,
  onDrop,
  onDragStart,
  startHour,
}: TimeSlotCardProps) => {
  if (slot.mergedIntoId) {
    return null;
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    onDrop(slot.id);
  };

  const scheduledTalks = slot.talkIds
    .map((id) => talks.find((t) => t.id === id))
    .filter((talk): talk is Talk => talk !== undefined);

  const totalDuration = scheduledTalks.reduce(
    (sum, talk) => sum + talk.duration,
    0
  );
  const hoursNeeded = Math.ceil(totalDuration / 60);
  const currentHour = parseInt(slot.time);
  const rowStart = currentHour - startHour + 1;

  const getTimeDisplay = () => {
    if (hoursNeeded <= 1) {
      return `${currentHour}:00`;
    }
    return `${currentHour}:00 - ${currentHour + hoursNeeded}:00`;
  };

  return (
    <div
      className={`time-slot p-4 rounded-lg hover:bg-blue-50 
        transition-colors border border-blue-200 
        ${scheduledTalks.length > 0 ? "bg-white" : "bg-gray-50"}`}
      style={{
        gridRow:
          hoursNeeded > 1 ? `${rowStart} / span ${hoursNeeded}` : `${rowStart}`,
        marginBottom: "0.5rem",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-sm font-medium text-blue-900 mb-2">
        {getTimeDisplay()}
      </div>

      <div className="flex flex-col gap-2">
        {scheduledTalks.map((talk) => (
          <TalkCard key={talk.id} talk={talk} onDragStart={onDragStart} />
        ))}
      </div>

      {(!scheduledTalks.length || slot.remainingMinutes > 0) && (
        <div className="text-sm text-blue-700 font-medium mt-2">
          {slot.remainingMinutes} minutes available
        </div>
      )}
    </div>
  );
};

export default TimeSlotCard;
