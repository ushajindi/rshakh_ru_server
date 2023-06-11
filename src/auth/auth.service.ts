import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto, LoginUserDto, UserDto} from "../dto/create-user.dto";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,private jwtService:JwtService) {}

    async login(userDto: LoginUserDto) {
        const user = await this.validateUser(userDto)
        const tok =await this.generateToken(user)
        return {
            token:tok.token,
            user:user
        }
    }

    async registration(userDto:UserDto) {
        const candidate=await this.usersService.getByEmail(userDto.email)
        if (candidate){
            return({
                status:400,
                message:"Пользователь с таким Email существует"
            })
        }
        const hashPassword= await bcrypt.hash(userDto.password,5);
        const user = await this.usersService.createUser({
           ...userDto,password:hashPassword})
           const tok =await this.generateToken(user)
           return {
               token:tok.token,
               user:user
           }
    }
   private async generateToken(user){
        const payload ={email:user.email,name:user.name,userId: user._id}
        return{
            token:this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: LoginUserDto) {
        const user= await this.usersService.getByEmail(userDto.email)
        if(user){
            const EqualsPassword= await bcrypt.compare(userDto.password,user.password)
        if (EqualsPassword){
            return user
        }
        }

        throw new UnauthorizedException({message:"Неправильный логин или пароль"})
    }
}
