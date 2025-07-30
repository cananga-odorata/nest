// src/core/logger/logger.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { PrettyOptions } from 'pino-pretty';

@Module({
    imports: [
        ConfigModule,
        PinoLoggerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const isProduction = configService.get<string>('NODE_ENV') === 'production';

                const pinoPrettyOptions: PrettyOptions = {
                    colorize: true,
                    levelFirst: true,
                    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
                    // รูปแบบนี้จะแสดง [LEVEL] [Context] - Message
                    // messageFormat: `[{levelLabel}] {context} - {msg}`,
                    // ไม่ต้องแสดง field เหล่านี้เพราะเราจัดการเองใน messageFormat แล้ว
                    ignore: 'pid,hostname,req,res,responseTime,context',
                };

                return {
                    pinoHttp: {
                        level: isProduction ? 'info' : 'debug',
                        // Final check: เพิ่ม name เพื่อให้ HTTP log มี context เริ่มต้น
                        name: 'HTTP',
                        // Final check: ปรับ custom message เล็กน้อยให้เข้ากับ format ใหม่
                        customSuccessMessage: (req, res) => {
                            return `request completed ${req.method} ${req.url}`;
                        },
                        customErrorMessage: (req, res, error) => {
                            return `request failed ${req.method} ${req.url}`;
                        },
                        // ใช้ transport เหมือนเดิม
                        transport: !isProduction
                            ? {
                                target: 'pino-pretty',
                                options: pinoPrettyOptions,
                            }
                            : undefined,
                    },
                };
            },
        }),
    ],
})
export class LoggerModule { }