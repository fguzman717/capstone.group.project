import React from "react";
import { Route, Routes } from "react-router-dom";
import ProfileCard from "./ProfileCard";

// export const About = (props) => {
//     const developerTeam = [
//         {   "devname": "Whitney Brown",
//             "interest": "in1",
//             "linkedin": "li1",
//             "active": true
//         }
//         {   "devname": "Felix Guzman",
//             "interest": "in2",
//             "linkedin": "li2",
//             "active": true
//         }
//         {   "devname": "Whitney Brown",
//             "interest": "in3",
//             "linkedin": "li3",
//             "active": true
//         }
//         {   "devname": "Jonathan Eason",
//             "interest": "in4 ",
//             "linkedin": "li4 ",
//             "active": true
//         }
//     ]
const About = (props) => {
  return;
  <div className="about-styling">
    <h1> Meet the Development Team </h1>
    <div>
      <ProfileCard />
      <ProfileCard />
      <ProfileCard />
      <ProfileCard />
    </div>
  </div>;
};

export default About;
