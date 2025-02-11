import vine from '@vinejs/vine'

export const createUserValidator = vine.object({
    nickname: vine.string(),
    email: vine.string().email(),
    password: vine.string(),
    role_id: vine.number(),
})

export const createProfileValidator = vine.object({
    name: vine.string(),
    last_name: vine.string(),
    phone: vine.string(),
    address: vine.string(),
})


export const updateUserValidator = vine.object({
    nickname: vine.string(),
    email: vine.string().email(),
    role_id: vine.number(),
})

export const updateProfileValidator = vine.object({
    name: vine.string(),
    last_name: vine.string(),
    phone: vine.string(),
    address: vine.string(),
})