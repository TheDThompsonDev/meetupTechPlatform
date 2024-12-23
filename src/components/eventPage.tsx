"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Event {
  type: string;
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  neighborhood: string;
  attendees: number;
  maxAttendees: number;
  hasRSVPd: boolean;
  tags: string[];
  image: string;
  isRecurring?: boolean;
  frequency?: string;
  price?: string;
  duration?: string;
}

const AuthEventCreation = ({ onEventCreated, onCancel }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    neighborhood: "",
    maxAttendees: "",
    tags: "",
    image: "/api/placeholder/320/256",
    isRecurring: false,
    frequency: "Monthly",
    type: "meetup",
  });

  // Effect to sync login state with localStorage
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    if (loginStatus !== isLoggedIn) {
      setIsLoggedIn(loginStatus);
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (loginData.username === "admin" && loginData.password === "password") {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      setLoginData({ username: "", password: "" }); // Clear form
    } else {
      alert("Invalid credentials! Use username: admin, password: password");
    }
  };

  const handleEventSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const newEvent = {
      id: Date.now(),
      ...eventData,
      attendees: 0,
      hasRSVPd: false,
      tags: eventData.tags.split(",").map((tag) => tag.trim()),
    };

    const existingEvents = JSON.parse(
      localStorage.getItem("localEvents") || "[]"
    );
    const updatedEvents = [...existingEvents, newEvent];
    localStorage.setItem("localEvents", JSON.stringify(updatedEvents));

    onEventCreated(updatedEvents);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <Card className="max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">
            Organizer Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Username
              </label>
              <Input
                type="text"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                className="w-full"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Password
              </label>
              <Input
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full"
                placeholder="password"
                required
              />
            </div>
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={handleLogin}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Login
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Create New Event</h2>
          <Button
            onClick={onCancel}
            variant="outline"
            className="text-blue-600"
          >
            Cancel
          </Button>
        </div>

        <form onSubmit={handleEventSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Event Type
            </label>
            <Select
              value={eventData.type}
              onValueChange={(value) =>
                setEventData({ ...eventData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meetup">Meetup</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Title
            </label>
            <Input
              value={eventData.title}
              onChange={(e) =>
                setEventData({ ...eventData, title: e.target.value })
              }
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Description
            </label>
            <Textarea
              value={eventData.description}
              onChange={(e) =>
                setEventData({ ...eventData, description: e.target.value })
              }
              className="w-full"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Date
              </label>
              <Input
                type="date"
                value={eventData.date}
                onChange={(e) =>
                  setEventData({ ...eventData, date: e.target.value })
                }
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Time
              </label>
              <Input
                type="time"
                value={eventData.time}
                onChange={(e) =>
                  setEventData({ ...eventData, time: e.target.value })
                }
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={eventData.isRecurring}
              onChange={(e) =>
                setEventData({ ...eventData, isRecurring: e.target.checked })
              }
              className="rounded border-blue-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <label className="text-sm font-medium text-blue-800">
              Recurring Event
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Create Event
          </Button>
        </form>
      </Card>
    </div>
  );
};

// const EventPage = () => {
//   const [selectedCategory, setSelectedCategory] = useState("Tech");
//   const categories = ["Tech", "Social", "Art", "Science", "Entertainment"];

//   const [meetups, setMeetups] = useState([
//     {
//       id: 1,
//       title: "Dallas JS Meetup",
//       description:
//         "Join the largest JavaScript community in Dallas for an evening of technical talks and networking.",
//       date: "2024-12-28",
//       time: "18:30",
//       location: "Common Desk - Deep Ellum",
//       neighborhood: "Deep Ellum",
//       attendees: 45,
//       maxAttendees: 80,
//       hasRSVPd: false,
//       tags: ["JavaScript", "React", "Web Development"],
//       image: "/assets/1.jpg",
//       isRecurring: true,
//       frequency: "Monthly",
//     },
//     {
//       id: 2,
//       title: "Python Developers DFW",
//       description:
//         "Monthly meetup for Python enthusiasts. Focus on data science and machine learning.",
//       date: "2024-12-29",
//       time: "19:00",
//       location: "WeWork - Uptown",
//       neighborhood: "Uptown",
//       attendees: 35,
//       maxAttendees: 60,
//       hasRSVPd: false,
//       tags: ["Python", "Data Science", "ML"],
//       image: "/assets/2.jpg",
//       isRecurring: true,
//       frequency: "Monthly",
//     },
//     {
//       id: 3,
//       title: "DFW Cloud Computing",
//       description:
//         "Learn about cloud technologies and DevOps practices. AWS and Azure focused.",
//       date: "2024-12-30",
//       time: "18:00",
//       location: "Microsoft Office",
//       neighborhood: "Las Colinas",
//       attendees: 55,
//       maxAttendees: 100,
//       hasRSVPd: false,
//       tags: ["Cloud", "AWS", "Azure"],
//       image: "/assets/3.jpg",
//       isRecurring: true,
//       frequency: "Bi-weekly",
//     },
//     {
//       id: 4,
//       title: "Blockchain DFW",
//       description:
//         "Discussions on blockchain technology, cryptocurrencies, and Web3 development.",
//       date: "2025-01-02",
//       time: "18:30",
//       location: "Capital Factory",
//       neighborhood: "Downtown",
//       attendees: 40,
//       maxAttendees: 75,
//       hasRSVPd: false,
//       tags: ["Blockchain", "Web3", "Crypto"],
//       image: "/assets/4.jpg",
//       isRecurring: true,
//       frequency: "Monthly",
//     },
//     {
//       id: 5,
//       title: "UI/UX Design Meetup",
//       description:
//         "Share design experiences, portfolio reviews, and latest UI/UX trends.",
//       date: "2025-01-03",
//       time: "19:00",
//       location: "Industrious",
//       neighborhood: "Knox/Henderson",
//       attendees: 30,
//       maxAttendees: 50,
//       hasRSVPd: false,
//       tags: ["Design", "UI/UX", "Product"],
//       image: "/assets/5.jpg",
//       isRecurring: true,
//       frequency: "Monthly",
//     },
//     {
//       id: 6,
//       title: "Mobile Dev Dallas",
//       description:
//         "Mobile app development community covering iOS, Android, and cross-platform.",
//       date: "2025-01-05",
//       time: "18:00",
//       location: "Google Office",
//       neighborhood: "Frisco",
//       attendees: 50,
//       maxAttendees: 90,
//       hasRSVPd: false,
//       tags: ["Mobile", "iOS", "Android"],
//       image: "/assets/6.jpg",
//       isRecurring: true,
//       frequency: "Monthly",
//     },
//     {
//       id: 7,
//       title: "Women in Tech DFW",
//       description: "Networking and mentorship for women in technology roles.",
//       date: "2025-01-07",
//       time: "18:30",
//       location: "The Grove",
//       neighborhood: "Downtown",
//       attendees: 65,
//       maxAttendees: 100,
//       hasRSVPd: false,
//       tags: ["WomenInTech", "Networking"],
//       image: "/assets/7.jpg",
//       isRecurring: true,
//       frequency: "Monthly",
//     },
//     {
//       id: 8,
//       title: "Data Science Exchange",
//       description:
//         "Share insights on data analysis, visualization, and machine learning projects.",
//       date: "2025-01-09",
//       time: "19:00",
//       location: "SMU Campus",
//       neighborhood: "University Park",
//       attendees: 45,
//       maxAttendees: 80,
//       hasRSVPd: false,
//       tags: ["Data", "Analytics", "ML"],
//       image: "/assets/8.jpg",
//       isRecurring: true,
//       frequency: "Monthly",
//     },
//     {
//       id: 9,
//       title: "DevOps Dallas",
//       description:
//         "Best practices in DevOps, CI/CD, and infrastructure management.",
//       date: "2025-01-10",
//       time: "18:00",
//       location: "Amazon Office",
//       neighborhood: "Plano",
//       attendees: 40,
//       maxAttendees: 70,
//       hasRSVPd: false,
//       tags: ["DevOps", "CI/CD", "Infrastructure"],
//       image: "/assets/9.jpg",
//       isRecurring: true,
//       frequency: "Monthly",
//     },
//     {
//       id: 10,
//       title: "Cybersecurity Meetup",
//       description:
//         "Discussion of security trends, threat analysis, and protection strategies.",
//       date: "2025-01-12",
//       time: "18:30",
//       location: "AT&T Discovery District",
//       neighborhood: "Downtown",
//       attendees: 55,
//       maxAttendees: 90,
//       hasRSVPd: false,
//       tags: ["Security", "Cybersecurity", "InfoSec"],
//       image: "/assets/10.jpg",
//       isRecurring: true,
//       frequency: "Monthly",
//     },
//   ]);

//   const [conferences, setConferences] = useState([
//     {
//       id: 1,
//       title: "Big D Tech Fest 2024",
//       description:
//         "The largest tech conference in North Texas. Three days of workshops and keynotes.",
//       date: "2024-12-15",
//       time: "09:00",
//       location: "Kay Bailey Hutchison Convention Center",
//       neighborhood: "Downtown Dallas",
//       attendees: 580,
//       maxAttendees: 1000,
//       hasRSVPd: false,
//       tags: ["Full Stack", "AI", "Cloud"],
//       image: "/assets/11.jpg",
//       price: "$599",
//       duration: "3 days",
//     },
//     {
//       id: 2,
//       title: "DFW Cybersecurity Summit",
//       description:
//         "Annual conference on cybersecurity featuring industry experts and workshops.",
//       date: "2025-01-20",
//       time: "08:30",
//       location: "Hyatt Regency Dallas",
//       neighborhood: "Downtown",
//       attendees: 320,
//       maxAttendees: 500,
//       hasRSVPd: false,
//       tags: ["Security", "Privacy", "InfoSec"],
//       image: "/assets/10.jpg",
//       price: "$399",
//       duration: "2 days",
//     },
//     {
//       id: 3,
//       title: "Data Science Congress",
//       description:
//         "Focus on big data, AI, and machine learning applications in industry.",
//       date: "2025-02-05",
//       time: "09:00",
//       location: "Irving Convention Center",
//       neighborhood: "Las Colinas",
//       attendees: 400,
//       maxAttendees: 600,
//       hasRSVPd: false,
//       tags: ["Data Science", "AI", "ML"],
//       image: "/assets/9.jpg",
//       price: "$499",
//       duration: "2 days",
//     },
//     {
//       id: 4,
//       title: "DevOps Days Dallas",
//       description: "Conference dedicated to DevOps methodologies and tools.",
//       date: "2025-02-15",
//       time: "09:00",
//       location: "Gaylord Texan",
//       neighborhood: "Grapevine",
//       attendees: 350,
//       maxAttendees: 500,
//       hasRSVPd: false,
//       tags: ["DevOps", "Infrastructure", "Cloud"],
//       image: "/assets/8.jpg",
//       price: "$449",
//       duration: "2 days",
//     },
//     {
//       id: 5,
//       title: "UX Design Summit",
//       description:
//         "Expert talks on user experience design and product development.",
//       date: "2025-03-01",
//       time: "09:00",
//       location: "Renaissance Dallas Hotel",
//       neighborhood: "Market Center",
//       attendees: 250,
//       maxAttendees: 400,
//       hasRSVPd: false,
//       tags: ["UX", "Design", "Product"],
//       image: "/assets/7.jpg",
//       price: "$349",
//       duration: "2 days",
//     },
//     {
//       id: 6,
//       title: "Blockchain Innovation",
//       description:
//         "Latest developments in blockchain technology and cryptocurrency.",
//       date: "2025-03-15",
//       time: "09:00",
//       location: "Sheraton Dallas",
//       neighborhood: "Downtown",
//       attendees: 300,
//       maxAttendees: 450,
//       hasRSVPd: false,
//       tags: ["Blockchain", "Crypto", "Web3"],
//       image: "/assets/6.jpg",
//       price: "$549",
//       duration: "2 days",
//     },
//     {
//       id: 7,
//       title: "Cloud Computing Expo",
//       description:
//         "Multi-cloud strategies and cloud-native development practices.",
//       date: "2025-04-01",
//       time: "09:00",
//       location: "Hilton Anatole",
//       neighborhood: "Design District",
//       attendees: 450,
//       maxAttendees: 700,
//       hasRSVPd: false,
//       tags: ["Cloud", "AWS", "Azure"],
//       image: "/assets/5.jpg",
//       price: "$499",
//       duration: "3 days",
//     },
//     {
//       id: 8,
//       title: "Mobile Dev Conference",
//       description: "Mobile development trends and cross-platform solutions.",
//       date: "2025-04-15",
//       time: "09:00",
//       location: "Westin Galleria",
//       neighborhood: "North Dallas",
//       attendees: 280,
//       maxAttendees: 400,
//       hasRSVPd: false,
//       tags: ["Mobile", "iOS", "Android"],
//       image: "/assets/4.jpg",
//       price: "$399",
//       duration: "2 days",
//     },
//     {
//       id: 9,
//       title: "API World Dallas",
//       description:
//         "Conference focused on API development and microservices architecture.",
//       date: "2025-05-01",
//       time: "09:00",
//       location: "Fairmont Dallas",
//       neighborhood: "Arts District",
//       attendees: 320,
//       maxAttendees: 500,
//       hasRSVPd: false,
//       tags: ["API", "Microservices", "Integration"],
//       image: "/assets/3.jpg",
//       price: "$449",
//       duration: "2 days",
//     },
//     {
//       id: 10,
//       title: "Testing & QA Summit",
//       description:
//         "Latest in software testing, automation, and quality assurance.",
//       date: "2025-05-15",
//       time: "09:00",
//       location: "Omni Dallas Hotel",
//       neighborhood: "Downtown",
//       attendees: 270,
//       maxAttendees: 400,
//       hasRSVPd: false,
//       tags: ["QA", "Testing", "Automation"],
//       image: "/assets/2.jpg",
//       price: "$399",
//       duration: "2 days",
//     },
//   ]);

//   const handleRSVP = (id: number, type: string) => {
//     if (type === "meetup") {
//       setMeetups(
//         meetups.map((meetup) => {
//           if (meetup.id === id) {
//             return {
//               ...meetup,
//               attendees: meetup.hasRSVPd
//                 ? meetup.attendees - 1
//                 : meetup.attendees + 1,
//               hasRSVPd: !meetup.hasRSVPd,
//             };
//           }
//           return meetup;
//         })
//       );
//     } else {
//       setConferences(
//         conferences.map((conf) => {
//           if (conf.id === id) {
//             return {
//               ...conf,
//               attendees: conf.hasRSVPd
//                 ? conf.attendees - 1
//                 : conf.attendees + 1,
//               hasRSVPd: !conf.hasRSVPd,
//             };
//           }
//           return conf;
//         })
//       );
//     }
//   };

//   const formatDate = (dateStr: string | number | Date) => {
//     const date = new Date(dateStr);
//     return new Intl.DateTimeFormat("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     }).format(date);
//   };

//   const EventCard = ({ event, type }: { event: Event; type: string }) => (
//     <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-gray-50 shadow-lg shadow-blue-100">
//       <div className="flex h-64">
//         <div className="flex-grow p-6">
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <h3 className="text-xl font-bold text-blue-800 mb-2">
//                 {event.title}
//               </h3>
//               <p className="text-gray-600 line-clamp-2">{event.description}</p>
//             </div>
//             <div className="flex flex-col gap-2">
//               {event.isRecurring && (
//                 <Badge className="bg-blue-100 text-blue-800">
//                   {event.frequency}
//                 </Badge>
//               )}
//               {event.price && (
//                 <Badge className="bg-blue-600 text-white">{event.price}</Badge>
//               )}
//               <Badge className="bg-blue-50 text-blue-800">
//                 {event.attendees}/{event.maxAttendees} spots
//               </Badge>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <div className="flex items-center gap-2 text-blue-800">
//               <span>{formatDate(event.date)}</span>
//             </div>
//             <div className="flex items-center gap-2 text-blue-800">
//               <span>{event.time}</span>
//               {event.duration && <span>• {event.duration}</span>}
//             </div>
//             <div className="space-y-1">
//               <div className="flex items-center gap-2 text-blue-800">
//                 <span>{event.location}</span>
//               </div>
//               <div className="text-sm text-blue-600 ml-6">
//                 {event.neighborhood}
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="flex gap-2 flex-wrap">
//                 {event.tags.map((tag) => (
//                   <Badge
//                     key={tag}
//                     variant="secondary"
//                     className="bg-blue-50 text-blue-800"
//                   >
//                     {tag}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="mt-4">
//             <Button
//               onClick={() => handleRSVP(event.id, type)}
//               variant={event.hasRSVPd ? "outline" : "default"}
//               className={`w-full transition-all ${
//                 event.hasRSVPd
//                   ? "border-blue-600 text-blue-600 hover:bg-blue-50"
//                   : "bg-blue-600 hover:bg-blue-700 text-white"
//               }`}
//             >
//               {event.hasRSVPd ? "Cancel RSVP" : "RSVP Now"}
//             </Button>
//           </div>
//         </div>
//         <div className="w-[320px] h-[256px] relative">
//           <Image
//             src={event.image}
//             alt={event.title}
//             fill
//             sizes="(max-width: 320px) 100vw"
//             className="object-cover"
//           />
//         </div>
//       </div>
//     </Card>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-b to-white py-12">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold mb-4 text-blue-800">
//             Dallas Events
//           </h1>
//           <p className="text-blue-600 text-lg max-w-2xl mx-auto mb-8">
//             Discover the best events in the Dallas-Fort Worth metroplex
//           </p>

//           <div className="flex justify-center gap-4 mb-8">
//             {categories.map((category) => (
//               <Button
//                 key={category}
//                 onClick={() => setSelectedCategory(category)}
//                 variant={selectedCategory === category ? "default" : "outline"}
//                 className={`
//                   ${
//                     selectedCategory === category
//                       ? "bg-blue-600 text-white hover:bg-blue-700"
//                       : "border-blue-600 text-blue-600 hover:bg-blue-50"
//                   }
//                 `}
//               >
//                 {category}
//               </Button>
//             ))}
//           </div>
//         </div>

//         <Tabs defaultValue="meetups" className="space-y-8">
//           <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-blue-100">
//             <TabsTrigger
//               value="meetups"
//               className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
//             >
//               Local Meetups
//             </TabsTrigger>
//             <TabsTrigger
//               value="conferences"
//               className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
//             >
//               Conferences
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="meetups">
//             <div className="space-y-6">
//               {meetups.map((meetup) => (
//                 <EventCard key={meetup.id} event={meetup} type="meetup" />
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="conferences">
//             <div className="space-y-6">
//               {conferences.map((conference) => (
//                 <EventCard
//                   key={conference.id}
//                   event={conference}
//                   type="conference"
//                 />
//               ))}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default EventPage;

const EventPage = () => {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [meetups, setMeetups] = useState<Event[]>([]);
  const [conferences, setConferences] = useState<Event[]>([]);

  useEffect(() => {
    const localEvents = JSON.parse(localStorage.getItem("localEvents") || "[]");
    const localMeetups = localEvents.filter(
      (event: { type: string }) => event.type === "meetup"
    );
    const localConferences = localEvents.filter(
      (event: { type: string }) => event.type === "conference"
    );

    setMeetups(localMeetups);
    setConferences(localConferences);
  }, []);

  const handleEventCreated = (events: Event[]) => {
    const newMeetups = events.filter((event) => event.type === "meetup");
    const newConferences = events.filter(
      (event) => event.type === "conference"
    );

    setMeetups(newMeetups);
    setConferences(newConferences);
    setShowCreateEvent(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b to-white py-12">
      {showCreateEvent ? (
        <AuthEventCreation
          onEventCreated={handleEventCreated}
          onCancel={() => setShowCreateEvent(false)}
        />
      ) : (
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setShowCreateEvent(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Event
            </Button>
          </div>

          <Tabs defaultValue="meetups" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-blue-100">
              <TabsTrigger
                value="meetups"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Meetups
              </TabsTrigger>
              <TabsTrigger
                value="conferences"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Conferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="meetups">
              <div className="space-y-6">
                {meetups.map((meetup) => (
                  <div key={meetup.id} className="p-4 border rounded">
                    <h3>{meetup.title}</h3>
                    <p>{meetup.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="conferences">
              <div className="space-y-6">
                {conferences.map((conference) => (
                  <div key={conference.id} className="p-4 border rounded">
                    <h3>{conference.title}</h3>
                    <p>{conference.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default EventPage;
