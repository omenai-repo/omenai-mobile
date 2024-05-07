import { create } from "zustand";

type IndividualAuthLoginStoreTypes = {
    individualLoginData: IndividualLoginData,
    setEmail: (value: string) => void,
    setPassword: (value: string) => void,
    handleSubmit: () => void
}

export const useIndividualAuthLoginStore = create<IndividualAuthLoginStoreTypes>(
    (set, get) => ({
        individualLoginData: {
            email: "",
            password: ""
        },
        setEmail: (email: string) => {
            const prevData = get().individualLoginData
            set({individualLoginData: {...prevData, email: email}})
        },
        setPassword: (password: string) => {
            const prevData = get().individualLoginData
            set({individualLoginData: {...prevData, password: password}})
        },
        handleSubmit: () => {
            set({individualLoginData: {email: "", password: ""}})
        }
    })
)