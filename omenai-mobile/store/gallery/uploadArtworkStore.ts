import {create} from 'zustand';

type UploadArtworkStoreType = {
    image: any,
    setImage: (image: any) => void,
    activeIndex: number,
    setActiveIndex: (e: number) => void,
    artworkUploadData: ArtworkUploadStateTypes,
    updateArtworkUploadData: (label: string, value: string) => void,
    clearData: () => void,
    isUploaded: boolean,
    setIsUploaded: (value: boolean) => void
}

export const uploadArtworkStore = create<UploadArtworkStoreType>((set, get) => ({
    image: null,
    setImage: (image: any) => { set({image}) },
    activeIndex: 1,
    setActiveIndex: (e: number) => {
        set({activeIndex: e})
    },
    artworkUploadData: {
        artist: "",
        year: 0,
        title: "",
        medium: "",
        rarity: "",
        materials: "",
        width: "",
        height: "",
        weight: "",
        price: 0,
        shouldShowPrice: "",
        depth: "",
        artist_birthyear: "",
        artist_country_origin: "",
        certificate_of_authenticity: "",
        artwork_description: "",
        framing: "",
        signature: "",
    },
    updateArtworkUploadData: (label: string, value: string) => {
        const data: Record<string, any> = get().artworkUploadData;
  
        if (label in data) {
          const updatedData = { ...data, [label]: value };
  
          set({
            artworkUploadData: updatedData as ArtworkUploadStateTypes,
          });
        }
    },
    clearData: () => {
        set({
          artworkUploadData: {
            artist: "",
            year: 0,
            title: "",
            medium: "",
            rarity: "",
            materials: "",
            width: "",
            height: "",
            price: 0,
            weight: "",
            shouldShowPrice: "",
            depth: "",
            artist_birthyear: "",
            artist_country_origin: "",
            certificate_of_authenticity: "",
            artwork_description: "",
            framing: "",
            signature: "",
          },
          isUploaded: false
        });
        set({ image: null });
      },
      isUploaded: false,
      setIsUploaded: (value: boolean) => {
        set({isUploaded: value})
      }
}))