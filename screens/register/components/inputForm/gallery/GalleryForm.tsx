import tw from "twrnc";
import React from "react";
import { View } from "react-native";
import GalleryRegisterForm from "../../galleryRegisterForm/GalleryRegisterForm";
// import GalleryWaitList from "../../galleryWaitlist/GalleryWaitList";
// import { useGalleryAuthRegisterStore } from "store/auth/register/GalleryAuthRegisterStore";
// import FittedBlackButton from "components/buttons/FittedBlackButton";

export default function GalleryForm() {
  // const { pageIndex, setPageIndex } = useGalleryAuthRegisterStore();
  // const [showWaitlistForm, setShowWaitlistForm] = useState<boolean>(false);

  // Always start from page 0 when this component mounts
  // React.useEffect(() => {
  //   setPageIndex(0);
  // }, [setPageIndex]);

  return (
    <View style={tw`mt-7`}>
      {/* {showWaitlistForm ? <GalleryWaitList /> : <GalleryRegisterForm />} */}
      <GalleryRegisterForm />
      {/* Waitlist button commented out */}
    </View>
  );
}
