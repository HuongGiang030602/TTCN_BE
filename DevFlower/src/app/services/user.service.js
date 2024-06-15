import {User} from "../models";
import {LINK_STATIC_URL} from "@/configs";
import {generatePassword, comparePassword} from "@/utils/helpers";

export async function create({name, email, password, phone, role}) {
    const user = new User({
        name,
        email,
        phone,
        role,
        password: generatePassword(password),
    });
    await user.save();
    return user;
}

export async function filter({q, page, per_page, field, sort_order}) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        ...(q && {$or: [{name: q}, {email: q}, {phone: q}]}),
    };

    const users = (
        await User.find(filter, {password: 0})
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({[field]: sort_order})
    ).map((user) => {
        if (user.avatar) {
            user.avatar = LINK_STATIC_URL + user.avatar;
        }
        return user;
    });

    const total = await User.countDocuments(filter);
    return {total, page, per_page, users};
}

export async function details(userId) {
    const user = await User.findById(userId);
    user.avatar = LINK_STATIC_URL + user.avatar;
    return user;
}

export async function update(user, {name, email, phone, password, role}) {
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.role = role;
    user.password = generatePassword(password);
    await user.save();
    return user;
}

export async function resetPassword(user, new_password) {
    user.password = generatePassword(new_password);
    await user.save();
    return user;
}

export async function remove(user) {
    await User.deleteOne({_id: user._id});
}
