import {create} from 'zustand';

type UploadArtworkStoreType = {
    image: string | null,
    setImage: (image: string|null) => void,
    activeIndex: number,
    setActiveIndex: (e: number) => void,
    artworkUploadData: ArtworkUploadStateTypes,
    updateArtworkUploadData: (label: string, value: string) => void,
    clearData: () => void,
}

export const uploadArtworkStore = create<UploadArtworkStoreType>((set, get) => ({
    image: null,
    setImage: (image: string|null) => { set({image}) },
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
        carrier: "",
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
            carrier: "",
          },
        });
        set({ image: null });
      },
}))