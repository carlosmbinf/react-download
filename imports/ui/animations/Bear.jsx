import React, { useEffect } from "react";
import { useRive , useStateMachineInput} from '@rive-app/react-canvas';
// import Teddy from './animated_login_screen.riv'
import { useTracker } from "meteor/react-meteor-data";


export default function Bear(options) {
const STATE_MACHINE_NAME = "Login Machine"
const IMPUT_NAME = "isChecking"

  const { rive, RiveComponent } = useRive({
    src: "/animations/animated_login_screen.riv",
    autoplay: options.autoplay,
    animations:"idle",
    // artboard:"Teddy",
    stateMachines: STATE_MACHINE_NAME
  });

  // const onClickInput = useStateMachineInput(rive,STATE_MACHINE_NAME,IMPUT_NAME)
  const type = useTracker(() => {
    return options.type
   });

  useEffect( () => {
    console.log(type)
    // Anything in here is fired on component mount.
    switch (options.type) {
      case "user":
        useStateMachineInput(rive, STATE_MACHINE_NAME, "isChecking").value = true
  
        break;
      case "password":
  
        useStateMachineInput(rive, STATE_MACHINE_NAME, "isHandsUp").value = true
        break;
      case "error":
        useStateMachineInput(rive, STATE_MACHINE_NAME, "trigFail").fire()
        break;
      case "ok":
        useStateMachineInput(rive, STATE_MACHINE_NAME, "trigSuccess").fire()
        break;
      default:
        useStateMachineInput(rive, STATE_MACHINE_NAME, "isHandsUp").fire()
        // useStateMachineInput(rive, STATE_MACHINE_NAME, "isChecking").value = false
        break;
    }
 
 }, []);

  

  
  return (
    <RiveComponent
      // onMouseEnter={() => rive && rive.play()}
      // onMouseLeave={() => rive && rive.pause()}
      // onMouseOver={()=> rive.play()}
      // onClick={() => onClickInput.fire()}
      onLoad={() => console.log(rive)}
      width={300}
      height={300}
    />
  );
}