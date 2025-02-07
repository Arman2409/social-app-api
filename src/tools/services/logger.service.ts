import { Injectable, Logger } from '@nestjs/common';
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from 'fs';

const ERROR_LOGS_PATH = './logs/errors.log';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger();

  constructor() {
    if (!existsSync(ERROR_LOGS_PATH)) {
      if (!existsSync('./logs')) {
        mkdirSync('./logs');
      }
      writeFileSync(ERROR_LOGS_PATH, '');
    }
  }

  info(message: string) {
    this.logger.log(message);
  }

  error(message: string) {
    this.logger.error(message);
    appendFileSync(
      ERROR_LOGS_PATH,
      `${new Date().toISOString()} - ${message} \n \n`,
    );
  }
}
