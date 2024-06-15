import { ROLE_STATUS } from "../middleware/common/enum";
import {createModel} from "./base";

export const User = createModel("User", "users", {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: String,
    role: {
        type: Number,
        enum: Object.values(ROLE_STATUS),
        required: true,
        default: 0
    }
});
