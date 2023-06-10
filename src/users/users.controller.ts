import {Body, Controller, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {UsersService} from "./users.service";
import {CreateUserDto, UserDto} from "../dto/create-user.dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "../schemas/user.schema";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";

@ApiTags('Пользователи')
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {
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
    updateUserAvatar(@Body()_id,@UploadedFile()image){
        return this.usersService.updateUserAvatar(_id._id,image)
    }

}
