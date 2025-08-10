import Lottie from "react-lottie";
import animationData from "./Animation - 1730480563648.json"; 


const FireworksAnimation = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };


  return <Lottie options={defaultOptions} height={400} width={400} />;
};


export default FireworksAnimation;





