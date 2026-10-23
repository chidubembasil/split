import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { CreateDto } from './dto/signUp_dto.js';
import { SignInDto } from './dto/signIn_dto.js';
import { AuthGuard } from './guards/auth/auth.guard.js';
import { UpdateProfileDto } from './dto/updateProfile_dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard)
  getAllUsers(){
    return this.authService.getAllUsers()
  }
  
  @ApiOperation({ summary: 'Get user by id' })
  @ApiBearerAuth()
  @Get(":id")
  @UseGuards(AuthGuard)
  getOneUser(@Param('id') id:string){
    return this.authService.getOneUser(id)
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth()
  @Get("profile/:id")
  @UseGuards(AuthGuard)
  getUserProfile(@Param('id') id:string){
    return this.authService.UserProfile(id)
  }

  @ApiOperation({ summary: 'Sign up' })
  @Post('signup')
  signup(@Body() data: CreateDto) {
    return this.authService.signup(data);
  }

  @ApiOperation({ summary: 'Sign in' })
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() data: SignInDto) {
    return this.authService.signIn(data);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @Req() req: Request, 
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(req, res);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiBearerAuth()
  @Put(":id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  updateUser(
    @Param('id') id: string,
    @Body() data: UpdateProfileDto,
  ){
    return this.authService.updateProfile(id, data)
  } 

  @ApiOperation({ summary: 'Delete user' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
}