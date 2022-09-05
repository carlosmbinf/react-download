import React from "react";
import { useRive , useStateMachineInput} from '@rive-app/react-canvas';
// import Teddy from './animated_login_screen.riv'


export default function Bear(options) {
const STATE_MACHINE_NAME = "Login Machine"
const IMPUT_NAME = "trigFail"

  const { rive, RiveComponent } = useRive({
    src: "/animations/animated_login_screen.riv",
    autoplay: options.autoplay,
    // artboard:"Teddy",
    stateMachines: STATE_MACHINE_NAME
  });

  const onClickInput = useStateMachineInput(rive,STATE_MACHINE_NAME,IMPUT_NAME)

  return (
    <RiveComponent
      // onMouseEnter={() => rive && rive.play()}
      // onMouseLeave={() => rive && rive.pause()}
      // onMouseOver={()=> rive.play()}
      onClick={() => onClickInput.fire()}
      
      width={300}
      height={300}
    />
  );
}