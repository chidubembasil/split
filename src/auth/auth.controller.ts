import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { CreateDto } from './dto/signUp_dto.js';
import { SignInDto } from './dto/signIn_dto.js';
import { AuthGuard } from './guards/auth/auth.guard.js';
import { UpdateProfileDto } from './dto/updateProfile_dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Get()
  @UseGuards(AuthGuard)
  getAllUsers(){
    return this.authService.getAllUsers()
  }
  
  @Get(":id")
  @UseGuards(AuthGuard)
  getOneUser(@Param('id') id:string){
    return this.authService.getOneUser(id)
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  getUserProfile(@Param('id') id:string){
    return this.authService.UserProfile(id)
  }

  @Post('signup')
  signup(@Body() data: CreateDto) {
    return this.authService.signup(data);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() data: SignInDto) {
    return this.authService.signIn(data);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @Req() req: Request, 
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(req, res);
  }

  @Put(":id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  updateUser(
    @Param(':id') id: string,
    @Body() data: UpdateProfileDto,
  ){
    return this.authService.updateProfile(id, data)
  } 

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
}