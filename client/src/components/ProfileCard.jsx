import react from "react";
//import { Route, Routes } from "react-router-dom";
// import { styles.css } from "./";

const About = (props) => {
  const devTeam = [
    {
      devname: "Jason Lewis",
      interest: "int1",
      linkedin: "li1",
      active: true,
    },
    {
      devname: "Felix Guzman",
      interest: "int2",
      linkedin: "li2",
      active: true,
    },
    {
      devname: "Whitney Brown",
      interest: "int3",
      linkedin: "li3",
      active: true,
    },
    {
      devname: "Jonathan Eason",
      interest: "int4 ",
      linkedin: "li4 ",
      active: true,
    },
  ];
};

function ProfileCard() {
  return (
    <div className="about-styling">
      <h1>(devTeam.devname)</h1>
      <ul>
        <li>(devTeam.interest)</li>
        <li>(devTeam.linkedin)</li>
      </ul>
    </div>
  );
}

export default ProfileCard;
