import React, { useEffect } from "react";
import { useRive , useStateMachineInput} from '@rive-app/react-canvas';
// import Teddy from './animated_login_screen.riv'
import { useTracker } from "meteor/react-meteor-data";


export default function HeroBot(options) {
const STATE_MACHINE_NAME = "Idle"
const IMPUT_NAME = "isChecking"

  const { rive, RiveComponent } = useRive({
    src: "/animations/hero_bot.riv",
    autoplay: true,
    animations:"Idle",
    // artboard:"Teddy",
    // stateMachines: STATE_MACHINE_NAME
  });

  // const onClickInput = useStateMachineInput(rive,STATE_MACHINE_NAME,IMPUT_NAME)

  useEffect( () => {
    console.log(rive)
    // Anything in here is fired on component mount.
 
 }, []);

  

  
  return (
    <RiveComponent
      // onMouseEnter={() => rive && rive.play()}
      // onMouseLeave={() => rive && rive.pause()}
      // onMouseOver={()=> rive.play()}
      // onClick={() => onClickInput.fire()}
      // onLoad={() => console.log(rive)}
      // width={300}
      // height={300}
    />
  );
}