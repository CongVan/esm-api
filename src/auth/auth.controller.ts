import {
    Controller,
    Request,
    Post,
    UseGuards,
    Body,
    Get,
  } from '@nestjs/common';
  import { UserDTO } from 'src/user/user.dto';
  import { UserService } from 'src/user/user.service';
  import { AuthService } from './auth.service';
  import { JwtAuthGuard } from './jwt-auth.guard';
  
  @Controller('auth')
  export class AuthController {
    constructor(
      private userService: UserService,
      private authService: AuthService,
    ) {}
  
    @Post('login')
    async login(@Body() user: UserDTO) {
      return this.authService.login(user);
    }
  
    @Post('register')
    async register(@Body() userDTO: UserDTO) {
      const user = await this.userService.addUser(userDTO);
      return user;
    }
  
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@Request() req) {
      const { _id } = req.user;
  
      const user = await this.userService.findUserById(_id);
      return { data: user };
    }
  }
  