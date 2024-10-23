import { create } from "zustand";

type GalleryAuthStoreTypes = {
    waitlistData: GalleryWaitlistData,
    setName: (value: string) => void,
    setEmail: (value: string) => void,
    handleSubmit: () => void
};

export const UseGalleryAuthStore = create<GalleryAuthStoreTypes>(
    (set, get) => ({
        waitlistData: {
            email: "",
            name: ""
        },
        setName: (name: string) => {
            const prev = get().waitlistData
            set({waitlistData: {...prev, name}})
        },
        setEmail: (email: string) => {
            const prev = get().waitlistData
            set({waitlistData: {...prev, email}})
        },
        handleSubmit: () => {
            set({waitlistData: {email: "", name: ""}})
        }
    })
)