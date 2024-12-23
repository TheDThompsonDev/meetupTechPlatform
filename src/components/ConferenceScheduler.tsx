"use client";

import React, { useState, useEffect } from "react";
import { Talk, TimeSlot } from "../types/scheduler";

interface Speaker {
  name: string;
}

interface Session {
  id: string;
  title: string;
  speakers: Speaker[];
  startsAt?: string;
  endsAt?: string;
  room?: string;
}

import TalkCard from "./TalksCard";
import TimeSlotCard from "./TimeSlotCard";

const ConferenceScheduler = () => {
  const [talks, setTalks] = useState<Talk[]>([
    {
      id: "talk1",
      title: "Future of TypeScript",
      speaker: "Sarah Johnson",
      duration: 25,
      track: "JavaScript",
      slotId: "",
    },

    {
      id: "break2",
      title: "break",
      speaker: "break",
      duration: 10,
      track: "any",
      slotId: "",
    },
    {
      id: "break22",
      title: "break",
      speaker: "break",
      duration: 10,
      track: "any",
      slotId: "",
    },
    {
      id: "break222",
      title: "break",
      speaker: "break",
      duration: 10,
      track: "any",
      slotId: "",
    },
    {
      id: "break2222",
      title: "break",
      speaker: "break",
      duration: 10,
      track: "any",
      slotId: "",
    },
    {
      id: "break22222",
      title: "break",
      speaker: "break",
      duration: 10,
      track: "any",
      slotId: "",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numberOfTracks, setNumberOfTracks] = useState<number>(1);
  const [trackNames, setTrackNames] = useState<string[]>(["Track 1"]);

  useEffect(() => {
    const fetchTalks = async () => {
      try {
        const response = await fetch(
          "https://sessionize.com/api/v2/d821dv0b/view/All"
        );
        const data = await response.json();
        console.log(data);
        const fetchedTalks = data.sessions.map((session: Session) => ({
          id: session.id,
          title: session.title,
          speaker: session.speakers.map((s: Speaker) => s.name).join(", "),
          duration: 25,
          track: session.room || "any",
          slotId: "",
        }));
        setTalks(fetchedTalks);
      } catch (error) {
        console.error("Error fetching talks:", error);
      }
    };

    fetchTalks();
  }, []);

  const generateTimeSlots = () => {
    const days = ["2025-09-25", "2025-09-26", "2025-09-27"];
    const startTime = 9;
    const endTime = 17;
    const slots: TimeSlot[] = [];

    days.forEach((day) => {
      trackNames.forEach((track) => {
        for (let hour = startTime; hour < endTime; hour++) {
          slots.push({
            id: `${day}-${hour}-${track}`,
            time: `${hour}:00`,
            day: day,
            track: track,
            talkIds: [],
            remainingMinutes: 60,
          });
        }
      });
    });
    return slots;
  };
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(generateTimeSlots());
  const [draggedTalkId, setDraggedTalkId] = useState<string | null>(null);

  const handleDragStart = (talkId: string) => {
    setDraggedTalkId(talkId);
  };

  const handleDrop = (slotId: string) => {
    if (!draggedTalkId) return;

    const draggedTalk = talks.find((talk) => talk.id === draggedTalkId);
    if (!draggedTalk) return;

    const targetSlotIndex = timeSlots.findIndex((slot) => slot.id === slotId);
    const targetSlot = timeSlots[targetSlotIndex];

    const existingTalks = targetSlot.talkIds
      .map((id) => talks.find((t) => t.id === id))
      .filter((t): t is Talk => t !== undefined);

    const newTotalDuration =
      existingTalks.reduce((sum, talk) => sum + talk.duration, 0) +
      draggedTalk.duration;

    const hoursNeeded = Math.ceil(newTotalDuration / 60);

    const consecutiveSlots: TimeSlot[] = [];
    for (let i = 0; i < hoursNeeded; i++) {
      const nextSlot = timeSlots.find(
        (slot) =>
          slot.track === targetSlot.track &&
          slot.day === targetSlot.day &&
          parseInt(slot.time) === parseInt(targetSlot.time) + i
      );
      if (nextSlot) {
        consecutiveSlots.push(nextSlot);
      }
    }

    if (consecutiveSlots.length === hoursNeeded) {
      const newTimeSlots = timeSlots.map((slot) => {
        if (slot.talkIds.includes(draggedTalkId)) {
          const updatedTalkIds = slot.talkIds.filter(
            (id) => id !== draggedTalkId
          );
          const remainingTalks = updatedTalkIds
            .map((id) => talks.find((t) => t.id === id))
            .filter((t): t is Talk => t !== undefined);
          const remainingDuration = remainingTalks.reduce(
            (sum, talk) => sum + talk.duration,
            0
          );

          return {
            ...slot,
            talkIds: updatedTalkIds,
            remainingMinutes: 60 - (remainingDuration % 60),
            mergedIntoId: undefined,
          };
        }

        if (slot.id === targetSlot.id) {
          return {
            ...slot,
            talkIds: [...slot.talkIds, draggedTalkId],
            remainingMinutes: 60 - (newTotalDuration % 60),
          };
        }

        if (
          hoursNeeded > 1 &&
          consecutiveSlots.slice(1).find((s) => s.id === slot.id)
        ) {
          return {
            ...slot,
            talkIds: [],
            remainingMinutes: 0,
            mergedIntoId: targetSlot.id,
          };
        }

        if (
          slot.mergedIntoId === targetSlot.id &&
          !consecutiveSlots.slice(1).find((s) => s.id === slot.id)
        ) {
          return {
            ...slot,
            mergedIntoId: undefined,
            remainingMinutes: 60,
          };
        }

        return slot;
      });

      setTimeSlots(newTimeSlots);
    }

    setDraggedTalkId(null);
  };
  const getUnscheduledTalks = () => {
    return talks.filter(
      (talk) => !timeSlots.some((slot) => slot.talkIds.includes(talk.id))
    );
  };
  const getDaySchedule = (day: string) => {
    return timeSlots.filter((slot) => slot.day === day);
  };

  const addNewTalk = () => {
    setIsModalOpen(true);
  };

  const handleAddTalk = (talkData: Omit<Talk, "id" | "slotId">) => {
    const newTalk: Talk = {
      id: `talk${talks.length + 1}`,
      ...talkData,
      slotId: "",
    };
    setTalks([...talks, newTalk]);
  };

  const AddTalkModal = ({
    onClose,
    onSubmit,
  }: {
    onClose: () => void;
    onSubmit: (talkData: Omit<Talk, "id" | "slotId">) => void;
  }) => {
    const [formData, setFormData] = useState({
      title: "",
      speaker: "",
      duration: 30,
      track: "Main Stage",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">Add New Talk</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Speaker</label>
              <input
                type="text"
                value={formData.speaker}
                onChange={(e) =>
                  setFormData({ ...formData, speaker: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 ">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: Number(e.target.value) })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Track</label>
              <select
                value={formData.track}
                onChange={(e) =>
                  setFormData({ ...formData, track: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                <option>Main Stage</option>
                <option>Technical</option>
                <option>Architecture</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add Talk
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: "1.5rem" }}>Conference Schedule Organizer</h1>

      <div className="scheduler-layout">
        <div className="sidebar">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Unscheduled Talks</h2>
            </div>
            <div className="card-content">
              <div className="card-header">
                <button
                  onClick={addNewTalk}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add Talk
                </button>
                {isModalOpen && (
                  <AddTalkModal
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddTalk}
                  />
                )}
              </div>
              <div className="mb-4 p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">
                  Track Configuration
                </h3>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-sm mb-1">
                      Number of Tracks:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={numberOfTracks || 1}
                      onChange={(e) => {
                        const num = Math.max(
                          1,
                          Math.min(10, parseInt(e.target.value) || 1)
                        );
                        setNumberOfTracks(num);
                        setTrackNames(
                          Array.from(
                            { length: num },
                            (_, i) => `Track ${i + 1}`
                          )
                        );
                        setTimeSlots(generateTimeSlots());
                      }}
                      className="border rounded px-2 py-1"
                    />
                  </div>
                </div>
              </div>
              {getUnscheduledTalks().map((talk) => (
                <TalkCard
                  key={talk.id}
                  talk={talk}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="schedule-grid flex flex-row gap-4">
          {["2025-09-25", "2025-09-26", "2025-09-27"].map((day) => (
            <div
              key={day}
              className="schedule-day card bg-white shadow-lg rounded-lg border border-blue-100 flex-1"
            >
              <div className="card-header bg-blue-600 p-4 rounded-t-lg">
                <h2 className="card-title text-white font-semibold">
                  {new Date(day).toLocaleDateString()}
                </h2>
              </div>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${numberOfTracks}, 1fr)`,
                }}
              >
                {trackNames.map((track) => (
                  <div key={track} className="track-column p-4">
                    <h3 className="font-semibold mb-2">{track}</h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateRows: "repeat(8, minmax(8rem, auto))",
                        gap: "0.5rem",
                        position: "relative",
                      }}
                    >
                      {getDaySchedule(day)
                        .filter((slot) => slot.track === track)
                        .map((slot) => (
                          <TimeSlotCard
                            key={slot.id}
                            slot={slot}
                            talks={talks}
                            onDrop={handleDrop}
                            onDragStart={handleDragStart}
                            startHour={9}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ConferenceScheduler;
