import { Injectable, Logger } from '@nestjs/common';
import {
  appendFileSync,
  existsSync,
  mkdir,
  mkdirSync,
  writeFileSync,
} from 'fs';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger();

  constructor() {
    if (!existsSync('./logs/errors.log')) {
      if (!existsSync('./logs')) {
        mkdirSync('./logs');
        writeFileSync('./logs/errors.log', '');
      }
    }
  }

  info(message: string) {
    this.logger.log(message);
  }

  error(message: string) {
    this.logger.error(message);
    appendFileSync(
      './logs/errors.log',
      `${new Date().toISOString()} - ${message} \n \n`,
    );
  }
}
