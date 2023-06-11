import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put, Req,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken'
import {UsersService} from "./users.service";
import {CreateUserDto, UserDto} from "../dto/create-user.dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "../schemas/user.schema";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import * as dotenv from "dotenv";
dotenv.config();
@ApiTags('Пользователи')
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {
    }

    getUserIdASToken(token:string):string{
        const tokenWithoutBearer = token.replace('Bearer ', '');
        try {
            const decodedToken: any = jwt.verify(tokenWithoutBearer, process.env.DB_SECRET_KEY);
            return decodedToken.userId;
        } catch (error) {
            console.log('Ошибка при расшифровке токена:', error);
            return null;
        }

    }
    @UseGuards(JwtAuthGuard)
    @Get('/user/profile')
    GetUserProfile(@Req() request) {
        const authHeader = request.headers.authorization
        return this.usersService.findUser(this.getUserIdASToken(authHeader))
    }
    @ApiResponse({status: 200, type: User})
    @UseGuards(JwtAuthGuard)
    @Get("/user/:_id")
    findUser(@Param("_id") _id: string) {
        return this.usersService.findUser(_id)
    }

    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({status: 200, type: User})
    @Post("/create")
    creteUser(@Body() UserDto:UserDto) {
        return this.usersService.createUser(UserDto)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/all')
    getAll(){
        return this.usersService.findAllUsers()
    }


   @UseGuards(JwtAuthGuard)
    @Put("/update")
    @UseInterceptors(FileInterceptor("image"))
    updateUserAvatar(@Req() request,@UploadedFile()image){
        const token=request.headers.Authorization
        return this.usersService.updateUserAvatar(this.getUserIdASToken(token),image)
    }

}
