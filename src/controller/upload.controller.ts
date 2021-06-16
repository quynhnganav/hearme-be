import { Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query, Res, UploadedFile, UseInterceptors, Response } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { IDFactory } from '../helper';
import { diskStorage } from 'multer'
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { NotAuthentication } from 'src/modules/auth/decorator';
import * as sharp from 'sharp'

@Controller('/api/file')
export class UpdaloadController {

    @NotAuthentication()
    @Post('upload-image')
    @UseInterceptors(
        FileInterceptor('rawImage', {
            limits: {
                fileSize: 30 * 1024 * 1024
            },
            fileFilter: (req, file, callback) => {
                if (!file || !file.originalname.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
                    console.log('err');
                    return callback(new Error('Only image files are allowed!'), false)
                }
                console.log('file');
                callback(null, true)
            },
            storage: diskStorage({
                destination:
                    process.env.NODE_ENV === 'production'
                        ? '/var/www/data/images/cfr_test/'
                        : './uploads/images/',
                filename(_, file, callback) {
                    callback(null, IDFactory.createID()() + extname(file.originalname))
                }
            })
        })
    )
    @HttpCode(201)
    async uploadImage(@UploadedFile() file) {
        console.log(file);
        if (!file) return null;
        if (file.mimetype.includes('image')) {
            return file.path.split('/').pop()
        }
        return null
    }

    @NotAuthentication()
    @Get('download')
    @HttpCode(200)
    downloadImage(
        @Query('id') id: string,
        @Query('height') height: number,
        @Query('width') width: number,
        @Res() res
    ) {
        const path = this.downloadFile(id);
        let file = createReadStream(path);
        console.log(file.readableLength);
        if (width && height) {
            const resizer = sharp().resize(Number(width), Number(height)).jpeg()
            file.pipe(resizer).pipe(res)
            res.
            return
        }
        file.pipe(res)
    }

    downloadFile(id: string): string {
        if (!id) throw new HttpException('Bat Request', HttpStatus.BAD_REQUEST);
        const urlLocal = process.env.NODE_ENV === 'production'
            ? '/var/www/data/images/cfr_test/'
            : './uploads/images/'

        const path = join(urlLocal, id);
        const paths = path.split('/');
        // if (!paths[1] || paths[1] !== 'tmp') throw new HttpException('Bat Request', HttpStatus.BAD_REQUEST);
        if (!existsSync(path)) throw new HttpException('Bat Request', HttpStatus.BAD_REQUEST);
        return path;
    }

}
