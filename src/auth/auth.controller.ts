import {Body, Controller, Post} from '@nestjs/common';
import {CreateUserDto, LoginUserDto, UserDto} from "../dto/create-user.dto";
import {UsersService} from "../users/users.service";
import {AuthService} from "./auth.service";

@Controller('api/auth')
export class AuthController {
    constructor(private authService:AuthService) {
    }
    @Post("/login")
     async login(@Body()userDto:LoginUserDto){
        return await this.authService.login(userDto)
    }

    @Post("/registration")
    registration(@Body()userDto:UserDto){
        return this.authService.registration(userDto)
    }
}
