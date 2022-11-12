import {configureStore} from "@reduxjs/toolkit"

export const store = configureStore({
    reducer: (state: any, action: any) => {
        if (action.type === "update_jwt"){
            let newJwtKey = action.payload
            return {
                counter: "123",
                jwtKey: newJwtKey
            }
        }
        return {
            counter: "123",
            jwtKey: null
        }
    },
})