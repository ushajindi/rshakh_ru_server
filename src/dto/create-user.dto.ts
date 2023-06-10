export class CreateUserDto{
    readonly email:string
    readonly name:string
    readonly username:string
    readonly password:string
}
type id={
    id:string
}
export class UserDto{
    readonly _id:string
    readonly username:string
    readonly password:string
    readonly email:string

}
export class LoginUserDto{
    email:string
    password:string
}
export class userChatDto{
    _id:string
    users:[
        username:string,
        userId:string,
        email:string,
        avaimg:string
    ]
    messages:[
        username:string,
        avaimg:string,
        message:string,
        img:[
            src:string
        ]
    ]
}