import { BadGatewayException, BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { auth } from '../lib/auth.js';
import { CreateDto } from './dto/signUp_dto.js';
import { SignInDto } from './dto/signIn_dto.js';
import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response } from "express";
import { DatabaseService } from '../database/database.service.js';
import { UpdateProfileDto } from './dto/updateProfile_dto.js';

@Injectable()
export class AuthService {
    constructor(private readonly db: DatabaseService){}

    ////// GET-ALL-USERS //////
    async getAllUsers(){
        try{
            const getUsers = await this.db.user.findMany({
                select:{
                    name: true,
                    email: true,
                    image: true
                }
            })

            return getUsers
        }catch(e){
            throw new BadGatewayException(e)
        }
    }


    ////// GET-ONE-USER //////
    async getOneUser(id: string){
        try{
            const findId = await this.db.user.findUnique({
                where:{id},
                select:{
                    name: true,
                    email: true,
                    image: true,
                }
            })

            if(!findId){
                throw new NotFoundException()
            }

            return findId
        }catch(e){
            throw new BadGatewayException(e)
        }
    }


    ////// USER-PROFILE //////
    async UserProfile(id: string) {
        try {
            const profile = await this.db.profile.findUnique({
                where: { id },
                select: {
                    id: true,

                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },

                    upload: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            price: true,
                            currency: true,
                            filename: true,
                            fileType: true,
                            fileSize: true,
                            fileurl: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
            });

            if (!profile) {
                throw new NotFoundException('Profile not found');
            }

            return profile;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new InternalServerErrorException('Failed to retrieve profile',);
        }
    }

    ///// UPDATE-PROFILE //////
    async updateProfile( profileId: string, data: UpdateProfileDto) {
        try {
            const profile = await this.db.profile.findUnique({
                where: { id: profileId },
                select: {
                    id: true,
                    user: {
                        select: { id: true },
                    },
                },
            });

            if (!profile || !profile.user) {
                throw new NotFoundException('Profile not found');
            }

            return await this.db.$transaction(async (tx) => {
                // Update user details
                if (data.name !== undefined || data.image !== undefined) {
                    await tx.user.update({
                        where: { id: profile.user!.id },
                        data: {
                            ...(data.name !== undefined && {
                            name: data.name,
                            }),
                            ...(data.image !== undefined && {
                            image: data.image,
                            }),
                        },
                    });
                }

                // Update existing upload details, if provided
                const uploadData = {
                    ...(data.uploadName !== undefined && {
                    name: data.uploadName,
                    }),
                    ...(data.description !== undefined && {
                    description: data.description,
                    }),
                    ...(data.price !== undefined && {
                    price: data.price,
                    }),
                    ...(data.currency !== undefined && {
                    currency: data.currency,
                    }),
                };

                if (Object.keys(uploadData).length > 0) {
                    const uploads = await tx.upload.findMany({
                        where: { profileId },
                        select: { id: true },
                    });

                    if (uploads.length !== 1) {
                        throw new BadRequestException(
                            'Specify an upload ID when updating a specific upload',
                        );
                    }

                    await tx.upload.update({
                        where: { id: uploads[0].id },
                        data: uploadData,
                    });
                }

                // Return the updated profile and its uploads
                return tx.profile.findUnique({
                    where: { id: profileId },
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            },
                        },
                        upload: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                price: true,
                                currency: true,
                                filename: true,
                                fileType: true,
                                fileSize: true,
                                fileurl: true,
                                createdAt: true,
                                updatedAt: true,
                            },
                        },
                    },
                });
            });
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException('Failed to update profile');
        }
    }


    ////// SIGN-UP //////
    async signup (data: CreateDto){
        const createData = await auth.api.signUpEmail({
            body:{
                name : data.name,
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe,
                callbackURL: "www.google.com"
            }
        })

        if(!createData){
            return new HttpException('Could not create your account', HttpStatus.BAD_REQUEST)
        }

        return new HttpException('Created Successfully', HttpStatus.CREATED)
    }


    ////// SIGN-IN //////
    async signIn(data : SignInDto){
        const SignIn = await auth.api.signInEmail({
            body: {
                email: data.email, 
                password: data.password, 
                rememberMe: data.rememberMe, 
                callbackURL: "https://example.com/callback",
            },
        })

        if(!SignIn){
            return new HttpException('Could not SignIn your account', HttpStatus.BAD_REQUEST)
        }

        return new HttpException('Signed In Successfully', HttpStatus.ACCEPTED)
    }




    ////// LOGOUT //////
    async logout(req: Request, res: Response) {
        try {
            const response = await auth.api.signOut({
                headers: fromNodeHeaders(req.headers),
                asResponse: true,
            });

            res.setHeader("Set-Cookie", response.headers.getSetCookie());

            return { message: "Logged out successfully" };
        } catch (error) {
            throw new HttpException(
                `'Could not log out' ${error}`,
                HttpStatus.BAD_REQUEST
            );
        }
    }


    ////// DELETE-MY-USER //////
    async deleteUser (id: string){
        try{
            const deleteId = await this.getOneUser(id)

            if(!deleteId){
                throw new NotFoundException()
            }

            const deleteUser = await this.db.user.delete({
                where:{id}
            })
            return new HttpException(`${deleteUser} has been deleted`, HttpStatus.NO_CONTENT)

        }catch(e){
            throw new BadGatewayException(e)
        }
    }
}
