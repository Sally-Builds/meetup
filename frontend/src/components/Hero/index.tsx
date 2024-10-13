import styles from "./index.module.css";
import { Image } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";

const Hero = ({ img }: { img: string }) => {
  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    console.log("entered");
    const currentHour = moment().hour(); // Get the current hour (0-23)

    // Determine if it's morning, afternoon, or evening

    if (currentHour >= 5 && currentHour < 12) {
      setTimeOfDay("Morning");
    } else if (currentHour >= 12 && currentHour < 17) {
      setTimeOfDay("Afternoon");
    } else {
      setTimeOfDay("Evening");
    }
  }, []);

  return (
    <>
      <div className={styles["container"]}>
        <Image
          borderRadius="full"
          boxSize="180px"
          src={img}
          alt="Profile Image"
        />
        <span>Good {timeOfDay}</span>
      </div>
    </>
  );
};

export default Hero;
