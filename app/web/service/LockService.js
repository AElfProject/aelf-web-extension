/**
 * @file LockUnlockService.js
 * @author hzz780
 */

import errorHandler from '../utils/errorHandler';

export default class LockService {
  async lockGuard(aesSeed) {
    return !(aesSeed && aesSeed.length) ? {
      ...errorHandler(200005)
    } : {
      ...errorHandler(0)
    };
  }

  async callUnLockPagePrompt(Background, sendResponse) {
    Background.openPrompt(sendResponse,{
      payload: {
        method: 'UNLOCK_NIGHT_ELF'
      }
    });
  }
}
