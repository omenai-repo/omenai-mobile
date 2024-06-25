import {create} from 'zustand';


type UploadArtworkStoreTypes = {
    activeIndex: number,
    setActiveIndex: (e: number) => void
};

export const uploadArtworkStore = create<UploadArtworkStoreTypes>((set, get) => ({
    activeIndex: 1,
    setActiveIndex: (e: number) => {
        set({activeIndex: e})
    }
}))