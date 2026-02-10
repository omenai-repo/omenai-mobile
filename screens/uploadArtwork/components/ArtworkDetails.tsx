import { View } from "react-native";
import React, { useEffect, useState } from "react";
import Input from "#components/inputs/Input";
import LargeInput from "#components/inputs/LargeInput";
import LongBlackButton from "#components/buttons/LongBlackButton";
import { uploadArtworkStore } from "#store/gallery/uploadArtworkStore";
import CustomSelectPicker from "#components/inputs/CustomSelectPicker";
import {
  certificateOfAuthenticitySelectOptions,
  mediumListing,
  rarityList,
  signatureArtistSelectOptions,
  signatureSelectOptions,
} from "#data/uploadArtworkForm.data";
import { validate } from "#lib/validations/upload_artwork_input_validator/validator";
import { useAppStore } from "#store/app/appStore";
import tw from "twrnc";

type artworkDetailsErrorsType = {
  title: string;
  description: string;
  materials: string;
  year: string;
};

export default function ArtworkDetails() {
  const { userType } = useAppStore();
  const {
    setActiveIndex,
    activeIndex,
    updateArtworkUploadData,
    artworkUploadData,
  } = uploadArtworkStore();

  const [year, setYear] = useState<string>("");

  const [formErrors, setFormErrors] = useState<artworkDetailsErrorsType>({
    title: "",
    description: "",
    materials: "",
    year: "",
  });

  const checkIsDisabled = () => {
    // Check if there are no error messages and all input fields are filled
    const isFormValid = Object.values(formErrors).every(
      (error) => error === "",
    );
    const areAllFieldsFilled = Object.values({
      title: artworkUploadData.title,
      materials: artworkUploadData.materials,
      year: artworkUploadData.year,
      medium: artworkUploadData.medium,
      rarity: artworkUploadData.rarity,
      certificate_of_auth: artworkUploadData.certificate_of_authenticity,
      signature: artworkUploadData.signature,
    }).every((value) => value !== "");

    return !(isFormValid && areAllFieldsFilled);
  };

  const handleValidationChecks = (label: string, value: string) => {
    const { success, errors }: { success: boolean; errors: string[] | [] } =
      validate(label, value);
    if (!success) {
      setFormErrors((prev) => ({ ...prev, [label]: errors[0] }));
    } else {
      setFormErrors((prev) => ({ ...prev, [label]: "" }));
    }
  };

  useEffect(() => {
    if (artworkUploadData.title) {
      handleValidationChecks("title", artworkUploadData.title);
    }
  }, [artworkUploadData.title]);

  useEffect(() => {
    if (artworkUploadData.artwork_description) {
      handleValidationChecks(
        "description",
        artworkUploadData.artwork_description || "",
      );
    }
  }, [artworkUploadData.artwork_description]);

  useEffect(() => {
    if (artworkUploadData.year) {
      handleValidationChecks("year", artworkUploadData.year.toString());
    }
  }, [artworkUploadData.year]);

  useEffect(() => {
    if (artworkUploadData.materials) {
      handleValidationChecks("materials", artworkUploadData.materials);
    }
  }, [artworkUploadData.materials]);

  return (
    <View style={tw`flex-1`}>
      <View style={tw`gap-5 mb-12`}>
        <Input
          label="Artwork title"
          onInputChange={(value) => updateArtworkUploadData("title", value)}
          placeHolder="Enter the name of your artwork"
          value={artworkUploadData.title}
          errorMessage={formErrors.title}
        />
        <LargeInput
          label="Artwork description"
          onInputChange={(value) =>
            updateArtworkUploadData("artwork_description", value)
          }
          placeHolder="Write a description of your artwork (not more than 100 words)"
          value={artworkUploadData.artwork_description || ""}
          errorMessage={formErrors.description}
        />
        <View style={tw`flex-1`}>
          <CustomSelectPicker
            label="Medium"
            data={mediumListing}
            placeholder="Select medium"
            value={artworkUploadData.medium}
            handleSetValue={(item) =>
              updateArtworkUploadData("medium", item.value)
            }
          />
        </View>
        <LargeInput
          label="Materials"
          onInputChange={(value) => updateArtworkUploadData("materials", value)}
          placeHolder="Enter the materials used (separate each with a comma)"
          value={artworkUploadData.materials}
          errorMessage={formErrors.materials}
          height={105}
        />
        <View style={tw`flex-1`}>
          <Input
            label="Year"
            placeHolder="Enter year of creation"
            value={year}
            onInputChange={(value) => {
              setYear(value);
              updateArtworkUploadData("year", value);
            }}
            errorMessage={formErrors.year}
          />
        </View>
        <View style={tw`flex-row gap-5 z-[5]`}>
          <View style={tw`flex-1`}>
            <CustomSelectPicker
              label="Rarity"
              data={rarityList}
              placeholder="Select rarity"
              value={artworkUploadData.rarity}
              handleSetValue={(item) =>
                updateArtworkUploadData("rarity", item.value)
              }
            />
          </View>
          <View style={tw`flex-1`}>
            <CustomSelectPicker
              label="Certificate of authenticity"
              data={certificateOfAuthenticitySelectOptions}
              placeholder="Select"
              value={artworkUploadData.certificate_of_authenticity}
              handleSetValue={(item) =>
                updateArtworkUploadData(
                  "certificate_of_authenticity",
                  item.value,
                )
              }
            />
          </View>
        </View>

        <View style={tw`flex-1 z-[4]`}>
          <CustomSelectPicker
            label="Signature"
            data={
              userType === "gallery"
                ? signatureSelectOptions
                : signatureArtistSelectOptions
            }
            placeholder="Select"
            value={artworkUploadData.signature}
            dropdownPosition="top"
            handleSetValue={(item) =>
              updateArtworkUploadData("signature", item.value)
            }
          />
        </View>
      </View>
      <LongBlackButton
        value="Proceed"
        onClick={() => setActiveIndex(activeIndex + 1)}
        isLoading={false}
        isDisabled={checkIsDisabled()}
      />
    </View>
  );
}
