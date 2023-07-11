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